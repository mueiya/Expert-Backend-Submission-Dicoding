const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const PostedReply = require('../../Domains/replies/entities/PostedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(postReply) {
    const {content, threadId, commentId, owner} = postReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
            INSERT INTO replies
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING id, content, owner`,
      values: [id, content, date, commentId, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new PostedReply({...result.rows[0]});
  }

  async getReplyById(id) {
    const query = {
      text: `
        SELECT *
        FROM replies
        WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`reply with id: ${id} not found`);
    }
    return result.rows[0].id;
  }

  async verifyReplyAvailability(id, commentId, threadId) {
    const query = {
      text: `
        SELECT *
        FROM replies
        WHERE id = $1 AND comment = $2 AND thread = $3`,
      values: [id, commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`reply with ${id} and ${commentId} and ${threadId}`);
    }
    return result.rows[0].id;
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: `
          SELECT *
          FROM replies
          WHERE id = $1 AND owner = $2`,
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError(`only author can do this action`);
    }
    return result.rows[0].id;
  }

  async getReplyByCommentId(commentId) {
    const queryComment = {
      text: `
            SELECT *
            FROM comments
            WHERE id = $1`,
      values: [commentId],
    };

    const checkComment = await this._pool.query(queryComment);
    if (!checkComment.rowCount) {
      throw new NotFoundError(`comment with id: ${commentId} not found`);
    }
    const comment = checkComment.rows[0].id;

    const query = {
      text: `
        SELECT
        replies.id,
        replies.content,
        replies.date,
        replies.comment,
        users.username,
        replies.deleted
        FROM replies
        INNER JOIN users ON replies.owner = users.id
        WHERE comment = $1
        `,
      values: [comment],
    };

    const result = await this._pool.query(query);
    return new DetailReply(result.rows);
  }

  async deleteReplyById(id) {
    const query = {
      text: `
        UPDATE replies
        SET deleted = TRUE
        WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`reply with id: ${id} not found`);
    }
  }
}

module.exports = ReplyRepositoryPostgres;
