const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();
const models = require("../models");

// Get a user by id
router.get("/", (req, res) => {
    models.users.findById(req.user.id)
      .then(user => res.json({ user }));
});

// Update a user by id
router.patch("/", (req, res) => {
    const {password} = req.body;
    if (password) {
        req.body.password_hash = bcrypt.hashSync(password, 8);
        delete req.body.password;
    }

    models.users.update(req.body, {
        where: {
          id: req.user.id
        }
    })
    .then(users => res.json({ users }));
});

// Delete a user by id
router.delete("/", (req, res) => {
    models.users.destroy({
      where: {
        id: req.user.id
      }
    })
    .then(user => res.json({ user }));
});

module.exports = router;
