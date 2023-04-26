const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }
  async putCommentLikeHandler(request, h) {
    const params = request.params;

    const {id: userId} = request.auth.credentials;
    const useCasePayload = {
      threadId: params.threadId,
      commentId: params.commentId,
      owner: userId,
    };

    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'like status changed',
    });

    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;
