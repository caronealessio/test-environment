const db = require("../db");
const { readSingle, deleteRecords } = require("../utils/queryDefaults");

/**
 * Legge tutti gli utenti dal database.
 *
 * @param {express.Request} req - Richiesta HTTP.
 * @param {express.Response} res - Risposta HTTP.
 *
 * @returns {Promise<void>} Una promessa che restituisce i dati letti come oggetto JSON.
 */
exports.readAll = (req, res) => {
  const params = [];

  let query = `
    SELECT
      u.*,
      r.name as role
    FROM users as u
    INNER JOIN roles as r ON u.role_id = r.id
    `;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};

/**
 * Legge un singolo utente dal database.
 *
 * @param {express.Request} req - Richiesta HTTP.
 * @param {express.Response} res - Risposta HTTP.
 *
 * @returns {Promise<void>} Una promessa che restituisce i dati letti come oggetto JSON.
 */
exports.readSingle = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      t1.*  
    FROM users t1
    INNER JOIN roles t2 ON t1.role_id = t2.id
    INNER JOIN genders t3 ON t1.gender_id = t3.id
    WHERE t1.id = ?
  `;

  // const query = `
  //   SELECT
  //     t1.*,
  //     JSON_OBJECT('id', t2.id, 'name', t2.name, 'code', t2.code) AS role,
  //     JSON_OBJECT('id', t3.id, 'name', t3.name, 'code', t3.code) AS gender
  //   FROM users t1
  //   INNER JOIN roles t2 ON t1.role_id = t2.id
  //   INNER JOIN genders t3 ON t1.gender_id = t3.id
  //   WHERE t1.id = ?
  // `;

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

/**
 * Aggiunge un nuovo utente nel database.
 *
 * @param {express.Request} req - Richiesta HTTP.
 * @param {express.Response} res - Risposta HTTP.
 *
 * @body {Object} req.body - Contiene i dati dell'utente da aggiungere.
 * @body {string} req.body.address - Indirizzo dell'utente.
 * @body {string} req.body.birth_date - Data di nascita dell'utente.
 * @body {string} req.body.cap - CAP dell'utente.
 * @body {string} req.body.city - Citt dell'utente.
 * @body {string} req.body.email - Indirizzo email dell'utente.
 * @body {string} req.body.fiscal_code - Codice fiscale dell'utente.
 * @body {string} req.body.gender_id - ID del genere dell'utente.
 * @body {string} req.body.name - Nome dell'utente.
 * @body {string} req.body.phone - Numero di telefono dell'utente.
 * @body {string} req.body.role_id - ID del ruolo dell'utente.
 * @body {string} req.body.surname - Cognome dell'utente.
 *
 * @returns {Promise<void>} Una promessa che restituisce la risposta del server, se presente, come oggetto JSON.
 */
exports.create = (req, res) => {
  const { address, birth_date, cap, city, email, fiscal_code, gender_id, name, phone, role_id, surname } = req.body;

  const query = `
    INSERT INTO users (address, birth_date, cap, city, email, fiscal_code, gender_id, name, phone, role_id, surname)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      `;

  const params = [address, birth_date, cap, city, email, fiscal_code, gender_id, name, phone, role_id, surname];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Errore durante la query:", err.message);
      return res.status(500).send(err.message);
    }

    res.json({ message: "Elemento aggiunto" });
  });
};

/**
 * Elimina uno o più utenti dal database.
 *
 * @param {express.Request} req - Richiesta HTTP.
 * @param {express.Response} res - Risposta HTTP.
 *
 * @body {Array<number|string>} req.body.ids - Array contenente gli ID degli utenti da eliminare.
 *
 * @returns {Promise<void>} Una promessa che restituisce la risposta del server, se presente, come oggetto JSON.
 */
exports.delete = (req, res) => {
  const { ids } = req.body;

  deleteRecords("users", ids, res);
};

/**
 * Aggiorna un utente nel database.
 *
 * @param {express.Request} req - Richiesta HTTP.
 * @param {express.Response} res - Risposta HTTP.
 *
 * @body {Object} req.body - Contiene i dati dell'utente da aggiornare.
 * @body {string} req.body.address - Indirizzo dell'utente.
 * @body {string} req.body.birth_date - Data di nascita dell'utente.
 * @body {string} req.body.cap - CAP dell'utente.
 * @body {string} req.body.city - Citt dell'utente.
 * @body {string} req.body.email - Indirizzo email dell'utente.
 * @body {string} req.body.fiscal_code - Codice fiscale dell'utente.
 * @body {string} req.body.gender_id - ID del genere dell'utente.
 * @body {string} req.body.name - Nome dell'utente.
 * @body {string} req.body.phone - Numero di telefono dell'utente.
 * @body {string} req.body.role_id - ID del ruolo dell'utente.
 * @body {string} req.body.surname - Cognome dell'utente.
 *
 * @returns {Promise<void>} Una promessa che restituisce la risposta del server, se presente, come oggetto JSON.
 */
exports.update = (req, res) => {
  const { id } = req.params;

  const { address, birth_date, cap, city, email, fiscal_code, gender_id, name, phone, role_id, surname } = req.body;

  const query = `
    UPDATE users 
    SET 
      address = ?, 
      birth_date = ?, 
      cap = ?, 
      city = ?, 
      email = ?, 
      fiscal_code = ?, 
      gender_id = ?, 
      name = ?, 
      phone = ?, 
      role_id = ?, 
      surname = ? 
    WHERE id = ?`;

  db.query(
    query,
    [address, birth_date, cap, city, email, fiscal_code, gender_id, name, phone, role_id, surname, id],
    (err, results) => {
      if (err) {
        console.error("Errore durante la query:", err.message);
        return res.status(500).send(err.message);
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("Utente non trovato");
      }

      res.json({ message: "Elemento aggiornato con successo" });
    }
  );
};
