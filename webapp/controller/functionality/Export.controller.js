sap.ui.define(
  ["../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],
  function (BaseController, JSONModel, mockdata, Export) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Export", {
      onBack: function () {
        this.getRouter().navTo("home");
      },

      onAfterRendering: function () {},
    });
  }
);
