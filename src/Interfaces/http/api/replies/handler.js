const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
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
      data: {
        addedReply: addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
