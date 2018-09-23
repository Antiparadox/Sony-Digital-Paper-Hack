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
            var SettingPage = (function (_super) {
                __extends(SettingPage, _super);
                function SettingPage() {
                    _super.call(this, "/templates/settingview.html", "page-setting-view", { route: "settingview" });
                    this._view = null;
                }
                SettingPage.prototype.onPageInit = function (event) {
                    console.log(event);
                    _super.prototype.onPageInit.call(this, event);
                    console.log("SettingsPageView.onPageInit()");
                    this._view = new Setting.SettingView({ el: "#page-setting-view" });
                };
                SettingPage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    console.log("SettingsPageView.onPageRemove()");
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return SettingPage;
            }(CDP.Framework.Page));
            var settingPage = new SettingPage;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SettingPage.js.map