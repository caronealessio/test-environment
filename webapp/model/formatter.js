sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * @param {Date} oDate
     * @returns {Date}
     */
    convertDateInUTCRome: function (oDate) {
      if (!oDate) {
        return null;
      }

      if (!oDate instanceof Date) {
        oDate = new Date(oDate);
      }

      var sDay = oDate.getDate();
      var iDay = parseInt(sDay);
      if (iDay < 10) {
        sDay = "0" + sDay;
      }
      var sMonths = oDate.getMonth() + 1;
      var iMonth = parseInt(sMonths);
      if (iMonth < 10) {
        sMonths = "0" + sMonths;
      }
      var sYear = oDate.getFullYear();
      var sDatetime = sYear + "-" + sMonths + "-" + sDay + "T00:00:00.000+00:00";
      oDate = new Date(sDatetime);

      return oDate;
    },

    convertVarInUTCRome: function (oItem) {
      if (!oItem) {
        return oItem;
      }

      var bIsDate = oItem instanceof Date;
      var bIsObject = typeof oItem === "object" && !Array.isArray(oItem) && oItem !== null && !(oItem instanceof Date);
      var bIsArray = Array.isArray(oItem);

      if (bIsObject) {
        for (const property in oItem) {
          bIsObject =
            typeof oItem[property] === "object" &&
            !Array.isArray(oItem[property]) &&
            oItem[property] !== null &&
            !(oItem[property] instanceof Date);

          var bIsArray = Array.isArray(oItem[property]);

          if (bIsObject) {
            oItem[property] = this.convertVarInUTCRome(oItem[property]);
          }

          if (bIsArray) {
            oItem[property] = this.convertVarInUTCRome(oItem[property]);
          }

          if (oItem[property] instanceof Date) {
            oItem[property] = this.UTCRome(oItem[property]);
          }
        }
      }

      if (bIsArray && oItem.length > 0) {
        oItem.map((oRecord, index) => {
          oItem[index] = this.convertVarInUTCRome(oRecord);
        });
      }

      if (bIsDate) {
        oItem = this.UTCRome(oItem);
      }

      return oItem;
    },

    /**
     * @param {array} aArray
     * @param {string} sKey
     * @returns
     */
    disableLastButtonsFromArray: function (aArray, sKey) {
      return aArray[aArray.length - 1].key !== sKey;
    },

    /**
     *
     * @param {Date} oDate
     * @returns {Date}
     */
    UTCRome: function (oDate) {
      if (!oDate) {
        return null;
      }

      if (!oDate instanceof Date) {
        oDate = new Date(oDate);
      }

      var sDay = oDate.getDate();
      var iDay = parseInt(sDay);
      if (iDay < 10) {
        sDay = "0" + sDay;
      }
      var sMonths = oDate.getMonth() + 1;
      var iMonth = parseInt(sMonths);
      if (iMonth < 10) {
        sMonths = "0" + sMonths;
      }
      var sYear = oDate.getFullYear();
      var sDatetime = sYear + "-" + sMonths + "-" + sDay + "T00:00:00.000+00:00";
      oDate = new Date(sDatetime);

      return oDate;
    },

    /**
     * Controlla se una stringa è in formato ISO 8601 (con Z finale)
     * @param {string} value
     * @returns {boolean}
     */
    isIsoDateString: function (value) {
      return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value);
    },

    /**
     * Funzione ricorsiva per convertire tutte le stringhe ISO in oggetti Date
     * @param {any} obj
     * @returns {any}
     */
    convertIsoStringsToDate: function (obj) {
      if (Array.isArray(obj)) {
        return obj.map(this.convertIsoStringsToDate.bind(this));
      } else if (obj && typeof obj === "object") {
        for (const key in obj) {
          if (!obj.hasOwnProperty(key)) continue;
          obj[key] = this.convertIsoStringsToDate(obj[key]);
        }
        return obj;
      } else if (typeof obj === "string") {
        if (this.isIsoDateString(obj)) {
          return new Date(obj);
        }
        return obj;
      }
      return obj;
    },

    // /**
    //  * Converte un oggetto Date in stringa "YYYY-MM-DD HH:mm:ss" (formato MySQL DATETIME).
    //  * @param {Date} date Oggetto Date da convertire
    //  * @returns {string|null} Stringa formattata o null se input non valido
    //  */
    // formatDateToMySQL: function (date) {
    //   if (!(date instanceof Date) || isNaN(date)) {
    //     return null;
    //   }

    //   const pad = (n) => (n < 10 ? "0" + n : n);

    //   const year = date.getFullYear();
    //   const month = pad(date.getMonth() + 1);
    //   const day = pad(date.getDate());
    //   const hours = pad(date.getHours());
    //   const minutes = pad(date.getMinutes());
    //   const seconds = pad(date.getSeconds());

    //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    // },

    // /**
    //  * Funzione ricorsiva per convertire tutti i Date in stringhe "YYYY-MM-DD HH:mm:ss"
    //  * @param {any} obj
    //  * @returns {any}
    //  */
    // convertDatesToMySQL: function (obj) {
    //   if (Array.isArray(obj)) {
    //     return obj.map(this.convertDatesToMySQL.bind(this));
    //   } else if (obj && typeof obj === "object") {
    //     for (const key in obj) {
    //       if (!obj.hasOwnProperty(key)) continue;
    //       obj[key] = this.convertDatesToMySQL(obj[key]);
    //     }
    //     return obj;
    //   } else if (obj instanceof Date) {
    //     return this.formatDateToMySQL(obj);
    //   }
    //   return obj;
    // },

    /**
     * Converte Date in stringhe MySQL ricorsivamente.
     *
     * @param {any} obj - value/array/object da convertire
     * @param {Object} [opts] - opzioni
     * @param {boolean} [opts.utc=true] - se true usa getUTC*(), altrimenti get*() locale
     * @param {boolean} [opts.dateOnly=false] - se true restituisce "YYYY-MM-DD", altrimenti "YYYY-MM-DD HH:mm:ss"
     * @param {boolean} [opts.mutate=true] - se true modifica l'oggetto passato, altrimenti ritorna copia
     * @returns {any} - oggetto/array/valore convertito
     */
    convertDatesToMySQL: function (obj, opts) {
      opts = opts || {};
      var utc = typeof opts.utc === "boolean" ? opts.utc : true;
      var dateOnly = !!opts.dateOnly;
      var mutate = typeof opts.mutate === "boolean" ? opts.mutate : true;

      var pad = function (n) {
        return n < 10 ? "0" + n : String(n);
      };

      var format = function (date) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return null;
        }
        if (utc) {
          var y = date.getUTCFullYear();
          var m = pad(date.getUTCMonth() + 1);
          var d = pad(date.getUTCDate());
          if (dateOnly) {
            return y + "-" + m + "-" + d;
          }
          var hh = pad(date.getUTCHours());
          var mm = pad(date.getUTCMinutes());
          var ss = pad(date.getUTCSeconds());
          return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
        } else {
          var y2 = date.getFullYear();
          var m2 = pad(date.getMonth() + 1);
          var d2 = pad(date.getDate());
          if (dateOnly) {
            return y2 + "-" + m2 + "-" + d2;
          }
          var hh2 = pad(date.getHours());
          var mm2 = pad(date.getMinutes());
          var ss2 = pad(date.getSeconds());
          return y2 + "-" + m2 + "-" + d2 + " " + hh2 + ":" + mm2 + ":" + ss2;
        }
      };

      // Se è una Date -> formatta subito (PRIMA CHECK)
      if (obj instanceof Date) {
        return format(obj);
      }

      // Array -> mappa ricorsiva
      if (Array.isArray(obj)) {
        var arr = obj.map(
          function (item) {
            return this.convertDatesToMySQL(item, opts);
          }.bind(this)
        );
        return mutate
          ? (function () {
              obj.length = 0;
              Array.prototype.push.apply(obj, arr);
              return obj;
            })()
          : arr;
      }

      // Object (non-null)
      if (obj && typeof obj === "object") {
        var target = mutate ? obj : {};
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            target[key] = this.convertDatesToMySQL(obj[key], opts);
          }
        }
        return target;
      }

      // valore primitivo (string/number/null/undefined) -> lascialo così com'è
      return obj;
    },
  };
});
