require("dotenv-safe").config({ allowEmptyValues: true });
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Strategy } = require("passport-jwt");
const cors = require("cors");

const controllers = require("./controllers");
const models = require("./models");
const { jwtOptions, authMiddleware } = require("./controllers/auth");

const app = express();
app.use(cors());

// Settings
app.set("port", process.env.PORT || 3000);

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

passport.use(
  new Strategy(jwtOptions, (payload, done) => {
    models.users
      .findById(payload.id)
      // or, more succinctly..
      .then(user => done(null, user || false));
  })
);
app.use(passport.initialize());

const swaggerDefinition = {
  info: {
    title: "Kwitter",
    version: "1.0"
  },
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [`${__dirname}/controllers/*.js`]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", controllers.auth);
app.use("/users", authMiddleware, controllers.users);
app.use("/messages", controllers.messages);
app.use("/likes", authMiddleware, controllers.likes);

// Redirect to docs
app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.get("/swagger.json", (req, res) => {
  res.send(swaggerSpec);
});

if (require.main === module) {
  app.listen(app.get("port"), () =>
    console.log(`API server now running on port ${app.get("port")}`)
  );
}

module.exports = app;
