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
const { jwtOptions, authMiddleware } = require("./controllers/auth");

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middleware
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

passport.use(
  new Strategy(jwtOptions, (payload, done) => {
    User.findById(payload.id).then(user => done(null, user || false));
  })
);
app.use(passport.initialize());

// Routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", controllers.auth);
app.use("/users", controllers.users);
app.use("/messages", controllers.messages);
app.use("/likes", authMiddleware, controllers.likes);

// Redirect to docs
app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.get("/swagger.json", (req, res) => {
  res.send(swaggerSpec);
});

SwaggerParser.validate(swaggerSpec)
  .then(() => sequelize.authenticate())
  .then(() =>
    app.listen(app.get("port"), () =>
      console.log(`API server now running on port ${app.get("port")}`)
    )
  )
  .catch(err => console.error(err.toString()));
