const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwtAuthMiddleware } = require("../authentication");

// logout user
const logout = [
  jwtAuthMiddleware,
  (req, res) => {
    req.logout();
    res.send({ success: true, message: "Logged out!" });
  }
];

// register a new user
const register = async (req, res, next) => {
  const { username, displayName, password } = req.body;
  try {
    const user = await User.create({
      username,
      displayName,
      password
    });
    res.send({
      username: user.get("username"),
      displayName: user.get("displayName")
    });
  } catch (err) {
    next(err);
  }
};

// login user
const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.scope(null).findOne({ where: { username } });
  if (user && (await bcrypt.compare(password, user.get("password")))) {
    const payload = { id: user.get("id") };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.send({ token, id: payload.id });
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
  register
};
