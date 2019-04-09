require("dotenv-safe").config({ allowEmptyValues: true });
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const { Strategy } = require("passport-jwt");
const SwaggerParser = require("swagger-parser");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerSpec = YAML.load("./specification.yaml");
const controllers = require("./controllers");
const { User, sequelize } = require("./models");
const { authMiddleware } = require("./controllers/auth");
const { ExtractJwt } = require("passport-jwt");
const EnforcerMiddleware = require("openapi-enforcer-middleware");

// Setup
const app = express();
const enforcer = EnforcerMiddleware("./specification.yaml");
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      const user = await User.findById(payload.id);
      done(null, user || false);
    }
  )
);

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
    console.error(err.toString());
  }
})();
