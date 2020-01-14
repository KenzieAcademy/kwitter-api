const users = require("./users");
const messages = require("./messages");
const likes = require("./likes");
const auth = require("./auth");
const models = require("../models");

const EnforcerMiddleware = require("openapi-enforcer-middleware");
const enforcer = EnforcerMiddleware("./specification.yaml");
const enforcerMulter = require("openapi-enforcer-multer");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200000 }
});

const multerErrorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413);
    } else {
      res.status(400);
    }
    next({
      statusCode: res.statusCode,
      message: `${err.message}: ${err.field}`
    });
    return;
  } else if (err.message === "Multipart: Boundary not found") {
    res.status(400);
    next({
      statusCode: res.statusCode,
      message: "Did not receive picture data"
    });
    return;
  }
  next(err);
};

module.exports = {
  ...auth,
  ...likes,
  ...messages,
  ...users,
  middleware: [
    enforcerMulter(enforcer, upload),
    enforcer.middleware(),
    multerErrorHandlerMiddleware,
    models.errorHandlerMiddleware,
    // this error handler middleware adjusts err.statusCode and err.message in the case when enforcer.middleware encounters an undefined operation (ie this means the operation does not exist)
    (err, req, res, next) => {
      if (err.message === "Cannot read property 'operation' of undefined") {
        err.statusCode = 404;
        err.message = "Operation does not exist";
      }
      next(err);
    }
  ],
  startup: async () => {
    await enforcer.promise;
    await enforcer.controllers("./controllers");
    await models.startup();
  }
};
