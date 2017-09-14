const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/:id", (req, res) => {
    models("users")
        .select()
        .where("id", req.params.id)
        .then(([user])=> res.json({ user }))
});

router.patch("/:id", (req, res) => {
    models("users")
        .update(req.body)
        .where(req.params)
        .then(rowCount => res.json({ rowCount }))
});

router.delete("/:id", (req, res) => {
    models("users")
        .del()
        .where(req.params)
        .then(({ rowCount }) => res.json({ rowCount }))
});

router.get("/", (req, res) => {
    models("users")
        .select()
        .then(users => res.json({ users }))
});

router.post("/", (req, res) => {
    models("users")
        .insert(req.body)
        .then(({rowCount}) => res.json({ rowCount }))
        .catch(({ detail, table }) => res.status(400).json({ detail, table }));
});


module.exports = router;
