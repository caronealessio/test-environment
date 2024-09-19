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
        console.log(moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"));
      },
    });
  }
);
