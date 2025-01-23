/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "testenvironment/model/models",
    "sap/ui/model/json/JSONModel",
    "testenvironment/libs/moment",
  ],
  function (UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("testenvironment.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: async function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // // Creazione di un modello JSON dal servizio
        var oModel = new JSONModel();
        await oModel.loadData("http://localhost:3000/users/");

        console.log(oModel.getData());

        oModel.getData().map((item) => {
          item.birthday = moment(item.birthday)._d;
          item.birthtime = { ms: moment.duration(item.birthtime).asMilliseconds(), __edmType: "Edm.Time" };
          item.created = moment(item.created)._d;
          item.isMale = item.isMale === 1;
        });

        this.setModel(oModel, "users");
      },
    });
  }
);
