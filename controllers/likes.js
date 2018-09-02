const express = require("express");
const router = express.Router();
const { Like } = require("../models");

// create a like
router.post("/", (req, res) => {
  const likeObject = {
    userId: req.user.id,
    messageId: req.body.messageId
  };
  Like.findOne({
    where: likeObject
  })
    .then(like => {
      if (like !== null) {
        res.status(400).send({ error: "Like already exists" });
      } else {
        return Like.create(likeObject).then(like => res.json({ like }));
      }
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

// delete a like
router.delete("/:id", (req, res) => {
  Like.destroy({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  })
    .then(destroyedCount => {
      if (destroyedCount === 0) {
        res.status(400).send({ error: "Like does not exist" });
      } else {
        return res.json({ id: req.params.id });
      }
    })
    .catch(err => res.status(500).send({ error: err.toString() }));
});

module.exports = router;
