"use strict";
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// import models into sequelize
const Like = sequelize.import("./Like");
const Message = sequelize.import("./Message");
const User = sequelize.import("./User");

// setup associations between models
User.hasMany(Message);

Message.belongsTo(User);
Message.hasMany(Like);

Like.belongsTo(User);
Like.belongsTo(Message);

module.exports = {
  sequelize,
  Like,
  Message,
  User
};
