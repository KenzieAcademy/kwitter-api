const users = require("./users");
const messages = require("./messages");
const likes = require("./likes");
const { router } = require("./auth");

module.exports = {
  auth: router,
  likes,
  messages,
  users
};
