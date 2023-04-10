const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
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
    const expectedReply = [
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
    ];

    const expectedComment = [
      {
        id: 'comment-1234',
        username: 'notmueiya',
        date: '2021-08-08T07:20:09.775Z',
        replies: expectedReply,
        content: 'Akhirnya aku bisa bernapas',
      },
      {
        id: 'comment-3224',
        username: 'somewhere over the raibow',
        date: '2021-08-08T07:50:09.775Z',
        replies: [{}],
        content: '**komentar telah dihapus**',
      },
    ];

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
      comments: expectedComment,
    });

    const mockDetailComment = new DetailComment([
      {
        id: 'comment-1234',
        username: 'notmueiya',
        date: '2021-08-08T07:20:09.775Z',
        thread: useCasePayload.id,
        replies: expectedReply,
        content: 'Akhirnya aku bisa bernapas',
        deleted: false,
      },
    ]);

    const mockDetailReply = new DetailReply([
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

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mock needed function */
    mockReplyRepository.getReplyById = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyByCommentId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockDetailReply));
    mockCommentRepository.getCommentById = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockDetailComment));
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(mockDetailThread));

    /** creating use case instance */
    const getViewDetailThreadByIdUseCase = new ViewDetailThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getViewDetailThreadByIdUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(mockDetailComment.comments[0].id);
  });
});
