sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "testenvironment/model/mockdata",
    "testenvironment/util/generalUtils",
  ],
  function (BaseController, JSONModel, mockdata, generalUtils) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Paginator", {
      onInit: function () {
        this.setModel(new JSONModel({}));

        var aArray = [];

        for (let i = 0; i < 205; i++) {
          aArray.push({
            Id: i + 1,
            Name: this.createRandomString(),
            Surname: this.createRandomString(),
            BirthDate: new Date(new Date() - Math.random() * 1e12),
            City: this.createRandomString(),
          });
        }

        this._aArray = aArray;

        var aCopy = generalUtils.copyWithoutRef(this._aArray);

        var oPaginator = {
          Top: 50,
          Skip: 0,
          Records: 205,
        };

        this.setModel(new JSONModel(oPaginator), "Paginator");
        this.setModel(new JSONModel(aCopy.slice(oPaginator.Skip, oPaginator.Top)), "PaginatorList");
      },

      onBack: function () {
        this.getRouter().navTo("home");
      },

      createRandomString: function (length = 10) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      },

      onPaginatorChange: async function (oEvent) {
        var oPaginator = this.getModel("Paginator").getData();
        var aCopy = generalUtils.copyWithoutRef(this._aArray);

        this.setModel(new JSONModel(aCopy.splice(oPaginator.Skip, oPaginator.Top)), "PaginatorList");

        var sId = oEvent.getSource().getParent().getId().split("-").pop();
        var oTable = this.byId(sId);
        sId = sId.charAt(0).toUpperCase() + sId.slice(1);
        var sName = "_a" + sId;

        if (!this[sName]) {
          return;
        }

        var sModelName = oTable.getBindingInfo("rows").model;
        var aModel = await this.getModel(sModelName).getData();

        oTable.setSelectionInterval(-1, -1);

        this[sName].map(async function (oItem) {
          var oItem1 = aModel.filter((oModelItem) => {
            if (
              oModelItem.Id === oItem.Id &&
              oModelItem.Name === oItem.Name &&
              oModelItem.Surname === oItem.Surname &&
              oModelItem.City === oItem.City
            ) {
              return oModelItem;
            }
          })[0];

          var iIndex = aModel.indexOf(oItem1);

          if (aModel.includes(oItem1)) {
            oTable.addSelectionInterval(iIndex, iIndex);
          }
        });
      },

      onSelectionItem: function (oEvent) {
        var sId = oEvent.getParameter("id").split("-").pop();
        var oTable = this.byId(sId);
        sId = sId.charAt(0).toUpperCase() + sId.slice(1);
        var sName = "_a" + sId;
        var iIndex = oEvent.getParameter("rowIndex");

        if (!this[sName]) {
          this[sName] = [];
        }

        if (oEvent.getParameter("selectAll") || iIndex === -1) {
          return;
        }

        var oItem = oTable.getContextByIndex(iIndex).getObject();

        if (this[sName].includes(oItem)) {
          iIndex = this[sName].indexOf(oItem);
          this[sName].splice(iIndex, 1);
          return;
        }
        this[sName].push(oItem);
      },
    });
  }
);
