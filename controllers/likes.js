const express = require("express");
const router = express.Router();
const models = require("../models");

// create a like
router.post("/", (req, res) => {
  const likeObject = {
    userId: req.user.id,
    messageId: req.body.messageId
  };
  models.likes
    .findOne({
      where: likeObject
    })
    .then(like => {
      if (like !== null) {
        res.status(400).send({ error: "Like already exists" });
      } else {
        return models.likes.create(likeObject).then(like => res.json({ like }));
      }
    })
    .catch(err => {
      res.status(500).send({ error: err.toString() });
    });
});

// delete a like
router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.user.get("id"));
  models.likes
    .destroy({
      where: {
        id: req.params.id,
        userId: req.user.get("id")
      }
    })
    .then(like => res.json({ like }));
});

module.exports = router;
