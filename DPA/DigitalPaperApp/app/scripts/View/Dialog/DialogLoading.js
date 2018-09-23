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
            var DialogLoading = (function (_super) {
                __extends(DialogLoading, _super);
                function DialogLoading(dialogName) {
                    _super.call(this, dialogName);
                }
                DialogLoading.prototype.setInitValue = function (info) {
                    if (info.cancelable === false) {
                        $('#btn-area').hide();
                        $('.main').css('bottom', 0);
                    }
                    $('#wait-message').text(info.message);
                };
                return DialogLoading;
            }(DPMW.View.Dialog.DialogBase));
            Dialog.DialogLoading = DialogLoading;
            var loadingDialog = new DialogLoading(View.Dialog.DialogName.DIALOG_LOADING);
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogLoading.js.map