const express = require("express");
const cors = require("cors");
const db = require("./db"); // Connessione al database
const routes = require("./routes"); // Importa le rotte del menu

const app = express();
const PORT = 3000;

// Abilita CORS per tutte le richieste
app.use(cors());

app.use(express.json()); // Middleware per analizzare il corpo della richiesta in JSON

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

app.use("/", routes);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
