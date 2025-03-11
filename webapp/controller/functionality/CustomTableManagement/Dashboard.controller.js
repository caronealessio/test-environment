sap.ui.define(
  [
    "../../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/controller/functionality/CustomTableManagement/library.controller",
  ],
  function (BaseController, JSONModel, mockdata, CustomTableManagement) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.CustomTableManagement.Dashboard", {
      CustomTableManagement: new CustomTableManagement(this),
      onInit: function () {
        this.setModel(new JSONModel(mockdata.Users()), "Users");
        this.setModel(new JSONModel(mockdata.Items()), "Items");
      },

      onBack: function () {
        this.getRouter().navTo("home");
      },
    });
  }
);
