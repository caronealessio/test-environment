sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/controller/functionality/StandardTableManagement.controller",
  ],
  function (BaseController, JSONModel, mockdata, StandardTableManagement) {
    "use strict";

    return BaseController.extend("testenvironment.controller.page.StandardTableManagement", {
      StandardTableManagement: new StandardTableManagement(this),
      onInit: function () {
        this.setModel(new JSONModel(mockdata.Users()), "Users");
      },

      onAfterRendering: function () {
        this.StandardTableManagement.registerForP13n(this, ["tblDefault", "tblItems"]);
      },

      onBack: function () {
        window.history.go(-1);
      },
    });
  }
);
