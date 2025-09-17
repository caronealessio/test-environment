sap.ui.define(
  ["sap/m/HBox", "sap/m/ToolbarSpacer", "sap/m/Label", "sap/m/Button"],
  function (HBox, ToolbarSpacer, Label, Button) {
    "use strict";

    return HBox.extend("testenvironment.controls.table.Paginator", {
      metadata: {
        properties: {
          top: {
            type: "int",
            defaultValue: 10,
          },
          skip: {
            type: "int",
            defaultValue: 0,
          },
          records: {
            type: "int",
          },
        },
        events: {
          press: {},
        },
      },

      init: function (a) {
        HBox.prototype.init.call(this);
      },

      renderer: function (oRm, oHBox) {
        sap.m.HBoxRenderer.render(oRm, oHBox);
      },

      applySettings: function () {
        HBox.prototype.applySettings.apply(this, arguments);

        const oFirstButton = new Button(`${this.getId()}_firstButton`, {
          icon: "sap-icon://close-command-field",
          tooltip: "Prima pagina",
          press: function (e) {
            this.setSkip(0);
            this.firePress();
          }.bind(this),
        });

        const oBackButton = new Button(`${this.getId()}_backButton`, {
          icon: "sap-icon://slim-arrow-left",
          tooltip: "Indietro",
          press: function () {
            this.setSkip(this.getSkip() - this.getTop());
            this.firePress();
          }.bind(this),
        });

        const oLabel = new Label(`${this.getId()}_label`).addStyleClass("sapUiTinyMarginTop");

        const oNextButton = new Button(`${this.getId()}_nextButton`, {
          icon: "sap-icon://slim-arrow-right",
          tooltip: "Avanti",
          press: function () {
            this.setSkip(this.getSkip() + this.getTop());
            this.firePress();
          }.bind(this),
        });

        const oLastButton = new Button(`${this.getId()}_lastButton`, {
          icon: "sap-icon://open-command-field",
          tooltip: "Ultima pagina",
          press: function () {
            const iRecords = this.getRecords();
            const iTop = this.getTop();
            const iLastSkip = iRecords % iTop === 0 ? iRecords - iTop : iRecords - (iRecords % iTop);

            this.setSkip(iLastSkip);
            this.firePress();
          }.bind(this),
        });

        this.addItem(oFirstButton);
        this.addItem(oBackButton);
        this.addItem(oLabel);
        this.addItem(oNextButton);
        this.addItem(oLastButton);
      },

      onAfterRendering: function (oEvent) {
        HBox.prototype.onAfterRendering.apply(this, arguments);

        this._setLabelText();
        this._setButtonsEnabled();
      },

      _setLabelText: function () {
        const sId = `${this.getId()}_label`;
        const aItems = this.getItems();
        const oLabel = aItems.filter((i) => i.getId() === sId)[0];
        let sText = "";

        const sCurrentPage = this.getSkip() / this.getTop() + 1;
        const sTotalPage = Math.ceil(this.getRecords() / this.getTop());

        sText = sCurrentPage + " di " + sTotalPage;

        oLabel.setText(sText);
      },

      _setButtonsEnabled: function () {
        const sId = this.getId();
        const aItems = this.getItems();

        const oFirstButton = aItems.filter((i) => i.getId() === `${sId}_firstButton`)[0];
        const oBackButton = aItems.filter((i) => i.getId() === `${sId}_backButton`)[0];
        const oNextButton = aItems.filter((i) => i.getId() === `${sId}_nextButton`)[0];
        const oLastButton = aItems.filter((i) => i.getId() === `${sId}_lastButton`)[0];

        oFirstButton.setEnabled(this.getSkip() > 0);
        oBackButton.setEnabled(this.getSkip() > 0);
        oNextButton.setEnabled(this.getTop() + this.getSkip() < this.getRecords());
        oLastButton.setEnabled(this.getTop() + this.getSkip() < this.getRecords());
      },
    });
  }
);
