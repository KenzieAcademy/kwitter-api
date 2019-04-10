const { Like } = require("../models");
const Sequelize = require("sequelize");
const { authMiddleware } = require("./auth");

// add a like
const addLike = [
  authMiddleware,
  async (req, res) => {
    try {
      const like = await Like.create({
        userId: req.user.id,
        messageId: req.body.messageId
      });
      res.json({ like });
    } catch (err) {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({
          errors: err.errors.map(err => ({
            message: err.message,
            type: err.type,
            path: err.path,
            value: err.value
          }))
        });
      }
      console.error(err);
      res.status(500).send({ error: err.toString() });
    }
  }
];
// remove a like
const removeLike = [
  authMiddleware,
  async (req, res) => {
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
        return res.send({ id: req.params.id });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.toString() });
    }
  }
];

module.exports = {
  addLike,
  removeLike
};
