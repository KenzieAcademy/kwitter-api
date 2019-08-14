const statuses = require("statuses");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

morgan.token("user", req => JSON.stringify(req.user));
morgan.token("body", req => JSON.stringify(req.body));
morgan.token("headers", req => JSON.stringify(req.headers));
morgan.token("errorMessage", req => req.error.message);
morgan.token("errorStack", req => req.error.stack);

module.exports = [
  (err, req, res, next) => {
    // some packages pass an error with a status property instead of statusCode
    // reconcile that difference here by copying err.status to err.statusCode
    if (err.status) {
      err.statusCode = err.status;
    }
    if (err.statusCode >= 400 && err.statusCode < 500) {
      if (err.statusCode === 401) {
        res.set(
          "WWW-Authenticate",
          `Bearer realm="POST your username and password to /auth/login to receive a token"`
        );
      }
      res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode
      });
    } else {
      res.status(err.statusCode || 500);
      res.json({
        message: statuses[res.statusCode],
        statusCode: res.statusCode
      });
      // morgan is NOT an error handler, so must add error to req so morgan has access to it
      // also ensure req/res gets passed to following morgan logging middleware by calling next()
      req.error = err;
      console.log(err);
      next();
    }
  },
  // this middleware logs unknown error details to a log file for later investigation
  morgan(
    ":date :method :url :status \n\trequest:\n\t\theaders: :headers\n\t\tuser: :user\n\t\tbody: :body\n\tresponse:\n\t\tstatus: :status\n\t\terror message: :errorMessage\n\t\terror stack: :errorStack",
    {
      skip: (req, res) => {
        return res.statusCode <= 499;
      },
      stream: fs.createWriteStream(path.join(__dirname, "unknown_errors.log"), {
        flags: "a"
      })
    }
  )
];
