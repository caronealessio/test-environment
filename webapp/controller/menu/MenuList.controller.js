// @ts-check

sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/util/tableUtils",
    "sap/m/MessageBox",
    "testenvironment/util/crudUtils",
    "testenvironment/util/generalUtils",
  ],
  function (BaseController, JSONModel, tableUtils, MessageBox, crudUtils, generalUtils) {
    "use strict";

    const DEFAULT_TOP = 10;
    const DEFAULT_SKIP = 0;

    return BaseController.extend("testenvironment.controller.menu.MenuList", {
      onInit: function () {
        this.getRouter().getRoute("menuList").attachPatternMatched(this._onObjectMatched, this);

        this.oModelMenu = this.setModel(new JSONModel(null), "Menu");
        this.oModelMenuTree = this.setModel(new JSONModel([]), "MenuTree");
      },

      _onObjectMatched: async function () {
        this.setBusy(true);

        try {
          /** @type {MenuTypes[]} */
          const oResults = await this.read("menu", {
            order: "pos:asc",
            top: DEFAULT_TOP,
            skip: DEFAULT_SKIP,
          });

          this.oModelMenu.setData({ ...oResults, skip: DEFAULT_SKIP, top: DEFAULT_SKIP });
          this.oModelMenuTree.setData(oResults.data);
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onCreate: function () {
        this.navTo("menu", { id: "create" });
      },

      onDelete: async function (oEvent) {
        const oItem = oEvent.getSource().getParent().getBindingContext("Menu").getObject();

        this.setBusy(true);

        try {
          await this.delete("menu", [oItem.id]);
          const oResults = await this.read("menu");

          this.oModelMenu.setData(oResults);
          this.oModelMenuTree.setData(oResults.data);

          sap.ui.getCore().getEventBus().publish("MenuChannel", "MenuUpdated");
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onEdit: async function (oEvent) {
        const oItem = oEvent.getSource().getParent().getBindingContext("Menu").getObject();

        this.navTo("menu", { id: oItem.id });
      },

      onVisibleChange: async function (oEvent) {
        const bState = oEvent.getParameter("state");
        const oItem = oEvent.getSource().getParent().getBindingContext("Menu").getObject();

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

        this.setBusy(true);

        try {
          const oResults = await this.read("menu", {
            filters: {
              description: sValue,
              target: sValue,
            },
          });

          this.oModelMenu.setData(oResults);
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onDrop: async function (oEvent) {
        const oDragged = oEvent.getParameter("draggedControl"); //Record spostato
        const oDropped = oEvent.getParameter("droppedControl"); //Record dove spostato
        const sPosition = oEvent.getParameter("dropPosition"); // "Before", "After", "On"

        if (!oDragged || !oDropped) {
          return;
        }

        const oDraggedData = oDragged.getBindingContext("MenuTree").getObject();
        const oDroppedData = oDropped.getBindingContext("MenuTree").getObject();

        const oDraggedId = oDraggedData.id;
        const oDroppedId = oDroppedData.id;

        // Copia senza riferimenti
        const aMenuTree = this.oModelMenuTree.getData();

        // Trova indice dell'elemento da spostare e rimuovilo
        const iDraggedIndex = aMenuTree.findIndex((item) => item.id === oDraggedId);
        if (iDraggedIndex === -1) return;
        aMenuTree.splice(iDraggedIndex, 1); // Rimuovi il trascinato

        // Trova di nuovo l'indice dove inserirlo (dopo la rimozione potrebbe essere cambiato!)
        let iDropIndex = aMenuTree.findIndex((item) => item.id === oDroppedId);
        if (iDropIndex === -1) return;

        if (sPosition === "After") {
          iDropIndex += 1;
        }

        aMenuTree.splice(iDropIndex, 0, oDraggedData); // Inserisci nella nuova posizione

        this.oModelMenuTree.setData(aMenuTree);
        this.oModelMenuTree.refresh(true);

        console.log(aMenuTree);

        aMenuTree.map((item, index) => {
          item.pos = index;
        });

        this.setBusy(true);

        try {
          const response = await fetch(`http://localhost:3000/menu/update-positions`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(aMenuTree),
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }

          // const oResults = await response.json();
          sap.ui.getCore().getEventBus().publish("MenuChannel", "MenuUpdated");
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },
    });
  }
);
