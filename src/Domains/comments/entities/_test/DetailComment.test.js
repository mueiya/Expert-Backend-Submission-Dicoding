const DetailComment = require('../DetailComment');

describe('a DetailComment entites', () => {
  it('should throw error when payload is not an array', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      username: 'mueiya',
      date: '2021-08-08T07:19:09.775Z',
      deleted: false,
      thread: 'thread-134',
      replies: [],
      content: 'Gue sih keluar dlu baru tarik',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_AN_ARRAY');
  });

  it('should throw error when object payload did not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-1234',
        username: 'mueiya',
      },
      {
        id: 'comment-234',
        content: 'makan bang',
      },
    ];

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when object payload did not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: 1234,
        username: {},
        date: [],
        deleted: 432,
        thread: 234,
        replies: 233,
        content: 344,
      },
      {
        id: 1234,
        username: {},
        date: [],
        deleted: 325,
        thread: 234,
        replies: 233,
        content: 344,
      },
    ];

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should change content if deleted is true', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-234',
        username: 'Mueiya',
        date: '2021-08-08T07:10:09.775Z',
        deleted: true,
        thread: 'thread-134',
        replies: [{}],
        content: 'apalah itu',
      },
    ];

    const expectedDetailComment = {
      comments: [
        {
          id: 'comment-234',
          username: 'Mueiya',
          date: '2021-08-08T07:10:09.775Z',
          thread: 'thread-134',
          replies: [{}],
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Action
    const detailComment = new DetailComment(payload);
    expect(detailComment).toEqual(expectedDetailComment);
  });
  it('should create detailedComment object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-1234',
        username: 'Mueiya',
        date: '2021-08-08T07:19:09.775Z',
        deleted: false,
        thread: 'thread-134',
        replies: [
          {
            'id': 'reply-BErOXUSefjwWGW1Z10Ihk',
            'content': '**balasan telah dihapus**',
            'date': '2021-08-08T07:59:48.766Z',
            'username': 'johndoe',
          },
          {
            'id': 'reply-xNBtm9HPR-492AeiimpfN',
            'content': 'sebuah balasan',
            'date': '2021-08-08T08:07:01.522Z',
            'username': 'dicoding',
          },
        ],
        content: 'Gue sih keluar dlu baru tarik',
      },
      {
        id: 'comment-234',
        username: 'Mueiya',
        date: '2021-08-08T07:10:09.775Z',
        deleted: true,
        thread: 'thread-134',
        replies: [{}],
        content: 'apalah itu',
      },
    ]
    ;

    // Action
    const detailComment = new DetailComment(payload);

    detailComment.comments.forEach((comment, i) => {
    // Assert
      expect(comment.id).toEqual(payload[i].id);
      expect(comment.username).toEqual(payload[i].username);
      expect(comment.date).toEqual(payload[i].date);
      expect(comment.thread).toEqual(payload[i].thread);
      expect(comment.replies).toEqual(payload[i].replies);
      expect(comment.content).toEqual(payload[i].deleted ? '**komentar telah dihapus**': payload[i].content);
    });
  });
});
