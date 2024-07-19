sap.ui.define(["sap/m/Input", "sap/m/Label"], function (Input, Label) {
  "use strict";

  return Input.extend("testenvironment.controls.Input", {
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
      },
      aggregations: {
        _label: { type: "sap.m.Label", multiple: false, visibility: "hidden" },
      },
    },

    init: function () {
      Input.prototype.init.call(this);

      this.setAggregation("_label", new Label());
    },

    renderer: function (oRm, oInput) {
      oInput._createLabel(oRm, oInput);

      sap.m.InputRenderer.render(oRm, oInput);
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
