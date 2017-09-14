const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();
const { User, bookshelf } = require("../models/db");

// Get a user by id
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    User.where("id", req.user.id).fetch({
        withRelated: ["messages", "messages.likes"]
    })
    .then(user => res.json(user.toJSON()));
});

// Update a user by id
router.patch("/", (req, res) => {
    const {password} = req.body;
    if (password) {
        req.body.password_hash = bcrypt.hash(password, 8);
        delete req.body.password;
    }

    bookshelf.knex("users")
        .update(req.body)
        .where({...req.params, id: req.user.id})
        .then(rowCount => res.json({ rowCount }))
});

// Delete a user by id
router.delete("/", (req, res) => {
    bookshelf.knex("users")
        .del()
        .where({id: req.user.id})
        .then(({ rowCount }) => res.json({ rowCount }))
});

module.exports = router;
