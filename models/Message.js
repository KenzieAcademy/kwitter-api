"use strict";
module.exports = function(sequelize, DataTypes) {
  const Message = sequelize.define(
    "message",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: "Message text must be between 2 and 255 characters"
          }
        }
      },
      userId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          Message.belongsTo(models.User);
          Message.hasMany(models.Like);
        }
      },
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"]
        }
      }
    }
  );
  return Message;
};
