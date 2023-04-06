const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', ( ) => {
    // Arrange
    const payload = {
      id: 'reply-1234',
      content: 'Okay',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 23,
      content: {},
      date: [],
      username: 34,
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-2341',
      content: 'Senang dapat membantu',
      date: '2021-08-08T07:19:09.775Z',
      username: 'Mueiya',
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });
});
