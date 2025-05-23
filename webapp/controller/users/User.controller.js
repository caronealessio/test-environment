// @ts-check

sap.ui.define(
  ["../BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  function (BaseController, JSONModel, MessageBox) {
    "use strict";

    return BaseController.extend("testenvironment.controller.users.User", {
      onInit: function () {
        this.getRouter().getRoute("user").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: async function (oEvent) {
        this.sId = oEvent.getParameter("arguments").id;
      },
    });
  }
);
