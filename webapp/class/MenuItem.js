// @ts-check

/**
 * @typedef {Object} MenuItemTypes
 * @property {number} id - ID univoco dell'elemento del menu
 * @property {string} title - Titolo visualizzato nell'interfaccia
 * @property {string} router - Route di navigazione UI5
 * @property {string} created - Timestamp di creazione
 */

sap.ui.define([], function () {
  "use strict";

  /**
   * @class MenuItem
   * @description Classe che rappresenta un elemento del menu
   */
  return class MenuItem {
    /**
     * @constructor
     * @param {number} id
     * @param {string} title
     * @param {string} router
     * @param {string} created
     */
    constructor(id, title, router, created) {
      this.id = id;
      this.title = title;
      this.router = router;
      this.created = created;
    }
  };
});
