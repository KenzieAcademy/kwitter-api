// Imports
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const { Strategy } = require("passport-jwt");

const controllers = require("./controllers");
const models = require("./models");
const { jwtOptions, authMiddleware } = require("./controllers/auth");



const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middleware
const formats = {
    "development": "dev",
    "production": "common",
    "test": "tiny"
};
app.use(morgan(formats[process.env.NODE_ENV || "development"]));
app.use(bodyParser.json());

passport.use(new Strategy(jwtOptions, (payload, done) => {
    models.users.findById(payload.id)
      .then(user => done(null, user || false));
}));
app.use(passport.initialize());


// Routes
app.use("/auth", controllers.auth);
app.use("/user", authMiddleware, controllers.users);
app.use("/messages", controllers.messages);
app.use("/likes", authMiddleware, controllers.likes);

if (require.main === module) {
    app.listen(app.get("port"), () =>
        console.log(`API server now running on port ${app.get("port")}`)
    );
}

module.exports = app;
