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
            var DialogWpsCountdown = (function (_super) {
                __extends(DialogWpsCountdown, _super);
                function DialogWpsCountdown(dialogName) {
                    _super.call(this, dialogName);
                }
                DialogWpsCountdown.prototype.setInitValue = function (info) {
                    $('#dialog-message').html(info.message);
                    if (info.pin) {
                        $('#wpsPin').removeClass('hide');
                        $('#pinCode').text(info.pin);
                    }
                    var me = this;
                    var TIMER = info.time;
                    var countdownInterval = info.countdownInterval;
                    $('#remainTime').text($.i18n.t('page.wifiDetail.wpsPin.remainTime', { time: TIMER }));
                    var intervalId = setInterval(function () {
                        $('#remainTime').text($.i18n.t('page.wifiDetail.wpsPin.remainTime', { time: TIMER }));
                        TIMER--;
                        if (TIMER < 0) {
                            clearInterval(intervalId);
                            me.closeDialog(me);
                        }
                    }, countdownInterval * 1000);
                };
                return DialogWpsCountdown;
            }(DPMW.View.Dialog.DialogBase));
            Dialog.DialogWpsCountdown = DialogWpsCountdown;
            var loadingDialog = new DialogWpsCountdown(View.Dialog.DialogName.DIALOG_WPS_COUNTDOWN);
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogWpsCountdown.js.map