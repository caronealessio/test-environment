sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/controller/functionality/StandardTableManagement.controller",
  ],

  function (BaseController, JSONModel, mockdata, StandardTableManagement) {
    "use strict";

    return BaseController.extend("testenvironment.controller.Home", {
      mockdata: mockdata,
      StandardTableManagement: new StandardTableManagement(this),

      onInit: function () {
        this.setModel(new JSONModel(mockdata.Functionality()), "Functionality");
        this.setModel(new JSONModel(mockdata.Users()), "Home");
      },

      onAfterRendering: function () {
        this.StandardTableManagement.registerForP13n(this, ["tblHome"]);
      },

      onFunctionality: function (oEvent) {
        var sRoute = oEvent.getParameter("item").getProperty("key");

        this.getRouter().navTo(sRoute);
      },
    });
  }
);
