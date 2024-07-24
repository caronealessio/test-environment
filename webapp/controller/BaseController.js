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

      getFieldType: function (oComponent) {
        var oBinding;
        var sComponent = oComponent.getMetadata().getName();

        if (oComponent?.data("type")) {
          return oComponent?.data("type"); //integer - float
        }

        oBinding = oBinding ?? oComponent.getBindingInfo("text");
        oBinding = oBinding ?? oComponent.getBindingInfo("value");

        var oType = oBinding?.type;

        if (oType) {
          if (oType?.oFormat?.type) {
            return oType?.oFormat?.type; //time
          } else if (oType?.getName()) {
            return oType?.getName().toLowerCase(); //date - currency
          }
        }

        if (sComponent === "sap.m.CheckBox") {
          return "boolean"; //boolean
        }

        return null;
      },

      getFieldProperty: function (oField) {
        var sProperty;

        sProperty = sProperty ?? oField.getBindingPath("value");
        sProperty = sProperty ?? oField.getBindingPath("selectedKey");
        sProperty = sProperty ?? oField.getBindingPath("text");
        sProperty = sProperty ?? oField.getBindingPath("selected");
        sProperty = sProperty ?? oField.getBindingPath("src");
        sProperty = sProperty ?? oField?.data("property");

        return sProperty;
      },

      copyWithoutRef: function (oArray) {
        function json_deserialize_helper(key, value) {
          if (typeof value === "string") {
            var regexp;
            regexp = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.exec(value);
            if (regexp) {
              return new Date(value);
            }
          }
          return value;
        }

        return JSON.parse(JSON.stringify(oArray), json_deserialize_helper);
      },
    });
  }
);
