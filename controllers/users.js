const express = require("express");
const users = express.Router();

users.get("/", (req, res) => res.json({
    users: []
}));

module.exports = users;
