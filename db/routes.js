const express = require("express");
const router = express.Router();
const menu = require("./query/menu");
const users = require("./query/users");
const genders = require("./query/genders");
const roles = require("./query/roles");

router.get("/menu", menu.list);
router.get("/menu/:id", menu.detail);
router.post("/menu", menu.create);
router.delete("/menu", menu.delete);
router.put("/menu/update-positions", menu.updatePositions);
router.put("/menu/:id", menu.edit);

router.get("/users", users.list);
router.get("/users/:id", users.readUser);

router.get("/genders", genders.readGenders);

router.get("/roles", roles.readRoles);

module.exports = router;
