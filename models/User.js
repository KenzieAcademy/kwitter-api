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
          }
        }
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      about: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
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
        afterValidate: async function(user) {
          // PATCH /users endpoint does not require a password to be passed
          // so check if the password is provided before trying to hash it (this prevents bcrypt from throwing an error)
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 8);
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
