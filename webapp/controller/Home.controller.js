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

        /** @type {MenuItemTypes[]} */
        this.aMenuItems = [];
      },

      _onObjectMatched: async function () {
        this.aMenuItems = await this.read("menu-items");

        this.setModel(new JSONModel(this.aMenuItems), "MenuItems");
      },

      onMenuItemPress: function (oEvent) {
        var sRoute = oEvent.getParameter("item").getProperty("key");

        this.getRouter().navTo(sRoute);
      },

      onTest: function () {
        // this.create("menu-items/create", {
        //   title: "Test",
        //   router: "RouteTest",
        // }).then(async () => {
        //   this.aMenuItem = await this.read("menu-item");

        //   this.setModel(new JSONModel(this.aMenuItems), "MenuItems");
        // });
        var currentTheme = sap.ui.getCore().getConfiguration().getTheme();

        var newTheme = currentTheme === "sap_fiori_3" ? "sap_fiori_3_dark" : "sap_fiori_3";

        sap.ui.getCore().applyTheme(newTheme);
      },

      onConfigMenuItem: function () {
        this.navTo("menuItems");
      },
    });
  }
);
