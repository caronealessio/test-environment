sap.ui.define([], function () {
  "use strict";

  return {
    Functionalities: function () {
      return [
        { Text: "Formattazione Standard Tabelle", Route: "StandardTableManagement" },
        { Text: "Formattazione Custom Tabelle", Route: "CustomTableManagement" },
        { Text: "Esporta", Route: "Export" },
      ];
    },

    Users: function () {
      return [
        { Id: 1, Name: "Alessio", Surname: "Carone", BirthDate: new Date("1999-09-29T00:00:00"), City: "Altamura" },
        { Id: 2, Name: "Carlo", Surname: "Giustino", BirthDate: new Date("2001-02-05T00:00:00"), City: "Bari" },
      ];
    },

    Items: function () {
      return [];
    },

    Export: function () {
      return [
        {
          String: "Ciao",
          Date: new Date(),
          Time: { ms: 64596000, __edmType: "Edm.Time" },
          Currency: "256.36",
          Boolean: true,
          Integer: "00000",
        },
        {
          String: "Sium",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "12658942.00",
          Boolean: false,
          Integer: "0009966",
        },
      ];
    },
  };
});
