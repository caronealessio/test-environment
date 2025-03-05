const db = require("../../db"); // Connessione al database

// Funzione per recuperare tutti gli articoli del menu
exports.readMenuItems = (req, res) => {
  db.query("SELECT * FROM menu_item", (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json(results);
    }
  });
};

// Funzione per aggiungere un nuovo elemento al menu
exports.createMenuItem = (req, res) => {
  const { title, router } = req.body;

  db.query(`INSERT INTO menu_item (title, router) VALUES ('${title}', '${router}')`, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json({ message: "Elemento aggiunto" });
    }
  });
};
