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

          var sType = this._getType(oColumn);
          var sProperty = this._getPoperty(oColumn);

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

      _getType: function (oColumn) {
        var oBinding;
        var oTemplate = oColumn.getTemplate();
        var sComponent = oTemplate.getMetadata().getName();

        if (oColumn?.data("type")) {
          return oColumn?.data("type");
        }

        oBinding = oBinding ?? oTemplate.getBindingInfo("text");
        oBinding = oBinding ?? oTemplate.getBindingInfo("value");

        var oType = oBinding?.type;

        if (oType) {
          if (oType?.oFormat?.type) {
            return oType?.oFormat?.type; //time
          } else if (oType?.getName()) {
            return oType?.getName().toLowerCase(); //date - currency
          }
        }

        if (sComponent === "sap.m.CheckBox") {
          return "boolean";
        }

        return null;
      },

      _getPoperty: function (oColumn) {
        var sProperty;
        var oTemplate = oColumn.getTemplate();

        sProperty = sProperty ?? oTemplate.getBindingPath("value");
        sProperty = sProperty ?? oTemplate.getBindingPath("selectedKey");
        sProperty = sProperty ?? oTemplate.getBindingPath("text");
        sProperty = sProperty ?? oTemplate.getBindingPath("selected");
        sProperty = sProperty ?? oTemplate.getBindingPath("src");
        sProperty = sProperty ?? oColumn?.data("property");

        return sProperty;
      },
    });
  }
);
