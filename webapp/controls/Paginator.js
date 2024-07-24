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
        },
        aggregations: {
          content: { singleName: "content" },
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
          })
        );
        this.insertAggregation("content", new Label("labelPage"));
        this.insertAggregation(
          "content",
          new ToggleButton("backButton", {
            icon: "sap-icon://slim-arrow-left",
            tooltip: "{i18n>labelBack}",
          })
        );
        this.insertAggregation("content", new ToolbarSpacer());

        console.log(this);
      },

      renderer: function (oRm, oToolbar) {
        sap.m.OverflowToolbarRenderer.render(oRm, oToolbar);
      },

      //   <OverflowToolbar id="paginatorStandard"
      //   style="Clear"
      //   visible="{RiaPdgPaginator>/visible}"
      //   app:backFunction="onRiaPdgPaginator"
      //   app:nextFunction="onRiaPdgPaginator"
      //   app:paginatorName="RiaPdgPaginator">
      //   <ToolbarSpacer />
      //   <ToggleButton icon="sap-icon://slim-arrow-left"
      //     enabled="{RiaPdgPaginator>/backEnabled}"
      //     press="onPaginatorBack"
      //     tooltip="{i18n>btnNext}" />
      //   <Label text="{RiaPdgPaginator>/start} - {RiaPdgPaginator>/end}" />
      //   <ToggleButton icon="sap-icon://slim-arrow-right"
      //     enabled="{RiaPdgPaginator>/nextEnabled}"
      //     press="onPaginatorNext"
      //     tooltip="{i18n>btnBack}" />
      //   <ToolbarSpacer />
      // </OverflowToolbar>
    });
  }
);
