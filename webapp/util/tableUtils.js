// @ts-check

sap.ui.define([], function () {
  "use strict";

  return {
    getSelectedItems: function (oTable) {
      const aSelectedIndex = oTable.getSelectedIndices();

      if (aSelectedIndex.length === 0) {
        return [];
      }

      const aSelectedRecords = aSelectedIndex.map((iIndex) => {
        return oTable.getContextByIndex(iIndex).getObject();
      });

      return aSelectedRecords;
    },
  };
});
