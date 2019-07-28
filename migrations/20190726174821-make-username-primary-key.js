"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE messages 
      DROP CONSTRAINT "messages_userId_fkey";
    ALTER TABLE likes 
      DROP CONSTRAINT "likes_userId_fkey";
    ALTER TABLE likes 
      DROP CONSTRAINT "likes_userId_messageId_key";
    ALTER TABLE users 
      DROP CONSTRAINT users_pkey;

    ALTER TABLE messages
      ADD username VARCHAR(255);
    ALTER TABLE likes
      ADD username VARCHAR(255);

    UPDATE messages
      SET username=(SELECT username FROM users WHERE users.id=messages."userId");
    UPDATE likes
      SET username=(SELECT username FROM users WHERE users.id=likes."userId");

    ALTER TABLE messages
      DROP COLUMN "userId";
    ALTER TABLE likes
      DROP COLUMN "userId";

    ALTER TABLE users 
      ADD PRIMARY KEY (username);

    ALTER TABLE messages 
      ADD CONSTRAINT messages_username_fkey 
      FOREIGN KEY (username) 
      REFERENCES users(username) ON DELETE CASCADE;
    ALTER TABLE likes
      ADD CONSTRAINT likes_username_fkey
      FOREIGN KEY (username)
      REFERENCES users(username) ON DELETE CASCADE;
    ALTER TABLE likes
      ADD CONSTRAINT "likes_username_messageId_key"
      UNIQUE (username, "messageId");
    
    ALTER TABLE messages
      ALTER COLUMN username SET NOT NULL;
    ALTER TABLE likes
      ALTER COLUMN username SET NOT NULL;
    
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE messages
      ADD COLUMN "userId" SERIAL;
    ALTER TABLE likes
      ADD COLUMN "userId" SERIAL;

    UPDATE messages
      SET "userId"=(SELECT users.id FROM users WHERE users.username=messages.username);
    UPDATE likes
      SET "userId"=(SELECT users.id FROM users WHERE users.username=likes.username);

    ALTER TABLE messages
      DROP CONSTRAINT messages_username_fkey;
    ALTER TABLE likes
      DROP CONSTRAINT likes_username_fkey;
    ALTER TABLE likes
      DROP CONSTRAINT "likes_username_messageId_key";

    ALTER TABLE messages
      DROP COLUMN username;
    ALTER TABLE likes
      DROP COLUMN username;

    ALTER TABLE users 
      DROP CONSTRAINT users_pkey;
    ALTER TABLE users 
      ADD PRIMARY KEY (id);

    ALTER TABLE messages
      ADD CONSTRAINT "messages_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE likes
      ADD CONSTRAINT "likes_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE likes
      ADD CONSTRAINT "likes_userId_messageId_key"
      UNIQUE ("userId", "messageId");
    `);
  }
};
