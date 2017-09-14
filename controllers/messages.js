const express = require("express");
const passport = require("passport");
const router = express.Router();
const models = require("../models");

router.get("/", (req, res) => {
    models("messages")
        .join("users", "users.id", "=", "messages.user_id", "likes.user_id")
        .join("likes", "likes.message_id", "=", "messages.id")
        .select("messages.id", "messages.text", "users.display_name")
        .where({"messages.user_id": req.user.id})
        .then(messages => res.json({ messages }));
});

router.post("/", (req, res) => {
    models("messages")
        .insert({...req.body, user_id: req.user.id})
        .then(({rowCount}) => res.json({ rowCount }));
});

router.get("/:id", (req, res) => {
    models("messages")
        .select()
        .where(req.params)
        .then(([message]) => res.json({ message }));
});

router.post("/:id/like", (req, res) => {
    models("likes")
        .insert({
            user_id: req.user.id,
            message_id: req.params.id
        })
        .then(({ rowCount }) => res.json({ rowCount }));
});

module.exports = router;

