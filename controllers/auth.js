const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

const router = express.Router();
const { bookshelf } = require("../models");

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

router.get("/logout", (req, res) => {
    req.logout();
    res.json({
        message: "Logged out!"
    });
});

// Register a new user
router.post("/register", (req, res) => {
    const {username, display_name, password} = req.body;
    bcrypt.hash(password, 8)
        .then(password_hash => bookshelf.knex("users").insert({
            username, 
            display_name,
            password_hash
        }))
        .then(({rowCount}) => res.json({ rowCount }))
        .catch(({ detail, table }) => res.status(400).json({ detail, table }));
});



router.post("/login", (req, res) => {
    const {username, password, passwordConfirmation} = req.body;
    if (password !== passwordConfirmation) {
        res.status(400).json({
            detail: "Password and confirmed password do not match!",
            table: "users"
        });
    } else {
        bookshelf.knex("users")
            .where({ username })
            .then(results => {
                const [user] = results;
                if (!user) {
                    res.status(400).json({
                        detail: "No such user exists!",
                        table: "users"
                    });
                } else {
                    const success = bcrypt.compareSync(password, user.password_hash);
                    if (success) {
                        const payload = { id: user.id };
                        const token = jwt.sign(payload, jwtOptions.secretOrKey);
                        res.json({token});
                    } else {
                        res.status(403).json({
                            detail: "Incorrect password!",
                            table: "users"
                        });
                    }
                }
            });
    }
});

module.exports = {
    jwtOptions,
    router
};
