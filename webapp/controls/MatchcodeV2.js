sap.ui.define(
  [
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/SearchField",
    "sap/ui/comp/filterbar/FilterBar",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (ValueHelpDialog, JSONModel, Column, Label, Text, SearchField, FilterBar, Filter, FilterOperator) {
    "use strict";

    return ValueHelpDialog.extend("testenvironment.controls.MatchcodeV2", {
      /**
       * Costruttore per il MatchcodeV2.
       *
       * @param {object} oConfig - Configurazione del dialogo.
       * @param {string} oConfig.title - Titolo del dialogo.
       * @param {Array} oConfig.data - Dati da visualizzare nella tabella.
       * @param {Array} oConfig.columns - Configurazione delle colonne della tabella.
       * @param {sap.ui.model.Model} oConfig.model - Modello esterno da aggiornare.
       * @param {string} oConfig.modelPath - Percorso del modello esterno da aggiornare.
       * @param {function} [oConfig.onOk] - Funzione di callback personalizzata per l'evento OK.
       * @param {boolean} [oConfig.supportMultiselect] - Abilita o meno il multiselezione.
       * @param {Array} oConfig.filters - Filtri per la FilterBar { field, label }.
       */
      constructor: function (oConfig) {
        // Chiamata al costruttore padre
        ValueHelpDialog.apply(this, [
          {
            title: oConfig.title || "Seleziona Valore",
            supportMultiselect: oConfig.supportMultiselect || false,
          },
        ]);

        // Memorizza il modello e il path
        this.oExternalModel = oConfig.model; // Modello esterno da aggiornare
        this.sModelPath = oConfig.modelPath; // Percorso del modello da aggiornare
        this.aFilters = oConfig.filters || [];
        this.fnCustomOkHandler = oConfig.onOk || this._defaultOkHandler.bind(this); // Callback OK personalizzata

        // Configura la FilterBar con barra di ricerca e filtri
        this._createFilterBar(oConfig.filters);

        // Gestione degli eventi
        this.attachOk(this.fnCustomOkHandler);
        this.attachCancel(this._onCancelPress.bind(this));

        // Modello interno per i dati della tabella
        this.setModel(new JSONModel(oConfig.data));

        // Configura le colonne della tabella
        this._configureColumns(oConfig.columns);
      },

      renderer: function (oRm, oValueHelpDialog) {
        sap.ui.comp.valuehelpdialog.ValueHelpDialogRenderer.render(oRm, oValueHelpDialog);
      },

      /**
       * Crea una FilterBar dinamica con barra di ricerca e filtri specificati.
       *
       * @param {Array} aFilters - Array di oggetti con { field, label } per i filtri.
       * @private
       */
      _createFilterBar: function (aFilters) {
        // Creazione della barra di ricerca
        var oSearchField = new SearchField({
          placeholder: "Cerca...",
          liveChange: this._onSearch.bind(this),
        });

        // Creazione dei filtri
        var oFilterBar = new FilterBar({
          advancedMode: true,
          filterItems: aFilters.map(function (oFilter) {
            return new sap.ui.comp.filterbar.FilterItem({
              name: oFilter.field,
              label: oFilter.label,
              control: new sap.m.Input(),
            });
          }),
          search: this._onSearch.bind(this),
        });

        // Aggiunta della barra di ricerca alla FilterBar
        oFilterBar.setBasicSearch(oSearchField);
        this.setFilterBar(oFilterBar);
      },

      /**
       * Configura le colonne della tabella usando `sap.ui.table.Column`.
       *
       * @param {object[]} aColumns - Array di oggetti con { label, template } per definire le colonne.
       * @private
       */
      _configureColumns: function (aColumns) {
        aColumns.forEach(
          function (oColumn) {
            this.getTable().addColumn(
              new Column({
                label: new Label({ text: oColumn.label }),
                template: new Text({ text: "{" + oColumn.template + "}" }),
              })
            );
          }.bind(this)
        );

        // Carica e binda i dati nella tabella
        this.getTableAsync().then(
          function (oTable) {
            oTable.setModel(this.getModel());
            oTable.bindRows("/");
          }.bind(this)
        );
      },

      /**
       * Funzione di ricerca per filtrare i dati della tabella in base alla query.
       *
       * @param {sap.ui.base.Event} oEvent - Evento liveChange o search del SearchField.
       * @private
       */
      _onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
        var aSelectionSet = oEvent.getParameter("selectionSet");

        //Creo i filtri per i vari input
        var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
          if (oControl.getValue()) {
            aResult.push(
              new Filter({
                path: oControl.getName(),
                operator: FilterOperator.Contains,
                value1: oControl.getValue(),
              })
            );
          }

          return aResult;
        }, []);

        //Recupero le colonne e creo i filtri per il SearchField
        this.getTable()
          .getColumns()
          .map((oColumn) => {
            var sValue = oColumn.getTemplate().getBindingPath("text");

            aSearchFilters.push(new Filter({ path: sValue, operator: FilterOperator.Contains, value1: sSearchQuery }));
          });

        aFilters.push(new Filter({ filters: aSearchFilters, and: false }));

        // Creazione del filtro per la query
        var oFilter = new Filter({
          filters: this.aFilters.map(function (oFilter) {
            return new Filter(oFilter.field, FilterOperator.Contains, sQuery);
          }),
          and: false,
        });

        this.getTable()
          .getBinding("rows")
          .filter(sQuery ? [oFilter] : []);
      },

      /**
       * Gestisce l'evento OK e aggiorna il modello esterno con il valore selezionato.
       * Se non è presente una funzione personalizzata, viene usata la funzione di default.
       *
       * @param {sap.ui.base.Event} oEvent - Evento di selezione OK.
       * @private
       */
      _defaultOkHandler: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        if (aTokens.length > 0) {
          var oSelectedData = {
            id: aTokens[0].getKey(),
            name: aTokens[0].getText(),
          };

          // Aggiorna il modello esterno
          this.oExternalModel.setProperty(this.sModelPath, oSelectedData);
        }
        this.close();
      },

      /**
       * Gestisce l'evento Cancel.
       *
       * @private
       */
      _onCancelPress: function () {
        this.close();
      },
    });
  }
);
