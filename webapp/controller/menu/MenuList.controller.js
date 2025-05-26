// @ts-check

sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/class/MenuItem",
    "testenvironment/util/tableUtils",
    "sap/m/MessageBox",
    "testenvironment/util/crudUtils",
  ],
  function (BaseController, JSONModel, MenuItem, tableUtils, MessageBox, crudUtils) {
    "use strict";

    return BaseController.extend("testenvironment.controller.menu.MenuList", {
      onInit: function () {
        this.getRouter().getRoute("menuList").attachPatternMatched(this._onObjectMatched, this);

        this.oModelMenuItems = this.setModel(new JSONModel([]), "MenuItems");

        this.oMenuItemsTable = this.byId("menuItemsTable");
      },

      _onObjectMatched: async function () {
        this.setBusy(true);

        try {
          /** @type {MenuItemTypes[]} */
          const oResults = await this.read("menu");

          this.oModelMenuItems.setData(oResults);
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onCreate: function () {
        this.navTo("menuItem", { id: "create" });
      },

      onDelete: async function (oEvent) {
        const oItem = oEvent.getSource().getParent().getBindingContext("MenuItems").getObject();

        this.setBusy(true);

        try {
          await this.delete("menu", [oItem.id]);
          const oResults = await this.read("menu");

          this.oModelMenuItems.setData(oResults);

          sap.ui.getCore().getEventBus().publish("MenuChannel", "MenuUpdated");
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onEdit: async function (oEvent) {
        const oItem = oEvent.getSource().getParent().getBindingContext("MenuItems").getObject();

        this.navTo("menuItem", { id: oItem.id });
      },

      onVisibleChange: async function (oEvent) {
        const bState = oEvent.getParameter("state");
        const oItem = oEvent.getSource().getParent().getBindingContext("MenuItems").getObject();

        this.setBusy(true);

        try {
          await this.edit("menu", oItem.id, { ...oItem, isVisible: bState ? 1 : 0 });

          sap.ui.getCore().getEventBus().publish("MenuChannel", "MenuUpdated");
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onSearchFieldChange: async function (oEvent) {
        let sValue = oEvent.getParameter("value");

        const sQuery = crudUtils.buildQueryString({
          search: sValue,
        });

        this.setBusy(true);

        try {
          const oResults = await this.read("menu", sQuery);

          this.oModelMenuItems.setData(oResults);
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },
    });
  }
);
