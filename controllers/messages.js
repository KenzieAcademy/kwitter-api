const express = require("express");
const passport = require("passport");
const router = express.Router();
const { Message, bookshelf } = require("../models/db");

router.get("/", (req, res) => {
    Message.where("user_id", req.user.id).fetch({
        withRelated: ["likes.user", "user"]
    })
    .then(messages => res.json(messages.toJSON()));
});

router.post("/", (req, res) => {
    bookshelf.knex("messages")
        .insert({...req.body, user_id: req.user.id})
        .then(({rowCount}) => res.json({ rowCount }));
});

router.get("/:id", (req, res) => {
    bookshelf.knex("messages")
        .select()
        .where(req.params)
        .then(([message]) => res.json({ message }));
});

router.patch("/:id/like", (req, res) => {
    bookshelf.knex("likes")
        .insert({
            user_id: req.user.id,
            message_id: req.params.id
        })
        .then(({ rowCount }) => res.json({ rowCount }));
});

module.exports = router;
