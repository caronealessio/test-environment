sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  return {
    /**
     * Esegue una richiesta di tipo `read` per recuperare un insieme di entità (EntitySet) dal modello OData.
     * Supporta filtri, ordinamento, e parametri opzionali come il numero di record da recuperare e da saltare.
     *
     * @param {string} sPath - Il percorso dell'EntitySet da leggere (es. "/EntitySet").
     * @param {array} [aFilters=[]] - Filtri opzionali da applicare alla richiesta.
     * @param {object} [oUrlParameters={}] - Parametri URL opzionali da aggiungere alla richiesta.
     * @param {number} [iTop=0] - Numero di record da recuperare (0 per nessun limite).
     * @param {number} [iSkip=0] - Numero di record da saltare (usato per la paginazione).
     * @param {string} [sSort=""] - Ordine dei record da recuperare.
     * @param {string} [sExpand=""] - Parametri di espansione per recuperare entità correlate.
     *
     * @returns {Promise<object>} - Una promessa che restituisce un oggetto con i dati dell'EntitySet e informazioni aggiuntive come il conteggio totale dei record.
     *
     * @throws {Error} - Lancia un errore se la richiesta OData fallisce, con un messaggio di errore dettagliato.
     */
    async getEntitySet(sPath, aFilters = [], oUrlParameters = {}, iTop = 0, iSkip = 0, sSort = "", sExpand = "") {
      try {
        const oDataModel = this.getModel();

        const oUrlParametersStandard = {
          $top: iTop,
          $skip: iSkip,
          $inlinecount: "allpages",
          $orderby: sSort,
          $expand: sExpand,
        };

        const oUrlParametersMerge = { ...oUrlParametersStandard, ...oUrlParameters };

        const data = await new Promise((resolve, reject) => {
          oDataModel.read(sPath, {
            filters: aFilters,
            urlParameters: oUrlParametersMerge,
            success: (data, response) => resolve({ data, response }),
            error: (error) => reject(error),
          });
        });

        return {
          data: data.data?.results || [],
          response: data.response,
          count: parseInt(data.data?.__count, 10) || 0,
        };
      } catch (error) {
        const errorMessage = entityUtils.getErrorMessage(error);

        throw new Error(`${errorMessage || error?.message || error}`);
      }
    },

    /**
     * Esegue una richiesta di tipo `read` per recuperare una singola entità dal modello OData.
     * Utilizza una chiave specifica per individuare l'entità richiesta, supportando anche parametri URL e espansione di entità correlate.
     *
     * @param {string} sPath - Il percorso dell'entità da leggere (es. "/EntitySet/ID").
     * @param {object} oKey - Oggetto che rappresenta la chiave dell'entità (es. {ID: 1}).
     * @param {object} [oUrlParameters={}] - Parametri URL opzionali da aggiungere alla richiesta.
     * @param {string} [sExpand=""] - Parametri di espansione per recuperare entità correlate.
     *
     * @returns {Promise<object>} - Una promessa che restituisce i dati dell'entità e la risposta completa.
     *
     * @throws {Error} - Lancia un errore se la richiesta OData fallisce, con un messaggio di errore dettagliato.
     */
    async getEntity(sPath, oKey, oUrlParameters = {}, sExpand = "") {
      try {
        const oDataModel = this.getModel();
        const sKey = oDataModel.createKey(sPath, oKey);
        oUrlParameters["$expand"] = sExpand;

        const data = await new Promise((resolve, reject) => {
          oDataModel.read(sKey, {
            urlParameters: oUrlParameters,
            success: (data, response) => resolve({ data, response }),
            error: (error) => reject(error),
          });
        });

        return {
          data: data.data,
          response: data.response,
        };
      } catch (error) {
        const errorMessage = entityUtils.getErrorMessage(error);

        throw new Error(` ${errorMessage || error?.message || error}`);
      }
    },

    /**
     * Esegue una richiesta di tipo `create` su un endpoint OData specificato, passando un payload e opzioni aggiuntive come i parametri URL.
     * Prima di inviare la richiesta, il payload viene convertito ricorsivamente in formato UTC (fuso orario Roma) utilizzando un formatter personalizzato.
     * Restituisce una promessa che si risolve con i dati ricevuti dalla risposta OData o rifiuta con l'errore in caso di fallimento.
     *
     * @param {string} sPath - Il percorso dell'entità OData su cui eseguire la creazione (es. "/EntitySet").
     * @param {object} oPayload - Il corpo della richiesta contenente i dati da inviare al backend.
     * @param {object} [oUrlParameters={}] - Parametri opzionali da aggiungere all'URL della richiesta OData.
     *
     * @returns {Promise<{data: object, response: object}>} - Una promessa che restituisce un oggetto contenente i dati della risposta OData
     *    e la risposta stessa, se la richiesta ha avuto successo. In caso di errore, la promessa verrà rifiutata con un errore.
     *
     * @throws {Error} - Lancia un errore se la richiesta OData fallisce, con un messaggio di errore dettagliato.
     */
    createEntity: async function (sPath, oPayload, oUrlParameters = {}) {
      try {
        const oDataModel = this.getModel();

        oPayload = formatter.convertRecorsiveInUTCRome(oPayload);

        const data = await new Promise(async function (resolve, reject) {
          oDataModel.create(sPath, oPayload, {
            urlParameters: oUrlParameters,
            success: (data, response) => resolve({ data, response }),
            error: (error) => reject(error),
          });
        });

        return {
          data: data.data,
          response: data.response,
        };
      } catch (error) {
        const errorMessage = entityUtils.getErrorMessage(error);

        throw new Error(` ${errorMessage || error?.message || error}`);
      }
    },

    /**
     * Esegue una richiesta di tipo `delete` su un endpoint OData specificato, utilizzando la chiave dell'entità per identificarla.
     * Accetta opzionalmente dei parametri URL per personalizzare la richiesta.
     * Restituisce una promessa che si risolve con i dati ricevuti dalla risposta OData o rifiuta con l'errore in caso di fallimento.
     *
     * @param {string} sPath - Il percorso dell'entità OData su cui eseguire l'eliminazione (es. "/EntitySet").
     * @param {object} oKey - Oggetto che rappresenta la chiave dell'entità da eliminare (es. { ID: "123" }).
     * @param {object} [oUrlParameters={}] - Parametri opzionali da aggiungere all'URL della richiesta OData.
     *
     * @returns {Promise<{data: object, response: object}>} - Una promessa che restituisce un oggetto contenente i dati della risposta OData
     *    e la risposta stessa, se la richiesta ha avuto successo. In caso di errore, la promessa verrà rifiutata con un errore.
     *
     * @throws {Error} - Lancia un errore se la richiesta OData fallisce, con un messaggio di errore dettagliato.
     */
    deleteEntity: async function (sPath, oKey, oUrlParameters = {}) {
      try {
        const oDataModel = this.getModel();
        const sKey = oDataModel.createKey(sPath, oKey);

        const data = await new Promise((resolve, reject) => {
          oDataModel.remove(sKey, {
            urlParameters: oUrlParameters,
            method: "DELETE",
            success: (data, response) => resolve({ data, response }),
            error: (error) => reject(error),
          });
        });

        return {
          data: data.data,
          response: data.response,
        };
      } catch (error) {
        const errorMessage = entityUtils.getErrorMessage(error);

        throw new Error(` ${errorMessage || error?.message || error}`);
      }
    },

    /**
     * Esegue una richiesta di tipo `update` su un endpoint OData specificato, utilizzando la chiave dell'entità e i dati aggiornati.
     * Permette di aggiornare i dati nel backend e supporta anche parametri URL opzionali.
     * Restituisce una promessa che si risolve con i dati ricevuti dalla risposta OData o rifiuta con l'errore in caso di fallimento.
     *
     * @param {string} sPath - Il percorso dell'entità OData su cui eseguire l'aggiornamento (es. "/EntitySet").
     * @param {object} oKey - Oggetto che rappresenta la chiave dell'entità da aggiornare (es. { ID: "123" }).
     * @param {object} oData - I nuovi dati da inviare al backend per aggiornare l'entità.
     * @param {object} [oUrlParameters={}] - Parametri opzionali da aggiungere all'URL della richiesta OData.
     *
     * @returns {Promise<{data: object, response: object}>} - Una promessa che restituisce un oggetto contenente i dati della risposta OData
     *    e la risposta stessa, se la richiesta ha avuto successo. In caso di errore, la promessa verrà rifiutata con un errore.
     *
     * @throws {Error} - Lancia un errore se la richiesta OData fallisce, con un messaggio di errore dettagliato.
     */
    updateEntity: async function (sPath, oKey, oData, oUrlParameters = {}, bCallGetEntity = true) {
      try {
        const oDataModel = this.getModel();
        const sKey = oDataModel.createKey(sPath, oKey);

        const data = await new Promise((resolve, reject) => {
          oDataModel.update(sKey, oData, {
            urlParameters: oUrlParameters,
            success: async (data, response) => {
              if (bCallGetEntity) {
                const read = await this.getEntity(sPath, oKey);

                resolve({ data: read.data, response: response });
              } else {
                resolve({ data: data, response: response });
              }
            },
            error: (error) => reject(error),
          });
        });

        return {
          data: data.data,
          response: data.response,
        };
      } catch (error) {
        const errorMessage = entityUtils.getErrorMessage(error);

        throw new Error(` ${errorMessage || error?.message || error}`);
      }
    },

    /**
     * Esegue una chiamata a una funzione OData (Function Import) specificata tramite il nome della funzione, il metodo HTTP e parametri opzionali.
     * La funzione OData viene invocata utilizzando il modello OData, e la risposta viene restituita tramite una promessa.
     *
     * @param {string} sFunctionName - Il nome della funzione OData da chiamare (es. "/MyFunctionImport").
     * @param {string} sMethod - Il metodo HTTP da utilizzare per la richiesta (es. "GET", "POST").
     * @param {object} [oUrlParameters={}] - Parametri URL opzionali da aggiungere alla richiesta OData.
     *
     * @returns {Promise<{data: object, response: object}>} - Una promessa che restituisce i dati della risposta OData e la risposta stessa in caso di successo.
     *
     * @throws {Error} - Lancia un errore se la richiesta OData fallisce, con un messaggio di errore dettagliato.
     */
    functionImport: async function (sFunctionName, sMethod, oUrlParameters) {
      try {
        const oDataModel = this.getModel();

        const data = await new Promise(async function (resolve, reject) {
          await oDataModel.callFunction(sFunctionName, {
            method: sMethod,
            urlParameters: oUrlParameters,
            success: (data, response) => resolve({ data, response }),
            error: (error) => reject(error),
          });
        });

        return {
          data: data.data,
          response: data.response,
        };
      } catch (error) {
        const errorMessage = entityUtils.getErrorMessage(error);

        throw new Error(`${errorMessage || error?.message || error}`);
      }
    },
  };
});
