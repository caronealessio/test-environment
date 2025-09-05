// @ts-check

sap.ui.define(
  ["../BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseController, JSONModel, MessageBox) {
    "use strict";

    return BaseController.extend("testenvironment.controller.users.UsersForm", {
      onInit: function () {
        this.getRouter().getRoute("usersForm").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: async function (oEvent) {
        this.sId = oEvent.getParameter("arguments").id;
      },

      onNavBack: function () {
        this.navTo("usersList");
      },
    });
  }
);
