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
            var WifiSettingPage = (function (_super) {
                __extends(WifiSettingPage, _super);
                function WifiSettingPage() {
                    _super.call(this, "/templates/wifi_setting.html", "page-wifi-setting", { route: "wifi-setup-view" });
                    this._view = null;
                }
                WifiSettingPage.prototype.onPageInit = function (event) {
                    console.log(event);
                    _super.prototype.onPageInit.call(this, event);
                    console.log("WifiSettingPage.onPageInit()");
                    this._view = new Setting.WifiSettingView({ el: "#page-pc-wifi-setup-view" });
                    var remote = require('electron').remote;
                    var curwin = remote.getCurrentWindow();
                    curwin.setTitle($.i18n.t('config.wifi.title'));
                };
                WifiSettingPage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    console.log("WifiSettingPage.onPageRemove()");
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return WifiSettingPage;
            }(CDP.Framework.Page));
            var wifiSettingPage = new WifiSettingPage;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiSettingPage.js.map