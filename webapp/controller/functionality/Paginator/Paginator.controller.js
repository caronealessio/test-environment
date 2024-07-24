sap.ui.define(
  ["../../BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/mockdata"],
  function (BaseController, JSONModel, mockdata) {
    "use strict";

    return BaseController.extend("testenvironment.controller.functionality.Paginator.Paginator", {
      onInit: function () {
        this.setModel(new JSONModel({}));

        var aArray = [];

        for (let i = 0; i < 195; i++) {
          aArray.push({
            Id: i + 1,
            Name: this.createRandomString(),
            Surname: this.createRandomString(),
            BirthDate: new Date(new Date() - Math.random() * 1e12),
            City: this.createRandomString(),
          });
        }

        this._aArray = aArray;

        var aCopy = this.copyWithoutRef(this._aArray);

        var oPaginator = {
          Top: 50,
          Skip: 0,
          Records: 195,
        };

        this.setModel(new JSONModel(oPaginator), "Paginator");
        this.setModel(new JSONModel(aCopy.slice(oPaginator.Skip, oPaginator.Top)), "PaginatorList");
      },

      onBack: function () {
        window.history.go(-1);
      },

      createRandomString: function (length = 10) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      },

      onPaginatorChange: function (oEvent) {
        var oPaginator = this.getModel("Paginator").getData();

        var aCopy = this.copyWithoutRef(this._aArray);
        this.setModel(new JSONModel(aCopy.splice(oPaginator.Skip, oPaginator.Top)), "PaginatorList");
      },
    });
  }
);
