const users = require("./users");
const messages = require("./messages");
const { router } = require("./auth");

module.exports = {
    auth: router,
    messages,
    users
};
