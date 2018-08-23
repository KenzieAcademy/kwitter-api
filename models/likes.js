"use strict";
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define(
    "likes",
    {
      userId: DataTypes.INTEGER,
      messageId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          likes.belongsTo(models.users);
          likes.belongsTo(models.messages);
        }
      },
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"]
        }
      }
    }
  );
  return likes;
};
