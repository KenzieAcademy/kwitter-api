"use strict";
module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define(
    "like",
    {
      userId: DataTypes.INTEGER,
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
