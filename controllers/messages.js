const express = require("express");
const router = express.Router();
const { Message, Like } = require("../models");
const { authMiddleware } = require("./auth");
const Sequelize = require("sequelize");

router
  // create a message
  .post("/", authMiddleware, async (req, res) => {
    try {
      const message = await Message.create({
        text: req.body.text,
        userId: req.user.get("id")
      });
      res.json({ message });
    } catch (err) {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({ errors: err.errors });
      }
      res.status(500).send();
    }
  })
  // read all messages
  .get("/", async (req, res) => {
    const messages = await Message.findAll({
      include: [Like],
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]]
    });
    res.json({ messages });
  })
  // read message by id
  .get("/:id", async (req, res) => {
    const message = await Message.findById(req.params.id, {
      include: [Like]
    });
    res.json({ message });
  })
  // delete message
  .delete("/:id", authMiddleware, async (req, res) => {
    const destroyedCount = await Message.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (destroyedCount === 0) {
      return res.status(404).send({ error: "Message does not exist" });
    }
    res.json({ id: req.params.id });
  });

module.exports = router;
