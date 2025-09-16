sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device", "sap/m/MessageBox"],
  function (JSONModel, Device, MessageBox) {
    "use strict";

    return {
      /**
       * Provides runtime info for the device the UI5 app is running on as JSONModel
       */
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },

      //Aggiungere la destination nel file xs-app.json
      createUserModel: async function () {
        var oUser, oResponse;
        var sUrl = window.location.href;

        if (!sUrl.includes("workspaces-ws-")) {
          sUrl = sUrl.split("/index.html")[0];

          var sUrlCurrentUser = sUrl + "/user-api/currentUser";

          try {
            oResponse = await fetch(sUrlCurrentUser);
            oUser = await oResponse.json();
          } catch (error) {
            console.error(error);
          }

          return new JSONModel(oUser);
        }
      },

      createCitiesModel: async function () {
        let aCities = [];

        try {
          const oResponse = await fetch("https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni");

          if (!oResponse.ok) {
            const errorMessage = await oResponse.text();
            throw new Error(errorMessage);
          }

          aCities = await oResponse.json();
        } catch (error) {
          MessageBox.error(error.message);
        }

        return new JSONModel(aCities);
      },

      createGendersModel: async function () {
        let aGenders = [];

        try {
          const oResponse = await fetch(`http://localhost:3000/genders`);

          if (!oResponse.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }

          aGenders = await oResponse.json();
        } catch (error) {
          MessageBox.error(error.message);
        }

        return new JSONModel(aGenders);
      },

      createRolesModel: async function () {
        let aRoles = [];

        try {
          const oResponse = await fetch(`http://localhost:3000/roles`);

          if (!oResponse.ok) {
            const errorMessage = await oResponse.text();
            throw new Error(errorMessage);
          }

          aRoles = await oResponse.json();
        } catch (error) {
          MessageBox.error(error.message);
        }

        return new JSONModel(aRoles);
      },
    };
  }
);
