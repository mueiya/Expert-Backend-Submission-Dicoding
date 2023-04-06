const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {

    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 34251,
    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Akhirnya ku bisa bernapas',
    };

    // Action
    const postComment = new PostComment(payload);

    // Assert
    expect(postComment.content).toEqual(payload.content);
  });
});
