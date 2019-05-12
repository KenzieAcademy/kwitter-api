const { Like } = require("../models");
const { jwtAuthMiddleware } = require("../authentication");

// add a like
const addLike = [
  jwtAuthMiddleware,
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
  jwtAuthMiddleware,
  async (req, res, next) => {
    try {
      const destroyedCount = await Like.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (destroyedCount === 0) {
        next({
          statusCode: 404,
          message: "Like does not exist"
        });
        return;
      }
      res.send({ id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  addLike,
  removeLike
};
