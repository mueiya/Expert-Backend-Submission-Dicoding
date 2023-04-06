const PostedComment = require('../PostedComment');

describe('a PostedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Akhirnya ku bisa bernapas',
      owner: 'user-1234',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meed data type specification', () => {
    // Arrange
    const payload = {
      id: 234,
      content: {},
      owner: 1,
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      content: 'Akhirnya ku bisa bernapas',
      owner: 'user-1234',
    };

    // Action
    const postedComment = new PostedComment(payload);

    // Assert
    expect(postedComment.id).toEqual(payload.id);
    expect(postedComment.content).toEqual(payload.content);
    expect(postedComment.owner).toEqual(payload.owner);
  });
});

