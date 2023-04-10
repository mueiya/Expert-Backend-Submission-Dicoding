const PostThread = require('../../Domains/threads/entities/PostThread');

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const postThread = new PostThread(useCasePayload);
    await this._threadRepository.getThreadById(postThread.id);
    return this._threadRepository.addThread(postThread);
  }
}
module.exports = AddThreadUseCase;
