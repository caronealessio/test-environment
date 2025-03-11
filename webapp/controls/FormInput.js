// @ts-check

sap.ui.define(
  ["sap/ui/core/Control", "sap/m/HBox", "sap/m/Label", "sap/m/Input", "sap/ui/layout/GridData", "sap/m/FlexBox"],
  function (Control, HBox, Label, Input, GridData, FlexBox) {
    "use strict";

    return Control.extend("testenvironment.controls.FormInput", {
      metadata: {
        properties: {
          label: { type: "string", defaultValue: "" },
          required: { type: "boolean", defaultValue: false },
          value: { type: "any", defaultValue: null },
        },
        aggregations: {
          layoutData: { type: "sap.ui.core.LayoutData", multiple: false },
        },
        events: {},
      },

      init: function () {
        this._oBox = new FlexBox();
        this.addDependent(this._oBox);
      },

      onBeforeRendering: function () {
        this._oBox.setDirection("Column");
        this._oBox.removeAllItems();
        this._oBox.addItem(
          new Label({
            text: this.getLabel(),
            required: this.getRequired(),
          })
        );
        this._oBox.addItem(
          new Input({
            value: this.getValue(),
          })
        );
      },

      onAfterRendering: function () {
        if (this._oBox) {
          const domRef = this._oBox.getDomRef();
          if (domRef) {
            // Forza l'update delle classi responsive
            sap.ui.getCore().applyChanges();
          }
        }
      },

      renderer: function (oRm, oControl) {
        oRm.renderControl(oControl._oBox);
      },
    });
  }
);
