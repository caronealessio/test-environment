sap.ui.define(
  ["sap/ui/table/Table", "sap/ui/table/Column", "sap/ui/core/Control", "sap/ui/table/rowmodes/Fixed"],
  function (Table, Column, Control, FixedRowMode) {
    "use strict";

    return Table.extend("testenvironment.controls.Table", {
      metadata: {
        properties: {
          cols: { type: "object[]", defaultValue: "[]" },
          rowCount: { type: "int", defaultValue: 20 },
        },
      },

      init: function () {
        Table.prototype.init.call(this);

        this._columnsCreated = false;
      },

      onAfterRendering: function (oEvent) {
        Table.prototype.onAfterRendering.call(this);

        this._sModel = this.getBindingInfo("rows").model;

        if (!this._columnsCreated) {
          this._createColumns();

          this.setRowMode(
            new FixedRowMode({
              rowCount: this.getRowCount(),
            })
          );

          this._columnsCreated = true;
        }
      },

      _createColumns: function () {
        const aCols = this.getCols();

        this.removeAllColumns();

        aCols.forEach(function (col) {
          let oControl = {};

          if (col.customControl) {
            oControl = col.customControl;
          } else {
            switch (col.component) {
              case "button":
                oControl = new sap.m.Button({
                  icon: col.icon,
                  tooltip: col.tooltip,
                  press: col.press || function () {},
                  type: col.type,
                });
                break;
              default:
                oControl = new sap.m.Text({
                  text: {
                    path: `${this._sModel}>${col.property}`,
                    type: col.type,
                    formatOptions: { pattern: col.pattern },
                  },
                });
                break;
            }
          }

          this.addColumn(
            new Column({
              label: new sap.m.Label({ text: col.label }),
              template: oControl,
              sortProperty: col.sortProperty,
              filterProperty: col.filterProperty,
              width: col.width,
              hAlign: col.hAlign,
            })
          );
        }, this);
      },

      renderer: function (oRm, oTable) {
        sap.ui.table.TableRenderer.render(oRm, oTable);
      },
    });
  }
);
