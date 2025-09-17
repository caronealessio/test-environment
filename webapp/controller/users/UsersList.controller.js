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
            { label: this.getText("labelFiscalCode"), property: "fiscal_code", align: "Center", width: "10rem" },
            { label: this.getText("labelEmail"), property: "email", align: "Center" },
            { label: this.getText("labelPhone"), property: "phone", align: "Center", width: "6rem" },
            { label: this.getText("labelRole"), property: "role", align: "Center" },
            {
              label: this.getText("labelBirthDate"),
              property: "birth_date",
              type: "sap.ui.model.type.Date",
              pattern: "dd/MM/yyyy",
              width: "6rem",
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
              tooltip: this.getText("btnEdit"),
            },
            {
              label: "",
              component: "button",
              icon: "sap-icon://delete",
              type: "Transparent",
              press: async function (oEvent) {
                const oUser = oEvent.getSource().getParent().getBindingContext("Users").getObject();

                const deleteUser = async () => {
                  try {
                    this.setBusy(true);

                    await this.delete("users", [oUser.id]);

                    const oResponse = await this.read("users");
                    this.oModelUsers.setData(oResponse);
                  } catch (error) {
                    MessageBox.error(error.message);
                  } finally {
                    this.setBusy(false);
                  }
                };

                MessageBox.warning(`${this.getText("msgWarningDeleteUser")} ${oUser.surname} ${oUser.name}?`, {
                  actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                  onClose: async function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                      await deleteUser();
                    }
                  }.bind(this),
                });
              }.bind(this),
              width: "3.5rem",
              hAlign: "Center",
              tooltip: this.getText("btnDelete"),
            },
          ],
        });

        oTableUserContainer.addItem(oTable);
      },

      onCreatePress: function () {
        this.navTo("usersForm", { id: "create" });
      },
    });
  }
);
