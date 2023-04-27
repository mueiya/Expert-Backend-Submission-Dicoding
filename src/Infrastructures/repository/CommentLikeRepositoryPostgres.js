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

  async getCommentLikeCount(commentIds) {
    const query = {
      text: `
        SELECT comment, COUNT(*) as likecount
        FROM comment_likes
        WHERE comment = ANY($1::text[])
        GROUP BY comment`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    const likeCountMap = new Map();
    result.rows.forEach((row) => {
      likeCountMap.set(row.comment, row.likecount);
    });

    const commentLikes = commentIds.map((commentId) => {
      const likeCount = likeCountMap.get(commentId);
      return {
        comment: commentId,
        likeCount: likeCount === undefined ? 0 : parseInt(likeCount),
      };
    });

    return commentLikes;
  }
}

module.exports = CommentLikeRepositoryPostgres;
