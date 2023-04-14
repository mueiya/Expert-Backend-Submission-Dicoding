const PostReply = require('../../Domains/replies/entities/PostReply');

class AddReplyUseCase {
  constructor({thredRepository, commentRepository, replyRepository}) {
    this._threadRepository = thredRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {threadId, commentId} = useCasePayload;
    await this._commentRepository.verifyCommentAvailability(commentId, threadId);
    const postReply = new PostReply(useCasePayload);
    return this._replyRepository.addReply(postReply);
  }
}

module.exports = AddReplyUseCase;
