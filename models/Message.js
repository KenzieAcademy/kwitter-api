"use strict";
module.exports = function(sequelize, DataTypes) {
  const Message = sequelize.define(
    "message",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: DataTypes.STRING,
      category: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"]
        }
      }
    }
  );
  return Message;
};
