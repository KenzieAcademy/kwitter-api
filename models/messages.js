"use strict";
module.exports = function(sequelize, DataTypes) {
  var messages = sequelize.define(
    "messages",
    {
      text: DataTypes.STRING,
      userId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          messages.belongsTo(models.users);
          messages.hasMany(models.likes);
        }
      }
    }
  );
  return messages;
};
