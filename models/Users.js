'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    displayName: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
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
