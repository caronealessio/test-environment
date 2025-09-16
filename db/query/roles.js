const db = require("../db");
const { readAll } = require("../utils/queryDefaults");

exports.readAll = (req, res) => {
  readAll("roles", res);
};
