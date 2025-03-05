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

        /** @type {MenuItemTypes[]} */
        this.aMenuItem = [];
      },

      _onObjectMatched: async function () {
        this.aMenuItem = await this.read("menu-item");

        this.setModel(new JSONModel(this.aMenuItem), "MenuItem");
      },

      onMenuItemPress: function (oEvent) {
        var sRoute = oEvent.getParameter("item").getProperty("key");

        this.getRouter().navTo(sRoute);
      },

      onTest: function () {
        this.create("add-menu-item", {
          title: "Test",
          router: "RouteTest",
        }).then(async () => {
          this.aMenuItem = await this.read("menu-item");

          this.setModel(new JSONModel(this.aMenuItem), "MenuItem");
        });
      },

      onConfigMenuItem: function () {},
    });
  }
);
