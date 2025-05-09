const db = require("../../db");

exports.list = (req, res) => {
  const query = "SELECT * FROM menu_items";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(`Errore del server: ${err.message}`);
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
      return res.status(500).send(`Errore del server: ${err.message}`);
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Elemento del menu non trovato" });
    }

    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  const { description, key, icon, isVisible } = req.body;

  db.query(
    `INSERT INTO menu_items (description, key, icon, isVisible) VALUES ('${description}', '${key}', '${icon}', '${isVisible}')`,
    (err, results) => {
      if (err) {
        console.error("Errore durante la query:", err.message);
        return res.status(500).send(`Errore del server: ${err.message}`);
      } else {
        res.json({ message: "Elemento aggiunto" });
      }
    }
  );
};

exports.delete = (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Devi fornire un array di ID valido" });
  }

  const query = `DELETE FROM menu_items WHERE id IN (?)`;

  db.query(query, [ids], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(`Errore del server: ${err.message}`);
    } else {
      res.json({ message: `Eliminati ${results.affectedRows} elementi` });
    }
  });
};

exports.edit = (req, res) => {
  const { id } = req.params;
  const { description, key, icon, isVisible } = req.body;

  if (!description || !key) {
    return res.status(400).json({ error: "Descrizione e Chiave sono obbligatori" });
  }

  const query = "UPDATE menu_items SET description = ?, key = ?, icon = ?, isVisible = ? WHERE id = ?";

  db.query(query, [description, key, icon, isVisible, id], (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(`Errore del server: ${err.message}`);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Elemento del menu non trovato" });
    }

    res.json({ message: "Elemento aggiornato con successo" });
  });
};
