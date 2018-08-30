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

// get list of users
router.get("/", (req, res) => {
  models.users
    .findAll({
      limit: req.query.limit || 100,
      offset: req.query.offset || 0
    })
    .then(users => res.json({ users }));
});

// update a user by id
router.patch("/", authMiddleware, (req, res) => {
  const { password } = req.body;

  models.users
    .update(
      { passwordHash: bcrypt.hashSync(password, 8) },
      {
        where: {
          id: req.user.id
        }
      }
    )
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
