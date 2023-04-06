const PostedReply = require('../PostedReply');

describe('a PostedReply entities', () => {
  it('should throw error when payload did not contain needed property', ( ) => {
    // Arrange
    const payload = {
      id: 'reply-1234',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 23,
      content: {},
      owner: 34,
    };

    // Action and Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-2341',
      content: 'Senang dapat membantu',
      owner: 'user-234',
    };

    // Action
    const postedReply = new PostedReply(payload);

    // Assert
    expect(postedReply.id).toEqual(payload.id);
    expect(postedReply.content).toEqual(payload.content);
    expect(postedReply.owner).toEqual(payload.owner);
  });
});
