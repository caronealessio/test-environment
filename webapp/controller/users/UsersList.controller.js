// @ts-check

sap.ui.define(
  ["../BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "testenvironment/controls/Table"],
  function (BaseController, JSONModel, MessageBox, Table) {
    "use strict";

    return BaseController.extend("testenvironment.controller.users.UsersList", {
      onInit: function () {
        this.getRouter().getRoute("usersList").attachPatternMatched(this._onObjectMatched, this);

        this.oModelUsers = this.setModel(new JSONModel([]), "Users");
      },

      _onObjectMatched: async function (oEvent) {
        this.setBusy(true);

        try {
          let oResponse = await this.read("users");

          oResponse.map((user) => {
            user.birthday = new Date(user.birthday);
          });

          this.oModelUsers.setData(oResponse);
          this._createUsersTable();
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      _createUsersTable() {
        const aUsers = this.oModelUsers.getData();
        const oTableUserContainer = this.byId("tableUserContainer");

        if (oTableUserContainer.getItems().length > 0) {
          return;
        }

        const oTable = new Table({
          rows: "{Users>/}",
          selectionMode: "None",
          rowCount: 20,
          cols: [
            { label: this.getText("labelId"), property: "id", width: "3rem", hAlign: "Center" },
            { label: this.getText("labelName"), property: "name" },
            { label: this.getText("labelSurname"), property: "surname" },
            { label: this.getText("labelEmail"), property: "email", align: "Center" },
            {
              label: this.getText("labelBirthDate"),
              property: "birthday",
              type: "sap.ui.model.type.Date",
              pattern: "dd/MM/yyyy HH:mm",
              width: "10rem",
              hAlign: "Center",
            },
            {
              label: "",
              component: "button",
              icon: "sap-icon://edit",
              type: "Transparent",
              press: function (oEvent) {
                this.navTo("usersForm", {
                  id: oEvent.getSource().getParent().getBindingContext("Users").getObject("id"),
                });
              }.bind(this),
              width: "3.5rem",
              hAlign: "Center",
            },
            {
              label: "",
              component: "button",
              icon: "sap-icon://delete",
              type: "Transparent",
              press: function (oEvent) {
                this.navTo("userForm", {
                  id: oEvent.getSource().getParent().getBindingContext("Users").getObject("id"),
                });
              },
              width: "3.5rem",
              hAlign: "Center",
            },
          ],
        });

        oTableUserContainer.addItem(oTable);
      },
    });
  }
);
