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
        this.getView().setModel(oModel, sName);
        return this.getModel(sName);
      },

      /**
       * Get a global model from the core. Optionally specify the model name.
       *
       * @param {string} [sName] The name of the model. If not provided, the default global model is returned.
       * @returns {sap.ui.model.Model} The global model instance from the core.
       */
      getGlobalModel: function (sName) {
        return sap.ui.getCore().getModel(sName);
      },

      /**
       * Set a global model on the core. Optionally specify a model name.
       *
       * @param {sap.ui.model.Model} oModel The model to be set globally on the core.
       * @param {string} [sName] The name of the model. If not provided, the model is set as the default global model.
       * @returns {sap.ui.model.Model} The global model instance that was set on the core.
       */
      setGlobalModel: function (oModel, sName) {
        sap.ui.getCore().setModel(oModel, sName);
        return sap.ui.getCore().getModel(sName);
      },

      /**
       * Get the router instance for the current component.
       *
       * @returns {sap.ui.core.routing.Router} The router instance associated with this component.
       */
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
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
       * Imposta lo stato di "busy" (occupato) della vista.
       * Quando il parametro `bBusy` è impostato su `true`, la vista viene considerata occupata
       * e viene visualizzato un indicatore di caricamento (di solito un "busy indicator").
       * Quando `bBusy` è impostato su `false`, l'indicatore di caricamento viene rimosso
       * e la vista torna al suo stato normale.
       *
       * @param {boolean} bBusy - Stato di "busy". `true` per mostrare l'indicatore di caricamento, `false` per nasconderlo.
       */
      setBusy: function (bBusy) {
        this.getView().setBusy(bBusy);
      },

      /**
       * Restituisce una stringa localizzata dal modello di risorse i18n del componente.
       * Utilizza il modello "i18n" definito nel componente per accedere al bundle delle traduzioni,
       * permettendo di ottenere facilmente testi localizzati in base alla chiave fornita.
       *
       * @param {string} sKey - La chiave della stringa localizzata da recuperare (definita nei file i18n.properties).
       * @returns {string} La stringa tradotta corrispondente alla chiave specificata.
       */
      getText: function (sKey) {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
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
        return sap.ui.core.Fragment.load({
          id: oView.getId(),
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
       * @param {string|number} [id] Un ID opzionale per filtrare i dati (es. per leggere un singolo elemento).
       * @returns {Promise<Object>} Una promessa che restituisce i dati letti dall'endpoint come oggetto JSON.
       */
      read: async function (sEndpoint, sId, sParams = "") {
        try {
          let sKey = sId ? `/${sId}` : "";

          const response = await fetch(`http://localhost:3000/${sEndpoint}${sKey}${sParams}`);

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }

          return await response.json();
        } catch (error) {
          throw error;
        }
      },

      /**
       * Effettua una richiesta POST per creare nuovi dati su un endpoint specificato utilizzando fetch.
       *
       * @param {string} sEndpoint L'endpoint su cui inviare i dati (es. "users", "products").
       * @param {Object} oData I dati da inviare nel corpo della richiesta (oggetto JSON).
       * @returns {Promise<Object>} Una promessa che restituisce la risposta del server, se presente, come oggetto JSON.
       */
      create: async function (sEndpoint, oData) {
        try {
          const response = await fetch(`http://localhost:3000/${sEndpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(oData),
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      },

      /**
       * Effettua una richiesta DELETE per eliminare più elementi da un endpoint specificato.
       *
       * @param {string} sEndpoint L'endpoint su cui effettuare la richiesta (es. "menu-items").
       * @param {Array<number>} aIds Array di ID degli elementi da eliminare.
       * @returns {Promise<Object>} Una promessa che restituisce la risposta del server come oggetto JSON.
       */
      delete: async function (sEndpoint, aIds) {
        try {
          const response = await fetch(`http://localhost:3000/${sEndpoint}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: aIds }),
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      },

      /**
       * Effettua una richiesta PUT per aggiornare un elemento specifico in un endpoint fornito.
       *
       * @param {string} sEndpoint - L'endpoint API a cui inviare la richiesta (es. "menu-items").
       * @param {string|number} sId - L'ID dell'elemento da modificare.
       * @param {Object} oData - I nuovi dati da aggiornare per l'elemento.
       * @returns {Promise<Object>} - Una promessa che restituisce l'oggetto aggiornato come JSON.
       */
      edit: async function (sEndpoint, sId, oData) {
        try {
          const response = await fetch(`http://localhost:3000/${sEndpoint}/${sId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(oData),
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      },
    });
  }
);
