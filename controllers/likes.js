const express = require("express");
const router = express.Router();
const models = require("../models");

// create a like
router.post("/", (req, res) => {
  models.likes.create(req.body).then(like => res.json({ like }));
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
