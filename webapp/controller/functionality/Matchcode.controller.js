sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/comp/filterbar/FilterBar",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/table/Column",
    "sap/m/Input",
    "sap/m/SearchField",
    "testenvironment/controls/Matchcode",
    "testenvironment/controls/MatchcodeV2",
  ],
  function (
    BaseController,
    JSONModel,
    mockdata,
    ValueHelpDialog,
    FilterBar,
    Filter,
    FilterOperator,
    FilterGroupItem,
    Label,
    Text,
    Column,
    Input,
    SearchField,
    Matchcode,
    MatchcodeV2
  ) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Matchcode", {
      onInit: function () {
        this.setModel(new JSONModel(mockdata.Users()), "Users");

        this.oPersonModel = new JSONModel({ Name: null, Names: [] });
        this.setModel(this.oPersonModel, "Person");
      },

      onBack: function () {
        this.getRouter().navTo("RouteHome");
      },

      createMcColumn: function (oTable, sLabel, sModel, sProperty, sWidth = "auto") {
        var oColumn = new Column({
          label: new Label({ text: this.getResourceBundle().getText(sLabel) }),
          template: new Text({ wrapping: false, text: "{" + sModel + ">" + sProperty + "}" }),
          width: sWidth,
        });

        oTable.addColumn(oColumn);
      },

      onMcClose: function () {
        this._oMC.destroy();
        this._oMC = undefined;
      },

      onMcFilter: function (oEvent) {
        var sSearchQuery = oEvent.getSource()._oBasicSearchField.getValue();
        var aSelectionSet = oEvent.getParameter("selectionSet");
        var aSearchFilters = [];

        //Creo i filtri per i vari input
        var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
          if (oControl.getValue()) {
            aResult.push(
              new Filter({
                path: oControl.getName(),
                operator: FilterOperator.Contains,
                value1: oControl.getValue(),
              })
            );
          }

          return aResult;
        }, []);

        //Recupero le colonne e creo i filtri per il SearchField
        this._oMC
          .getTable()
          .getColumns()
          .map((oColumn) => {
            var sValue = oColumn.getTemplate().getBindingPath("text");

            aSearchFilters.push(new Filter({ path: sValue, operator: FilterOperator.Contains, value1: sSearchQuery }));
          });

        aFilters.push(new Filter({ filters: aSearchFilters, and: false }));

        //Filtro la tabella
        this._oMC.getTableAsync().then(
          function (oTable) {
            if (oTable.bindRows) {
              oTable.getBinding("rows").filter(aFilters);
            }
            if (oTable.bindItems) {
              oTable.getBinding("items").filter(aFilters);
            }

            // This method must be called after binding update of the table.
            this._oMC.update();
          }.bind(this)
        );
      },

      onMcOpen: async function () {
        //#region Crezione dei filtri

        var oFilterBar = new FilterBar("", {
          advancedMode: true,
          isRunningInValueHelpDialog: true,
        });

        oFilterBar.attachSearch(this.onMcFilter.bind(this));

        var oBasicSearchField = new SearchField("");

        oFilterBar.setBasicSearch(oBasicSearchField);

        // // Trigger filter bar search when the basic search is fired
        oBasicSearchField.attachSearch(function () {
          oFilterBar.search();
        });

        var oFilterGroupItems = new FilterGroupItem("", {
          groupName: "__$INTERNAL$",
          label: "Filtro 1",
          visibleInFilterBar: true,
          name: "Name",
        });

        oFilterGroupItems.setControl(
          new Input("", {
            name: "Name",
          })
        );

        var oFilterGroupItems1 = new FilterGroupItem("", {
          groupName: "__$INTERNAL$",
          label: "Filtro 2",
          visibleInFilterBar: true,
          name: "Surname",
        });

        oFilterGroupItems1.setControl(
          new Input("", {
            name: "Surname",
          })
        );

        oFilterBar.addFilterGroupItem(oFilterGroupItems);
        oFilterBar.addFilterGroupItem(oFilterGroupItems1);

        //#endregion

        this._oMC = new ValueHelpDialog("", {
          title: "Test",
        });

        this._oMC.getTableAsync().then(
          async function (oTable) {
            var oData = this.getModel("Users").getData();

            oTable.setModel(new JSONModel(oData), "Users");

            oTable.bindAggregation("rows", {
              path: "Users>/",
            });

            this.createMcColumn(oTable, "labelCode", "Users", "Name");
            this.createMcColumn(oTable, "labelDescription", "Users", "Surname");

            this._oMC.update();
          }.bind(this)
        );

        this._oMC.setFilterBar(oFilterBar);
        this._oMC.attachCancel(this.onMcClose.bind(this));
        this._oMC.attachAfterClose(this.onMcClose.bind(this));

        this._oMC.open();
      },

      onMcOpenV1: async function () {
        // if (!this._oMC) {
        this._oMC = await this.loadFragment("testenvironment.view.fragment.Matchcode");
        // }

        this._oMC.getTableAsync().then(
          async function (oTable) {
            var oData = this.getModel("Users").getData();

            // oTable.setModel(new JSONModel(oData), "Users");

            oTable.bindAggregation("rows", {
              path: "Users>/",
            });

            this.createMcColumn(oTable, "labelCode", "Users", "Name");
            this.createMcColumn(oTable, "labelDescription", "Users", "Surname");

            this._oMC.update();
          }.bind(this)
        );

        this._oMC.open();
      },

      onMcOpenV3: async function (oEvent) {
        var aData = this.getModel("Users").getData();
        var aFilters = [
          { label: this.getResourceBundle().getText("labelName"), name: "Name" },
          { label: this.getResourceBundle().getText("labelSurname"), name: "Surname" },
        ];
        var aColumns = [
          { label: this.getResourceBundle().getText("labelName"), property: "Name" },
          { label: this.getResourceBundle().getText("labelSurname"), property: "Surname" },
        ];

        this._oMC = new Matchcode("", {
          title: this.getResourceBundle().getText("labelMatchcode"),
          key: "Name",
          filters: aFilters,
          modelName: "Users",
          data: aData,
          columns: aColumns,
          supportMultiselect: false,
          input: oEvent.getSource(),
          ok: function (oEvent) {
            var sValue = oEvent.getParameter("tokens")[0].getProperty("key");
            this.getModel("Person").setProperty("/Name", sValue);
          }.bind(this),
        });

        this._oMC.open();
      },

      onMcOpenV4: async function (oEvent) {
        var aData = this.getModel("Users").getData();
        var aFilters = [
          { label: this.getResourceBundle().getText("labelName"), name: "Name" },
          { label: this.getResourceBundle().getText("labelSurname"), name: "Surname" },
        ];
        var aColumns = [
          { label: this.getResourceBundle().getText("labelName"), property: "Name" },
          { label: this.getResourceBundle().getText("labelSurname"), property: "Surname" },
        ];

        this._oMC = new Matchcode("", {
          title: this.getResourceBundle().getText("labelMatchcode"),
          key: "Name",
          filters: aFilters,
          modelName: "Users",
          data: aData,
          columns: aColumns,
          supportMultiselect: true,
          input: oEvent.getSource(),
          ok: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            var oInput = oEvent.getSource().getInput();

            this.getModel("Person").setProperty("/Names", aTokens);
            oInput.setTokens(aTokens);
          }.bind(this),
        });

        this._oMC.open();
      },

      onTest: function (oEvent) {
        console.log(this.getModel("Person").getData());
      },

      onMatchcodeV2: async function (oEvent) {
        var aData = this.getModel("Users").getData();
        this.oPersonModel = this.getModel("Person");
        var aFilters = [
          { label: this.getResourceBundle().getText("labelName"), field: "Name" },
          { label: this.getResourceBundle().getText("labelSurname"), field: "Surname" },
        ];
        var aColumns = [
          { label: this.getResourceBundle().getText("labelName"), template: "Name" },
          { label: this.getResourceBundle().getText("labelSurname"), template: "Surname" },
        ];

        // Configurazione per il ValueHelpDialog
        var oConfig = {
          // key: "Name",
          title: "Utente",
          data: aData,
          columns: aColumns,
          filters: aFilters,
          model: this.oPersonModel,
          modelPath: "/Name",
          // onOk: this.customOkHandler.bind(this), // Funzione personalizzata per OK
        };

        // Crea e apre il DynamicValueHelpDialog
        var oValueHelpDialog = new MatchcodeV2(oConfig);
        oValueHelpDialog.open();
      },
    });
  }
);
