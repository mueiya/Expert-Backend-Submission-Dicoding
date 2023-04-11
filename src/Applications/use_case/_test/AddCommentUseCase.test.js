const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostComment = require('../../../Domains/comments/entities/PostComment');

describe('AddCommentUseCase', () => {
  /**
  * to test wheter the use case can consentrate step by step correctly
  */
  it('should orchestrating the add action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'apalah itu',
      threadId: 'thread-1234',
      owner: 'user-1234',
    };

    const mockPostedComment = new PostedComment({
      id: 'comment-1345',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed fuction
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(mockPostedComment));

    // creating use case instance
    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const postedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(postedComment).toStrictEqual(new PostedComment({
      id: 'comment-1345',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new PostComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
