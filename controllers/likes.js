const express = require("express");
const router = express.Router();
const { Like } = require("../models");

router
  // create a like
  .post("/", async (req, res) => {
    const likeObject = {
      userId: req.user.id,
      messageId: req.body.messageId
    };
    try {
      const like = await Like.findOne({
        where: likeObject
      });
      if (like !== null) {
        return res.status(409).send({ error: "Like already exists" });
      }
      const newlike = await Like.create(likeObject);
      res.json({ like: newlike });
    } catch (err) {
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
