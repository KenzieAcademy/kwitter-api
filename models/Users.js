"use strict";
const bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define(
    "users",
    {
      username: DataTypes.STRING,
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Display name must be between 3 and 20 characters"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: "Password must be between 3 and 20 characters"
          }
        }
      },
      about: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
        validate: {
          len: {
            args: [0, 255],
            msg: "About must be 255 characters or less"
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
          // PATCH /users endpoint does not require a password to be passed
          // so check if the password is provided before trying to hash it (this prevents bcrypt from throwing an error)
          if (user.password) {
            user.password = bcrypt.hashSync(user.password, 8);
          }
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
