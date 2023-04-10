class DetailComment {
  constructor(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('DETAIL_COMMENT.NOT_AN_ARRAY');
    }

    this.comments = payload.map((comment) => this._remapComment(comment));
  }

  _remapComment(comment) {
    this._verifyPayload(comment);

    const {
      id,
      username,
      date,
      deleted,
      thread,
      content,
    } = comment;

    // soft deleted comment
    const remappedContent = deleted ? '**komentar telah dihapus**' : content;

    return {
      id,
      username,
      date,
      thread,
      content: remappedContent,
    };
  }

  _verifyPayload(comment) {
    const {
      id,
      username,
      date,
      deleted,
      thread,
      content,
    } = comment;

    if (!id || !username || !date || deleted == null || deleted == undefined || !thread || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof deleted !== 'boolean' ||
      typeof thread !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
