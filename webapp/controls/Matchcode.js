sap.ui.define(
  [
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/comp/filterbar/FilterBar",
    "sap/m/SearchField",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/table/Column",
    "sap/ui/model/json/JSONModel",
  ],
  function (
    ValueHelpDialog,
    FilterBar,
    SearchField,
    Filter,
    FilterOperator,
    FilterGroupItem,
    Input,
    Label,
    Text,
    Column,
    JSONModel
  ) {
    "use strict";

    return ValueHelpDialog.extend("testenvironment.controls.Matchcode", {
      metadata: {
        /**
         * Properties standard:
         * - title
         * - key
         * - supportMultiselect
         */
        properties: {
          filters: {
            type: "any",
            defaultValue: [],
          },
          modelName: {
            type: "string",
            defaultValue: "",
          },
          data: {
            type: "any",
            defaultValue: [],
          },
          columns: {
            type: "any",
            defaultValue: [],
          },
          input: {
            type: "any",
            defaultValue: {},
          },
        },
      },
      init: function () {
        ValueHelpDialog.prototype.init.apply(this);

        this.attachCancel(this.close.bind(this));
        this.attachOk(this.ok.bind(this));
      },

      renderer: function (oRm, oValueHelpDialog) {
        sap.ui.comp.valuehelpdialog.ValueHelpDialogRenderer.render(oRm, oValueHelpDialog);

        oValueHelpDialog.setFilterBar(oValueHelpDialog._createFilters());
        oValueHelpDialog._createTable();
      },

      close: function () {
        this.destroy();
      },

      filter: function (oEvent) {
        var sSearchQuery = oEvent.getSource()._oBasicSearchField.getValue();
        var aSelectionSet = oEvent.getParameter("selectionSet");
        var aSearchFilters = [];

        //Creo i filtri per i vari input
        var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
          if (oControl.getValue()) {
            aResult.push(
              new Filter({
                path: oControl.getName(),
                operator: FilterOperator.Contains,
                value1: oControl.getValue(),
              })
            );
          }

          return aResult;
        }, []);

        //Recupero le colonne e creo i filtri per il SearchField
        this.getTable()
          .getColumns()
          .map((oColumn) => {
            var sValue = oColumn.getTemplate().getBindingPath("text");

            aSearchFilters.push(new Filter({ path: sValue, operator: FilterOperator.Contains, value1: sSearchQuery }));
          });

        aFilters.push(new Filter({ filters: aSearchFilters, and: false }));

        //Filtro la tabella
        this.getTableAsync().then(
          function (oTable) {
            if (oTable.bindRows) {
              oTable.getBinding("rows").filter(aFilters);
            }
            if (oTable.bindItems) {
              oTable.getBinding("items").filter(aFilters);
            }

            // This method must be called after binding update of the table.
            this.update();
          }.bind(this)
        );
      },

      ok: function (oEvent) {
        this.destroy();
      },

      _createFilters: function () {
        var oBasicSearchField = new SearchField();
        var oFilterBar = new FilterBar("", {
          advancedMode: true,
          isRunningInValueHelpDialog: true,
        });

        oFilterBar.attachSearch(this.filter.bind(this));
        oFilterBar.setBasicSearch(oBasicSearchField);

        // Trigger filter bar search when the basic search is fired
        oBasicSearchField.attachSearch(function () {
          oFilterBar.search();
        });

        var aFilters = this.getFilters();

        aFilters.map((oFilter) => {
          var oFilterGroupItem = new FilterGroupItem("", {
            groupName: "__$INTERNAL$",
            label: oFilter.label,
            visibleInFilterBar: true,
            name: oFilter.name,
          });

          oFilterGroupItem.setControl(new Input("", { name: oFilter.name }));

          oFilterBar.addFilterGroupItem(oFilterGroupItem);
        });

        return oFilterBar;
      },

      _createTable: function () {
        var sModel = this.getModelName();
        var aData = this.getData();
        var aColumns = this.getColumns();

        this.getTableAsync().then(
          async function (oTable) {
            oTable.setModel(new JSONModel(aData), sModel);

            oTable.bindAggregation("rows", { path: `${sModel}>/` });

            aColumns.map((oColumn) => {
              this._createColumn(oTable, oColumn.label, oColumn.property);
            });

            this.update();
          }.bind(this)
        );
      },

      _createColumn: function (oTable, sLabel, sProperty, sWidth = "auto") {
        var sModel = this.getModelName();
        var oColumn = new Column({
          label: new Label({ text: sLabel }),
          template: new Text({ wrapping: false, text: `{${sModel}>${sProperty}}` }),
          width: sWidth,
        });

        oTable.addColumn(oColumn);
      },

      getFilters: function () {
        return this.getProperty("filters");
      },

      getModelName: function () {
        return this.getProperty("modelName");
      },

      getData: function () {
        return this.getProperty("data");
      },

      getColumns: function () {
        return this.getProperty("columns");
      },

      getInput: function () {
        return this.getProperty("input");
      },
    });
  }
);
