sap.ui.define([], function () {
  "use strict";

  return {
    buildQueryString(filters) {
      const params = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

      return params.length > 0 ? `?${params.join("&")}` : "";
    },
  };
});
