const users = require("./users");
const messages = require("./messages");
const likes = require("./likes");
const auth = require("./auth");

const EnforcerMiddleware = require("openapi-enforcer-middleware");
const enforcer = EnforcerMiddleware("./specification.yaml");

module.exports = {
  ...auth,
  ...likes,
  ...messages,
  ...users,
  middleware: enforcer.middleware(),
  startup: async () => {
    await enforcer.promise;
    await enforcer.controllers("./controllers");
  }
};
