const db = require("../db");
const { readAll } = require("../utils/queryDefaults");

exports.readGenders = (req, res) => {
  readAll("genders", res);
};
