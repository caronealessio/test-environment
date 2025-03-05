const express = require("express");
const cors = require("cors");
const db = require("./db"); // Connessione al database

const app = express();
const PORT = 3000;

// Abilita CORS per tutte le richieste
app.use(cors());

app.use(express.json()); // Middleware per analizzare il corpo della richiesta in JSON

// Endpoint per recuperare gli utenti
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json(results);
    }
  });
});

app.get("/menu-item", (req, res) => {
  db.query("SELECT * FROM menu_item", (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json(results);
    }
  });
});

app.post("/add-menu-item", (req, res) => {
  const { title, router } = req.body;

  console.log("title:", title);
  console.log("router:", router);

  db.query(`INSERT INTO menu_item (title, router) VALUES ('${title}', '${router}')`, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.stack);
      res.status(500).send("Errore del server");
    } else {
      res.json({ message: "Elemento aggiunto" });
    }
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
