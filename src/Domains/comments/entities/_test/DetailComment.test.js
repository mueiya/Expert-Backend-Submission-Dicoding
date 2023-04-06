const DetailComment = require('../DetailComment');

describe('a DetailComment entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      owner: 'user-1234',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1234,
      username: {},
      date: [],
      replies: 233,
      content: 344,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create detailedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1234',
      username: 'Mueiya',
      date: '2021-08-08T07:19:09.775Z',
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
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.replies).toEqual(payload.replies);
    expect(detailComment.content).toEqual(payload.content);
  });
});
