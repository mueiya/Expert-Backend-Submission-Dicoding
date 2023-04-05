/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'The content of the reply',
    comment = 'comment-123',
    owner = 'user-123',
    deleted = false,
  }) {
    const query = {
      text: `INSERT INTO replies VALUES ($1, $2, $3, $4, $5)`,
      values: [id, content, comment, owner, deleted],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies');
  },
};

module.exports = RepliesTableTestHelper;
