sap.ui.define(
  [
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "sap/m/Button",
    "sap/m/Toolbar",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSpacer",
  ],
  function (Dialog, DialogRenderer, Button, Toolbar, OverflowToolbar, ToolbarSpacer) {
    "use strict";

    return Dialog.extend("testenvironment.controls.Dialog", {
      metadata: {
        aggregations: {
          footer: {
            type: "sap.m.OverflowToolbar",
            multiple: false,
            visibility: "hidden",
          },
        },
      },
      init: function () {
        Dialog.prototype.init.apply(this);

        this.setEscapeHandler((oEscapeHandler) => {
          oEscapeHandler.reject();
        });

        var oOverflowToolbar = new OverflowToolbar();
        oOverflowToolbar.addContent(new ToolbarSpacer());
        oOverflowToolbar.addContent(new Button({ text: "{i18n>labelClose}", press: this.close.bind(this) }));

        this.setAggregation("footer", oOverflowToolbar);
      },

      renderer: function (oRm, oDialog) {
        sap.m.DialogRenderer.render(oRm, oDialog);
      },

      close: function () {
        this.destroy();
      },
    });
  }
);
