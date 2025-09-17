const express = require("express");
const router = express.Router();
const menu = require("./query/menu");
const users = require("./query/users");
const genders = require("./query/genders");
const roles = require("./query/roles");

router.get("/menu", menu.readAll);
router.get("/menu/:id", menu.readSingle);
router.post("/menu", menu.create);
router.delete("/menu", menu.delete);
router.put("/menu/update-positions", menu.updatePositions);
router.put("/menu/:id", menu.update);

router.get("/users", users.readAll);
router.get("/users/:id", users.readSingle);
router.post("/users", users.create);
router.delete("/users", users.delete);
router.put("/users/:id", users.update);

router.get("/genders", genders.readAll);

router.get("/roles", roles.readAll);

module.exports = router;
