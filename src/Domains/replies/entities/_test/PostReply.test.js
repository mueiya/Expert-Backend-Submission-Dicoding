const PostReply = require('../PostReply');

describe('a PostReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'lah lah lah!!',
      threadId: 'thread-1234',
    };

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: [],
      commentId: 234,
      owner: {},
    };

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'Sama ane juga, gan.',
      threadId: 'thread-1343',
      commentId: 'comment-134',
      owner: 'user-243',
    };

    // Action
    const postReply = new PostReply(payload);

    // Assert
    expect(postReply.content).toEqual(payload.content);
    expect(postReply.threadId).toEqual(payload.threadId);
    expect(postReply.commentId).toEqual(payload.commentId);
    expect(postReply.owner).toEqual(payload.owner);
  });
});
