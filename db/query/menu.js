const db = require("../db");

const {
  buildOrderByClause,
  buildPaginationClause,
  buildLikeFilters,
  buildEqualFilters,
} = require("../utils/queryHelpers");

exports.list = (req, res) => {
  const { top, skip, order } = req.query;

  let baseQuery = "FROM menu WHERE 1=1";
  const filterParams = [];

  //GESTIONE FILTRI
  const likeFilter = buildLikeFilters(req.query, ["description", "target"]);
  baseQuery += likeFilter.clause;
  filterParams.push(...likeFilter.params);

  const equalFilter = buildEqualFilters(req.query, ["isVisible"]);
  baseQuery += equalFilter.clause;
  filterParams.push(...equalFilter.params);

  // ORDER e PAGINATION
  const orderClause = buildOrderByClause(order);
  const { clause: paginationClause, params: paginationParams } = buildPaginationClause(top, skip);

  const dataQuery = `SELECT * ${baseQuery}${orderClause}${paginationClause}`;
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

  // Totale
  db.query(countQuery, filterParams, (countErr, countResults) => {
    if (countErr) {
      console.error("Errore conteggio:", countErr.message);
      return res.status(500).send(countErr.message);
    }

    const total = countResults[0].total;

    // Dati
    db.query(dataQuery, [...filterParams, ...paginationParams], (dataErr, results) => {
      if (dataErr) {
        console.error("Errore query dati:", dataErr.message);
        return res.status(500).send(dataErr.message);
      }

      res.json({
        data: results,
        total,
      });
    });
  });
};

exports.detail = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM menu WHERE id = ?";

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

exports.create = (req, res) => {
  const description = req.body.description ?? "";
  const target = req.body.target ?? "";
  const icon = req.body.icon ?? "";

  if (!description || !target) {
    return res.status(400).send("I campi 'Descrizione' e 'Chiave' sono obbligatori");
  }

  const query = `
    INSERT INTO menu (description, target, icon, isVisible, pos)
    SELECT ?, ?, ?, 1, IFNULL(MAX(pos), -1) + 1 FROM (SELECT pos FROM menu) AS temp
      `;

  const params = [description, target, icon];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    res.json({ message: "Elemento aggiunto" });
  });
};

exports.delete = (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("Devi fornire un array di ID valido");
  }

  const query = `DELETE FROM menu WHERE id IN (?)`;

  db.query(query, [ids], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    } else {
      res.json({ message: `Eliminati ${results.affectedRows} elementi` });
    }
  });
};

exports.edit = (req, res) => {
  const { id } = req.params;

  const description = req.body.description ?? "";
  const target = req.body.target ?? "";
  const icon = req.body.icon ?? "";
  const isVisible = req.body.isVisible ?? 1;

  if (!description || !target) {
    return res.status(400).send("I campi 'Descrizione' e 'Chiave' sono obbligatori");
  }

  const query = "UPDATE menu SET description = ?, target = ?, icon = ?, isVisible = ? WHERE id = ?";

  db.query(query, [description, target, icon, isVisible, id], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Elemento del menu non trovato");
    }

    res.json({ message: "Elemento aggiornato con successo" });
  });
};

exports.updatePositions = (req, res) => {
  const updates = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).send("Fornisci un array valido di oggetti { id, pos }");
  }

  // Controllo che ogni oggetto abbia id e pos validi
  for (const u of updates) {
    if (typeof u.id !== "number" || typeof u.pos !== "number") {
      return res.status(400).send("Ogni oggetto deve avere un 'id' e un 'pos' numerico");
    }
  }

  const ids = updates.map((u) => u.id);
  const caseStatements = updates.map((u) => `WHEN ${u.id} THEN ${u.pos}`).join(" ");

  const query = `UPDATE menu SET pos = CASE id ${caseStatements} END WHERE id IN (${ids.join(",")});`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore durante l'update massivo:", err.message);
      return res.status(500).send(err.message);
    }

    res.json({ message: "Posizioni aggiornate con successo", affectedRows: results.affectedRows });
  });
};
