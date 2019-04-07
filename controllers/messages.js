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
    try {
      const messages = await Message.findAll({
        include: [Like],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        order: [["createdAt", "DESC"]]
      });
      res.json({ messages });
    } catch (err) {
      console.error(err);
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({ errors: err.errors });
      } else if (err instanceof Sequelize.DatabaseError) {
        return res.status(400).send({ error: err.toString() });
      }
      res.status(500).send();
    }
  })
  // read message by id
  .get("/:id", async (req, res) => {
    try {
      const message = await Message.findById(req.params.id, {
        include: [Like]
      });
      res.json({ message });
    } catch (err) {
      console.error(err);
      if (err instanceof Sequelize.DatabaseError) {
        return res.status(400).send({ error: err.toString() });
      }
      return res.status(500).send();
    }
  })
  // delete message
  .delete("/:id", authMiddleware, async (req, res) => {
    try {
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
    } catch (err) {
      console.error(err);
      if (err instanceof Sequelize.DatabaseError) {
        return res.status(400).send({ error: err.toString() });
      }
      return res.status(500).send();
    }
  });

module.exports = router;
