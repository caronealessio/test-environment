sap.ui.define(["sap/m/Input", "sap/m/InputRenderer"], function (Input, InputRenderer) {
  "use strict";

  const InputType = {
    Text: "Text",
    Email: "Email",
    FiscalCode: "FiscalCode",
    Integer: "Integer",
    Phone: "Phone",
  };

  return Input.extend("testenvironment.controls.input.CustomInput", {
    metadata: {
      properties: {
        /**
         * Tipo di input accettato dal controllo.
         * Valori possibili:
         * - "Text": testo libero
         * - "Email": indirizzi email validi
         * - "FiscalCode": codici fiscali italiani validi
         * - "Integer": numeri interi
         * - "Phone": numeri di telefono
         */
        type: {
          type: "string",
          defaultValue: "Text",
        },
      },
    },

    init: function () {
      Input.prototype.init.apply(this, arguments);

      this.attachLiveChange(this._onLiveChange.bind(this));
      this.attachBrowserEvent("keypress", this._onKeyPress.bind(this));
    },

    _onLiveChange: function (oEvent) {
      const sType = this.getType();
      const oInput = oEvent.getSource();

      let value = oEvent.getParameter("value") || "";
      let regex = null;

      switch (sType) {
        case InputType.Email:
          regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!value || regex.test(value)) {
            oInput.setValueState("None");
            oInput.setValueStateText("");
          } else {
            oInput.setValueState("Error");
            oInput.setValueStateText("Email non valida");
          }
          break;
        case InputType.FiscalCode:
          regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]$/;

          if (!value) {
            oInput.setValueState("None");
            oInput.setValueStateText("");
            return;
          }

          if (value.length < 16) {
            oInput.setValueState("Error");
            oInput.setValueStateText("Il codice fiscale deve essere di 16 caratteri");
            return;
          } else {
            oInput.setValueState("None");
            oInput.setValueStateText("");
          }

          if (regex.test(value)) {
            oInput.setValueState("None");
            oInput.setValueStateText("");
          } else {
            oInput.setValueState("Error");
            oInput.setValueStateText("Codice fiscale non valido");
          }
          break;
        case InputType.Phone:
          if (!value || value.length === 10) {
            oInput.setValueState("None");
            oInput.setValueStateText("");
          } else {
            oInput.setValueState("Error");
            oInput.setValueStateText("Il numero di telefono deve essere di 10 cifre");
          }
          break;
      }
    },

    _onKeyPress: function (oEvent) {
      const sType = this.getType();

      switch (sType) {
        case InputType.FiscalCode:
          const char = oEvent.key;
          // Se è una lettera minuscola blocco l'evento
          if (char >= "a" && char <= "z") {
            oEvent.preventDefault();
          }
          break;
        case InputType.Integer:
        case InputType.Phone:
          const key = oEvent.key;

          if (!/^\d$/.test(key)) {
            oEvent.preventDefault();
          }
          break;
      }
    },

    setType: function (sValue) {
      this.setProperty("type", sValue, true);

      switch (sValue) {
        case InputType.FiscalCode:
          this.setMaxLength(16);
          break;
        case InputType.Phone:
          this.setMaxLength(10);
          break;
      }

      return this;
    },

    renderer: InputRenderer,
  });
});
