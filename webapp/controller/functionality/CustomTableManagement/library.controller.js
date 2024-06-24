sap.ui.define(
  [
    "../../BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "testenvironment/model/constants",
  ],
  function (BaseController, JSONModel, CoreLibrary, Filter, FilterOperator, constants) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.CustomTableManagement.library", {
      /**
       * Quando si vuole aggiungere la formattazione custom delle colonne di una UI Table
       * bisogna aggiungere:
       * formatter: disableLastButtonsFromArray
       * css: removeLineColumn
       * i18n: labelLayoutSettings, labelField, btnOk, btnClose
       * BaseController: loadFragment
       * constants: BEGINNING, UP, DOWN, END
       */

      onTableSettings: async function (oEvent) {
        this.sIdTable = oEvent.getSource().data("idTable");
        var oTable = this.getView().byId(this.sIdTable);

        var aCols = oTable.getColumns();

        var aColsFormatted = [];

        aCols.map((oCol) => {
          aColsFormatted.push({
            key: oCol.getId().split("-").pop(),
            label: oCol.getAggregation("label").getText(),
            visible: oCol.getProperty("visible"),
          });
        });

        var oSettings = {
          title: this.CustomTableManagement._getTitle(this, aColsFormatted),
          cols: aColsFormatted,
        };

        this.setModel(new JSONModel(oSettings), "TableSettings");

        if (!this._oDialogTableSettings) {
          this._oDialogTableSettings = await this.loadFragment(
            "testenvironment.view.functionality.CustomTableManagement.SettingsMenu"
          );
        }

        this._oDialogTableSettings.open();

        var oTableSettings = this.getView().byId("layout_tblSettings");

        oSettings.cols.map((oCol, index) => {
          if (oCol.visible) {
            oTableSettings.addSelectionInterval(index, index);
          }
        });
      },

      onTableSettingsClose: function () {
        this._oDialogTableSettings.destroy();
        this._oDialogTableSettings = undefined;
      },

      onTableSettingsChange: function (oEvent) {
        var oModelTableSettings = this.getModel("TableSettings");
        var aCols = oModelTableSettings.getProperty("/cols");
        var iIndex = oEvent.getParameter("rowIndex");

        if (!oEvent.getParameter("userInteraction")) {
          return;
        }

        if (oEvent.getParameter("selectAll") || iIndex === -1) {
          aCols.map((x, index) => {
            oModelTableSettings.setProperty("/cols/" + index + "/visible", iIndex === 0);
          });

          oModelTableSettings.setProperty("/title", this.CustomTableManagement._getTitle(this, aCols));
          return;
        }

        var sPath = oEvent.getParameter("rowContext").getPath() + "/visible";

        oModelTableSettings.setProperty(sPath, !oModelTableSettings.getProperty(sPath));
        oModelTableSettings.setProperty("/title", this.CustomTableManagement._getTitle(this, aCols));
      },

      onTableSettingsOk: function () {
        var oTable = this.getView().byId(this.sIdTable);
        var aCols = this.getModel("TableSettings").getProperty("/cols");
        var aVisibleCols = aCols.filter((oCol) => oCol.visible === true);

        oTable.getColumns().forEach(
          function (oColumn) {
            oColumn.setVisible(false);
            oColumn.setSortOrder(CoreLibrary.SortOrder.None);
          }.bind(this)
        );

        aVisibleCols?.forEach(
          function (oProp, iIndex) {
            var oCol = this.byId(oProp.key);
            oCol.setVisible(true);

            oTable.removeColumn(oCol);
            oTable.insertColumn(oCol, iIndex);
          }.bind(this)
        );

        this._oDialogTableSettings.destroy();
        this._oDialogTableSettings = undefined;
      },

      onTableSettingsSearch: function (oEvent) {
        var sValue = oEvent.getParameter("newValue");
        var oModelTableSettings = this.getModel("TableSettings");
        var aCols = oModelTableSettings.getProperty("/cols");
        var aFilters = [];
        var oColBeginning = this.byId("layout_clnBeginning");
        var oColUp = this.byId("layout_clnUp");
        var oColDown = this.byId("layout_clnDown");
        var oColEnd = this.byId("layout_clnEnd");

        oColBeginning.setVisible(sValue ? false : true);
        oColUp.setVisible(sValue ? false : true);
        oColDown.setVisible(sValue ? false : true);
        oColEnd.setVisible(sValue ? false : true);

        if (sValue) {
          var oFilter = new Filter("label", FilterOperator.Contains, sValue);
          aFilters.push(oFilter);
        }

        var oTable = this.byId("layout_tblSettings");
        var oBinding = oTable.getBinding("rows").filter(aFilters);
        var aFilteredColumns = [];

        aCols.map((oCol, iIndex) => {
          if (oBinding.aIndices.includes(iIndex)) {
            aFilteredColumns.push(oCol);
          }
        });

        aFilteredColumns.map((oCol, index) => {
          if (oCol.visible) {
            oTable.addSelectionInterval(index, index);
          }
        });
      },

      _getTitle: function (self, aCols) {
        var bColsCount = aCols.length;
        var bVisibleColsCount = aCols.filter((oCol) => oCol.visible === true).length;
        var sTitle = self.getResourceBundle().getText("labelField") + " (" + bVisibleColsCount + "/" + bColsCount + ")";

        return sTitle;
      },

      onMoveColumn: function (oEvent) {
        var sMove = oEvent.getSource().data("Move");
        var oTable = this.getView().byId("layout_tblSettings");
        var oModelTableSettings = this.getModel("TableSettings");
        var aCols = oModelTableSettings.getProperty("/cols");

        var iIndex = parseInt(
          oEvent.getSource().getParent().getBindingContext("TableSettings").getPath().split("/").pop()
        );

        switch (sMove) {
          case constants.BEGINNING:
            aCols.unshift(aCols.splice(iIndex, 1)[0]);
            break;
          case constants.UP:
            aCols.splice(iIndex - 1, 0, aCols.splice(iIndex, 1)[0]);
            break;
          case constants.DOWN:
            aCols.splice(iIndex + 1, 0, aCols.splice(iIndex, 1)[0]);
            break;
          case constants.END:
            aCols.push(aCols.splice(iIndex, 1)[0]);
            break;
        }

        oModelTableSettings.setProperty("/cols", aCols);

        oTable.clearSelection();

        aCols.map((oCol, index) => {
          if (oCol.visible) {
            oTable.addSelectionInterval(index, index);
          }
        });
      },
    });
  }
);
