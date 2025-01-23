sap.ui.define([], function () {
  "use strict";

  return {
    /**
     * Mostra un messaggio di errore utilizzando sap.m.MessageBox.
     * @param {string} sMessage - Messaggio da mostrare.
     */
    showErrorMessage: function (sMessage) {
      sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
        MessageBox.error(sMessage);
      });
    },

    /**
     * Recupera un componente da un ID, ricorrendo nella gerarchia parent finché non trova un _oContainingView valorizzato.
     * @param {sap.ui.core.Control} oControl - Il controllo di partenza.
     * @param {string} sId - L'ID del componente da cercare.
     * @returns {sap.ui.core.Control|null} Il componente trovato o null.
     */
    findComponentById: function (oControl, sId) {
      while (oControl) {
        if (oControl._oContainingView) {
          return oControl._oContainingView.byId(sId);
        }
        oControl = oControl.getParent();
      }
      return null;
    },

    /**
     * Recupera la vista associata a un componente, risalendo la gerarchia dei genitori fino a trovare un `_oContainingView` valorizzato.
     *
     * @param {sap.ui.core.Control} oControl - Il controllo di partenza.
     * @param {string} sId - L'ID del componente da cercare (non più necessario per il ritorno della vista).
     * @returns {sap.ui.core.mvc.View|null} La vista trovata o `null` se non viene trovata.
     */
    findViewByControl: function (oControl) {
      // Risali nella gerarchia dei genitori del controllo
      while (oControl) {
        // Verifica se il controllo ha un _oContainingView valorizzato
        if (oControl._oContainingView) {
          // Restituisce la vista associata
          return oControl._oContainingView;
        }
        // Passa al genitore successivo
        oControl = oControl.getParent();
      }
      // Se non viene trovata alcuna vista, restituisce null
      return null;
    },

    /**
     * Determina il tipo di campo di un componente SAPUI5 basandosi sulle informazioni di binding o su dati personalizzati.
     *
     * @param {sap.ui.core.Control} oComponent Il componente SAPUI5 per cui si vuole determinare il tipo di campo.
     * @returns {string|null} Il tipo di campo determinato, che può essere:
     * - "integer", "float" (se definito nei dati personalizzati del componente)
     * - "time", "date", "currency" (a seconda del tipo di formattazione del binding del componente)
     * - "boolean" (se il componente è una casella di controllo)
     * - null (se non è possibile determinare il tipo)
     */
    getFieldType: function (oComponent) {
      // Verifica se il componente contiene un valore di tipo definito nei dati personalizzati
      if (oComponent?.data("type")) {
        return oComponent.data("type"); // Esempi: integer, float
      }

      // Recupera le informazioni di binding del componente (priorità: "text", poi "value")
      var oBinding = oComponent.getBindingInfo("text") || oComponent.getBindingInfo("value");

      // Se esiste un tipo associato al binding, lo determina
      if (oBinding?.type) {
        var oType = oBinding.type;

        if (oType?.oFormat?.type) {
          return oType.oFormat.type; // Esempio: time
        } else if (typeof oType.getName === "function") {
          return oType.getName().toLowerCase(); // Esempi: date, currency
        }
      }

      // Controlla se il componente è una casella di controllo
      if (oComponent.getMetadata().getName() === "sap.m.CheckBox") {
        return "boolean"; // Tipo booleano
      }

      // Valore di default se non viene trovato un tipo
      return null;
    },

    /**
     * Recupera il percorso di binding o la proprietà associata a un campo.
     *
     * @param {sap.ui.core.Control} oField Il campo (componente SAPUI5) per cui si vuole determinare la proprietà.
     * @returns {string|null} Il percorso di binding del campo, o un valore di proprietà personalizzata se presente.
     *                       Restituisce `null` se non è possibile determinare la proprietà.
     */
    getFieldProperty: function (oField) {
      // Verifica e restituisce il primo percorso di binding disponibile per il campo
      return (
        oField.getBindingPath("value") ||
        oField.getBindingPath("selectedKey") ||
        oField.getBindingPath("text") ||
        oField.getBindingPath("selected") ||
        oField.getBindingPath("src") ||
        oField?.data("property") || // Verifica proprietà personalizzata
        null // Restituisce null se nessuna proprietà è trovata
      );
    },
  };
});
