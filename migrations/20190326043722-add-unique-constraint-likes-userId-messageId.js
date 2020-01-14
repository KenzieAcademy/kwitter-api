"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE likes
    ADD UNIQUE("userId", "messageId")`);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE likes
    DROP CONSTRAINT "likes_userId_messageId_key"`);
  }
};
