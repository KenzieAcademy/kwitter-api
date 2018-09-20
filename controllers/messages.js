const express = require("express");
const router = express.Router();
const { Message, Like } = require("../models");
const { authMiddleware } = require("./auth");
const Sequelize = require("sequelize");

// create a message
router.post("/", authMiddleware, (req, res) => {
  Message.create({
    text: req.body.text,
    userId: req.user.get("id")
  })
    .then(message => res.json({ message }))
    .catch(err => {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({ errors: err.errors });
      }
      res.status(500).send();
    });
});

// read all messages
router.get("/", (req, res) => {
  Message.findAll({
    include: [
      {
        model: Like
      }
    ],
    limit: req.query.limit || 100,
    offset: req.query.offset || 0,
    order: [["createdAt", "DESC"]]
  }).then(messages => res.json({ messages }));
});

// read message by id
router.get("/:id", (req, res) => {
  Message.findById(req.params.id, {
    include: [Like]
  }).then(message => res.json({ message }));
});

// update message by id
router.patch("/:id", authMiddleware, (req, res) => {
  Message.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(message => res.json({ message }));
});

// delete message
router.delete("/:id", authMiddleware, (req, res) => {
  Message.destroy({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  }).then(destroyedCount => {
    if (destroyedCount === 0) {
      return res.status(400).send({ error: "Message does not exist" });
    }
    res.json({ id: req.params.id });
  });
});

module.exports = router;
