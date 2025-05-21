const express = require("express");
const router = express.Router();
const menuItems = require("./query/menu-items");

router.get("/menu-items", menuItems.list);
router.get("/menu-items/:id", menuItems.detail);
router.post("/menu-items", menuItems.create);
router.delete("/menu-items", menuItems.delete);
router.put("/menu-items/:id", menuItems.edit);

module.exports = router;
