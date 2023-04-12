const PostedComment = require('../../Domains/comments/entities/PostedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(postComment) {
    const {content, threadId, owner} = postComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO comments
        VALUES($1,$2,$3,$4,$5)
        RETURNING id, content, owner`,
      values: [id, content, date, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new PostedComment({...result.rows[0]});
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id =$1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`comment with id: ${id} not found`);
    }
    return result.rows[0].id;
  }

  async verifyCommentAvailability(id, threadId) {
    const query = {
      text: `
        SELECT *
        FROM comments
        WHERE id=$1 AND thread = $2`,
      values: [id, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`comment with ${id} and ${threadId} not found`);
    }
    return result.rows[0].id;
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: `
        SELECT *
        FROM comments
        WHERE id = $1 AND owner = $2`,
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError(`only author can do this action`);
    }
    return result.rows[0].id;
  }

  async getCommentByThreadId(threadId) {
    const queryThread = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const checkThread = await this._pool.query(queryThread);
    if (!checkThread.rowCount) {
      throw new NotFoundError(`thread with id: ${threadId} not found`);
    }
    const thread = checkThread.rows[0].id;

    const query = {
      text: `
        SELECT 
        comments.id, 
        users.username,
        comments.date,
        comments.deleted,
        comments.thread,
        comments.content
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE thread = $1
        `,
      values: [thread],
    };

    const result = await this._pool.query(query);
    return new DetailComment(result.rows);
  }
  async deleteCommentById(id) {
    const query = {
      text: `
        UPDATE comments
        SET deleted = TRUE
        WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`comment with id: ${id} not found`);
    }
  }
}

module.exports = CommentRepositoryPostgres;
