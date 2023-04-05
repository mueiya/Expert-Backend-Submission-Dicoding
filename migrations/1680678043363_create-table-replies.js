/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primarykey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
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
    deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: 'false',
    },
  });

  // Adding foreign key comments(id) as comment
  pgm.addConstraint('replies', 'fk_replies_comments', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');
  // Adding foreign key users(id) as owner
  pgm.addConstraint('replies', 'fk_replies_users', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
