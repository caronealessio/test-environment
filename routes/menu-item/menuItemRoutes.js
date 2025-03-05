const express = require("express");
const router = express.Router();
const menuItemController = require("./menuItemController"); // Importa il controller

// Definisci le rotte
router.get("/", menuItemController.readMenuItems);
router.post("/create", menuItemController.createMenuItem);

module.exports = router;
