const { User, Message, Like } = require("../models");
const { jwtAuthMiddleware } = require("../authentication");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200000 }
});

// get a specific user by id
const getUser = async (req, res, next) => {
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
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
// get list of users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      order: [["createdAt", "DESC"]]
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
// update a user by id
const updateUser = [
  jwtAuthMiddleware,
  async (req, res, next) => {
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
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
];
// delete a user by id
const deleteUser = [
  jwtAuthMiddleware,
  async (req, res, next) => {
    try {
      await User.destroy({
        where: {
          id: req.user.id
        }
      });
      res.send({ id: req.user.id });
    } catch (err) {
      next(err);
    }
  }
];

// get user's picture
const getUserPicture = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.scope("picture").findById(id);
    if (user === null) {
      next({ statusCode: 404, message: "User does not exist" });
      return;
    }
    if (user.picture === null) {
      next({ statusCode: 404, message: "User does not have a picture" });
      return;
    }
    const { picture, pictureContentType } = user;
    res.set({
      "Content-Type": pictureContentType,
      "Content-Disposition": "inline"
    });
    res.send(picture);
  } catch (err) {
    next(err);
  }
};

// set user's picture
const setUserPicture = [
  jwtAuthMiddleware,
  upload.single("picture"),
  async (req, res, next) => {
    const supportedContentTypes = ["image/gif", "image/jpeg", "image/png"];
    const { buffer, mimetype } = req.file;
    const { id } = req.user;

    if (!supportedContentTypes.includes(mimetype)) {
      next({
        statusCode: 415,
        message: `Content-Type must be one of ${supportedContentTypes.join(
          ", "
        )}`
      });
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
      next(err);
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
