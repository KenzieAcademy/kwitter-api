"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TABLE messages 
      DROP CONSTRAINT "messages_userId_fkey",
      ADD CONSTRAINT "messages_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES users(id) 
        ON DELETE CASCADE;

      ALTER TABLE likes
      DROP CONSTRAINT "likes_userId_fkey",
      ADD CONSTRAINT "likes_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES users(id)
        ON DELETE CASCADE;

      ALTER TABLE likes
      DROP CONSTRAINT "likes_messageId_fkey",
      ADD CONSTRAINT "likes_messageId_fkey"
        FOREIGN KEY ("messageId")
        REFERENCES messages(id)
        ON DELETE CASCADE;`
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TABLE messages
      DROP CONSTRAINT "messages_userId_fkey",
      ADD CONSTRAINT "messages_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES users(id);

      ALTER TABLE likes
      DROP CONSTRAINT "likes_userId_fkey",
      ADD CONSTRAINT "likes_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES users(id);
      
      ALTER TABLE likes
      DROP CONSTRAINT "likes_messageId_fkey",
      ADD CONSTRAINT "likes_messageId_fkey"
        FOREIGN KEY ("messageId")
        REFERENCES messages(id);`
    );
  }
};
