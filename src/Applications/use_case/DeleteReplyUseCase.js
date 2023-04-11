class DeleteReplyUseCase {
  constructor({replyRepository}) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      id,
      commentId,
      threadId,
      owner,
    } = useCasePayload;

    await this._replyRepository.verifyReplyAvailability(id, commentId, threadId);
    await this._replyRepository.verifyReplyOwner(id, owner);
    await this._replyRepository.deleteReplyById(id);
  }
}

module.exports = DeleteReplyUseCase;
