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
            var InitSetupPage = (function (_super) {
                __extends(InitSetupPage, _super);
                function InitSetupPage() {
                    _super.call(this, "/templates/settingsview.html", "page-settings-main", { route: "welcomeview" });
                    this._view = null;
                }
                InitSetupPage.prototype.onPageInit = function (event) {
                    _super.prototype.onPageInit.call(this, event);
                    this._view = new InitSetup.InitSetupMainView({ el: "#page-settings-main" });
                };
                InitSetupPage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return InitSetupPage;
            }(CDP.Framework.Page));
            var initSetupPage = new InitSetupPage;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupPage.js.map