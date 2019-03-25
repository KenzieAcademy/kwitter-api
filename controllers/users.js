const express = require("express");
const Sequelize = require("sequelize");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200000 }
});

const router = express.Router();
const { User, Message, Like } = require("../models");

const { authMiddleware } = require("./auth");
/* NOTE: See controllers/auth.js for creating a user */

// get a specific user by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, {
    include: [
      {
        model: Message,
        include: [Like]
      }
    ]
  });
  res.json({ user });
});

// get list of users
router.get("/", async (req, res) => {
  const users = await User.findAll({
    limit: req.query.limit || 100,
    offset: req.query.offset || 0,
    order: [["createdAt", "DESC"]]
  });
  res.json({ users });
});

// update a user by id
router.patch("/", authMiddleware, async (req, res) => {
  const patch = {};
  if (req.body.password !== undefined) {
    patch.password = req.body.password;
  }

  if (req.body.displayName !== undefined) {
    patch.displayName = req.body.displayName;
  }

  if (req.body.about !== undefined) {
    patch.about = req.body.about;
  }

  try {
    await User.update(patch, {
      where: {
        id: req.user.id
      }
    });
    const user = await User.findOne({ where: { id: req.user.id } });
    res.send({ user });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      return res.status(400).send({ errors: err.errors });
    }
    res.status(500).send();
  }
});

// delete a user by id
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.user.id
      }
    });
    res.json({ id: req.user.id });
  } catch (err) {
    console.error(err);
    res.send(500).send();
  }
});

router.get("/:id/picture", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.scope("picture").findById(id);
    if (user === null || user.picture === null) {
      return res.status(404).send();
    }
    const { picture, pictureContentType } = user;
    res.set({
      "Content-Type": pictureContentType,
      "Content-Disposition": "inline"
    });
    res.send(picture);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.put(
  "/picture",
  authMiddleware,
  upload.single("picture"),
  async (req, res) => {
    const supportedContentTypes = ["image/gif", "image/jpeg", "image/png"];
    const { buffer, mimetype } = req.file;
    const { id } = req.user;

    if (!supportedContentTypes.includes(mimetype)) {
      res.status(415).send();
      return;
    }

    try {
      await User.scope("picture").update(
        { picture: buffer, pictureContentType: mimetype },
        { where: { id } }
      );
      res.set({ "Content-Location": `/users/${id}/picture` });
      res.send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

module.exports = router;
