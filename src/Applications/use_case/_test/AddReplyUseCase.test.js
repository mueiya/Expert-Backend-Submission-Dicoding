const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  /**
  * to test wheter the use case can consentrate step by step correctly
  */
  it('should orchestrating the add action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'reply content aja',
      threadId: 'thread-1234',
      commentId: 'comment-1345',
      owner: 'user-4353',
    };

    const mockPostedReply = new PostedReply({
      id: 'reply-1234',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** Creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** Mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
        .mockImplementation(() => Promise.resolve(mockPostedReply));

    /** Creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      thredRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const postedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(postedReply).toStrictEqual(new PostedReply({
      id: 'reply-1234',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new PostReply({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });
});
