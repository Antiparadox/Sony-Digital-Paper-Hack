var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var SoftwareUpdate;
        (function (SoftwareUpdate) {
            var SoftwareUpdateDialog = (function (_super) {
                __extends(SoftwareUpdateDialog, _super);
                function SoftwareUpdateDialog(softwareUpdateView) {
                    _super.call(this, View.Dialog.DialogName.WINDOW_SOFTWARE_UPDATE_FOUND, softwareUpdateView);
                }
                SoftwareUpdateDialog.prototype.setInitValue = function (info) {
                    this.initInfo = info;
                };
                SoftwareUpdateDialog.prototype.getFirstAndLastItem = function () {
                    this.firstItem = $("#agree-yes-lbl", "#software-update-eula");
                    this.lastItem = $("#cancel-button", "#software-update-eula");
                };
                return SoftwareUpdateDialog;
            }(View.Dialog.DialogBase));
            SoftwareUpdate.SoftwareUpdateDialog = SoftwareUpdateDialog;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateDialog.js.map