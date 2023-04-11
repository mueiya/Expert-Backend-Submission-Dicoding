/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'The content of the reply',
    date = '2023-04-11T08:12:00.000Z',
    comment = 'comment-123',
    thread = 'thread-123',
    owner = 'user-123',
    deleted = false,
  }) {
    const query = {
      text: `INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      values: [id, content, date, comment, thread, owner, deleted],
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
