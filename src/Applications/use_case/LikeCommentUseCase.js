class LikeCommentUseCase {
  constructor({threadRepository, commentRepository, commentLikeRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const {threadId, commentId, owner} = useCasePayload;
    await this._commentRepository.verifyCommentAvailability(commentId, threadId);
    const liked = await this._commentLikeRepository.verifyCommentLikeAvailability(commentId, owner);

    if (liked) {
      await this._commentLikeRepository.deleteCommentLike(commentId, owner);
    } else {
      await this._commentLikeRepository.addCommentLike(commentId, owner);
    }
  }
}

module.exports = LikeCommentUseCase;
