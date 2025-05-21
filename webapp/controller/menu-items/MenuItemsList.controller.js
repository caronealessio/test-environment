// @ts-check

sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/class/MenuItem",
    "testenvironment/util/tableUtils",
    "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel, MenuItem, tableUtils, MessageBox) {
    "use strict";

    return BaseController.extend("testenvironment.controller.menu-items.MenuItemsList", {
      onInit: function () {
        this.getRouter().getRoute("menuItems").attachPatternMatched(this._onObjectMatched, this);

        this.setModel(new JSONModel({}), "MenuItems");

        this.oMenuItemsTable = this.byId("menuItemsTable");
        this.oModelMenuItems = this.getModel("MenuItems");
      },

      _onObjectMatched: async function () {
        /** @type {MenuItemTypes[]} */
        this.aMenuItems = await this.read("menu-items");

        this.oModelMenuItems.setData(this.aMenuItems);
      },

      onCreate: function () {
        this.navTo("menuItemForm", { id: "create" });
      },

      onDelete: async function (oEvent) {
        const aSelectedItems = tableUtils.getSelectedItems(this.oMenuItemsTable);
        const aIds = aSelectedItems.map((x) => x.id);

        await this.delete("menu-items", aIds);

        this._onObjectMatched();
      },

      onEdit: async function (oEvent) {
        const aSelectedItems = tableUtils.getSelectedItems(this.oMenuItemsTable);
        const id = aSelectedItems[0].id;

        this.navTo("menuItemForm", { id: id });
      },

      onSelectionChange: function (oEvent) {
        const aSelectedIndices = this.oMenuItemsTable.getSelectedIndices();
        const iSelectedCount = aSelectedIndices.length;

        this.byId("editButton").setEnabled(iSelectedCount === 1);
        this.byId("deleteButton").setEnabled(iSelectedCount > 0);
      },

      onVisibleChange: function (oEvent) {
        const bState = oEvent.getParameter("state");
        const oSwitch = oEvent.getSource();
        const oContext = oSwitch.getBindingContext("MenuItems");
        const oSelectedItem = oContext.getObject();

        this.setBusy(true);

        try {
          this.edit("menu-items", oSelectedItem.id, { ...oSelectedItem, isVisible: bState ? 1 : 0 });
        } catch (error) {
          console.log("ciao");
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },
    });
  }
);
