// @ts-check

sap.ui.define(["../BaseController", "sap/ui/model/json/JSONModel"], function (BaseController, JSONModel) {
  "use strict";

  return BaseController.extend("testenvironment.controller.menuItems.MenuItemForm", {
    onInit: function () {
      this.getRouter().getRoute("menuItemForm").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: async function (oEvent) {
      this.sId = oEvent.getParameter("arguments").id;

      /** @type {MenuItemTypes} */
      var oMenuItem = {};

      if (this.sId !== "create") {
        oMenuItem = await this.read("menu-items", this.sId);
      }

      this.setModel(new JSONModel(oMenuItem), "MenuItem");
    },

    onSave: function () {
      /** @type {MenuItemTypes} */
      var oMenuItem = this.getModel("MenuItem").getData();

      try {
        if (this.sId === "create") {
          this.create("menu-items", oMenuItem).then(() => {
            this.navTo("menuItems");
          });
        } else {
          // this.update("menu-items", this.sId, oMenuItem);
        }
      } catch (oError) {
        console.error(oError);
      }
    },

    onNavBack: function () {
      this.navTo("menuItems");
    },
  });
});
