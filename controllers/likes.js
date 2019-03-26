const express = require("express");
const router = express.Router();
const { Like } = require("../models");
const Sequelize = require("sequelize");

router
  // create a like
  .post("/", async (req, res) => {
    try {
      const like = await Like.create({
        userId: req.user.id,
        messageId: req.body.messageId
      });
      res.json({ like });
    } catch (err) {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({ errors: err.errors });
      }
      console.error(err);
      res.status(500).send({ error: err.toString() });
    }
  })
  // delete a like
  .delete("/:id", async (req, res) => {
    try {
      const destroyedCount = await Like.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (destroyedCount === 0) {
        return res.status(404).send({ error: "Like does not exist" });
      } else {
        return res.json({ id: req.params.id });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.toString() });
    }
  });

module.exports = router;
