const db = require("../db");
const { buildLikeFilters, buildEqualFilters, buildOrderByClause, buildPaginationClause } = require("./queryHelpers");

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

/**
 * Funzione generica per leggere i dati con filtri, ordinamento, paginazione, join e selezione personalizzata.
 *
 * @param {string} tableName - Il nome della tabella.
 * @param {object} queryParams - Parametri della query, tra cui top, skip, likeFilters, equalFilters, order, innerJoin, select.
 * @param {express.Request} req - La richiesta HTTP.
 * @param {express.Response} res - La risposta HTTP.
 */
function readAllDynamic(tableName, queryParams, req, res) {
  const { top, skip, order } = req.query;
  const { likeFilters, equalFilters, innerJoin, select } = queryParams;

  // Creiamo la base della query
  let whereQuery = `WHERE 1=1`;
  const filterParams = [];

  // GESTIONE FILTRI "LIKE"
  if (likeFilters && Array.isArray(likeFilters)) {
    const likeFilter = buildLikeFilters(req.query, likeFilters);
    whereQuery += likeFilter.clause;
    filterParams.push(...likeFilter.params);
  }

  // GESTIONE FILTRI "EQUAL"
  if (equalFilters && Array.isArray(equalFilters)) {
    const equalFilter = buildEqualFilters(req.query, equalFilters);
    whereQuery += equalFilter.clause;
    filterParams.push(...equalFilter.params);
  }

  // INNER JOIN
  let joinClause = "";
  if (innerJoin && Array.isArray(innerJoin)) {
    innerJoin.forEach((join) => {
      const { table, on, alias } = join;
      // Se viene passato un alias, lo usiamo, altrimenti usiamo la tabella stessa
      const tableAlias = alias || table.charAt(0); // Usa la prima lettera della tabella come alias di default
      joinClause += ` INNER JOIN ${table} AS ${tableAlias} ON ${on}`;
    });
  }

  // Selezione personalizzata (ad esempio `SELECT u.id, u.name`)
  const selectClause = select || "*";

  // ORDERING
  const orderClause = buildOrderByClause(order);

  // PAGINAZIONE
  const { clause: paginationClause, params: paginationParams } = buildPaginationClause(top, skip);

  // Query per i dati
  const dataQuery = `SELECT ${selectClause} FROM ${tableName} AS t ${joinClause} ${whereQuery} ${orderClause} ${paginationClause}`;

  // Query per il conteggio totale
  const countQuery = `SELECT COUNT(*) as count FROM ${tableName} AS t ${joinClause} ${whereQuery} `;

  // Totale
  db.query(countQuery, filterParams, (countErr, countResults) => {
    if (countErr) {
      console.error("Errore conteggio:", countErr.message);
      return res.status(500).send(countErr.message);
    }

    const count = countResults[0].count;

    // Dati
    db.query(dataQuery, [...filterParams, ...paginationParams], (dataErr, results) => {
      if (dataErr) {
        console.error("Errore query dati:", dataErr.message);
        return res.status(500).send(dataErr.message);
      }

      res.json({
        data: results,
        count,
      });
    });
  });
}

module.exports = { readSingle, readAll, deleteRecords, readAllDynamic };
