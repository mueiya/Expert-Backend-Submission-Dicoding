/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsLikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    date = '2023-04-11T08:12:00.000Z',
    comment = 'comment-123',
    owner = 'user-123',
  }) {
    const query = {
      text: `INSERT INTO comment_likes VALUES ($1, $2, $3, $4)`,
      values: [id, date, comment, owner],
    };

    await pool.query(query);
  },

  async checkCommentLike(commentId, owner) {
    const query = {
      text: `
          SELECT *
          FROM comment_likes
          WHERE comment =$1 AND owner = $2`,
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentsLikesTableTestHelper;
