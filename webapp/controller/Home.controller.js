sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/controller/functionality/StandardTableManagement/library.controller",
    "testenvironment/model/formatter",
    "testenvironment/libs/moment",
  ],

  function (BaseController, JSONModel, mockdata, StandardTableManagement, formatter) {
    "use strict";

    return BaseController.extend("testenvironment.controller.Home", {
      mockdata: mockdata,
      StandardTableManagement: new StandardTableManagement(this),

      onInit: function () {
        this.setModel(new JSONModel({}));
        this.setModel(new JSONModel(mockdata.Functionalities()), "Functionalities");
        this.setModel(new JSONModel(mockdata.Users()), "Home");
      },

      onFunctionality: function (oEvent) {
        var sRoute = oEvent.getParameter("item").getProperty("key");

        this.getRouter().navTo(sRoute);
      },

      onTest: function (oEvent) {
        var d = new Date("2024-11-05T12:55:46.315Z");
        var d1 = new Date();
        var d2 = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
        console.log(d2);
        console.log(d2 > d1);
        console.log(d > d1);
      },
    });
  }
);
