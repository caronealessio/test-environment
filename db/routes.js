const express = require("express");
const router = express.Router();
const menu = require("./query/menu");
const users = require("./query/users");

router.get("/menu", menu.list);
router.get("/menu/:id", menu.detail);
router.post("/menu", menu.create);
router.delete("/menu", menu.delete);
router.put("/menu/:id", menu.edit);
router.get("/users", users.list);

module.exports = router;
