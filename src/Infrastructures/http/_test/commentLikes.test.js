const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ServerTestHelper.cleanCommentsTable();
    await ServerTestHelper.cleanUsersTable();
    await ServerTestHelper.cleanThreadsTable();
    await ServerTestHelper.cleanCommentLikesTable();
  });

  describe('when PUT /likes', () => {
    it('should response 401 and throw AuthorizedError when not given authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
      const commentId = await ServerTestHelper.addCommentDummy(server, threadId, authentication);
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
    describe('Bad Params', () => {
      it('should response 404 and throw error when given wrong thread id', async () => {
        // Arrange
        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);
        const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
        const commentId = await ServerTestHelper.addCommentDummy(server, threadId, authentication);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: `/threads/xxxxxx/comments/${commentId}/likes`,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(`comment with ${commentId} and xxxxxx not found`);
      });

      it('should response 404 and throw error when given wrong comment id', async () => {
        // Arrange
        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);
        const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
        await ServerTestHelper.addCommentDummy(server, threadId, authentication);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: `/threads/${threadId}/comments/xxxxx/likes`,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(`comment with xxxxx and ${threadId} not found`);
      });

      it('should response 404 and throw error when given wrong thread id', async () => {
        // Arrange
        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);
        const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
        await ServerTestHelper.addCommentDummy(server, threadId, authentication);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: `/threads/xxxxxx/comments/xxxxx/likes`,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.message).toEqual('comment with xxxxx and xxxxxx not found');
        expect(responseJson.status).toEqual('fail');
      });
    });
    it('should response 200', async () => {
      // Arrange
      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
      const commentId = await ServerTestHelper.addCommentDummy(server, threadId, authentication);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.message).toEqual('like status changed');
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
