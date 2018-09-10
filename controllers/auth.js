const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");
const Sequelize = require("sequelize");

const router = express.Router();
const { User } = require("../models");

const authMiddleware = passport.authenticate("jwt", { session: false });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags:
 *     - "user"
 *     description: "Log out an existing user"
 *     operationId: "logout"
 *     responses:
 *       201:
 *         description: "Success, User logged out"
 */
router.get("/logout", (req, res) => {
  req.logout();
  res.json({ success: true, message: "Logged out!" });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *     - "user"
 *     description: "Create a new user"
 *     operationId: "createUser"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "user details"
 *         required: true
 *         schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       201:
 *         description: "Success, User registered"
 *       400:
 *         description: "Unable to log in"
 */
router.post("/register", (req, res) => {
  const { username, displayName, password } = req.body;
  User.create({
    username,
    displayName,
    password
  })
    .then(user =>
      res.json({
        username: user.get("username"),
        displayName: user.get("displayName")
      })
    )
    .catch(err => {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({ errors: err.errors });
      }
      console.error(err);
      res.status(500).send();
    });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *     - "user"
 *     description: "Login in an existing user"
 *     operationId: "login"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "user details"
 *         required: true
 *         schema:
 *             $ref: "#/components/schemas/Login"
 *     responses:
 *       201:
 *         description: "Success, User logged in"
 *       202:
 *         description: "Success, User logged in"
 *       400:
 *         description: "Unable to log in"
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.scope(null)
    .find({ where: { username } })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.get("password"))) {
        const payload = { id: user.get("id") };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ token, id: payload.id, success: true });
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
