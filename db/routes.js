const express = require("express");
const router = express.Router();
const menuItems = require("./query/menu-items");
const users = require("./query/users");

router.get("/menu-items", menuItems.list);
router.get("/menu-items/:id", menuItems.detail);
router.post("/menu-items", menuItems.create);
router.delete("/menu-items", menuItems.delete);
router.put("/menu-items/:id", menuItems.edit);
router.get("/users", users.list);

module.exports = router;
