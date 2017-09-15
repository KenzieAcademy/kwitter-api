const express = require("express");
const router = express.Router();
const models = require("../models");
const { authMiddleware } = require("./auth");

// create message
router.post("/", authMiddleware, (req, res) => {
    models.messages.create(Object.assign({}, req.body, {
      userId: req.user.get("id")
    }));
    models.messages.create({ ...req.body, userId: req.user.get("id") })
        .then(message => res.json({ message }))
});

// read all messages
router.get("/", (req, res) => {
    models.messages.findAll({
        include: [{
              model: models.likes
        }]
    }).then(messages => res.json({ messages }));
});

// read message by id
router.get("/:id", (req, res) => {
    models.messages.findById(req.params.id, {
      include: [models.likes]
    })
        .then(message => res.json({ message }));
});

// update message by id
router.patch("/:id", authMiddleware, (req, res) => {
    models.messages.update(req.body, {
        where: {
          id: req.params.id
        }
    })
    .then(messages => res.json({ messages }));
});

// delete message
router.delete("/:id", authMiddleware, (req, res) => {
    models.likes.destroy({
      where: {
        messageId: req.params.id,
        userId: req.user.id
      }
    })
    .then(() => models.messages.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      })
    )
    .then(messages => res.json({ messages }))
});

module.exports = router;
