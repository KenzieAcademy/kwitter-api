"use strict";
module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define(
    "like",
    {
      userId: DataTypes.INTEGER,
      messageId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Like.belongsTo(models.User);
          Like.belongsTo(models.Message);
        }
      },
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"]
        }
      }
    }
  );
  return Like;
};
