const { Like } = require("../models");
const { authMiddleware } = require("./auth");

// add a like
const addLike = [
  authMiddleware,
  async (req, res, next) => {
    try {
      const like = await Like.create({
        userId: req.user.id,
        messageId: req.body.messageId
      });
      res.json({ like });
    } catch (err) {
      next(err);
    }
  }
];
// remove a like
const removeLike = [
  authMiddleware,
  async (req, res, next) => {
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
      next(err);
    }
  }
];

module.exports = {
  addLike,
  removeLike
};
