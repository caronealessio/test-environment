sap.ui.define(
  ["../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],
  function (BaseController, JSONModel, mockdata) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Form", {
      onInit: function () {
        this.setModel(new JSONModel({}));
        this.setModel(new JSONModel(mockdata.Form()), "Form");
      },

      onBack: function () {
        window.history.go(-1);
      },

      onDialogCustom: async function (oEvent) {
        switch (oEvent.getSource().data("button")) {
          case "Open":
            this._oDialogCustom = await this.loadFragment("testenvironment.view.functionality.Form.DialogCustom");
            this._oDialogCustom.open();
            break;
        }
      },

      onDialogStandard: async function (oEvent) {
        switch (oEvent.getSource().data("button")) {
          case "Open":
            this._oDialogStandard = await this.loadFragment("testenvironment.view.functionality.Form.DialogStandard");
            this._oDialogStandard.open();
            break;
          case "Close":
            this._oDialogStandard.destroy();
            this._oDialogStandard = undefined;
        }
      },
    });
  }
);
