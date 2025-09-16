sap.ui.define(
  [
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/filterbar/FilterBar",
    "sap/m/SearchField",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
  ],
  function (
    ValueHelpDialog,
    Filter,
    FilterOperator,
    FilterBar,
    SearchField,
    Column,
    Label,
    Text,
    JSONModel,
    FilterGroupItem,
    Input,
    ComboBox,
    Item
  ) {
    "use strict";

    return ValueHelpDialog.extend("testenvironment.controls.valueHelpRequest.ValueHelpRequestCustom", {
      metadata: {
        properties: {
          filters: {
            type: "any",
            defaultValue: [],
          },
          data: {
            type: "any",
            defaultValue: [],
          },
          columns: {
            type: "any",
            defaultValue: [],
          },
        },
      },

      init: function () {
        ValueHelpDialog.prototype.init.apply(this);

        this.attachOk(this.close.bind(this));
        this.attachCancel(this.close.bind(this));
      },

      renderer: function (oRm, oValueHelpDialog) {
        sap.ui.comp.valuehelpdialog.ValueHelpDialogRenderer.render(oRm, oValueHelpDialog);
      },

      /**
       * Metodo per aggiornare il dialog con le properties
       */
      applySettings: function (mSettings) {
        ValueHelpDialog.prototype.applySettings.apply(this, arguments);

        let aColumns = mSettings.columns;
        const aFilters = mSettings.filters;

        function search(oEvent) {
          const sSearchQuery = oEvent.getSource()._oBasicSearchField.getValue();
          const aSelectionSet = oEvent.getParameter("selectionSet");
          let aSearchFilters = [];

          //Creo i filtri per i vari input
          let aFilters = aSelectionSet.reduce(function (aResult, oControl) {
            let sValue = oControl.getValue ? oControl.getValue() : oControl.getSelectedKey?.();

            const sControlName = oControl.getMetadata().getName();

            switch (sControlName) {
              case "sap.m.Input":
                sValue = oControl.getValue();
                break;
              case "sap.m.ComboBox":
                sValue = oControl.getSelectedKey();
                break;
              default:
                sValue = oControl.getValue();
                break;
            }

            if (sValue) {
              aResult.push(
                new Filter({
                  path: oControl.getParent().getName(),
                  operator: FilterOperator.Contains,
                  value1: sValue,
                })
              );
            }

            return aResult;
          }, []);

          // Recupero le colonne e creo i filtri per il SearchField
          this.getTable()
            .getColumns()
            .map((oColumn) => {
              const sValue = oColumn.getTemplate().getBindingPath("text");

              aSearchFilters.push(
                new Filter({ path: sValue, operator: FilterOperator.Contains, value1: sSearchQuery })
              );
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
        }

        this.setModel(new JSONModel({ items: mSettings.data || [] }));

        if (aColumns.length > 0) {
          this.getTableAsync().then(
            async function (oTable) {
              oTable.bindRows("/items");

              aColumns.map((oColumn) => {
                oTable.addColumn(
                  new Column({
                    label: new Label({ text: oColumn.label }),
                    template: new Text({ wrapping: false, text: `{${oColumn.property}}` }),
                    width: oColumn.width || "auto",
                  })
                );
              });

              this.update();
            }.bind(this)
          );
        }

        if (aFilters.length > 0) {
          var aFilterItems = mSettings.filters.map(function (f) {
            let oControl;
            switch (f.type) {
              case "Input":
                oControl = new Input({ placeholder: f.placeholder || "" });
                break;
              case "ComboBox":
                oControl = new ComboBox({
                  items: (f.items || []).map(function (i) {
                    return new Item({ key: i.key, text: i.text });
                  }),
                });
                break;
              default:
                oControl = new Input();
            }

            return new FilterGroupItem({
              groupName: "__$INTERNAL$",
              name: f.name,
              label: f.label,
              control: oControl,
              visibleInFilterBar: true,
            });
          });

          var oBasicSearchField = new SearchField();

          const oFilterBar = new FilterBar({
            advancedMode: true,
            filterGroupItems: aFilterItems,
          });

          oFilterBar.setBasicSearch(oBasicSearchField);
          oFilterBar.attachSearch(search.bind(this));

          this.setFilterBar(oFilterBar);
        }
      },

      ok: function (oEvent) {
        this.destroy();
      },

      close: function (oEvent) {
        this.destroy();
      },
    });
  }
);
