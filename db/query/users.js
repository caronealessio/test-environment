const db = require("../db");

exports.list = (req, res) => {
  const params = [];

  let query = "SELECT * FROM users WHERE 1=1";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    res.json(results);
  });
};
