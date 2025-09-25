/**
 * Costruisce una clausola ORDER BY sicura
 * @param {string} orderParam - es: 'description:asc' o 'id:desc'
 * @returns {string} - parte della query SQL ORDER BY, oppure stringa vuota
 */
function buildOrderByClause(orderParam) {
  if (!orderParam) return "";

  const [column, dir] = orderParam.split(":");
  const direction = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  return ` ORDER BY \`${column}\` ${direction}`;
}

/**
 * Costruisce la clausola LIMIT e OFFSET
 * @param {string|number} top - numero massimo di risultati
 * @param {string|number} skip - numero di risultati da saltare
 * @returns {{ clause: string, params: number[] }}
 */
function buildPaginationClause(top, skip) {
  const clauseParts = [];
  const params = [];

  const limit = parseInt(top);
  const offset = parseInt(skip);

  if (!isNaN(limit)) {
    clauseParts.push("LIMIT ?");
    params.push(limit);

    if (!isNaN(offset)) {
      clauseParts.push("OFFSET ?");
      params.push(offset);
    }
  }

  return {
    clause: clauseParts.length ? " " + clauseParts.join(" ") : "",
    params,
  };
}

/**
 * Genera la clausola SQL e i parametri per campi con LIKE
 * @param {object} query - oggetto da req.query
 * @param {string[]} fields - campi da cercare con LIKE
 * @returns {{ clause: string, params: any[] }}
 */
function buildLikeFilters(query, fields) {
  const clauses = [];
  const params = [];

  for (const field of fields) {
    if (query[field]) {
      clauses.push(`(t.${field} LIKE ?)`);
      params.push(`%${query[field]}%`);
    }
  }

  return {
    clause: clauses.length ? " AND " + clauses.join(" OR ") : "",
    params,
  };
}

/**
 * Genera la clausola SQL e i parametri per campi con '='
 * @param {object} query - oggetto da req.query
 * @param {string[]} fields - campi da confrontare con uguaglianza
 * @returns {{ clause: string, params: any[] }}
 */
function buildEqualFilters(query, fields) {
  const clauses = [];
  const params = [];

  for (const field of fields) {
    if (query[field] !== undefined) {
      clauses.push(`(${field} = ?)`);
      params.push(query[field]);
    }
  }

  return {
    clause: clauses.length ? " AND " + clauses.join(" AND ") : "",
    params,
  };
}

module.exports = {
  buildOrderByClause,
  buildPaginationClause,
  buildLikeFilters,
  buildEqualFilters,
};
