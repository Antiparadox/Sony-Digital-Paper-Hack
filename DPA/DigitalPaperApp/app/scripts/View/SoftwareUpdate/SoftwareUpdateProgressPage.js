var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var SoftwareUpdate;
        (function (SoftwareUpdate) {
            var SoftwareUpdateProgressPage = (function (_super) {
                __extends(SoftwareUpdateProgressPage, _super);
                function SoftwareUpdateProgressPage() {
                    _super.call(this, '/templates/software_update_progress.html', 'page-software-update-progress', { route: 'software_update_progress' });
                    this._view = null;
                }
                SoftwareUpdateProgressPage.prototype.onPageInit = function (event) {
                    _super.prototype.onPageInit.call(this, event);
                    this._view = new SoftwareUpdate.SoftwareUpdateProgressView({ el: '#page-software-update-progress' });
                };
                SoftwareUpdateProgressPage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return SoftwareUpdateProgressPage;
            }(CDP.Framework.Page));
            var softwareUpdateProgressPage = new SoftwareUpdateProgressPage;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateProgressPage.js.map