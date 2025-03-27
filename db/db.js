const mysql = require("mysql2");

// Configura la connessione al database
const db = mysql.createConnection({
  host: "localhost", // Cambia con l'IP del server se remoto
  user: "root", // Nome utente MySQL
  password: "Altamura080!", // Password MySQL
  database: "fiori", // Nome del database
});

// Connettiti al database
db.connect((err) => {
  if (err) {
    console.error("Errore di connessione al database:", err.stack);
    return;
  }
});

module.exports = db;
