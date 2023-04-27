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

    /** get all CommentIds from getComments */
    const commentIds = getComments.comments.map((comment) => comment.id);

    /** get all replies and likeCount with all commentIds */
    const getReplies = await this._replyRepository.getReplyByCommentId(commentIds);
    const getLikeCount = await this._commentLikeRepository.getCommentLikeCount(commentIds);

    /** Inserting the replies and likeCount to corresponding comment */
    await getComments.comments.forEach((comment) => {
      const replies = getReplies.replies.filter((reply) => reply.comment === comment.id);
      const like = getLikeCount.filter((like) => like.comment === comment.id);
      /** remapping the replies to remove commentid properties */
      comment.replies = replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
      }));
      comment.likeCount = like[0].likeCount;
    });

    /** Remmmap the thread and commments to remove threadid prop from comment*/
    const remappedThread = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: getComments.comments.map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        replies: comment.replies,
        likeCount: comment.likeCount,
      })),
    };

    console.log(JSON.stringify(remappedThread, null, 2));

    return {thread: remappedThread};
  }
}

module.exports = ViewDetailThreadByIdUseCase;

