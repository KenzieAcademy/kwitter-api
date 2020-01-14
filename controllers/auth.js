const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validateJwtMiddleware, validateGoogleMiddleware } = require("../auth");
const passport = require("passport");

const loginGoogle = passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login"]
});

const loginGoogleCallback = [
  validateGoogleMiddleware,
  (req, res) => {
    const payload = { username: req.user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });
    res.send(
      `
      <h1>Logged In!</h1>
      <script>
        window.opener.postMessage(
          {
            username: "${req.user.username}",
            token: "${token}",
            statusCode: 200
          },
          "*"
        )
      </script>
      `
    );
  }
];

// logout user
const logout = [
  validateJwtMiddleware,
  (req, res) => {
    req.logout();
    res.send({ statusCode: res.statusCode });
  }
];

// login user
const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.scope(null).findOne({ where: { username } });
  if (user && (await bcrypt.compare(password, user.get("password")))) {
    const payload = { username: user.get("username") };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });
    res.send({
      token,
      username: user.get("username"),
      statusCode: res.statusCode
    });
  } else {
    next({
      statusCode: 400,
      message: "Invalid username or password"
    });
  }
};

module.exports = {
  login,
  logout,
  loginGoogle,
  loginGoogleCallback
};
