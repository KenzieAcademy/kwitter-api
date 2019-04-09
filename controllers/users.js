const express = require("express");
const Sequelize = require("sequelize");
const { User, Message, Like } = require("../models");
const { authMiddleware } = require("./auth");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200000 }
});

// get a specific user by id
const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, {
      include: [
        {
          model: Message,
          include: [Like]
        }
      ]
    });
    res.send({ user });
  } catch (err) {
    console.error(err);
    if (err instanceof Sequelize.DatabaseError) {
      return res.status(400).send({ error: err.toString() });
    }
    return res.status(500).send();
  }
};
// get list of users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]]
    });
    res.send({ users });
  } catch (err) {
    console.error(err);
    if (err instanceof Sequelize.DatabaseError) {
      return res.status(400).send({ error: err.toString() });
    }
    return res.status(500).send();
  }
};
// update a user by id
const updateUser = [
  authMiddleware,
  async (req, res) => {
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
      const user = await User.findById(req.user.id);
      res.send({ user });
    } catch (err) {
      if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({
          errors: err.errors.map(err => ({
            message: err.message,
            type: err.type,
            path: err.path,
            value: err.value
          }))
        });
      }
      res.status(500).send();
    }
  }
];
// delete a user by id
const deleteUser = [
  authMiddleware,
  async (req, res) => {
    try {
      await User.destroy({
        where: {
          id: req.user.id
        }
      });
      res.send({ id: req.user.id });
    } catch (err) {
      console.error(err);
      res.send(500).send();
    }
  }
];

// get user's picture
const getUserPicture = async (req, res) => {
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
    if (err instanceof Sequelize.DatabaseError) {
      return res.status(400).send({ error: err.toString() });
    }
    return res.status(500).send();
  }
};

// set user's picture
const setUserPicture = [
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
];

module.exports = {
  setUserPicture,
  getUser,
  getUserPicture,
  getUsers,
  deleteUser,
  updateUser
};
