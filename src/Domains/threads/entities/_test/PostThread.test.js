const PostThread = require('../PostThread');

describe('a PostThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Cara Bernapas',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      title: 2123,
      body: {},
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postUser object correctly', () => {
    // Arrange
    const payload = {
      title: 'Cara Bernapas',
      body: 'Tarik napas lalu keluarkan',
    };

    // Action
    const postThread = new PostThread(payload);

    // Assert
    expect(postThread.title).toEqual(payload.title);
    expect(postThread.body).toEqual(payload.body);
  });
});
