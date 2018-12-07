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
router.get("/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id, {
    include: [
      {
        model: Message,
        include: [Like]
      }
    ]
  }).then(user => res.json({ user }));
});

// get list of users
router.get("/", (req, res) => {
  User.findAll({
    limit: req.query.limit || 100,
    offset: req.query.offset || 0,
    order: [["createdAt", "DESC"]]
  }).then(users => {
    res.json({ users });
  });
});

// update a user by id
router.patch("/", authMiddleware, (req, res) => {
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

  User.update(patch, {
    where: {
      id: req.user.id
    }
  })
    .then(_ => User.findOne({ where: { id: req.user.id } }))
    .then(user => res.send({ user }))
    .catch(err => {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({ errors: err.errors });
      }
      res.status(500).send();
    });
});

// delete a user by id
router.delete("/", authMiddleware, (req, res) => {
  User.destroy({
    where: {
      id: req.user.id
    }
  })
    .then(() => res.json({ id: req.user.id }))
    .catch(() => {
      res.send(500).send();
    });
});

router.get("/:id/picture", (req, res) => {
  const { id } = req.params;
  User.scope("picture")
    .findById(id)
    .then(user => {
      if (user === null || user.picture === null) {
        return res.status(404).send();
      }
      const { picture, pictureContentType } = user;
      res.set({
        "Content-Type": pictureContentType,
        "Content-Disposition": "inline"
      });
      res.send(picture);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

router.put("/picture", authMiddleware, upload.single("picture"), (req, res) => {
  const supportedContentTypes = ["image/gif", "image/jpeg", "image/png"];
  const { buffer, mimetype } = req.file;
  const { id } = req.user;

  if (!supportedContentTypes.includes(mimetype)) {
    res.status(415).send();
    return;
  }

  User.scope("picture")
    .update(
      { picture: buffer, pictureContentType: mimetype },
      { where: { id } }
    )
    .then(_ => {
      res.set({ "Content-Location": `/users/${id}/picture`})
      res.send();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

module.exports = router;
