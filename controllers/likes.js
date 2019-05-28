const { Like, Message } = require("../models");
const { validateJwtMiddleware } = require("../auth");

// add a like
const addLike = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.findById(req.body.message);
      if (!message) {
        next({
          statusCode: 400,
          message: "Message does not exist"
        });
        return;
      }
      let like = await Like.find({
        where: {
          userId: req.user.id,
          messageId: req.body.messageId
        }
      });
      if (like) {
        next({ statusCode: 400, message: "Like already exists" });
        return;
      }
      like = await Like.create(
        {
          userId: req.user.id,
          messageId: req.body.messageId
        },
        { raw: true }
      );
      res.send({ like, statusCode: res.statusCode });
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
  removeLike
};
