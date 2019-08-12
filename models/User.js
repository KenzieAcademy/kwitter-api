"use strict";
const bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
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
      },
      googleId: {
        type: DataTypes.CHAR,
        allowNull: true
      }
    },
    {
      getterMethods: {
        pictureLocation() {
          return this.picture
            ? `/users/${this.username}/picture?t=${new Date(
                this.updatedAt
              ).getTime()}`
            : null;
        }
      },
      hooks: {
        beforeCreate: async user => {
          user.password = await bcrypt.hash(user.password, 8);
        },
        beforeUpdate: async user => {
          /*
          PATCH /users/{username} endpoint does not require a password to be passed
          so check if the password is provided before trying to hash it.
          we can determine whether the password was provided in PATCH /users/{username}
          by checking the length. if a password was not provided in the PATCH, then
          the password will be the original hashed password from the DB.
          the hashed password from the DB is always 60 characters long (according to bcrypt).
          while a new password provided to PATCH must be 2 to 20 characters
          (according to the api specification)
          */
          if (user.password.length !== 60) {
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
