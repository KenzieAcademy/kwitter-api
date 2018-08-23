const express = require("express");
const router = express.Router();
const models = require("../models");
const { authMiddleware } = require("./auth");

// create message
/**
 * @swagger
 * /messages:
 *   post:
 *     security:
 *       - Bearer: []
 *     tags:
 *     - "message"
 *     summary: "Create a new message"
 *     description: "Create a new message"
 *     operationId: "createMessage"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "message details"
 *         required: true
 *         schema:
 *             $ref: "#/definitions/Message"
 *     responses:
 *       201:
 *         description: "Success, account saved"
 *       202:
 *         description: "Success, account saved"
 *       400:
 *         description: "Unable to save account"
 *       403:
 *         description: "The capability token provided does not grant access to the\
 *           \ requested\nfunctionality.\n"
 */
router.post("/", authMiddleware, (req, res) => {
  models.messages
    .create(
      Object.assign({}, req.body, {
        userId: req.user.get("id")
      })
    )
    .then(message => res.json({ message }));
});

// read all messages
router.get("/", (req, res) => {
  models.messages
    .findAll({
      include: [
        {
          model: models.likes
        }
      ],
      limit: req.query.limit || 100,
      offset: req.query.offset || 0
    })
    .then(messages => res.json({ messages }));
});

// read message by id
router.get("/:id", (req, res) => {
  models.messages
    .findById(req.params.id, {
      include: [models.likes]
    })
    .then(message => res.json({ message }));
});

// update message by id
router.patch("/:id", authMiddleware, (req, res) => {
  models.messages
    .update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(message => res.json({ message }));
});

// delete message
router.delete("/:id", authMiddleware, (req, res) => {
  models.likes
    .destroy({
      where: {
        messageId: req.params.id,
        userId: req.user.id
      }
    })
    .then(() =>
      models.messages.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      })
    )
    .then(message => res.json({ message }));
});

module.exports = router;
