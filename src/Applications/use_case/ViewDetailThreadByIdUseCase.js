class ViewDetailThreadByIdUseCase {
  constructor({threadRepository, commentRepository, replyRepository, commentLikeRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getDetailThreadById(useCasePayload.id);
    const getComments = await this._commentRepository.getCommentByThreadId(useCasePayload.id);
    // Get each comment's replies and remmap the replies
    const commentPromises = getComments.comments.map(async (comment) => {
      const getLikeCount = await this._commentLikeRepository.getCommentLikeCount(comment.id);
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
        likeCount: getLikeCount,
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

