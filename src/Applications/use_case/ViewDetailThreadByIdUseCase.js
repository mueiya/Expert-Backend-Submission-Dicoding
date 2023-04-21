class ViewDetailThreadByIdUseCase {
  constructor({threadRepository, commentRepository, replyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getDetailThreadById(useCasePayload.id);
    const getComments = await this._commentRepository.getCommentByThreadId(useCasePayload.id);

    // Get each comment's replies and remmap the replies
    const commentPromises = getComments.comments.map(async (comment) => {
      const getReplies = await this._replyRepository.getReplyByCommentId(comment.id);
      const remappedReplies = getReplies.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
      }));

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        replies: remappedReplies,
        content: comment.content,
      };
    });

    const remappedComments = await Promise.all(commentPromises);

    const remappedThread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: remappedComments,
    };

    return {thread: remappedThread};
  }
}

module.exports = ViewDetailThreadByIdUseCase;

