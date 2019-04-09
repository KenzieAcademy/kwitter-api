const users = require("./users");
const messages = require("./messages");
const likes = require("./likes");
const auth = require("./auth");
module.exports = {
  ...auth,
  ...likes,
  ...messages,
  ...users
};
