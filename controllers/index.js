const users = require("./users");
const { router } = require("./auth");

module.exports = {
    auth: router,
    users
};
