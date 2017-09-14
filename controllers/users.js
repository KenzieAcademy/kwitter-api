const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();
const models = require("../models");

// Get a user by id
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    models("users")
        .select()
        .where("id",  req.user.id)
        .then(([user])=> res.json({ user }))
});

// Update a user by id
router.patch("/", (req, res) => {
    const {password} = req.body;
    if (password) {
        req.body.passwordHash = bcrypt.hash(password, 8);
        delete req.body.password;
    }

    models("users")
        .update(req.body)
        .where({...req.params, id: req.user.id})
        .then(rowCount => res.json({ rowCount }))
});

// Delete a user by id
router.delete("/", (req, res) => {
    models("users")
        .del()
        .where({id: req.user.id})
        .then(({ rowCount }) => res.json({ rowCount }))
});

module.exports = router;
