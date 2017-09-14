const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

const router = express.Router();
const { bookshelf } = require("../models/db");
const { Users } = require('../models')

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

router.get("/logout", (req, res) => {
    req.logout();
    res.json({
        success: true,
        message: "Logged out!"
    });
});

// Register a new user
router.post("/register", (req, res) => {
    Users.create(req.body)
        .then(({rowCount}) => res.json({ rowCount }))
        .catch(({ detail, table }) => res.status(400).json({ detail, table }));
});



router.post("/login", (req, res) => {
    Users.authenticate(req.body)
      .then(({ success, token }) => {
        if (success) {
          res.json({ token });
        } else {
          res.json({ success });
        }
      });
});

module.exports = {
    jwtOptions,
    router
};
