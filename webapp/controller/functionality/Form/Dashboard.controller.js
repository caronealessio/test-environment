sap.ui.define(
  ["../../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],
  function (BaseController, JSONModel, mockdata) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Form.Dashboard", {
      onInit: function () {
        this.setModel(new JSONModel({}));
        this.setModel(new JSONModel(mockdata.Form()), "Form");
      },

      onBack: function () {
        window.history.go(-1);
      },
    });
  }
);
