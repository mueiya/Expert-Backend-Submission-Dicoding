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

    return new PostedReply(result.rows[0]);
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
      throw new NotFoundError(`reply with ${id} and ${commentId} and ${threadId} not found`);
    }
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
  }

  async getReplyByCommentId(commentId) {
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
        ORDER BY replies.date ASC
        `,
      values: [commentId],
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
