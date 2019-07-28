const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  operatorsAliases: false
});

// import models into sequelize
const Like = sequelize.import("./Like");
const Message = sequelize.import("./Message");
const User = sequelize.import("./User");

// setup associations between models
User.hasMany(Message, {
  foreignKey: "username"
});

Message.belongsTo(User, {
  foreignKey: "username"
});
Message.hasMany(Like);

Like.belongsTo(User, {
  foreignKey: "username"
});
Like.belongsTo(Message);

// handle adding statusCode to Sequelize.ValidationError
// also handle Sequelize.UniqueConstraintError which requires special handling to create a clean error message
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    err.statusCode = 400;
    if (err instanceof Sequelize.UniqueConstraintError) {
      const uniqueConstraintError = Object.assign(err, {
        message: err.errors[0].message
      });
      next(uniqueConstraintError);
      return;
    }
  }
  next(err);
};

module.exports = {
  startup: () => sequelize.authenticate(),
  errorHandlerMiddleware,
  Like,
  Message,
  User
};
