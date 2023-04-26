/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // Adding foreign key comments(id) as comment
  pgm.addConstraint('comment_likes', 'fk_comment_likes_comments', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');
  // Adding foreign key users(id) as owner
  pgm.addConstraint('comment_likes', 'fk_comment_likes_users', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
