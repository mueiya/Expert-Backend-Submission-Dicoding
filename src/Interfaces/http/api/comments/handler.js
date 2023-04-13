const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }
  async postCommentHandler(request, h) {
    const payload = request.payload;
    const params = request.params;

    const {id: userId} = request.auth.credentials;
    const useCasePayload = {
      content: payload.content,
      threadId: params.threadId,
      owner: userId,
    };

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
