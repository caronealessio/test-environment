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
        sap.ui.getCore().getEventBus().subscribe("MenuChannel", "MenuUpdated", this._loadMenuItems, this);

        this.oMenu = this.byId("menu");
        this.oMenuList = this.byId("menuList");
      },

      onAfterRendering: function () {
        this._loadMenuItems();
      },

      async _loadMenuItems() {
        this.setBusy(true);

        try {
          const sQuery = crudUtils.buildQueryString({
            isVisible: 1,
          });

          const oMenuResults = await this.read("menu-items", sQuery);

          this.oMenuList.removeAllItems();

          let itemsMap = {};

          oMenuResults.forEach((item) => {
            const oMenuItem = new NavigationListItem({
              key: item.key,
              text: item.description,
              icon: item.icon,
            });

            itemsMap[item.id] = oMenuItem;

            this.oMenuList.addItem(oMenuItem);
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
