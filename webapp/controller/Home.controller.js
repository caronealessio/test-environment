// @ts-check

sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/controller/functionality/StandardTableManagement/library.controller",
    "testenvironment/model/formatter",
  ],

  function (BaseController, JSONModel, LibraryController, formatter) {
    "use strict";
    return BaseController.extend("testenvironment.controller.Home", {
      onInit: function () {
        this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: async function () {},

      onTest: function () {
        var currentTheme = sap.ui.getCore().getConfiguration().getTheme();

        var newTheme = currentTheme === "sap_fiori_3" ? "sap_fiori_3_dark" : "sap_fiori_3";

        sap.ui.getCore().applyTheme(newTheme);
      },
    });
  }
);
