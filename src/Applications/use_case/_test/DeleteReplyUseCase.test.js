const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-1123',
      commentId: 'comment-1234',
      threadId: 'thread-1345',
      owner: 'user-1344',
    };

    /** Creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** Mocking needed function */
    mockReplyRepository.verifyReplyAvailability = jest.fn()
        .mockImplementation(() => Promise.resolve(useCasePayload.id));
    mockReplyRepository.verifyReplyOwner = jest.fn()
        .mockImplementation(() => Promise.resolve(useCasePayload.id));
    mockReplyRepository.deleteReplyById = jest.fn()
        .mockImplementation(() => Promise.resolve());

    /** Creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReplyAvailability).toBeCalledWith(useCasePayload.id, useCasePayload.commentId, useCasePayload.threadId );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCasePayload.id);
  });
});
