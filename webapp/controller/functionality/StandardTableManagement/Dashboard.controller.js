sap.ui.define(
  [
    "../../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/controller/functionality/StandardTableManagement/library.controller",
  ],
  function (BaseController, JSONModel, mockdata, StandardTableManagement) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.StandardTableManagement.Dashboard", {
      StandardTableManagement: new StandardTableManagement(this),
      onInit: function () {
        this.setModel(new JSONModel(mockdata.Users()), "Users");
        this.setModel(new JSONModel(mockdata.Items()), "Items");
      },

      onAfterRendering: function () {
        this.StandardTableManagement.registerForP13n(this, ["tblUsers", "tblItems"]);
      },

      onBack: function () {
        this.getRouter().navTo("RouteHome");
      },
    });
  }
);
