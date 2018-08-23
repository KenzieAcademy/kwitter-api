const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();
const models = require("../models");

const { authMiddleware } = require("./auth");
/* NOTE: See controllers/auth.js for creating a user */

// get a specific user by id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  models.users
    .findById(id, {
      include: [
        {
          model: models.messages,
          include: [models.likes]
        }
      ]
    })
    .then(user => res.json({ user }));
});

// get user by the curently authenticated id
router.get("/", authMiddleware, (req, res) => {
  models.users
    .findById(req.user.id, {
      attributes: ["displayName"],
      include: [
        {
          model: models.messages,
          include: [models.likes]
        }
      ]
    })
    .then(user => res.json({ user }));
});

// update a user by id
router.patch("/", authMiddleware, (req, res) => {
  const { password } = req.body;
  if (password) {
    req.body.password_hash = bcrypt.hashSync(password, 8);
    delete req.body.password;
  }

  models.users
    .update(req.body, {
      where: {
        id: req.user.id
      }
    })
    .then(users => res.json({ users }));
});

// delete a user by id
router.delete("/", authMiddleware, (req, res) => {
  models.likes
    .destroy({
      where: {
        userId: req.user.id
      }
    })
    .then(() =>
      models.messages.destroy({
        where: {
          userId: req.user.id
        }
      })
    )
    .then(() =>
      models.users.destroy({
        where: {
          id: req.user.id
        }
      })
    )
    .then(user => res.json({ user }));
});

module.exports = router;
