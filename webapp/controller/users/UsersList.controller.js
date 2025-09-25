// @ts-check

sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "testenvironment/controls/table/Table",
    "testenvironment/model/models",
  ],
  function (BaseController, JSONModel, MessageBox, Table, models) {
    "use strict";

    const DEFAULT_TOP = 20;
    const DEFAULT_SKIP = 0;

    return BaseController.extend("testenvironment.controller.users.UsersList", {
      onInit: async function () {
        this.getRouter().getRoute("usersList").attachPatternMatched(this._onObjectMatched, this);

        this.oModelUsers = this.setModel(
          new JSONModel({
            data: [],
            top: DEFAULT_TOP,
            skip: DEFAULT_SKIP,
            count: 0,
            filters: {
              search: "",
              role_id: "",
            },
          }),
          "Users"
        );

        this.oModelRoles = this.setModel(await models.createRolesModel(), "Roles");
      },

      _onObjectMatched: async function (oEvent) {
        this.setBusy(true);

        try {
          this.oModelUsers.setProperty("/filters", { search: "", role_id: "" });
          this.oModelUsers.setProperty("/top", DEFAULT_TOP);
          this.oModelUsers.setProperty("/skip", DEFAULT_SKIP);

          await this._loadUsers();

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
          rows: "{Users>/data}",
          selectionMode: "None",
          rowCount: DEFAULT_TOP,
          cols: [
            { label: this.getText("labelName"), property: "name" },
            { label: this.getText("labelSurname"), property: "surname" },
            { label: this.getText("labelFiscalCode"), property: "fiscal_code", width: "10rem" },
            { label: this.getText("labelEmail"), property: "email" },
            { label: this.getText("labelPhone"), property: "phone", width: "6rem" },
            { label: this.getText("labelRole"), property: "role" },
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

                    await this._loadUsers();
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
          paginator: {
            top: "{Users>/top}",
            skip: "{Users>/skip}",
            count: "{Users>/count}",
            press: async function () {
              await this._loadUsers();
            }.bind(this),
            align: "End",
          },
        });

        oTableUserContainer.addItem(oTable);
      },

      onCreatePress: function () {
        this.navTo("usersForm", { id: "create" });
      },

      _loadUsers: async function () {
        const oFilters = this.oModelUsers.getProperty("/filters");

        const oResults = await this.read("users", {
          filters: {
            name: oFilters.search,
            surname: oFilters.search,
            fiscal_code: oFilters.search,
            email: oFilters.search,
            role_id: oFilters.role_id,
          },
          top: this.oModelUsers.getProperty("/top"),
          skip: this.oModelUsers.getProperty("/skip"),
        });

        this.oModelUsers.setProperty("/data", oResults.data);
        this.oModelUsers.setProperty("/count", oResults.count);
      },

      onFiltersChange: async function (oEvent) {
        this.oModelUsers.setProperty("/top", DEFAULT_TOP);
        this.oModelUsers.setProperty("/skip", DEFAULT_SKIP);

        await this._loadUsers();
      },
    });
  }
);
