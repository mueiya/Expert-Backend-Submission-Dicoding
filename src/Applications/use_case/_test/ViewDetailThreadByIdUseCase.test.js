const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');
const ViewDetailThreadByIdUseCase = require('../ViewDetailThreadByIdUseCase');

describe('GetDetailThreadByIdUseCase', () => {
  it('should orchestrating the Get detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-1234',
    };

    /**
     * create cascading expected object
     */
    const expectedThread = {
      thread: {
        id: useCasePayload.id,
        title: 'Cara Bernapas',
        body: 'Tarik napas lalu keluarkan',
        date: '2021-08-08T07:19:09.775Z',
        username: 'mueiya',
        comments: [
          {
            id: 'comment-1234',
            username: 'notmueiya',
            date: '2021-08-08T07:20:09.775Z',
            replies: [
              {
                id: 'reply-2341',
                content: 'Senang dapat membantu',
                date: '2021-08-08T0:29:09.775Z',
                username: 'mueiya',
              },
              {
                id: 'reply-3424',
                content: '**balasan telah dihapus**',
                date: '2021-08-08T07:50:09.775Z',
                username: 'someoneElse',
              },
            ],
            content: 'Akhirnya aku bisa bernapas',
            likeCount: 2,
          },
          {
            id: 'comment-2345',
            username: 'stranger',
            date: '2021-08-08T07:50:09.775Z',
            replies: [
              {
                id: 'reply-432',
                content: 'Wooosh',
                date: '2021-08-08T07:50:09.775Z',
                username: 'mueiya',
              },
            ],
            content: '**komentar telah dihapus**',
            likeCount: 1,
          },
        ],
      },
    };

    const mockDetailThread = new DetailThread({
      id: useCasePayload.id,
      title: 'Cara Bernapas',
      body: 'Tarik napas lalu keluarkan',
      date: '2021-08-08T07:19:09.775Z',
      username: 'mueiya',
    });

    const mockDetailComment = new DetailComment([
      {
        id: 'comment-1234',
        username: 'notmueiya',
        date: '2021-08-08T07:20:09.775Z',
        thread: useCasePayload.id,
        content: 'Akhirnya aku bisa bernapas',
        deleted: false,
      },
      {
        id: 'comment-2345',
        username: 'stranger',
        date: '2021-08-08T07:50:09.775Z',
        thread: useCasePayload.id,
        content: 'ngapain dah tutor ginian',
        deleted: true,
      },
    ]);

    const mockDetailReply1 = new DetailReply([
      {
        id: 'reply-2341',
        content: 'Senang dapat membantu',
        date: '2021-08-08T0:29:09.775Z',
        comment: 'comment-1234',
        deleted: false,
        username: 'mueiya',
      },
      {
        id: 'reply-3424',
        content: 'Saya juga terbantu',
        date: '2021-08-08T07:50:09.775Z',
        comment: 'comment-1234',
        deleted: true,
        username: 'someoneElse',
      },
    ]);

    const mockDetailReply2 = new DetailReply([
      {
        id: 'reply-432',
        content: 'Wooosh',
        date: '2021-08-08T07:50:09.775Z',
        comment: 'comment-2345',
        deleted: false,
        username: 'mueiya',
      },
    ]);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mock needed function */
    mockReplyRepository.getReplyByCommentId = jest.fn((commentId) => {
      if (commentId === 'comment-1234') {
        return Promise.resolve(mockDetailReply1);
      } else if (commentId === 'comment-2345') {
        return Promise.resolve(mockDetailReply2);
      }
    });
    mockCommentLikeRepository.getCommentLikeCount = jest.fn((commentId) => {
      if (commentId === 'comment-1234') {
        return Promise.resolve(2);
      } else if (commentId === 'comment-2345') {
        return Promise.resolve(1);
      }
    });
    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve(mockDetailComment));
    mockThreadRepository.getDetailThreadById = jest.fn(() => Promise.resolve(mockDetailThread));

    /** creating use case instance */
    const getViewDetailThreadByIdUseCase = new ViewDetailThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const detailThread = await getViewDetailThreadByIdUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentLikeRepository.getCommentLikeCount).toBeCalledWith(mockDetailComment.comments[0].id);
    expect(mockCommentLikeRepository.getCommentLikeCount).toBeCalledWith(mockDetailComment.comments[1].id);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(mockDetailComment.comments[0].id);
    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(mockDetailComment.comments[1].id);
  });
});
