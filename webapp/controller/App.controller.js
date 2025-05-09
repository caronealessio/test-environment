//@ts-check

sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/tnt/NavigationListItem"],
  function (BaseController, JSONModel, NavigationListItem) {
    "use strict";

    return BaseController.extend("testenvironment.controller.App", {
      onInit: function () {
        this.oMenu = this.byId("menu");
        this.oMenuList = this.byId("menuList");
      },

      onAfterRendering: function () {
        this._loadMenuItems();
      },

      async _loadMenuItems() {
        this.setBusy(true);

        try {
          const oMenuResults = await this.read("menu-items");

          this.oMenuList.removeAllItems();

          let itemsMap = {};

          console.log("MenuResults", oMenuResults);

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
          console.error(error);
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
