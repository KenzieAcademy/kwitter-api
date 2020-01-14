"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "ALTER TABLE users ADD COLUMN picture BYTEA"
    );
  },

  down: (queryInterface, Sequelize) => {
    // WARNING: this will delete all data from users picture column
    return queryInterface.sequelize.query(
      "ALTER TABLE users DROP COLUMN picture"
    );
  }
};
