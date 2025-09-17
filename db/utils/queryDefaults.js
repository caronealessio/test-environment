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
  const query = "SELECT * FROM ??";

  db.query(query, [tableName], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    res.json(results);
  });
}

/**
 * Elimina uno o più record da una tabella generica.
 *
 * @param {string} tableName - Nome della tabella da cui eliminare i record.
 * @param {Array<number|string>} ids - Array contenente gli ID da eliminare.
 * @param {object} res - Oggetto di risposta Express per inviare l'esito o l'errore.
 */
function deleteRecords(tableName, ids, res) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("Devi fornire un array di ID valido");
  }

  const query = `DELETE FROM ?? WHERE id IN (?)`;

  db.query(query, [tableName, ids], (err, results) => {
    if (err) {
      console.error(`Errore durante la query su ${tableName}:`, err.message);
      return res.status(500).send(err.message);
    } else {
      res.json({ message: `Eliminati ${results.affectedRows} elementi da ${tableName}` });
    }
  });
}

module.exports = { readSingle, readAll, deleteRecords };
