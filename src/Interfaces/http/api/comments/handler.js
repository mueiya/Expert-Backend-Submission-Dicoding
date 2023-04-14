const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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
      message: 'comment posted',
      data: {
        addedComment: addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const params = request.params;

    const {id: userId} = request.auth.credentials;
    const useCasePayload = {
      id: params.commentId,
      threadId: params.threadId,
      owner: userId,
    };

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'comment deleted',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
