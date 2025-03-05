// @ts-check

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "testenvironment/model/formatter",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, Fragment, formatter, JSONModel) {
    "use strict";

    return Controller.extend("testenvironment.controller.BaseController", {
      formatter: formatter,
      /**
       * Get the router instance for the current component.
       *
       * @returns {sap.ui.core.routing.Router} The router instance associated with this component.
       */
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      /**
       * Get the model for the view. Optionally specify the model name.
       *
       * @param {string} [sName] The name of the model. If not provided, the default model is returned.
       * @returns {sap.ui.model.Model} The model instance associated with the view.
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Set a model on the view. Optionally specify a model name.
       *
       * @param {sap.ui.model.Model} oModel The model to be set on the view.
       * @param {string} [sName] The name of the model. If not provided, the model is set as the default model.
       * @returns {void}
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Get the resource bundle for internationalization (i18n).
       *
       * @returns {sap.ui.model.resource.ResourceModel} The resource model for the i18n.
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      /**
       * Navigate to a different route using the router.
       *
       * @param {string} sName The name of the route to navigate to.
       * @param {Object} [oParameters] Optional parameters to pass to the route.
       * @param {boolean} [bReplace] If true, replaces the current entry in the history with the new one (optional).
       * @returns {void}
       */
      navTo: function (sName, oParameters, bReplace) {
        this.getRouter().navTo(sName, oParameters, undefined, bReplace);
      },

      /**
       * Carica un frammento di vista (fragment) in modo asincrono e lo aggiunge come dipendente della vista corrente.
       * Se il frammento è già stato caricato, restituisce l'istanza già esistente per evitare il caricamento ripetuto.
       *
       * @param {string} sFragmentName Il nome del frammento da caricare (deve essere un percorso relativo o completo).
       * @param {string} [sFragmentId] Un identificativo opzionale per il frammento. Se non fornito, verrà usato l'ID della vista.
       * @returns {Promise<sap.ui.core.Fragment>} Una promessa che restituisce l'oggetto frammento caricato.
       */
      loadFragment: function (sFragmentName, sFragmentId) {
        var oView = this.getView();
        var sId = sFragmentId || oView.getId() + "--" + sFragmentName;

        // Controlla se il frammento è già caricato e lo restituisce direttamente
        var oFragment = oView.byId(sId);
        if (oFragment) {
          return Promise.resolve(oFragment);
        }

        // Carica il frammento in modo asincrono
        return Fragment.load({
          id: sId,
          name: sFragmentName,
          controller: this,
        }).then(
          function (oFragment) {
            // Aggiunge il frammento come dipendente della vista
            oView.addDependent(oFragment);

            // Se necessario, aggiungi altre logiche di configurazione o binding qui (ad esempio, il modello "i18n")
            oFragment.setModel(this.getModel("i18n"), "i18n");

            // Restituisce il frammento caricato
            return oFragment;
          }.bind(this)
        );
      },

      /**
       * Effettua una richiesta GET per leggere i dati da un endpoint specificato usando fetch.
       *
       * @param {string} sEndpoint L'endpoint da cui leggere i dati (es. "users", "products").
       * @returns {Promise<Object>} Una promessa che restituisce i dati letti dall'endpoint come oggetto JSON.
       */
      read: async function (sEndpoint) {
        try {
          const response = await fetch(`http://localhost:3000/${sEndpoint}/`);

          // Controlla se la risposta è valida
          if (!response.ok) {
            throw new Error(`Errore nel caricamento dei dati da ${sEndpoint}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Errore nella richiesta GET:", error);
          throw error; // Rilancia l'errore per la gestione da parte del chiamante
        }
      },

      /**
       * Effettua una richiesta POST per creare nuovi dati su un endpoint specificato utilizzando fetch.
       *
       * @param {string} sEndpoint L'endpoint su cui inviare i dati (es. "users", "products").
       * @param {Object} oData I dati da inviare nel corpo della richiesta (oggetto JSON).
       * @returns {Promise<Object>} Una promessa che restituisce la risposta del server, se presente, come oggetto JSON.
       */
      create: function (sEndpoint, oData) {
        return fetch(`http://localhost:3000/${sEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(oData),
        })
          .then((response) => {
            // Controlla se la risposta è valida (status HTTP 2xx)
            if (!response.ok) {
              throw new Error(`Errore nella creazione dei dati su ${sEndpoint}`);
            }
            // Restituisce la risposta come oggetto JSON
            return response.json();
          })
          .catch((error) => {
            console.error("Errore nella richiesta POST:", error);
            throw error; // Rilancia l'errore per la gestione da parte del chiamante
          });
      },
    });
  }
);
