// @ts-check

sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/class/MenuItem",
    "testenvironment/util/tableUtils",
  ],
  function (BaseController, JSONModel, MenuItem, tableUtils) {
    "use strict";

    return BaseController.extend("testenvironment.controller.menuItems.MenuItemList", {
      onInit: function () {
        this.getRouter().getRoute("menuItems").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: async function () {
        /** @type {MenuItemTypes[]} */
        this.aMenuItems = await this.read("menu-items");

        this.setModel(new JSONModel(this.aMenuItems), "MenuItems");
      },

      onCreate: function () {
        this.navTo("menuItemForm", { id: "create" });
      },

      onDelete: async function (oEvent) {
        const aSelectedItems = tableUtils.getSelectedItems(this.byId("menuItemsTable"));
        const aIds = aSelectedItems.map((x) => x.id);

        await this.delete("menu-items", aIds);

        this._onObjectMatched();
      },

      onEdit: async function (oEvent) {
        const aSelectedItems = tableUtils.getSelectedItems(this.byId("menuItemsTable"));
        const id = aSelectedItems[0].id;

        this.navTo("menuItemForm", { id: id });
      },

      onSelectionChange: function (oEvent) {
        const aSelectedIndices = this.byId("menuItemsTable").getSelectedIndices();
        const iSelectedCount = aSelectedIndices.length;

        this.byId("editButton").setEnabled(iSelectedCount === 1);
        this.byId("deleteButton").setEnabled(iSelectedCount > 0);
      },

      onNavBack: function () {
        this.navTo("home");
      },
    });
  }
);
