// @ts-check

sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "testenvironment/model/models",
    "testenvironment/controls/valueHelpRequest/ValueHelpRequestCustom",
  ],
  function (BaseController, JSONModel, MessageBox, models, ValueHelpRequestCustom) {
    "use strict";

    const INIT_MODEL_USER = {
      address: "",
      birth_date: null,
      cap: "",
      city: "",
      email: "",
      fiscal_code: "",
      gender_id: "",
      id: "",
      name: "",
      phone: "",
      role_id: "",
      surname: "",
      created: null,
      modified: null,
    };

    return BaseController.extend("testenvironment.controller.users.UsersForm", {
      onInit: async function () {
        this.getRouter().getRoute("usersForm").attachPatternMatched(this._onObjectMatched, this);

        this.oModelUser = this.setModel(new JSONModel(this.generalUtils.copyWithoutRef(INIT_MODEL_USER)), "User");

        this.oModelCities = this.setModel(await models.createCitiesModel(), "Cities");
        this.oModelGenders = this.setModel(await models.createGendersModel(), "Genders");
        this.oModelRoles = this.setModel(await models.createRolesModel(), "Roles");
      },

      _onObjectMatched: async function (oEvent) {
        this.sId = oEvent.getParameter("arguments").id;
        this.bIsNew = this.sId === "create";
        this.generalUtils.clearAllValueStates(this.getView());

        this.setBusy(true);

        try {
          let oUser = this.generalUtils.copyWithoutRef(INIT_MODEL_USER);

          if (!this.bIsNew) {
            oUser = await this.read("users", { key: this.sId });
          }

          this.oModelUser.setData(oUser);
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onNavBack: function () {
        this.navTo("usersList");
      },

      onSavePress: async function () {
        const oView = this.getView();
        const aControls = oView.findAggregatedObjects(true);

        const oValidation = this.generalUtils.validateControls(aControls);

        if (!oValidation.valid) {
          MessageBox.error(oValidation.message);
          return;
        }

        let oUser = this.oModelUser.getData();

        try {
          this.setBusy(true);

          if (this.bIsNew) {
            await this.create("users", oUser);
          } else {
            await this.edit("users", oUser.id, oUser);
          }

          MessageBox.success(this.getText("msgSuccessSavedUser"), {
            actions: [sap.m.MessageBox.Action.OK],
            onClose: () => {
              this.navTo("usersList");
            },
          });
        } catch (error) {
          MessageBox.error(error.message);
        } finally {
          this.setBusy(false);
        }
      },

      onMcCity: function (oEvent) {
        const aFilters = [
          { label: this.getText("labelCap"), name: "cap" },
          {
            label: this.getText("labelProvince"),
            name: "provincia/sigla",
            type: "ComboBox",
            items: Array.from(
              new Map(
                this.oModelCities
                  .getData()
                  .map((item) => [item.provincia.sigla, { key: item.provincia.sigla, text: item.provincia.nome }])
              ).values()
            ),
          },
        ];

        const aColumns = [
          { label: this.getText("labelCity"), property: "nome" },
          { label: this.getText("labelCap"), property: "cap" },
          { label: this.getText("labelProvince"), property: "provincia/sigla" },
        ];

        this._oMC = new ValueHelpRequestCustom("", {
          title: this.getText("labelCity"),
          key: "nome",
          filters: aFilters,
          data: this.oModelCities.getData(),
          columns: aColumns,
          supportMultiselect: false,
          ok: function (oEvent) {
            const oCity = oEvent.getParameter("tokens")[0].getAggregation("customData")[0].getProperty("value");

            this.oModelUser.setProperty("/city", oCity.nome);
            this.oModelUser.setProperty("/cap", oCity.cap);
          }.bind(this),
        });

        this._oMC.open();
      },

      onCityChange: function (oEvent) {
        const sValue = oEvent.getParameter("value");
        const oCity = this.oModelCities
          .getData()
          .filter((item) => item.nome.toLowerCase() === sValue.toLowerCase())?.[0];

        if (!oCity) {
          this.oModelUser.setProperty("/city", "");
          this.oModelUser.setProperty("/cap", "");
          return;
        }

        this.oModelUser.setProperty("/city", oCity.nome);
        this.oModelUser.setProperty("/cap", oCity.cap);
      },

      onDeletePress: function () {
        const oUser = this.oModelUser.getData();

        const deleteUser = async () => {
          try {
            this.setBusy(true);

            await this.delete("users", [oUser.id]);

            this.navTo("usersList");
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
      },
    });
  }
);
