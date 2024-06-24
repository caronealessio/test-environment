sap.ui.define(
  [
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "cruscottoria/model/formatter",
    "sap/m/library",
    "sap/ui/core/BusyIndicator",
    ,
  ],
  function (BaseController, JSONModel, Filter, FilterOperator, formatter, mobileLibrary, BusyIndicator) {
    "use strict";

    const { MessageBox } = mobileLibrary;

    return BaseController.extend("cruscottoria.controller.Entity", {
      /**
       *  Inserire queste entità nel BaseController e aggiungere:
       *  - formatter: convertDateInUTCRome, convertVarInUTCRome
       */

      /**
       * @param {string} sPath parameter
       * @param {array} [aFilters] optional parameter
       * @param {object} [oUrlParameters] optional parameter
       * @param {boolean} [bPrint] optional parameter
       * @param {boolean} [bCount] optional parameter
       * @param {integer} [sTop] optional parameter
       * @param {integer} [sSkip] optional parameter
       */
      getEntitySet: async function (
        sPath,
        aFilters = [],
        oUrlParameters = {},
        bPrint = true,
        bCount = false,
        iTop = 0,
        iSkip = 0
      ) {
        var self = this;
        var oDataModel = this.getModel();

        var oUrlParametersStandard = {
          $top: iTop,
          $skip: iSkip,
          $inlinecount: bCount ? "allpages" : "",
        };

        var oUrlParametersMerge = { ...oUrlParametersStandard, ...oUrlParameters };

        BusyIndicator.show(0);
        return new Promise(async function (resolve, reject) {
          await oDataModel.read(sPath, {
            filters: aFilters,
            urlParameters: oUrlParametersMerge,
            success: function (data, oResponse) {
              BusyIndicator.hide();
              var oMessage = self.handlerHeaderMessage(oResponse, bPrint);
              resolve({
                success: true,
                data: data?.results,
                message: oMessage,
                count: parseInt(data?.__count),
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              resolve({
                success: false,
                data: null,
                message: null,
                count: null,
              });
              reject(error);
              self.handlerError();
            },
          });
        });
      },

      /**
       * @param {string} sPath parameter
       * @param {object} oKey parameter
       * @param {object} [oUrlParameters] optional parameter
       * @param {boolean} [bPrint] optional parameter
       * @param {string} [sExpand] optional parameter
       */
      getEntity: async function (sPath, oKey, oUrlParameters = {}, bPrint = true, sExpand = "") {
        var self = this;
        var oDataModel = this.getModel();

        var sKey = oDataModel.createKey(sPath, oKey);
        oUrlParameters["$expand"] = sExpand;

        BusyIndicator.show(0);
        return new Promise(async function (resolve, reject) {
          await oDataModel.read(sKey, {
            urlParameters: oUrlParameters,
            success: function (data, oResponse) {
              BusyIndicator.hide();
              var oMessage = self.handlerHeaderMessage(oResponse, bPrint);
              resolve({
                success: true,
                data: data,
                message: oMessage,
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              reject(error);
              resolve({
                success: false,
                data: null,
                message: null,
              });
              self.handlerError();
            },
          });
        });
      },

      /**
       * @param {string} sPath
       * @param {object} oKey
       * @param {boolean} [bPrint]
       * @returns
       */
      deleteEntity: async function (sPath, oKey, oUrlParameters = {}, bPrint = true) {
        var self = this;
        var oDataModel = this.getModel();

        var sKey = oDataModel.createKey(sPath, oKey);

        BusyIndicator.show(0);
        return new Promise(async function (resolve, reject) {
          oDataModel.remove(sKey, {
            urlParameters: oUrlParameters,
            method: "DELETE",
            success: function (data, oResponse) {
              BusyIndicator.hide();
              var oMessage = self.handlerHeaderMessage(oResponse, bPrint);

              resolve({
                success: true,
                data: data,
                message: oMessage,
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              self.handlerError();
              resolve({
                success: false,
                data: null,
                message: null,
              });
              reject(error);
            },
          });
        });
      },

      /**
       * @param {string} sPath
       * @param {object} oKey
       * @param {boolean} [bPrint]
       */
      createEntity: async function (sPath, oKey, oUrlParameters = {}, bPrint = true) {
        var self = this;
        var oDataModel = this.getModel();

        BusyIndicator.show(0);
        return new Promise(async function (resolve, reject) {
          oDataModel.create(sPath, oKey, {
            urlParameters: oUrlParameters,
            success: function (data, oResponse) {
              BusyIndicator.hide();
              var oMessage = self.handlerHeaderMessage(oResponse, bPrint);

              resolve({
                success: true,
                data: data,
                message: oMessage,
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              self.handlerError();
              resolve({
                success: false,
                data: null,
                message: null,
              });
              reject(error);
            },
          });
        });
      },

      /**
       * @param {string} sPath
       * @param {object} oKey
       * @param {object} oData
       * @param {object} [oUrlParameters]
       * @param {boolean} [bPrint]
       */
      updateEntity: async function (sPath, oKey, oData, oUrlParameters = {}, bPrint = true) {
        var self = this;
        var oDataModel = this.getModel();

        var sKey = oDataModel.createKey(sPath, oKey);

        BusyIndicator.show(0);
        return new Promise(async function (resolve, reject) {
          oDataModel.update(sKey, oData, {
            urlParameters: oUrlParameters,
            success: function (data, oResponse) {
              BusyIndicator.hide();
              var oMessage = self.handlerHeaderMessage(oResponse, bPrint);

              resolve({
                success: true,
                data: data,
                message: oMessage,
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              self.handlerError();
              resolve({
                success: false,
                data: null,
                message: null,
              });
              reject(error);
            },
          });
        });
      },

      /**
       *
       * @param {string} sPath
       * @param {object} oKey
       * @param {object} [oUrlParameters]
       * @param {boolean} [bPrint]
       * @returns
       */
      deepEntity: async function (sPath, oKey, oUrlParameters = {}, bPrint = true) {
        var self = this;
        var oDataModel = this.getModel();

        oKey = formatter.convertVarInUTCRome(oKey);

        BusyIndicator.show(0);
        return new Promise(async function (resolve, reject) {
          oDataModel.create(sPath, oKey, {
            urlParameters: oUrlParameters,
            success: function (data, oResponse) {
              BusyIndicator.hide();
              // var oMessage = self.handlerDeepMessage(data?.ErrorMessages, bPrint);

              resolve({
                success: !oMessage?.error,
                data: data,
                message: oMessage,
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              self.handlerError();
              resolve({
                success: false,
                data: null,
                message: null,
              });
              reject(error);
            },
          });
        });
      },

      /**
       * @param {string} sFunctionName
       * @param {string} sMethod
       * @param {object} oUrlParameters
       * @returns
       */
      callFunctionImport: async function (sFunctionName, sMethod, oUrlParameters) {
        var self = this;
        var oDataModel = this.getModel();

        BusyIndicator.show(0);

        return new Promise(async function (resolve, reject) {
          await oDataModel.callFunction(sFunctionName, {
            method: sMethod,
            urlParameters: oUrlParameters,
            success: function (data, oResponse) {
              BusyIndicator.hide();
              resolve({
                success: true,
                data: data,
              });
            },
            error: function (error) {
              BusyIndicator.hide();
              resolve({
                success: false,
                data: null,
              });
              reject(error);
              self.handlerError();
            },
          });
        });
      },

      //#region **********************GESTIONE MESSAGGI*************************

      /**
       * Gestione eccezioni
       */
      handlerError: function () {
        var oMessageManager = sap.ui.getCore().getMessageManager();
        var oMessageModel = oMessageManager.getMessageModel();

        this._bMessageOpen = false;

        this.oMessageModelBinding = oMessageModel.bindList(
          "/",
          undefined,
          [],
          new Filter("technical", FilterOperator.EQ, true)
        );

        this.oMessageModelBinding.attachChange(function (oEvent) {
          var aContexts = oEvent.getSource().getContexts(),
            aMessages = [];

          if (this._bMessageOpen || !aContexts.length) {
            return;
          }

          // Extract and remove the technical messages
          aContexts.forEach(function (oContext) {
            aMessages.push(oContext.getObject());
          });
          oMessageManager.removeMessages(aMessages);

          MessageBox.error(aMessages[0].message, {
            actions: [MessageBox.Action.CLOSE],
            onClose: function () {
              this._bMessageOpen = false;
            }.bind(this),
          });
        }, this);
      },

      /**
       * Gestione messaggi contenuti nella testata, lato BE nel Message Container
       */
      handlerHeaderMessage: function (oResponse, bPrint = true) {
        if (!oResponse?.headers["sap-message"]) {
          return null;
        }
        var oMessage = JSON.parse(oResponse.headers["sap-message"]);

        switch (oMessage.severity) {
          case "error":
            if (bPrint) {
              MessageBox.error(oMessage.message);
            }
            break;
          case "success":
            if (bPrint) {
              MessageBox.success(oMessage.message);
            }
            break;
          case "warning":
            if (bPrint) {
              MessageBox.warning(oMessage.message);
            }
            break;
          case "info":
            if (bPrint) {
              MessageBox.warning(oMessage.message);
            }
            break;
        }

        return { severity: oMessage.severity, message: oMessage.message };
      },

      /**
       * Gestione dei messaggi per la DEEP con la formattazione per il MessagePopover
       *
       * @param {object} oMessages
       * @param {boolean} [bPrint]
       * @returns
       */
      handlerDeepMessage: function (aMessages, bPrint = true) {
        var aMessage = [];
        var bError = false;
        var oMessagePopup;
        var aMessageNotFormatted = [];

        aMessages?.map((oMessage) => {
          if (oMessage.IsPopup) {
            oMessagePopup = {
              type: formatter.formatSeverity(oMessage.Type),
              title: oMessage.Title,
              subtitle: oMessage.Subtitle,
            };
          } else {
            aMessageNotFormatted.push(oMessage);
            aMessage.push({
              type: formatter.formatSeverity(oMessage.Type),
              title: oMessage.Title,
              subtitle: oMessage.Subtitle,
              description: oMessage.Subtitle.length > 55 ? oMessage.Subtitle : null,
              tabKey: oMessage?.TabKey,
              active: oMessage?.TabKey ? true : false,
            });
          }

          if (oMessage.Type === "E" || oMessage.Type === "W") {
            bError = true;
          }
        });

        if (bPrint && oMessagePopup) {
          switch (oMessagePopup?.type) {
            case "Error":
              MessageBox.error(oMessagePopup.subtitle);
              break;
            case "Warning":
              MessageBox.warning(oMessagePopup.subtitle);
              break;
            case "Information":
              MessageBox.information(oMessagePopup.subtitle);
              break;
            case "Success":
              MessageBox.success(oMessagePopup.subtitle);
              break;
          }
        }

        this.setModel(new JSONModel(aMessage), "Message");
        this.aErrorMessages = aMessageNotFormatted;

        return { noPopup: aMessage, popup: oMessagePopup, error: bError };
      },

      //#endregion
    });
  }
);
