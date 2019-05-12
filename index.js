require("dotenv-safe").config({ allowEmptyValues: true });
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const SwaggerParser = require("swagger-parser");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerSpec = YAML.load("./specification.yaml");
const { sequelize } = require("./models");

const EnforcerMiddleware = require("openapi-enforcer-middleware");
const statuses = require("statuses");
const Sequelize = require("sequelize");

// Setup
const app = express();
const enforcer = EnforcerMiddleware("./specification.yaml");

app
  .set("port", process.env.PORT || 3000)
  // Middleware
  .use(cors())
  .use(morgan("tiny"))
  .use(express.json())
  .use(passport.initialize())
  // Routes
  .use(enforcer.middleware())
  .use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Redirect to docs
  .get("/", (req, res) => {
    res.redirect("/docs");
  })
  .get("/swagger.json", (req, res) => {
    res.send(swaggerSpec);
  })
  // handle adding statusCode to Sequelize.ValidationError
  // also handle Sequelize.UniqueConstraintError which requires special handling to create a clean error message
  .use((err, req, res, next) => {
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
  })
  .use((err, req, res, next) => {
    // some packages pass an error with a status property instead of statusCode
    // reconcile that difference here by copying err.status to err.statusCode
    if (err.status) {
      err.statusCode = err.status;
    }
    if (err.statusCode >= 400 && err.statusCode < 500) {
      res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode
      });
    } else {
      const statusCode = err.statusCode || 500;
      console.error(err.stack);
      res.json({
        message: statuses[statusCode],
        statusCode: statusCode
      });
    }
  });

// Startup
(async () => {
  try {
    await SwaggerParser.validate(swaggerSpec);
    await sequelize.authenticate();
    await enforcer.promise;
    await enforcer.controllers("./controllers");
    app.listen(app.get("port"), () =>
      console.log(`API server now running on port ${app.get("port")}`)
    );
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();
