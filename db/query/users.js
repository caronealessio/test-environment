const db = require("../db");
const { readSingle } = require("../utils/queryDefaults");

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

exports.readUser = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      t1.*, 
      JSON_OBJECT('id', t2.id, 'name', t2.name, 'code', t2.code) AS role,
      JSON_OBJECT('id', t3.id, 'name', t3.name, 'code', t3.code) AS gender
    FROM users t1
    INNER JOIN roles t2 ON t1.role_id = t2.id
    INNER JOIN genders t3 ON t1.gender_id = t3.id
    WHERE t1.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send("Elemento del menu non trovato");
    }

    res.json(results[0]);
  });
};
