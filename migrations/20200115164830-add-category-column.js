"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE messages
      ADD COLUMN "category" VARCHAR(255) NOT NULL DEFAULT 'unknown'
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE messages
      DROP COLUMN "category"
    `);
  }
};
