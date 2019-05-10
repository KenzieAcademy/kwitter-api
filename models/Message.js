"use strict";
module.exports = function(sequelize, DataTypes) {
  const Message = sequelize.define(
    "message",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: DataTypes.INTEGER
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
