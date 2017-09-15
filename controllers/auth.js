const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

const router = express.Router();
const models = require("../models");

const authMiddleware = passport.authenticate("jwt", { session: false });

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
    const { username, displayName, password } = req.body;
    bcrypt.hash(password, 8)
        .then(passwordHash => models.users.create({
            username,
            displayName,
            passwordHash
      })).then(user => res.json({
        username: user.get("username"),
        displayName: user.get("displayName")
      }));
});



router.post("/login", (req, res) => {
    const { username, password } = req.body;
    models.users.find({  where: { username }})
        .then(user => {
              if (user && bcrypt.compareSync(password, user.get("passwordHash"))) {
                  const payload = { id: user.get("id") };
                  const token = jwt.sign(payload, jwtOptions.secretOrKey);
                  res.json({ token, success: true });
              } else {
                  res.json({ success: false });
              }
        });
});

module.exports = {
    authMiddleware,
    jwtOptions,
    router
};
