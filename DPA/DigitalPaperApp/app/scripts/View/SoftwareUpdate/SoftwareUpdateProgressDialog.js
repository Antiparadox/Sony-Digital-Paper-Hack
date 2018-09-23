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
            var SoftwareUpdateProgressDialog = (function (_super) {
                __extends(SoftwareUpdateProgressDialog, _super);
                function SoftwareUpdateProgressDialog(softwareUpdateProgressView) {
                    _super.call(this, View.Dialog.DialogName.WINDOW_SOFTWARE_UPDATE_PROGRESS, softwareUpdateProgressView);
                }
                SoftwareUpdateProgressDialog.prototype.setInitValue = function (info) {
                    this.initInfo = info;
                };
                return SoftwareUpdateProgressDialog;
            }(View.Dialog.DialogBase));
            SoftwareUpdate.SoftwareUpdateProgressDialog = SoftwareUpdateProgressDialog;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateProgressDialog.js.map