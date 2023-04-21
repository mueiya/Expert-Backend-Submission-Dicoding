const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const pool = require('../../database/postgres/pool');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', ( ) => {
    it('should persist post thread and return posted thread correctly ', async () => {
      // Arrange
      await UsersTableTestHelper.addUser(
          {
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
          },
      );
      const postThread = new PostThread({
        title: 'the title',
        body: 'this is the body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(postThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-1234');
      expect(threads).toHaveLength(1);
    });

    it('should return posted thread correctly', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      const postThread = new PostThread({
        title: 'the title',
        body: 'this is the body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await threadRepositoryPostgres.addThread(postThread);

      // Assert
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-1234',
        title: 'the title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadAvailability Function', () => {
    it('should resolve and throw error when not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-1234')).rejects.toThrowError(NotFoundError);
      expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).resolves;
    });
  });

  describe('getDetailThreadById Function', () => {
    it('should throw error when thread is not foundf', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getDetailThreadById('falseID')).rejects.toThrowError(NotFoundError);
    });
    it('should return detail thread corectly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.getDetailThreadById('thread-123');
      expect(detailThread).toStrictEqual(new DetailThread({
        id: 'thread-123',
        title: 'The Title',
        body: 'The content of the thread',
        date: '2023-04-11T08:12:00.000Z',
        username: 'dicoding',
      }));
    });
  });
});
