sap.ui.define(["sap/m/Input", "sap/m/Label", "sap/ui/core/format/NumberFormat"], function (Input, Label, NumberFormat) {
  "use strict";

  return Input.extend("testenvironment.controls.Currency", {
    metadata: {
      properties: {
        value: {
          type: "string",
          defaultValue: "",
        },
        label: {
          type: "string",
          defaultValue: "",
        },
        maxIntegerDigits: {
          type: "int",
        },
        maxDecimalDigits: {
          type: "int",
          defaultValue: 2,
        },
      },
      aggregations: {
        _label: { type: "sap.m.Label", multiple: false, visibility: "hidden" },
      },
    },

    init: function () {
      Input.prototype.init.call(this);

      this.attachBrowserEvent("keypress", this.onAcceptOnlyCurrency);

      this.setAggregation("_label", new Label());
    },

    onAcceptOnlyCurrency: function (oEvent) {
      var sValue = oEvent.target.value;
      if ((oEvent.key === "," && sValue.includes(",")) || (isNaN(oEvent.key) && oEvent.key !== ",")) {
        oEvent.preventDefault();
      }
    },

    onChange: function (oEvent) {
      var sValue = this.getValue();
      var sModel = oEvent.srcControl.getBindingInfo("value").parts[0].model;
      var sPath = oEvent.srcControl.getBindingPath("value");

      sValue = sValue.replace(".", "");
      sValue = sValue.replace(",", ".");

      var aValue = sValue.split(".");

      var iIntegerDigits = aValue[0].length;
      var iMaxIntegerDigits = this.getMaxIntegerDigits();
      var iDecimalDigits = aValue[1].length;
      var iMaxDecimalDigits = this.getMaxDecimalDigits();

      this.setValueState(sap.ui.core.ValueState.None);

      if (
        (iIntegerDigits > iMaxIntegerDigits && iMaxIntegerDigits) ||
        (iDecimalDigits > iMaxDecimalDigits && iMaxDecimalDigits)
      ) {
        this.setValueState(sap.ui.core.ValueState.Error);

        sValue = this.getModel(sModel).getProperty(sPath);

        var oCurrencyFormat = NumberFormat.getCurrencyInstance();
        this.setValue(oCurrencyFormat.format(parseFloat(sValue)));
      }

      this.getModel(sModel).setProperty(sPath, sValue);
    },

    renderer: function (oRm, oInput) {
      oInput._createLabel(oRm, oInput);

      sap.m.InputRenderer.render(oRm, oInput);
    },

    getMaxIntegerDigits: function () {
      return this.getProperty("maxIntegerDigits");
    },

    getMaxDecimalDigits: function () {
      return this.getProperty("maxDecimalDigits");
    },

    getLabel: function () {
      return this.getProperty("label");
    },

    _createLabel: function (oRm, oInput) {
      if (!oInput.getAggregation("_label").getText() && oInput.getLabel()) {
        oInput.getAggregation("_label").setVisible(oInput.getLabel() ? true : false);
        oInput.getAggregation("_label").setText(oInput.getLabel());

        oRm.renderControl(oInput.getAggregation("_label"));
      }
    },
  });
});
