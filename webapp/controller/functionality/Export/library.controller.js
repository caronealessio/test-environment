sap.ui.define(
  ["../../BaseController", "sap/ui/export/Spreadsheet", "sap/ui/export/library"],
  function (BaseController, Spreadsheet, ExportType) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Export.library", {
      setExportSettings: async function (self, sIdTable, sFileName, aData) {
        if (!sIdTable || !aData.length) {
          if (!sIdTable) return;
          MessageBox.error(self.getResourceBundle().getText("msgNoData"));
          return;
        }

        var oTable = self.getView().byId(sIdTable);
        var aCols = self.Export.createMcColumnConfig(oTable.getColumns());

        var oSheet = new Spreadsheet({
          workbook: { columns: aCols },
          dataSource: aData,
          fileName: sFileName,
        });

        oSheet.build().finally(() => oSheet.destroy());
      },

      createMcColumnConfig: function (aColumns) {
        const EDM_TYPE = ExportType.EdmType;
        const configMap = {
          date: { type: EDM_TYPE.Date, format: "dd.mm.yyyy" },
          currency: { type: EDM_TYPE.Number, delimiter: true, scale: 2 },
          boolean: { type: EDM_TYPE.Boolean, trueValue: "X", falseValue: " " },
          time: { type: EDM_TYPE.Time },
          integer: { type: EDM_TYPE.Number },
          default: { type: EDM_TYPE.String },
        };

        return aColumns.reduce((aConfig, oColumn) => {
          var sProperty = this.getFieldProperty(oColumn.getTemplate());
          var sType = this.getFieldType(oColumn.getTemplate());

          if (!sProperty) return aConfig;

          var oConfig = {
            label: oColumn.getLabel().getText(),
            property: sProperty,
            ...(configMap[sType] || configMap.default),
          };

          aConfig.push(oConfig);
          return aConfig;
        }, []);
      },
    });
  }
);
