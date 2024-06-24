sap.ui.define(["../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"], function (BaseController, JSONModel, mockdata) {
  "use strict";

  return BaseController.extend("testenvironment.controller.functionality.StandardTableManagement", {
    onInit: function () {
      this.setModel(new JSONModel(mockdata.DefaultTable()), "DefaultTable");
    },

    onBack: function () {
      window.history.go(-1);
    },


  });
});
