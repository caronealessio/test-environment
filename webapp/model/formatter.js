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
  };
});
