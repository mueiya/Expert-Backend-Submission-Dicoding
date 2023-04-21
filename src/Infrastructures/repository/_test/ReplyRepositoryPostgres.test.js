const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist post reply and return posted reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const postReply = new PostReply({
        content: 'the content',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(postReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-1234');
      expect(reply).toHaveLength(1);
    });
    it('should return postedReply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const postReply = new PostReply({
        content: 'the content',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '1234'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      expect(await replyRepositoryPostgres.addReply(postReply)).toStrictEqual(new PostedReply({
        id: 'reply-1234',
        content: 'the content',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundErro when reply is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      expect(replyRepositoryPostgres.verifyReplyAvailability()).rejects.toThrowError(NotFoundError);
      expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123', 'comment-123', 'falseThreadId')).rejects.toThrowError(NotFoundError);
      expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123', 'falseCommentId', 'thread-123')).rejects.toThrowError(NotFoundError);
      expect(replyRepositoryPostgres.verifyReplyAvailability('falseReplyId', 'comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
    });
  });
  describe('verifyReplyOwner', () => {
    it('should throw AuthorizationError when Owner and user-id doesnt match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'falseUserId')).rejects.toThrowError(AuthorizationError);
    });
    describe('getReplyByCommentId', () => {
      it('should return DetailReply correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({
          username: 'dicoding',
        });
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
        });
        await RepliesTableTestHelper.addReply({});

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action and Assert
        const detailReply = replyRepositoryPostgres.getReplyByCommentId('comment-123');
        await expect(detailReply).resolves.toStrictEqual(new DetailReply([
          {
            id: 'reply-123',
            content: 'The content of the reply',
            date: '2023-04-11T08:12:00.000Z',
            comment: 'comment-123',
            username: 'dicoding',
            deleted: false,
          },
        ]));
      });
      it('should return DetailReply in ascending order', async () => {
        // Arrange
        const secondReply = {
          id: 'reply-1234',
          content: 'Harusnya sih tampil pertama walau add di akhir',
          date: '2023-04-11T05:10:00.000Z',
          comment: 'comment-123',
          thread: 'thread-123',
          owner: 'user-123',
          deleted: false,
        };
        await UsersTableTestHelper.addUser({
          username: 'dicoding',
        });
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
        });
        await RepliesTableTestHelper.addReply({});
        await RepliesTableTestHelper.addReply(secondReply);

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action and Assert
        const detailReply = replyRepositoryPostgres.getReplyByCommentId('comment-123');
        await expect(detailReply).resolves.toStrictEqual(new DetailReply([
          {
            id: 'reply-1234',
            content: 'Harusnya sih tampil pertama walau add di akhir',
            date: '2023-04-11T05:10:00.000Z',
            comment: 'comment-123',
            username: 'dicoding',
            deleted: false,
          },
          {
            id: 'reply-123',
            content: 'The content of the reply',
            date: '2023-04-11T08:12:00.000Z',
            comment: 'comment-123',
            username: 'dicoding',
            deleted: false,
          },
        ]));
      });
    });
    describe('deleteReplyById', () => {
      it('should throw NotFoundError when reply is not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action and Assert
        expect(replyRepositoryPostgres.deleteReplyById('falseId')).rejects.toThrowError(NotFoundError);
      });
      it('should delete reply correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action
        await replyRepositoryPostgres.deleteReplyById('reply-123');

        const deletedReply = await RepliesTableTestHelper.findReplyById('reply-123');

        // Assert
        expect(deletedReply[0].deleted).toEqual(true);
      });
    });
  });
});
