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
            var DialogWifiSetting = (function (_super) {
                __extends(DialogWifiSetting, _super);
                function DialogWifiSetting(wifiSettingView) {
                    _super.call(this, View.Dialog.DialogName.WINDOW_WIFI_SETTING, wifiSettingView);
                }
                DialogWifiSetting.prototype.closeDialog = function (me) {
                    DPMW.appCtrl.terminate();
                    _super.prototype.closeDialog.call(this, me);
                };
                return DialogWifiSetting;
            }(View.Dialog.DialogBase));
            Setting.DialogWifiSetting = DialogWifiSetting;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogWifiSetting.js.map