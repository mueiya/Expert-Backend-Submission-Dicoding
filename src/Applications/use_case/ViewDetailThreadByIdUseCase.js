class ViewDetailThreadByIdUseCase {
  constructor({threadRepository, commentRepository, replyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload.id);
    const comments = await this._commentRepository.getCommentByThreadId(useCasePayload.id);

    const commentPromises = comments.comments.map(async (comment) => {
      const replies = await this._replyRepository.getReplyByCommentId(comment.id);
      const remappedReplies = replies.replies.map((reply) => ({
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

