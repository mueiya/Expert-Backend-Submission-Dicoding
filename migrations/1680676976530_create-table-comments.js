/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      typeof: 'TEXT',
      notNull: true,
    },
    thread: {
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
  // Adding foreign key threads(id) as thread
  pgm.addConstraint('comments', 'fk_comments_threads', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
  // Adding foreign key users(id) as owner
  pgm.addConstraint('comments', 'fk_comments_users', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
