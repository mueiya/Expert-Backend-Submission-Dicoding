const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ServerTestHelper.cleanCommentsTable();
    await ServerTestHelper.cleanUsersTable();
    await ServerTestHelper.cleanThreadsTable();
  });

  describe('when POST /comments', () => {
    it('should response 401 and throw AuthorizedError when not given authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'Comment Content',
      };

      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 and throw error when given wrong thread id', async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      await ServerTestHelper.addThreadDummy(server, authentication);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxxxx/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread with id: xxxxx not found');
    });
    describe('Bad Payload', () => {
      it('should response 400 and throw error when given missing payload', async () => {
        // Arrange
        const requestPayload = {};

        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);
        const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
      });

      it('should response 400 and throw error when given wrong data type', async () => {
        // Arrange
        const requestPayload = {
          content: 123,
        };

        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);
        const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
      });
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'the Content',
      };

      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('comment posted');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
  describe('When DELETE /comments', () => {
    it('should response 404 when comment with threadId or commentId not found', async () => {
      // Arrange
      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
      await ServerTestHelper.addCommentDummy(server, threadId, authentication);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxxxx/comments/xxxxx`,
        headers: {
          Authorization: `Bearer ${authentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(`comment with xxxxx and xxxxx not found`);
    });
    it('should response 200', async () => {
      // Arrange
      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);
      const commentId = await ServerTestHelper.addCommentDummy(server, threadId, authentication);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${authentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('comment deleted');
    });
  });
});
