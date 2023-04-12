const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepository Postgres', () => {
  afterEach(async ( ) => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist post comment and return posted comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const postComment = new PostComment({
        content: 'the comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(postComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-1234');
      expect(comment).toHaveLength(1);
    });
    it('should return posted comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const postComment = new PostComment({
        content: 'the comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      expect(await commentRepositoryPostgres.addComment(postComment)).toStrictEqual(new PostedComment({
        id: 'comment-1234',
        content: 'the comment',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentById functionn', ( ) => {
    it('should resolve and return comment id correctly and throw error when not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.getCommentById('commene-1234')).rejects.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.getCommentById('comment-123')).resolves.toEqual('comment-123');
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should returnig comment id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123', 'thread-123')).resolves.toEqual('comment-123');
    });
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-1234', 'thread-123')).rejects.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123', 'thread-1234')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw AuthorizationError when Owner and user-id doesnt macth', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'falseUsersId')).rejects.toThrowError(AuthorizationError);
    });
    it('should retun comment id when user is verified', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.toEqual('comment-123');
    });
  });
  describe('getCommentByThreadId', () => {
    it('should throw error when thread is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(commentRepositoryPostgres.getCommentByThreadId('falseThreadId')).rejects.toThrowError(NotFoundError);
    });
    it('should return DetailComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action
      const getCommentByThreadId = commentRepositoryPostgres.getCommentByThreadId('thread-123');
      // Assert
      await expect(getCommentByThreadId).resolves.toStrictEqual(new DetailComment([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2023-04-11T08:12:00.000Z',
          deleted: false,
          thread: 'thread-123',
          content: 'The content of the comment',
        },
      ]));
    });
  });
  describe('deleteCommentById', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      expect(commentRepositoryPostgres.deleteCommentById('falseId')).rejects.toThrowError(NotFoundError);
    });
    it('should delete comment correctly', async ( ) => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      const deletedComment = await CommentsTableTestHelper.findCommentById('comment-123');
      // Assert
      expect(deletedComment[0].deleted).toEqual(true);
    });
  });
});
