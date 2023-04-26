const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should threw error when invoke unimplemented method', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action & Assert
    await expect(commentLikeRepository.verifyCommentLikeAvailability('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.addCommentLike('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.deleteCommentLike('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.getCommentLikeCount('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
