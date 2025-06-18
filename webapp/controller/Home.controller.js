// @ts-check

sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "testenvironment/model/formatter", "sap/m/MessageToast"],

  function (BaseController, JSONModel, formatter, MessageToast) {
    "use strict";

    const CAPTCHA_KEY = "6Lfp4EkrAAAAAGAzLu6Roj_bWDxRvdADpsVQTYlx";

    return BaseController.extend("testenvironment.controller.Home", {
      onInit: function () {
        this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: async function () {
        //Gestione CAPTCHA
        const oVBoxCaptcha = this.byId("boxCaptcha");

        const oCaptcha = new sap.ui.core.HTML({
          content: "<div class='g-recaptcha' data-sitekey='6Lfp4EkrAAAAAGAzLu6Roj_bWDxRvdADpsVQTYlx'></div>",
        });

        oVBoxCaptcha.addItem(oCaptcha);
      },

      onAfterRendering: function () {
        if (window.grecaptcha) {
          grecaptcha.render(document.querySelector(".g-recaptcha"), {
            sitekey: "6Lfp4EkrAAAAAGAzLu6Roj_bWDxRvdADpsVQTYlx",
          });
        }
      },

      onTest: function () {
        var currentTheme = sap.ui.getCore().getConfiguration().getTheme();

        var newTheme = currentTheme === "sap_fiori_3" ? "sap_fiori_3_dark" : "sap_fiori_3";

        sap.ui.getCore().applyTheme(newTheme);
      },

      onTokenCaptcha: function () {
        const token = grecaptcha.getResponse();
        MessageToast.show("Token Captcha: " + token);
      },
    });
  }
);
