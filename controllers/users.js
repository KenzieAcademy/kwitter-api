const { User, Message, Like } = require("../models");
const { validateJwtMiddleware } = require("../auth");
// const multer = require("multer");
// const enforcerMulter = require("openapi-enforcer-multer");
// const enforcer = require("./").enforcer;

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 200000 }
// });

// get a specific user by id
const getUser = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id, {
      raw: true
    });

    res.send({ user, statusCode: res.statusCode });
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
      order: [["createdAt", "DESC"]],
      raw: true
    });
    res.send({ users, statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
};

// create a new user
const createUser = async (req, res, next) => {
  const { username, displayName, password } = req.body;
  try {
    const user = await User.create({
      username,
      displayName,
      password
    });
    const userRaw = await User.findById(user.id, { raw: true });
    res.send({ user: userRaw, statusCode: res.statusCode });
  } catch (err) {
    next(err);
  }
};

// update a user by id
const updateUser = [
  validateJwtMiddleware,
  async (req, res, next) => {
    if (req.params.userId !== req.user.id && req.user.role !== "admin") {
      next({
        statusCode: 403,
        message: "You do not have sufficient privileges to update this user"
      });
      return;
    }

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
      const user = await User.findById(req.params.userId, { raw: true });
      if (!user) {
        next({
          statusCode: 404,
          message: "User does not exist"
        });
        return;
      }
      await User.update(patch, { where: { id: req.params.userId } });
      res.send({ user, statusCode: res.statusCode });
    } catch (err) {
      next(err);
    }
  }
];

// delete a user by id
const deleteUser = [
  validateJwtMiddleware,
  async (req, res, next) => {
    try {
      await User.destroy({
        where: {
          id: req.user.id
        }
      });
      res.send({ id: req.user.id, statusCode: res.statusCode });
    } catch (err) {
      next(err);
    }
  }
];

// get user's picture
const getUserPicture = async (req, res, next) => {
  try {
    const user = await User.scope("picture").findById(req.params.userId);
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
  validateJwtMiddleware,
  async (req, res, next) => {
    const supportedContentTypes = ["image/gif", "image/jpeg", "image/png"];
    const { buffer, mimetype } = req.files.picture;
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
      res.send({ statusCode: res.statusCode });
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
  updateUser,
  createUser
};
