sap.ui.define(
  [
    "../../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/controller/functionality/Export/library.controller",
  ],
  function (BaseController, JSONModel, mockdata, Export) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Export.Dashboard", {
      Export: new Export(this),
      onInit: function () {
        this.setModel(new JSONModel({}));
        this.setModel(new JSONModel(mockdata.Export()), "Export");
      },

      onBack: function () {
        window.history.go(-1);
      },

      onExport: function () {
        var aData = this.getModel("Export").getData();
        this.Export.setExportSettings(this, "tblExport", "Esporta", aData);
      },
    });
  }
);
