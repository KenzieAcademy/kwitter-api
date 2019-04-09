const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const passport = require("passport");
const { User } = require("../models");

const authMiddleware = passport.authenticate("jwt", { session: false });

// logout user
const logout = (req, res) => {
  req.logout();
  res.send({ success: true, message: "Logged out!" });
};

// register a new user
const register = async (req, res) => {
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
    if (err instanceof Sequelize.ValidationError) {
      return res.status(400).send({ errors: err.errors });
    }
    console.error(err);
    res.status(500).send();
  }
};

// login user
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.scope(null).findOne({ where: { username } });
  if (user && (await bcrypt.compare(password, user.get("password")))) {
    const payload = { id: user.get("id") };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.send({ token, id: payload.id });
  } else {
    res.status(401).send({ message: "Invalid username or password" });
  }
};

module.exports = {
  authMiddleware,
  login,
  logout,
  register
};
