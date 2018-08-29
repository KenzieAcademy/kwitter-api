"use strict";
module.exports = function(sequelize, DataTypes) {
  var messages = sequelize.define(
    "messages",
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
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          messages.belongsTo(models.users);
          messages.hasMany(models.likes);
        }
      },
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"]
        }
      }
    }
  );
  return messages;
};
