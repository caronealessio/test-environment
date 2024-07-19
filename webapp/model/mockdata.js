sap.ui.define([], function () {
  "use strict";

  return {
    Functionalities: function () {
      return [
        { Text: "Formattazione Standard Tabelle", Route: "StandardTableManagement" },
        { Text: "Formattazione Custom Tabelle", Route: "CustomTableManagement" },
        { Text: "Esporta", Route: "Export" },
        { Text: "Form", Route: "Form" },
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
          String: "Prova 1",
          Date: new Date(),
          Time: { ms: 64596000, __edmType: "Edm.Time" },
          Currency: "256.36",
          Boolean: true,
          Integer: "00000",
        },
        {
          String: "Prova 2",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "12658942.00",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 3",
          Date: new Date(),
          Time: { ms: 64596000, __edmType: "Edm.Time" },
          Currency: "1598.71",
          Boolean: true,
          Integer: "00000",
        },
        {
          String: "Prova 4",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "65498.00",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 5",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "0.00",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 6",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "48.36",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 7",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "0.36",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 8",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "0.00",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 9",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "48.36",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 10",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "0.36",
          Boolean: false,
          Integer: "0009966",
        },
        {
          String: "Prova 11",
          Date: new Date(),
          Time: { ms: 32731000, __edmType: "Edm.Time" },
          Currency: "0.36",
          Boolean: false,
          Integer: "0009966",
        },
      ];
    },

    Form: function () {
      return {
        Currency: "256.65",
        Input: "Testiamo l'input",
      };
    },
  };
});
