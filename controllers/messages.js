const express = require("express");
const passport = require("passport");
const router = express.Router();
const models = require("../models");

router.get("/", (req, res) => {
    models("messages")
        .select()
        .where({userId: req.user.id})
        .then(messages => res.json({ messages }));
});

module.exports = router;

