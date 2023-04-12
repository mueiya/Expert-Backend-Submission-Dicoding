const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const PostedThread = require('../../Domains/threads/entities/PostedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postThread) {
    const {title, body, owner} = postThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
            INSERT INTO threads
            VALUES($1, $2, $3, $4, $5)
            RETURNING id, title, owner`,
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new PostedThread({...result.rows[0]});
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
    return result.rows[0].id;
  }

  async getDetailThreadById(id) {
    await this.getThreadById(id);

    const query = {
      text: `
      SELECT threads.id, threads.title, threads.body, threads.date, users.username
      FROM threads
      LEFT JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return new DetailThread({...result.rows[0]});
  }
}

module.exports = ThreadRepositoryPostgres;
