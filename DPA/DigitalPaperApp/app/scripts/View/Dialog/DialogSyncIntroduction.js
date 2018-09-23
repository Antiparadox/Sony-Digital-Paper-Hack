var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var DialogSyncIntroduction = (function (_super) {
                __extends(DialogSyncIntroduction, _super);
                function DialogSyncIntroduction(dialogName) {
                    _super.call(this, dialogName);
                }
                DialogSyncIntroduction.prototype.setInitValue = function (info) {
                };
                return DialogSyncIntroduction;
            }(DPMW.View.Dialog.DialogBase));
            Dialog.DialogSyncIntroduction = DialogSyncIntroduction;
            var dialogSyncIntroduction = new DialogSyncIntroduction(Dialog.DialogName.DIALOG_SYNC_INTRODUCTION);
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogSyncIntroduction.js.map