const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload is not an array', () => {
    // Arrange
    const payload = {
      id: 'reply-2341',
      content: 'Senang dapat membantu',
      date: '2021-08-08T07:19:09.775Z',
      comment: 'comment-1234',
      username: 'Mueiya',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_AN_ARRAY');
  });
  it('should throw error when payload did not contain needed property', ( ) => {
    // Arrange
    const payload = [
      {
        id: 'reply-1234',
        content: 'Okay',
      },
      {id: 'reply-4313',
        username: 'mueiya',
      },
    ];

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: 23,
        username: 34,
        date: [],
        comment: 423,
        deleted: 24,
        content: {},
      },
      {
        id: 4234,
        username: 435,
        date: {},
        comment: 234,
        deleted: 34,
        content: [],
      },
    ];

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should change content if deleted is true', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-234',
        username: 'Mueiya',
        date: '2021-08-08T07:10:09.775Z',
        comment: 'comment-134',
        deleted: true,
        content: 'apalah itu',
      },
    ];

    const expectedDetailReply = {
      replies: [
        {
          id: 'comment-234',
          username: 'Mueiya',
          date: '2021-08-08T07:10:09.775Z',
          comment: 'comment-134',
          content: '**balasan telah dihapus**',
        },
      ],
    };

    // Action
    const detailReply = new DetailReply(payload);
    expect(detailReply).toEqual(expectedDetailReply);
  });
  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'reply-2341',
        username: 'Mueiya',
        date: '2021-08-08T07:19:09.775Z',
        comment: 'comment-1234',
        deleted: false,
        content: 'Senang dapat membantu',
      },
      {
        id: 'reply-223',
        username: 'npe',
        date: '2021-08-08T07:09:09.775Z',
        comment: 'comment-1234',
        deleted: true,
        content: 'Senang membantu',
      },
    ];

    // Action
    const detailReply = new DetailReply(payload);

    detailReply.replies.forEach((reply, i) => {
      // Assert
      expect(reply.id).toEqual(payload[i].id);
      expect(reply.content).toEqual(payload[i].deleted ? '**balasan telah dihapus**': payload[i].content);
      expect(reply.date).toEqual(payload[i].date);
      expect(reply.comment).toEqual(payload[i].comment);
      expect(reply.username).toEqual(payload[i].username);
    });
  });
});
