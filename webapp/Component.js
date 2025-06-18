/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/Device", "testenvironment/model/models", "sap/ui/model/json/JSONModel"],
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

        try {
          var oModel = new JSONModel();
          await oModel.loadData("http://localhost:3000/users/");

          this.setModel(new JSONModel({ data: oModel.getData() }), "users");
        } catch (error) {
          MessageBox.error(error.message);
        }
      },
    });
  }
);
