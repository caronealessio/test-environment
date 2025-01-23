sap.ui.define(
  ["../../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],
  function (BaseController, JSONModel, mockdata, Export) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Export.Dashboard", {
      onInit: function () {
        this.setModel(new JSONModel({}));
        this.setModel(new JSONModel(mockdata.Export()), "Export");
      },

      onBack: function () {
        this.getRouter().navTo("RouteHome");
      },
    });
  }
);
