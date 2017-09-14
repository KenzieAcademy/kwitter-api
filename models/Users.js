'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    display_name: DataTypes.STRING,
    password_hash: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        users.hasMany(models.messages);
      }
    }
  });
  return users;
};
