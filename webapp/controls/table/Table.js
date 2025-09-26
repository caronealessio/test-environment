sap.ui.define(
  [
    "sap/ui/table/Table",
    "sap/ui/table/Column",
    "sap/ui/core/Control",
    "sap/ui/table/rowmodes/Fixed",
    "sap/m/OverflowToolbar",
    "testenvironment/controls/table/Paginator",
    "sap/m/ToolbarSpacer",
    "sap/ui/core/library",
  ],

  function (Table, Column, Control, Fixed, OverflowToolbar, Paginator, ToolbarSpacer, coreLibrary) {
    "use strict";

    const SortOrder = coreLibrary.SortOrder;

    return Table.extend("testenvironment.controls.table.Table", {
      metadata: {
        properties: {
          cols: { type: "object[]", defaultValue: "[]" },
          rowCount: { type: "int", defaultValue: 20 },
          paginator: { type: "object" },
          order: { type: "object[]", defaultValue: [] },
        },
        events: {
          sorting: {},
        },
      },

      init: function () {
        Table.prototype.init.call(this);
      },

      /**
       * @override
       * @param {object} mSettings <p>the settings to apply to this managed object</p>
       * @param {object} [oScope] <p>Scope object to resolve types and formatters</p>
       * @returns {this}
       */
      applySettings: function (mSettings, oScope) {
        Table.prototype.applySettings.apply(this, arguments);

        this.setRowMode(
          new Fixed({
            rowCount: mSettings.rowCount,
          })
        );

        this.setFooter(
          new OverflowToolbar({
            style: "Clear",
            content: [
              mSettings.paginator.align === "End" || mSettings.paginator.align === "Center"
                ? new ToolbarSpacer()
                : null,
              new Paginator({
                top: mSettings.paginator.top,
                skip: mSettings.paginator.skip,
                count: mSettings.paginator.count,
                press: mSettings.paginator.press,
              }),
              mSettings.paginator.align === "Center" || mSettings.paginator.align === "Start"
                ? new ToolbarSpacer()
                : null,
            ],
          })
        );

        this._createColumns();

        this.attachSort((oEvent) => {
          if (this?.mEventRegistry?.sorting) {
            this._customSort(oEvent);
          }
        });
      },

      renderer: function (oRm, oTable) {
        sap.ui.table.TableRenderer.render(oRm, oTable);
      },

      setOrder: function (aOrder) {
        aOrder.forEach((o) => {
          const oColumn = this.getColumns().filter(
            (c) => c.getAggregation("template").getBindingPath("text") === o.name
          )?.[0];

          if (oColumn) {
            oColumn.setSortOrder(o.order === "asc" ? SortOrder.Ascending : SortOrder.Descending);
            oColumn.setSorted(true);
          }
        });

        this.setProperty("order", aOrder);
      },

      _customSort: function (oEvent) {
        oEvent.preventDefault();
        const oColumn = oEvent.getParameter("column");
        const sSortProperty = oColumn.getSortProperty();
        const sSortOrder = oEvent.getParameter("sortOrder") === sap.ui.core.SortOrder.Ascending ? "asc" : "desc";
        const bIsNone = oColumn.getSortOrder() === oEvent.getParameter("sortOrder");

        oColumn.setSortOrder(bIsNone ? sap.ui.core.SortOrder.None : oEvent.getParameter("sortOrder"));
        oColumn.setSorted(!bIsNone);

        const oSortObject = { name: sSortProperty, order: sSortOrder };

        let aOrder = this.getOrder();

        if (bIsNone) {
          aOrder = aOrder.filter((i) => i.name !== oSortObject.name);
        } else {
          const iIndex = aOrder.findIndex((o) => o.name === oSortObject.name);

          if (iIndex !== -1) {
            aOrder[iIndex].order = oSortObject.order;
          } else {
            aOrder.push(oSortObject);
          }
        }

        this.setOrder(aOrder);
        this.fireEvent("sorting");
      },

      _createColumns: function () {
        const aCols = this.getCols();
        const sModel = this.getBindingInfo("rows").model;

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
                    path: `${sModel}>${col.property}`,
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
    });
  }
);
