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
      must add an empty array for likes so
      this will pass validation (the Message schema requires having a likes property)
      */
      await message.reload();
      const rawMessage = message.dataValues;
      rawMessage.likes = [];
      res.send({ message: rawMessage, statusCode: res.statusCode });
    } catch (err) {
      next(err);
    }
  }
];

// get messages
const getMessages = async (req, res, next) => {
  let where = null;
  if (req.query.userId) {
    where = {
      userId: req.query.userId
    };
  }
  try {
    const messages = await Message.findAll({
      where,
      include: [Like],
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]]
    });
    const rawMessages = messages.map(message => {
      const rawMessage = message.dataValues;
      rawMessage.likes = message.likes.map(like => like.dataValues);
      return rawMessage;
    });
    res.send({ messages: rawMessages, statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
};

// get message by id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId, {
      include: [Like]
    });
    if (!message) {
      next({ statusCode: 404, message: "Message does not exist" });
      return;
    }
    const rawMessage = message.dataValues;
    rawMessage.likes = message.likes.map(like => like.dataValues);
    res.send({ message: rawMessage, statusCode: res.statusCode });
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
      res.send({ id: req.params.messageId, statusCode: res.statusCode });
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
