"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TABLE users ADD COLUMN "pictureContentType" VARCHAR(255)`
    );
  },

  down: (queryInterface, Sequelize) => {
    // WARNING: this will delete all data from users pictureContentType column
    return queryInterface.sequelize.query(
      `ALTER TABLE users DROP COLUMN "pictureContentType"`
    );
  }
};
