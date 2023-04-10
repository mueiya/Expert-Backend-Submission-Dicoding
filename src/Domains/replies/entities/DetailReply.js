class DetailReply {
  constructor(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('DETAIL_REPLY.NOT_AN_ARRAY');
    }

    this.replies = payload.map((reply) => this._remapReply(reply));
  }

  _remapReply(reply) {
    this._verifyPayload(reply);

    const {
      id,
      content,
      date,
      comment,
      username,
      deleted,
    } = reply;

    // soft deleted reply
    const remmapedContent = deleted ? '**balasan telah dihapus**' : content;

    return {
      id,
      content: remmapedContent,
      date,
      comment,
      username,
    };
  }

  _verifyPayload(reply) {
    const {
      id,
      username,
      date,
      comment,
      deleted,
      content,
    } = reply;

    if (!id || !content || !date || !comment || !username || deleted == null || deleted == undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
        typeof content !== 'string' ||
        typeof date !== 'string' ||
        typeof comment !== 'string' ||
        typeof username !== 'string'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
