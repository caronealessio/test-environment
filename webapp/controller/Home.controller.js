sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],

  function (BaseController, JSONModel, mockdata) {
    "use strict";

    return BaseController.extend("testenvironment.controller.Home", {
      mockdata: mockdata,

      onInit: function () {
        this.setModel(new JSONModel(mockdata.Functionality()), "Functionality");
      },

      onFunctionality: function (oEvent) {
        var oRoute = oEvent.getParameter("item").getProperty("key");

        this.getRouter().navTo(oRoute);
      },
    });
  }
);
