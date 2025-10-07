sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * Crea una copia profonda di un array (o oggetto) senza mantenere i riferimenti agli oggetti originali.
     *
     * Questa funzione utilizza `JSON.parse()` e `JSON.stringify()` per creare una copia profonda e
     * deserializza automaticamente qualsiasi stringa data (formato ISO 8601) in oggetti `Date`.
     *
     * @param {Array|Object} oArray L'array o l'oggetto da copiare.
     * @returns {Array|Object} Una copia profonda dell'array o dell'oggetto di input, con le date correttamente deserializzate.
     */
    copyWithoutRef: function (oArray) {
      /**
       * Funzione di supporto per deserializzare le stringhe di data in oggetti Date.
       *
       * @param {string} key La chiave della proprietà corrente in elaborazione.
       * @param {any} value Il valore della proprietà corrente in elaborazione.
       * @returns {any} Il valore deserializzato, con le stringhe di data convertite in oggetti Date.
       */
      function json_deserialize_helper(key, value) {
        if (typeof value === "string") {
          var regexp;
          regexp = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.exec(value);
          if (regexp) {
            return new Date(value);
          }
        }
        return value;
      }

      return JSON.parse(JSON.stringify(oArray), json_deserialize_helper);
    },

    /**
     * Valida una lista di controlli SAPUI5 ricorsivamente.
     * Controlla:
     * - ValueState = Error
     * - Required Input (value mancante)
     * - Required ComboBox/Select (selectedKey mancante)
     *
     * @param {sap.ui.core.Control[]} aControls - Array di controlli da validare
     * @returns {{valid: boolean, message: string}} Risultato validazione
     */
    validateControls: function (aControls) {
      let bValid = true;
      let sMessage = "";

      const checkControls = (aCtrls) => {
        (aCtrls || []).forEach((control) => {
          const aChildren = []
            .concat(control && control.getItems ? control.getItems() : [])
            .concat(control && control.getContent ? control.getContent() : [])
            .concat(control && control.getCells ? control.getCells() : [])
            .concat(control && control.getFormElements ? control.getFormElements() : [])
            .concat(control && control.getFields ? control.getFields() : []);

          if (aChildren.length > 0) {
            checkControls(aChildren);
          }

          // ValueState = Error
          if (control && control.getValueState && control.getValueState() === sap.ui.core.ValueState.Error) {
            sMessage = control.getValueStateText();
            bValid = false;
          }

          // Required Input
          if (control?.getRequired && control?.getRequired() && control?.getValue) {
            if (!control.getValue()) {
              // control.setValueState(sap.ui.core.ValueState.Error);
              // control.setValueStateText("Campo obbligatorio");
              sMessage = "Valorizza tutti i campi obbligatori";
              bValid = false;
            }
          }

          // Required ComboBox / Select
          if (control instanceof sap.m.ComboBox || control instanceof sap.m.Select) {
            if (control?.getRequired && control?.getRequired()) {
              if (!control.getSelectedKey()) {
                // control.setValueState(sap.ui.core.ValueState.Error);
                // control.setValueStateText("Campo obbligatorio");
                sMessage = "Valorizza tutti i campi obbligatori";
                bValid = false;
              }
            }
          }
        });
      };

      checkControls(aControls);

      return { valid: bValid, message: sMessage };
    },

    /**
     * Ripulisce tutti i ValueState dei controlli in una vista.
     *
     * @param {sap.ui.core.mvc.View} oView - La vista di partenza
     */
    clearAllValueStates: function (oView) {
      if (!oView) {
        return;
      }

      // Prendo tutti i controlli della view
      const aControls = oView.findAggregatedObjects(true);

      aControls.forEach((control) => {
        // Ripulisce ValueState per gli input e simili
        if (control?.setValueState) {
          control.setValueState(sap.ui.core.ValueState.None);
        }
        if (control?.setValueStateText) {
          control.setValueStateText("");
        }
      });
    },
  };
});
