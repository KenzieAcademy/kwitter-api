"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    // WARNING: this could destroy rows. it deletes rows with duplicate username, leaving just a single row with a particular username
    // duplicate username deletion is necessary, otherwise the database will not allow to add the unique_username constraint
    return queryInterface.sequelize
      .query(
        "DELETE FROM users a USING users b WHERE a.id < b.id AND a.username = b.username;"
      )
      .then(() => {
        return queryInterface.sequelize.query(
          "ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);"
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "ALTER TABLE users DROP CONSTRAINT unique_username;"
    );
  }
};
