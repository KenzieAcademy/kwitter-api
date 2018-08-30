"use strict";
const bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define(
    "users",
    {
      username: DataTypes.STRING,
      displayName: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Password must be between 3 and 20 characters"
          }
        }
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
          users.hasMany(models.messages);
        }
      },
      hooks: {
        afterValidate: function(user) {
          user.password = bcrypt.hashSync(user.password, 8);
        }
      },
      defaultScope: {
        attributes: {
          exclude: ["password"]
        }
      }
    }
  );
  return users;
};
