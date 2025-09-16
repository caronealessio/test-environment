sap.ui.define(
  [
    "testenvironment/controls/datepicker/DatePickerCustom", // 👈 importo il tuo CustomInput
    "sap/m/Label",
    "sap/m/DatePickerRenderer",
  ],
  function (DatePickerCustom, Label, DatePickerRenderer) {
    "use strict";

    return DatePickerCustom.extend("testenvironment.controls.datepicker.LabeledDatePickerCustom", {
      metadata: {
        properties: {
          text: { type: "string", defaultValue: "" }, // label text
          required: { type: "boolean", defaultValue: false }, // label required
          showColon: { type: "boolean", defaultValue: true }, // label colon
        },
        aggregations: {
          _label: { type: "sap.m.Label", multiple: false, visibility: "hidden" },
        },
      },

      init: function () {
        DatePickerCustom.prototype.init.apply(this, arguments);

        this.setAggregation(
          "_label",
          new Label({
            text: this.getText(),
            required: this.getRequired(),
            showColon: this.getShowColon(),
            labelFor: this, // collega label a questo input
          })
        );
      },

      setText: function (sValue) {
        this.setProperty("text", sValue, true);
        this.getAggregation("_label")?.setText(sValue);
        return this;
      },

      setRequired: function (bValue) {
        this.setProperty("required", bValue, true);
        this.getAggregation("_label")?.setRequired(bValue);
        return this;
      },

      setShowColon: function (bValue) {
        this.setProperty("showColon", bValue, true);
        this.getAggregation("_label")?.setShowColon(bValue);
        return this;
      },

      renderer: {
        apiVersion: 2,
        render: function (oRm, oControl) {
          oRm.openStart("div", oControl);
          oRm.openEnd();

          // Label sopra
          oRm.renderControl(oControl.getAggregation("_label"));
          DatePickerRenderer.render(oRm, oControl);

          oRm.close("div");
        },
      },
    });
  }
);
