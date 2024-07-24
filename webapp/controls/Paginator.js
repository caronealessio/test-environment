sap.ui.define(
  ["sap/m/OverflowToolbar", "sap/m/ToolbarSpacer", "sap/m/Label", "sap/m/ToggleButton"],
  function (OverflowToolbar, ToolbarSpacer, Label, ToggleButton) {
    "use strict";

    return OverflowToolbar.extend("testenvironment.controls.Paginator", {
      metadata: {
        properties: {
          style: {
            type: "string",
            defaultValue: "Clear",
          },
          top: {
            type: "int",
            defaultValue: 100,
          },
          skip: {
            type: "int",
            defaultValue: 0,
          },
          records: {
            type: "int",
          },
        },
        aggregations: {
          content: { singleName: "content" },
        },
        events: {
          press: {},
        },
      },

      init: function () {
        OverflowToolbar.prototype.init.call(this);

        this.insertAggregation("content", new ToolbarSpacer());
        this.insertAggregation(
          "content",
          new ToggleButton("nextButton", {
            icon: "sap-icon://slim-arrow-right",
            tooltip: "{i18n>labelNext}",
            press: this._onNext.bind(this),
          })
        );
        this.insertAggregation("content", new Label("label"));
        this.insertAggregation(
          "content",
          new ToggleButton("backButton", {
            icon: "sap-icon://slim-arrow-left",
            tooltip: "{i18n>labelBack}",
            press: this._onBack.bind(this),
          })
        );
        this.insertAggregation("content", new ToolbarSpacer());
      },

      renderer: function (oRm, oToolbar) {
        sap.m.OverflowToolbarRenderer.render(oRm, oToolbar);

        oToolbar._setLabel();
        oToolbar._setBackEnabled();
        oToolbar._setNextEnabled();

        console.log();
      },

      getTop: function () {
        return this.getProperty("top");
      },

      getSkip: function () {
        return this.getProperty("skip");
      },

      getRecords: function () {
        return this.getProperty("records");
      },

      setTop: function (sValue) {
        this.setProperty("top", sValue);
        return this;
      },

      setSkip: function (sValue) {
        this.setProperty("skip", sValue);
        return this;
      },

      _setLabel: function () {
        var oLabel = this.getContent().filter((x) => x.getId() === "label")[0];

        var sFrom = this.getSkip() + 1;
        var sTo = this.getSkip() + this.getTop();
        sTo = sTo < this.getRecords() ? sTo : this.getRecords();

        oLabel.setText(sFrom + " - " + sTo);
      },

      _setBackEnabled: function () {
        var oButton = this.getContent().filter((x) => x.getId() === "backButton")[0];

        oButton.setEnabled(this.getSkip() > 0);
      },

      _setNextEnabled: function () {
        var oButton = this.getContent().filter((x) => x.getId() === "nextButton")[0];

        oButton.setEnabled(this.getTop() + this.getSkip() < this.getRecords());
      },

      _onNext: function (oEvent) {
        this.setSkip(this.getSkip() + this.getTop());
        this.firePress(oEvent);
      },

      _onBack: function (oEvent) {
        this.setSkip(this.getSkip() - this.getTop());
        this.firePress(oEvent);
      },
    });
  }
);
