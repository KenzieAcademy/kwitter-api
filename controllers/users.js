const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();
const models = require("../models");

// Get a user by id
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    models("users")
        .select()
        .where("id", req.params.id)
        .then(([user])=> res.json({ user }))
});

// Update a user by id
router.patch("/:id", (req, res) => {
    const {password} = req.body;
    if (password) {
        req.body.passwordHash = bcrypt.hash(password, 8);
        delete req.body.password;
    }

    models("users")
        .update(req.body)
        .where(req.params)
        .then(rowCount => res.json({ rowCount }))
});

// Delete a user by id
router.delete("/:id", (req, res) => {
    models("users")
        .del()
        .where(req.params)
        .then(({ rowCount }) => res.json({ rowCount }))
});

// Register a new user
router.post("/", (req, res) => {
    const {username, displayName, password} = req.body;
    bcrypt.hash(password, 8)
        .then(passwordHash => models("users").insert({
            username, 
            displayName,
            passwordHash
        }))
        .then(({rowCount}) => res.json({ rowCount }))
        .catch(({ detail, table }) => res.status(400).json({ detail, table }));
});


module.exports = router;
