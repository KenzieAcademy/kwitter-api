const users = require("./users");
const messages = require("./messages");
const likes = require("./likes");
const { router } = require("./auth");

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *     - "text"
 *     - "userId"
 *     properties:
 *       userId:
 *         type: "integer"
 *       text:
 *         type: "string"
 *   Login:
 *     required:
 *     - "username"
 *     - "password"
 *     properties:
 *       username:
 *         type: "string"
 *       password:
 *         type: "string"
 *   Message:
 *     required:
 *     - "username"
 *     properties:
 *       username:
 *         type: "string"
 *       displayName:
 *         type: "string"
 *       password:
 *         type: "string"
 * securityDefinitions:
 *  Bearer:
 *    type: apiKey
 *    name: Authorization
 *    in: header
 */

module.exports = {
  auth: router,
  likes,
  messages,
  users
};
