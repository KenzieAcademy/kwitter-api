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
      order: [["createdAt", "DESC"]]
    });
    const rawMessages = messages.map(message => message.dataValues);
    res.send({ messages: rawMessages });
  } catch (err) {
    next(err);
  }
};

// get message by id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id, {
      include: [Like],
      raw: true
    });
    res.send({ message });
  } catch (err) {
    next(err);
  }
};

// delete message
const deleteMessage = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.findById(req.params.messageId);
      if (!message) {
        next({
          statusCode: 404,
          message: "Message does not exist"
        });
        return;
      }
      if (message.get("userId") !== req.user.id && req.user.role !== "admin") {
        next({
          statusCode: 403,
          message:
            "You do not have sufficient privileges to delete this message"
        });
        return;
      }
      await message.destroy();
      res.send({ id: req.params.messageId });
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
