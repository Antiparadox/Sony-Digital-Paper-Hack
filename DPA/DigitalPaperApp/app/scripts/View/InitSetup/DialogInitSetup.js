var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var InitSetup;
        (function (InitSetup) {
            var DialogInitSetup = (function (_super) {
                __extends(DialogInitSetup, _super);
                function DialogInitSetup(initSetupMainView) {
                    _super.call(this, View.Dialog.DialogName.WINDOW_INIT_SETUP, initSetupMainView);
                }
                DialogInitSetup.prototype.getUserInput = function () {
                    var userInput = {
                        deviceId: DPMW.appCtrl.currentDeviceId,
                    };
                    return userInput;
                };
                DialogInitSetup.prototype.closeDialog = function (me) {
                    DPMW.appCtrl.terminate();
                    _super.prototype.closeDialog.call(this, me);
                };
                DialogInitSetup.prototype.getFirstAndLastItem = function () {
                    this.firstItem = $("#next", "#page-pc-welcome-view");
                    this.lastItem = $("#cancel", "#page-pc-welcome-view");
                };
                return DialogInitSetup;
            }(View.Dialog.DialogBase));
            InitSetup.DialogInitSetup = DialogInitSetup;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogInitSetup.js.map