const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
  * to test wheter the use case can consentrate step by step correctly
  */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Cara Bernapas',
      body: 'Tarik napas lalu keluarkan',
      owner: 'user-1234',
    };

    const mockPostedThread = new PostedThread({
      id: 'thread-1234',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockPostedThread));

    // Creating use case instance
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    // Action
    const postedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(new PostedThread({
      id: 'thread-1234',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new PostThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  },
  );
});
