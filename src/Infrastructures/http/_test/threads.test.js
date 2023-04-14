const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ServerTestHelper.cleanThreadsTable();
    await ServerTestHelper.cleanUsersTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 and throw AuthorizedError when not given authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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

    describe('Bad Payload', () => {
      it('should response 400 and throw error when given mising payload', async () => {
        // Arrange
        const requestPayload = {
          title: 'Thread Title',
        };

        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
      });

      it('should response 400 and throw error when given wrong data type', async () => {
        // Arrange
        const requestPayload = {
          title: {},
          body: 134,
        };

        const server = await createServer(container);

        const authentication = await ServerTestHelper.addAuthDummy(server);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
      });
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authentication.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('thread posted');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads', () => {
    it('should respon 404 when thread with threadId not found', async () => {
      // Arrange

      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      await ServerTestHelper.addThreadDummy(server, authentication);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxxxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread with id: xxxxx not found');
    });
    it('should respon 200 ', async () => {
      // Arrange

      const server = await createServer(container);

      const authentication = await ServerTestHelper.addAuthDummy(server);
      const threadId = await ServerTestHelper.addThreadDummy(server, authentication);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('get thread detail success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
