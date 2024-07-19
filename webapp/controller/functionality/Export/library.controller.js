sap.ui.define(
  ["../../BaseController", "sap/ui/export/Spreadsheet", "sap/ui/export/library"],
  function (BaseController, Spreadsheet, ExportType) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Export.library", {
      setExportSettings: async function (self, sIdTable, sFileName, aData) {
        var oSheet;

        if (!sIdTable) {
          return;
        }

        var oTable = self.getView().byId(sIdTable);

        if (!aData.length) {
          MessageBox.error(self.getResourceBundle().getText("msgNoData"));
          return;
        }

        var aCols = self.Export.createMcColumnConfig(oTable.getColumns());
        var oSettings = {
          workbook: {
            columns: aCols,
          },
          dataSource: aData,
          fileName: sFileName,
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      createMcColumnConfig: function (aColumns) {
        const EDM_TYPE = ExportType.EdmType;

        var aConfig = [];
        aColumns.map((oColumn) => {
          var oConfig, sProperty;

          var sType = this.getFieldType(oColumn.getTemplate());
          var sProperty = this.getFieldProperty(oColumn.getTemplate());

          var oFormattedColumn = {
            label: oColumn.getLabel().getText(),
            property: sProperty,
            type: sType,
          };

          if (!oFormattedColumn.property) {
            return;
          }

          switch (oFormattedColumn.type) {
            case "date": {
              oConfig = {
                label: oFormattedColumn.label,
                property: oFormattedColumn.property,
                type: EDM_TYPE.Date,
                format: "dd.mm.yyyy",
              };
              break;
            }
            case "currency": {
              oConfig = {
                label: oFormattedColumn.label,
                property: oFormattedColumn.property,
                type: EDM_TYPE.Number,
                delimiter: true,
                scale: 2,
              };
              break;
            }
            case "boolean": {
              oConfig = {
                label: oFormattedColumn.label,
                property: oFormattedColumn.property,
                type: EDM_TYPE.Boolean,
                trueValue: "X",
                falseValue: " ",
              };
              break;
            }
            case "time": {
              oConfig = {
                label: oFormattedColumn.label,
                property: oFormattedColumn.property,
                type: EDM_TYPE.Time,
              };
              break;
            }
            case "integer": {
              oConfig = {
                label: oFormattedColumn.label,
                property: oFormattedColumn.property,
                type: EDM_TYPE.Number,
              };
              break;
            }
            default: {
              oConfig = {
                label: oFormattedColumn.label,
                property: oFormattedColumn.property,
                type: EDM_TYPE.String,
              };
              break;
            }
          }

          aConfig.push(oConfig);
        });

        return aConfig;
      },
    });
  }
);
