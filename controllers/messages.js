const { Message, Like, User } = require("../models");
const { validateJwtMiddleware } = require("../auth");
const { getRawLike } = require("./likes");

// helper function
const getRawMessage = message => {
  const rawMessage = message.dataValues;
  rawMessage.username = message.user.dataValues.username;
  delete rawMessage.user;
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
          userId: req.user.get("id")
        },
        {
          include: [
            {
              model: Like,
              include: [{ model: User, attributes: ["username"] }]
            },
            { model: User, attributes: ["username"] }
          ]
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
  if (req.query.userId) {
    where = {
      userId: req.query.userId
    };
  }
  try {
    const messages = await Message.findAll({
      where,
      include: [
        {
          model: Like,
          include: [{ model: User, attributes: ["username"] }]
        },
        { model: User, attributes: ["username"] }
      ],
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]]
    });
    const rawMessages = messages.map(getRawMessage);
    res.send({ messages: rawMessages, statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
};

// get message by id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId, {
      include: [
        {
          model: Like,
          include: [{ model: User, attributes: ["username"] }]
        },
        { model: User, attributes: ["username"] }
      ]
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
