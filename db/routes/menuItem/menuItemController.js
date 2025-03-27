const db = require("../../db");

exports.list = (req, res) => {
  const query = "SELECT * FROM menu_items";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      return res.status(500).send("Errore del server");
    }

    res.json(results);
  });
};

exports.detail = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM menu_items WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      return res.status(500).send("Errore del server");
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Elemento del menu non trovato" });
    }

    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  const { title, router } = req.body;

  db.query(`INSERT INTO menu_items (title, router) VALUES ('${title}', '${router}')`, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json({ message: "Elemento aggiunto" });
    }
  });
};

exports.delete = (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Devi fornire un array di ID valido" });
  }

  const query = `DELETE FROM menu_items WHERE id IN (?)`;

  db.query(query, [ids], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json({ message: `Eliminati ${results.affectedRows} elementi` });
    }
  });
};

exports.edit = (req, res) => {
  const { id } = req.params;
  const { title, router } = req.body;

  if (!title || !router) {
    return res.status(400).json({ error: "Title e router sono obbligatori" });
  }

  const query = "UPDATE menu_items SET title = ?, router = ? WHERE id = ?";

  db.query(query, [title, router, id], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      return res.status(500).send("Errore del server");
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Elemento del menu non trovato" });
    }

    res.json({ message: "Elemento aggiornato con successo" });
  });
};
