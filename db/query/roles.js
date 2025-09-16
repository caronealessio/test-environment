const db = require("../db");
const { readAll } = require("../utils/queryDefaults");

exports.readRoles = (req, res) => {
  readAll("roles", res);
};
