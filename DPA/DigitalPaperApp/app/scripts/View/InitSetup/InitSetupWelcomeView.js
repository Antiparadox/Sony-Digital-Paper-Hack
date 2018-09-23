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
            var InitSetupWelcomeView = (function (_super) {
                __extends(InitSetupWelcomeView, _super);
                function InitSetupWelcomeView(dialog, options) {
                    _super.call(this, dialog, options);
                    this.tagName = "div";
                    var electron = require('electron');
                    var regctrl = electron.remote.require('mw-reg-ctrl');
                }
                InitSetupWelcomeView.prototype.getNextView = function () {
                    return new InitSetup.InitSetupRegisterView(this.dialog_, {
                        el: "#page-pc-register-view",
                        id: "page-pc-register-view",
                        attributes: { index: 1, menuId: 'menu-welcome' }
                    });
                };
                return InitSetupWelcomeView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.InitSetupWelcomeView = InitSetupWelcomeView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupWelcomeView.js.map