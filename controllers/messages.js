const express = require("express");
const passport = require("passport");
const router = express.Router();
const models = require("../models");

router.get("/", (req, res) => {
    models.messages.findAll({
        where: {
            userId: req.user.get("id")
        },
        include: [{
              model: models.likes
        }]
    }).then(messages => res.json({ messages }));
});

router.post("/", (req, res) => {
    models.messages.create({ ...req.body, userId: req.user.get("id") })
        .then(message => res.json({ message }))
});

router.get("/:id", (req, res) => {
    models.messages.findById(req.params.id)
        .then(message => res.json({ message }));
});

router.patch("/:id/like", (req, res) => {
    models.likes.create({
      userId: req.user.get("id"),
      messageId: req.params.id
    }).then(like => res.json({ like }));
});

module.exports = router;
