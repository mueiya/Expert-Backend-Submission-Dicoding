const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({threadRepository, commentRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {threadId} = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(threadId);
    const postComment = new PostComment(useCasePayload);
    return this._commentRepository.addComment(postComment);
  }
}

module.exports = AddCommentUseCase;
