var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Setting;
        (function (Setting) {
            var DialogGeneralSetting = (function (_super) {
                __extends(DialogGeneralSetting, _super);
                function DialogGeneralSetting(dialogName) {
                    _super.call(this, dialogName);
                    this.ownerEl = $('#owner');
                    this.dateFormatEl = $('#date-format');
                    this.timeFormatEl = $('#time-format');
                    this.timeoutToStandbyEl = $('#timeout-to-standby');
                    this.timeZoneEl = $('#time-zone');
                }
                DialogGeneralSetting.prototype.setInitValue = function (info) {
                    console.log(info);
                    this.ownerEl.val(info.owner);
                    this.dateFormatEl.val(info.date_format);
                    this.timeFormatEl.val(info.time_format);
                    this.timeoutToStandbyEl.val(info.timeout_to_standby);
                    this.timeZoneEl.val(info.time_zone);
                };
                DialogGeneralSetting.prototype.setDefaultFocus = function () {
                    this.ownerEl.focus();
                    $(this.ownerEl).addClass('outline-clear');
                };
                DialogGeneralSetting.prototype.getUserInput = function () {
                    var me = this;
                    var userInput = new View.Dialog.DialogInfo.DialogGeneralSettingInfo();
                    userInput.time_zone = this.timeZoneEl.val();
                    userInput.date_format = this.dateFormatEl.val();
                    userInput.time_format = this.timeFormatEl.val();
                    userInput.timeout_to_standby = this.timeoutToStandbyEl.val();
                    userInput.owner = this.ownerEl.val();
                    return userInput;
                };
                return DialogGeneralSetting;
            }(View.Dialog.DialogBase));
            Setting.DialogGeneralSetting = DialogGeneralSetting;
            var dialogGeneralSetting = new DialogGeneralSetting(View.Dialog.DialogName.DIALOG_GENERAL_SETTING);
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogGeneralSetting.js.map