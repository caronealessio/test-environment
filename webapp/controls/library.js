sap.ui.define(["sap/ui/core/Core", "sap/ui/core/library"], function (Core) {
  "use strict";

  /**
   * Test Environment Controls Library
   *
   * @namespace testenvironment.controls
   * @name testenvironment.controls
   * @public
   */
  Core.initLibrary({
    name: "testenvironment.controls",
    version: "1.0.0",
    dependencies: ["sap.ui.core"],
    controls: ["testenvironment.controls.input.InputCustom", "testenvironment.controls.input.LabeledInputCustom"],
  });

  return testenvironment.controls;
});
