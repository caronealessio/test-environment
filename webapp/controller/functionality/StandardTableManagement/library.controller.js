sap.ui.define(
  [
    "../../BaseController",
    "sap/m/p13n/MetadataHelper",
    "sap/m/p13n/Engine",
    "sap/m/p13n/SelectionController",
    "sap/m/p13n/SortController",
    "sap/m/p13n/GroupController",
    "sap/m/table/ColumnWidthController",
    "sap/ui/core/library",
    "sap/ui/model/Sorter",
  ],
  function (
    BaseController,
    MetadataHelper,
    Engine,
    SelectionController,
    SortController,
    GroupController,
    ColumnWidthController,
    CoreLibrary,
    Sorter
  ) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.StandardTableManagement.library", {
      onTableSettings: function (oEvent) {
        this.sIdTable = oEvent.getSource().data("idTable");
        var oTable = this.getView().byId(this.sIdTable);
        this._oMetadataHelper = this.StandardTableManagement._getMetadataHelper(oTable.getColumns());

        if (!oTable) {
          return;
        }

        Engine.getInstance().show(oTable, ["Columns", "Sorter"], {
          contentHeight: "35rem",
          contentWidth: "32rem",
          source: oEvent.getSource(),
        });

        var aStateChange = Engine.getInstance()?.stateHandlerRegistry?.mEventRegistry?.stateChange;
        if (aStateChange?.length > 0) {
          Engine.getInstance().detachStateChange(aStateChange[0].fFunction);
        }

        Engine.getInstance().attachStateChange(this.StandardTableManagement._handleStateChange.bind(this));
      },

      onSort: function (oEvt) {
        this.sIdTable = oEvt.getSource().getId();
        var oTable = this.byId(this.sIdTable);
        this._oMetadataHelper = this._getMetadataHelper(oTable.getColumns());

        var sAffectedProperty = this.StandardTableManagement._getKey(self, oEvt.getParameter("column"));
        var sSortOrder = oEvt.getParameter("sortOrder");

        Engine.getInstance()
          .retrieveState(oTable)
          .then(function (oState) {
            oState.Sorter.forEach(function (oSorter) {
              oSorter.sorted = false;
            });
            oState.Sorter.push({
              key: sAffectedProperty,
              descending: sSortOrder === CoreLibrary.SortOrder.Descending,
            });

            Engine.getInstance().applyState(oTable, oState);
          });
      },

      registerForP13n: function (self, aIdList) {
        aIdList.map((sId) => {
          var oTable = self.byId(sId);
          self._oMetadataHelper = self.StandardTableManagement._getMetadataHelper(oTable.getColumns());

          Engine.getInstance().register(oTable, {
            helper: self._oMetadataHelper,
            controller: {
              Columns: new SelectionController({
                targetAggregation: "columns",
                control: oTable,
              }),
              Sorter: new SortController({
                control: oTable,
              }),
              Groups: new GroupController({
                control: oTable,
              }),
              ColumnWidth: new ColumnWidthController({
                control: oTable,
              }),
            },
          });
        });
      },

      _handleStateChange: function (oEvent) {
        var oTable = this.byId(this.sIdTable);
        var oState = oEvent.getParameter("state");

        if (Object.keys(oState).length === 0 && oState.constructor === Object) {
          return;
        }

        oTable.getColumns().forEach(
          function (oColumn) {
            oColumn.setVisible(false);
            oColumn.setSortOrder(CoreLibrary.SortOrder.None);
          }.bind(this)
        );

        oState.Columns.forEach(
          function (oProp, iIndex) {
            var oCol = this.byId(oProp.key);
            oCol.setVisible(true);

            oTable.removeColumn(oCol);
            oTable.insertColumn(oCol, iIndex);
          }.bind(this)
        );

        var aSorter = [];
        oState.Sorter.forEach(
          function (oSorter) {
            var oColumn = this.byId(oSorter.key);
            /** @deprecated As of version 1.120 */
            oColumn.setSorted(true);
            oColumn.setSortOrder(
              oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending
            );
            aSorter.push(new Sorter(this._oMetadataHelper.getProperty(oSorter.key)?.path, oSorter.descending));
          }.bind(this)
        );
        if (oTable.getBinding("rows")) {
          oTable.getBinding("rows").sort(aSorter);
        }
      },

      _getMetadataHelper: function (aColumns) {
        var aMetadata = [];
        var sPath, oTemplate, sComponent;

        aMetadata = aColumns.map((oColumn) => {
          oTemplate = oColumn.getTemplate();
          sComponent = oTemplate.getMetadata()._sUIDToken;

          switch (sComponent) {
            case "text": {
              sPath = oTemplate.getBindingPath("text");
              break;
            }
            case "currency": {
              sPath = oTemplate.getBindingInfo("value")?.parts[0].path;
              break;
            }
            case "icon": {
              sPath = oTemplate.getBindingInfo("src").parts[0].path;
              break;
            }
            default: {
              sPath = oTemplate.getBindingPath("text");
              break;
            }
          }
          var oMetadata = {
            key: oColumn.getId().split("-").pop(),
            label: oColumn.getLabel().getText(),
            path: sPath,
          };
          return oMetadata;
        });
        return new MetadataHelper(aMetadata);
      },

      _getKey: function (self, oControl) {
        return self.getView().getLocalId(oControl.getId());
      },
    });
  }
);
