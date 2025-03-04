sap.ui.define(
  ["sap/m/Button", "sap/ui/export/Spreadsheet", "testenvironment/util/generalUtils"],
  function (Button, Spreadsheet, generalUtils) {
    "use strict";

    return Button.extend("testenvironment.controls.ExportButton", {
      metadata: {
        properties: {
          text: { type: "string", defaultValue: "" },
          icon: { type: "string", defaultValue: "sap-icon://excel-attachment" },
          tooltip: { type: "string", defaultValue: "Esporta" },
          modelPath: { type: "string" },
          tableId: { type: "string" }, //Required
          fileName: { type: "string", defaultValue: "export.xlsx" },
        },
      },

      init: function () {
        Button.prototype.init.call(this);

        this.attachPress(this.onExportPress.bind(this));
      },

      renderer: function (oRm, oButton) {
        sap.m.ButtonRenderer.render(oRm, oButton);
      },

      onExportPress: async function () {
        try {
          const sTableId = this.getTableId();
          const sFileName = this.getFileName();
          const oModel = this.getModel(this.getModelPath());

          const oTable = sTableId ? generalUtils.findComponentById(this, sTableId) : this.getParent().getParent();

          if (!oTable) {
            throw new Error("Tabella non trovata");
          }

          const oBinding = oTable.getBinding("rows");
          const aData = oBinding.getModel().getProperty(oBinding.getPath());

          if (!aData.length) {
            sap.m.MessageBox.error("Nessun dato disponibile per l'esportazione.");
            return;
          }

          const aCols = this.createMcColumnConfig(oTable.getColumns());

          const oSheet = new Spreadsheet({
            workbook: { columns: aCols },
            dataSource: aData,
            fileName: sFileName,
          });

          await oSheet.build().finally(() => oSheet.destroy());
        } catch (error) {
          sap.m.MessageBox.error(`Errore durante l'esportazione: ${error}`);
        }
      },

      createMcColumnConfig: function (aColumns) {
        const EDM_TYPE = sap.ui.export.EdmType;
        const configMap = {
          date: { type: EDM_TYPE.Date, format: "dd.mm.yyyy" },
          currency: { type: EDM_TYPE.Number, delimiter: true, scale: 2 },
          boolean: { type: EDM_TYPE.Boolean, trueValue: "X", falseValue: " " },
          time: { type: EDM_TYPE.Time },
          integer: { type: EDM_TYPE.Number },
          default: { type: EDM_TYPE.String },
        };

        return aColumns.reduce((aConfig, oColumn) => {
          const sProperty = generalUtils.getFieldProperty(oColumn.getTemplate());
          const sType = generalUtils.getFieldType(oColumn.getTemplate());

          if (!sProperty) return aConfig;

          const oConfig = {
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
