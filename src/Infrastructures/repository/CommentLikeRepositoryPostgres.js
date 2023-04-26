const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentLikeAvailability(commentId, owner) {
    const query = {
      text: `
          SELECT *
          FROM comment_likes
          WHERE comment =$1 AND owner = $2`,
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }

  async addCommentLike(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `INSERT INTO comment_likes VALUES ($1, $2, $3, $4)`,
      values: [id, date, commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteCommentLike(commentId, owner) {
    const query = {
      text: `
        DELETE 
        FROM comment_likes
        WHERE comment =$1 AND owner = $2`,
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getCommentLikeCount(commentId) {
    const query = {
      text: `
        SELECT *
        FROM comment_likes
        WHERE comment = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount.toString();
  }
}

module.exports = CommentLikeRepositoryPostgres;
