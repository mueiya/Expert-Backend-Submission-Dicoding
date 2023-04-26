const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentLikeAvailability function', () => {
    it('should return boolean false if owner not yet like comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action and Assert
      expect(commentLikeRepositoryPostgres.verifyCommentLikeAvailability('comment-123', 'user-123')).resolves.toEqual(false);
    });
    it('should return boolean true if owner not yet like comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      await CommentLikesTableTestHelper.addLike({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action and Assert
      expect(commentLikeRepositoryPostgres.verifyCommentLikeAvailability('comment-123', 'user-123')).resolves.toEqual(true);
    });
  });

  describe('addCommentLike function', () => {
    it('should adding new like to table', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepositoryPostgres.addCommentLike('comment-123', 'user-123');
      const addedLike = await CommentLikesTableTestHelper.checkCommentLike('comment-123', 'user-123');

      // Assert
      expect(addedLike).toEqual(true);
    });
  });
  describe('deleteCommentLike function', () => {
    it('should delete like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      await CommentLikesTableTestHelper.addLike({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      await commentLikeRepositoryPostgres.deleteCommentLike('comment-123', 'user-123');
      const addedLike = await CommentLikesTableTestHelper.checkCommentLike('comment-123', 'user-123');

      // Assert
      expect(addedLike).toEqual(false);
    });
  });
  describe('getCommentLikeCount function', () => {
    it('should delete like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-234',
        username: 'halomanusia',
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-234',
        owner: 'user-234',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await commentLikeRepositoryPostgres.getCommentLikeCount('comment-123', 'user-123');

      // Assert
      expect(likeCount).toEqual(2);
    });
  });
});
