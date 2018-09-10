const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  { dialect: process.env.DB_DIALECT }
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
