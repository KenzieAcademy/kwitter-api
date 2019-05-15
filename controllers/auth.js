const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validateJwtMiddleware } = require("../auth");

// logout user
const logout = [
  validateJwtMiddleware,
  (req, res) => {
    req.logout();
    res.send({ success: true, message: "Logged out!" });
  }
];

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
  logout
};
