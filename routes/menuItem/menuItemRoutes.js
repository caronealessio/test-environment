const express = require("express");
const router = express.Router();
const menuItemController = require("./menuItemController");

router.get("/", menuItemController.list);
router.get("/:id", menuItemController.detail);
router.post("/", menuItemController.create);
router.delete("/", menuItemController.delete);
router.put("/:id", menuItemController.edit);

module.exports = router;
