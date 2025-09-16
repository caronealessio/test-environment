sap.ui.define(
  ["sap/m/DatePicker", "sap/m/DatePickerRenderer", "sap/ui/model/type/Date"],
  function (DatePicker, DatePickerRenderer, DateType) {
    "use strict";

    return DatePicker.extend("testenvironment.controls.datepicker.DatePickerCustom", {
      metadata: {
        properties: {
          /**
           * Path del modello da bindare
           */
          path: { type: "string", defaultValue: "" },
          placeholder: { type: "string", defaultValue: " " },
        },
      },

      init: function () {
        DatePicker.prototype.init.apply(this, arguments);

        // Se è stato passato un path lo bindiamo automaticamente
        const sPath = this.getPath();
        if (sPath) {
          this._bindPath(sPath);
        }
      },

      setPath: function (sPath) {
        this.setProperty("path", sPath, true);
        this._bindPath(sPath);
        return this;
      },

      _bindPath: function (sPath) {
        if (!sPath) return;

        this.bindValue({
          path: sPath,
          type: new DateType({ pattern: "dd/MM/yyyy" }),
        });
      },

      renderer: DatePickerRenderer,
    });
  }
);
