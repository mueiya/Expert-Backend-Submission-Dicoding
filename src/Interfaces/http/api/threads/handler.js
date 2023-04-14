const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const ViewDetailThreadByIdUseCase = require('../../../../Applications/use_case/ViewDetailThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }
  async postThreadHandler(request, h) {
    const payload = request.payload;
    const {id: userId} = request.auth.credentials;
    const useCasePayload = {
      title: payload.title,
      body: payload.body,
      owner: userId,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'thread posted',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const {threadId} = request.params;
    const useCasePayload = {
      id: threadId,
    };

    const vievDetailThreadByIdUseCase = this._container.getInstance(ViewDetailThreadByIdUseCase.name);
    const {thread} = await vievDetailThreadByIdUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'get thread detail success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
