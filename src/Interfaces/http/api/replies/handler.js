const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }
  async postReplyHandler(request, h) {
    const payload = request.payload;
    const params = request.params;

    const {id: userId} = request.auth.credentials;
    const useCasePayload = {
      content: payload.content,
      threadId: params.threadId,
      commentId: params.commentId,
      owner: userId,
    };

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'reply posted',
      data: {
        addedReply: addedReply,
      },
    });
    response.code(201);
    return response;
  }
  async deleteReplyHandler(request, h) {
    const params = request.params;

    const {id: userId} = request.auth.credentials;
    const useCasePayload = {
      id: params.replyId,
      commentId: params.commentId,
      threadId: params.threadId,
      owner: userId,
    };

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'reply deleted',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
