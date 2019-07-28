"use strict";
module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define(
    "like",
    {
      username: DataTypes.STRING,
      messageId: DataTypes.INTEGER
    },
    {
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"]
        }
      }
    }
  );
  return Like;
};
