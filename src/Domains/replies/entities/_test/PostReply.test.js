const PostReply = require('../PostReply');

describe('a PostReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {

    };

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'Sama ane juga, gan.',
    };

    // Action
    const postReply = new PostReply(payload);

    // Assert
    expect(postReply.content).toEqual(payload.content);
  });
});
