const { Message, Like } = require("../models");
const { validateJwtMiddleware } = require("../auth");

// create a message
const createMessage = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.create({
        text: req.body.text,
        userId: req.user.get("id")
      });
      /*
      when the message is created it does not include the likes.
      while there are no likes after a message is first created,
      getting the message again and ask sequelize to include the likes so
      this will pass validation (the Message schema requires having a likes property)
      */
      const messageWithLikes = await Message.findById(message.id, {
        include: [Like]
      });
      res.json({ message: messageWithLikes });
    } catch (err) {
      next(err);
    }
  }
];

// get messages
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      include: [Like],
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]],
      raw: true
    });
    res.send({ messages });
  } catch (err) {
    next(err);
  }
};

// get message by id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id, {
      include: [Like]
    });
    res.json({ message });
  } catch (err) {
    next(err);
  }
};

// delete message
const deleteMessage = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const destroyedCount = await Message.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (destroyedCount === 0) {
        next({
          statusCode: 404,
          message: "Message does not exist"
        });
      }
      res.send({ id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
  deleteMessage,
  getMessage,
  getMessages,
  createMessage
};
