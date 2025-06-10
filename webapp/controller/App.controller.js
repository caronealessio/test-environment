//@ts-check

sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/tnt/NavigationListItem",
    "sap/m/MessageBox",
    "testenvironment/util/crudUtils",
  ],
  function (BaseController, JSONModel, NavigationListItem, MessageBox, crudUtils) {
    "use strict";

    return BaseController.extend("testenvironment.controller.App", {
      onInit: function () {
        sap.ui.getCore().getEventBus().subscribe("MenuChannel", "MenuUpdated", this._loadMenu, this);

        this.oMenu = this.byId("menu");
        this.oMenuList = this.byId("menuList");
      },

      onAfterRendering: function () {
        this._loadMenu();
      },

      async _loadMenu() {
        this.setBusy(true);

        try {
          const oMenuResults = await this.read("menu", {
            filters: {
              isVisible: 1,
            },
            order: "pos:asc",
          });

          this.oMenuList.removeAllItems();

          let itemsMap = {};

          oMenuResults.data.forEach((item) => {
            const oMenu = new NavigationListItem({
              key: item.target,
              text: item.description,
              icon: item.icon,
            });

            itemsMap[item.id] = oMenu;

            this.oMenuList.addItem(oMenu);
          });
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onMenuSelect: function (oEvent) {
        const sKey = oEvent.getParameter("item").getKey();
        this.navTo(sKey);
      },

      onCollapseExpandPress: function () {
        const bExpanded = this.oMenu.getExpanded();

        this.oMenu.setExpanded(!bExpanded);
      },
    });
  }
);
