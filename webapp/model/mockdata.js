sap.ui.define([], function () {
  "use strict";

  return {
    Functionality: function () {
      return [
        { Text: "Formattazione Standard Tabelle", Route: "StandardTableManagement" },
        { Text: "Formattazione Custom Tabelle", Route: "" },
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
  };
});
