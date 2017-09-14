const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

const router = express.Router();
const models = require("../models");

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

router.get("/logout", (req, res) => {
    req.logout();
    res.json({ success: true, message: "Logged out!" });
});

// Register a new user
router.post("/register", (req, res) => {
    const { username, display_name, password } = req.body;
    bcrypt.hash(password, 8)
        .then(password_hash => models.users.create({
            username,
            display_name,
            password_hash
      })).then(user => res.json({ user }));
});



router.post("/login", (req, res) => {
    const { username, password } = req.body;
    models.users.find({ username })
        .then(user => {
              console.log(user);
              if (bcrypt.compareSync(password, user.get("password_hash"))) {
                  const payload = { id: user.get("id") };
                  const token = jwt.sign(payload, jwtOptions.secretOrKey);
                  res.json({ token, success: true });
              } else {
                  res.json({ success: false });
              }
        });
});

module.exports = {
    jwtOptions,
    router
};
