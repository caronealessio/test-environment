const db = require("../db");

exports.list = (req, res) => {
  const params = [];
  const { search, isVisible } = req.query;

  let query = "SELECT * FROM menu_items WHERE 1=1";

  if (search) {
    query += " AND (description LIKE ? OR `key` LIKE ?)";
    const value = `%${search}%`;
    params.push(value, value);
  }

  if (isVisible) {
    query += " AND isVisible = ?";
    params.push(parseInt(isVisible));
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    res.json(results);
  });
};

exports.detail = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM menu_items WHERE id = ?";

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
  const key = req.body.key ?? "";
  const icon = req.body.icon ?? "";

  if (!description || !key) {
    return res.status(400).send("I campi 'Descrizione' e 'Chiave' sono obbligatori");
  }

  const query = "INSERT INTO menu_items (description, `key`, icon, isVisible) VALUES (?, ?, ?, 1)";

  const params = [description, key, icon];

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

  const query = `DELETE FROM menu_items WHERE id IN (?)`;

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
  const key = req.body.key ?? "";
  const icon = req.body.icon ?? "";
  const isVisible = req.body.isVisible ?? 1;

  if (!description || !key) {
    return res.status(400).send("I campi 'Descrizione' e 'Chiave' sono obbligatori");
  }

  const query = "UPDATE menu_items SET description = ?, `key` = ?, icon = ?, isVisible = ? WHERE id = ?";

  db.query(query, [description, key, icon, isVisible, id], (err, results) => {
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
