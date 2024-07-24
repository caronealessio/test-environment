sap.ui.define(
  ["../../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],
  function (BaseController, JSONModel, mockdata) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Form.Form", {
      onInit: function () {
        this.setModel(new JSONModel({}));
        this.setModel(new JSONModel(mockdata.Form()), "Form");
      },

      /**
       * @override
       */
      onAfterRendering: function () {
        console.log("paginatorStandard", this.byId("paginatorStandard"));
      },

      onBack: function () {
        window.history.go(-1);
      },

      onDialogCustom: async function (oEvent) {
        this.byId("inputCustom").setRequired(true);
        this.byId("inputCustom").setLabel(">Ciaone");

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
            console.log(this._oDialogStandard);
            break;
          case "Close":
            this._oDialogStandard.destroy();
            this._oDialogStandard = undefined;
        }
      },
    });
  }
);
