class DeleteCommentUseCase {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      id,
      threadId,
      owner,
    } = useCasePayload;

    await this._commentRepository.verifyCommentAvailability(id, threadId);
    await this._commentRepository.verifyCommentOwner(id, owner);
    await this._commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
