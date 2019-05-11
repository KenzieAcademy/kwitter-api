const { Message, Like } = require("../models");
const { authMiddleware } = require("./auth");

// create a message
const createMessage = [
  authMiddleware,
  async (req, res, next) => {
    try {
      const message = await Message.create({
        text: req.body.text,
        userId: req.user.get("id")
      });
      res.json({ message });
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
    res.json({ messages });
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
  authMiddleware,
  async (req, res, next) => {
    try {
      const destroyedCount = await Message.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (destroyedCount === 0) {
        return res.status(404).send({ error: "Message does not exist" });
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
