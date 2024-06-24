sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "testenvironment/model/formatter"],
  function (Controller, Fragment, formatter) {
    "use strict";

    return Controller.extend("testenvironment.controller.BaseController", {
      formatter: formatter,
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      /**
       * @param {string} [sName] optional parameter
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * @return {sap.ui.model.resource.ResourceModel}
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      loadFragment: function (sViewName) {
        var self = this;
        var oView = this.getView();

        var oFragment = Fragment.load({
          id: oView.getId(),
          name: sViewName,
          controller: this,
        }).then(function (oFragment) {
          oFragment.setModel(self.getModel("i18n"), "i18n");
          oView.addDependent(oFragment);
          return oFragment;
        });

        return oFragment;
      },
    });
  }
);
