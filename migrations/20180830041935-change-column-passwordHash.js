"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'ALTER TABLE users RENAME COLUMN "passwordHash" TO password'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'ALTER TABLE users RENAME COLUMN password TO "passwordHash"'
    );
  }
};
