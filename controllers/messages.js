const { Message, Like, User } = require("../models");
const { validateJwtMiddleware } = require("../auth");
const { getRawLike } = require("./likes");

// helper function
const getRawMessage = message => {
  const rawMessage = message.dataValues;
  rawMessage.likes = message.likes.map(getRawLike);
  return rawMessage;
};

// create a message
const createMessage = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.create(
        {
          text: req.body.text,
          username: req.user.get("username")
        },
        {
          include: [Like]
        }
      );
      await message.reload();
      const rawMessage = getRawMessage(message);
      res.send({ message: rawMessage, statusCode: res.statusCode });
    } catch (err) {
      next(err);
    }
  }
];

// get messages
const getMessages = async (req, res, next) => {
  let where = null;
  if (req.query.username) {
    where = {
      username: req.query.username
    };
  }
  try {
    const { count, rows: messages } = await Message.findAndCountAll({
      where,
      include: [Like],
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]],
      distinct: true
    });
    const rawMessages = messages.map(getRawMessage);
    res.send({ messages: rawMessages, count, statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
};

// get message by id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.messageId, {
      include: [Like]
    });
    if (!message) {
      next({ statusCode: 404, message: "Message does not exist" });
      return;
    }
    const rawMessage = getRawMessage(message);
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
      const message = await Message.findByPk(req.params.messageId);
      if (!message) {
        next({
          statusCode: 404,
          message: "Message does not exist"
        });
        return;
      }
      if (
        message.get("username") !== req.user.username &&
        req.user.role !== "admin"
      ) {
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
