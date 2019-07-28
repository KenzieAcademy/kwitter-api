const { Like, Message } = require("../models");
const { validateJwtMiddleware } = require("../auth");

// helper function
const getRawLike = like => {
  const rawLike = like.dataValues;
  return rawLike;
};
// add a like
const addLike = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.findByPk(req.body.messageId);
      if (!message) {
        next({
          statusCode: 404,
          message: "Message does not exist"
        });
        return;
      }
      const [like, created] = await Like.findOrCreate({
        where: {
          username: req.user.username,
          messageId: req.body.messageId
        }
      });
      if (!created) {
        next({ statusCode: 400, message: "Like already exists" });
        return;
      }
      await like.reload();
      res.send({ like: getRawLike(like), statusCode: res.statusCode });
    } catch (err) {
      next(err);
    }
  }
];
// remove a like
const removeLike = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const destroyedCount = await Like.destroy({
        where: {
          id: req.params.likeId,
          username: req.user.username
        }
      });
      if (destroyedCount === 0) {
        next({
          statusCode: 404,
          message: "Like does not exist"
        });
        return;
      }
      res.send({ id: req.params.likeId, statusCode: res.statusCode });
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  addLike,
  removeLike,
  getRawLike
};
