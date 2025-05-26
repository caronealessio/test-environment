// @ts-check

sap.ui.define(
  ["../BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/ui/core/IconPool"],
  function (BaseController, JSONModel, MessageBox, IconPool) {
    "use strict";

    return BaseController.extend("testenvironment.controller.menu.Menu", {
      onInit: function () {
        this.getRouter().getRoute("menu").attachPatternMatched(this._onObjectMatched, this);

        const aIcons = IconPool.getIconNames().map((icon) => {
          return `sap-icon://${icon}`;
        });

        this.oModelMenuItem = this.setModel(new JSONModel({}), "MenuItem");
        this.oModelIcon = this.setModel(new JSONModel(aIcons), "Icons");
      },

      _onObjectMatched: async function (oEvent) {
        this.sId = oEvent.getParameter("arguments").id;

        this.setBusy(true);

        try {
          /** @type {MenuItemTypes} */
          let oMenuItem = {};

          if (this.sId !== "create") {
            oMenuItem = await this.read("menu", this.sId);
          }

          this.oModelMenuItem.setData(oMenuItem);
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onSave: async function () {
        /** @type {MenuItemTypes} */
        var oMenuItem = this.getModel("MenuItem").getData();

        this.setBusy(true);

        try {
          if (this.sId === "create") {
            await this.create("menu", oMenuItem);
          } else {
            await this.edit("menu", this.sId, oMenuItem);
          }

          MessageBox.success(this.getText("msgSuccessSavedMenuItem"), {
            actions: [sap.m.MessageBox.Action.OK],
            onClose: () => {
              sap.ui.getCore().getEventBus().publish("MenuChannel", "MenuUpdated");
              this.navTo("menuItemsList");
            },
          });
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onSelectIconOpen: function (oEvent) {
        const oInput = oEvent.getSource();

        if (!this._oSelectDialog) {
          this._oSelectDialog = new sap.m.SelectDialog({
            title: "Seleziona un' icona",
            items: {
              path: "Icons>/",
              template: new sap.m.StandardListItem({
                title: "{Icons>}",
                icon: "{Icons>}",
              }),
            },
            search: function (oEvent) {
              const sValue = oEvent.getParameter("value");
              const oFilter = new sap.ui.model.Filter("", sap.ui.model.FilterOperator.Contains, sValue);
              oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            confirm: function (oEvent) {
              const oSelectedItem = oEvent.getParameter("selectedItem");
              if (oSelectedItem) {
                oInput.setValue(oSelectedItem.getTitle());
              }
            },
            cancel: function () {
              this._oSelectDialog.getBinding("items").filter([]);
            }.bind(this),
          });

          this.getView().addDependent(this._oSelectDialog);
        }

        this._oSelectDialog.open();
      },

      onNavBack: function () {
        this.navTo("menuItemsList");
      },
    });
  }
);
