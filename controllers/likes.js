const { Like, Message } = require("../models");
const { validateJwtMiddleware } = require("../auth");

// helper function
const getRawLike = like => {
  const rawLike = like.dataValues;
  rawLike.username = like.user.dataValues.username;
  delete rawLike.user;
  return rawLike;
};
// add a like
const addLike = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.findById(req.body.messageId);
      if (!message) {
        next({
          statusCode: 404,
          message: "Message does not exist"
        });
        return;
      }
      const [like, created] = await Like.findOrCreate(
        {
          where: {
            userId: req.user.id,
            messageId: req.body.messageId
          }
        },
        { include: [{ model: User, attributes: "username" }] }
      );
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
