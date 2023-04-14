/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ServerTestHelper = {
  async addAuthDummy(server) {
    const dummyUser = {
      username: 'userDummy',
      password: 'passwordDummy',
      fullname: 'fullnameDummy',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: dummyUser.username,
        password: dummyUser.password,
        fullname: dummyUser.fullname,
      },
    });

    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: dummyUser.username,
        password: dummyUser.password,
      },
    });

    const authResponse = JSON.parse(auth.payload);

    return authResponse;
  },

  async addThreadDummy(server, auth) {
    const dummyThread = {
      title: 'titleDummy',
      body: 'bodyDummy',
    };

    const thread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: dummyThread.title,
        body: dummyThread.body,
      },
      headers: {
        Authorization: `Bearer ${auth.data.accessToken}`,
      },
    });

    const threadResponse = JSON.parse(thread.payload);

    return threadResponse.data.addedThread.id;
  },

  async addCommentDummy(server, threadId, auth) {
    const commentDummy = {
      content: 'contentDummy',
    };

    const comment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: commentDummy.content,
      },
      headers: {
        Authorization: `Bearer ${auth.data.accessToken}`,
      },
    });

    const commentResponse = JSON.parse(comment.payload);

    return commentResponse.data.addedComment.id;
  },

  async cleanUsersTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },

  async cleanThreadsTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },

  async cleanCommentsTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },

  async cleanRepliesTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ServerTestHelper;
