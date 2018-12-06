"use strict";
const bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notContains: {
            args: " ",
            msg: "Username cannot include spaces"
          },
          len: {
            args: [3, 20],
            msg: "Username must be between 3 and 20 characters"
          }
        }
      },
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
      },
      picture: {
        type: DataTypes.BLOB,
        allowNull: true
      },
      pictureContentType: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
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
          exclude: ["password", "picture", "pictureContentType"]
        }
      },
      scopes: {
        picture: {
          attributes: {
            exclude: [
              "id",
              "username",
              "displayName",
              "password",
              "about",
              "createdAt",
              "updatedAt"
            ]
          }
        }
      }
    }
  );
  return User;
};
