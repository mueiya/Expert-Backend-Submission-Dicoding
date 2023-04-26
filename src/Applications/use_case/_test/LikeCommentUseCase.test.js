const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  /**
  * to test wheter the use case can consentrate step by step correctly
  */
  it('should orchestrating add like action correcty when comment is not liked by current user', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'owner-123',
    };

    /** Creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** Mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.verifyCommentLikeAvailability= jest.fn(() => Promise.resolve(false));
    mockCommentLikeRepository.addCommentLike = jest.fn(() => Promise.resolve());

    /** Creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockCommentLikeRepository.verifyCommentLikeAvailability).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
  it('should orchestrating delete like action correcty when comment is liked by current user', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'owner-123',
    };

    /** Creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** Mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.verifyCommentLikeAvailability= jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteCommentLike = jest.fn(() => Promise.resolve());

    /** Creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockCommentLikeRepository.verifyCommentLikeAvailability).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentLikeRepository.deleteCommentLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
