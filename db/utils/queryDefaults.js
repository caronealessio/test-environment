const db = require("../db");

/**
 * Legge un singolo record da qualsiasi tabella
 * @param {string} tableName - Nome della tabella
 * @param {number|string} id - Id del record
 * @param {object} res - risposta Express per gestire errori direttamente
 */
function readSingle(tableName, id, res) {
  const query = "SELECT * FROM ?? WHERE id = ?";

  db.query(query, [tableName, id], (err, results) => {
    if (err) {
      console.error(`Errore durante la query su ${tableName}:`, err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send(`Elemento non trovato in ${tableName}`);
    }

    res.json(results[0]);
  });
}

/**
 * Legge un singolo record da qualsiasi tabella
 * @param {string} tableName - Nome della tabella
 * @param {object} res - risposta Express per gestire errori direttamente
 */
function readAll(tableName, res) {
  let query = "SELECT * FROM ??";

  db.query(query, [tableName], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    res.json(results);
  });
}

module.exports = { readSingle, readAll };
