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
        this.getRouter().getRoute("RouteHome").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: async function () {
        /** @type {MenuItemTypes[]} */
        var aMenuItem = await this.getDataBE("menu-item");

        this.setModel(new JSONModel(aMenuItem), "MenuItem");
      },

      onMenuItemPress: function (oEvent) {
        var sRoute = oEvent.getParameter("item").getProperty("key");

        this.getRouter().navTo(sRoute);
      },
    });
  }
);
