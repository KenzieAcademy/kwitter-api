"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.Like = sequelize.import("./Like");
db.Message = sequelize.import("./Message");
db.User = sequelize.import("./User");

db.User.hasMany(db.Message);

db.Message.belongsTo(db.User);
db.Message.hasMany(db.Like);

db.Like.belongsTo(db.User);
db.Like.belongsTo(db.Message);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
