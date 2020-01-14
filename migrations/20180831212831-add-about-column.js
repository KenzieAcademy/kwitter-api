"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "ALTER TABLE users ADD COLUMN about VARCHAR(255) NOT NULL DEFAULT ''"
    );
  },

  down: (queryInterface, Sequelize) => {
    // WARNING: this will delete all data from the users about column
    return queryInterface.sequelize.query(
      "ALTER TABLE users DROP COLUMN about"
    );
  }
};
