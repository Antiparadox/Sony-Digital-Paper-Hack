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
            var SoftwareUpdatePage = (function (_super) {
                __extends(SoftwareUpdatePage, _super);
                function SoftwareUpdatePage() {
                    _super.call(this, '/templates/software_update.html', 'page-software-update', { route: 'software_update' });
                    this._view = null;
                }
                SoftwareUpdatePage.prototype.onPageInit = function (event) {
                    _super.prototype.onPageInit.call(this, event);
                    this._view = new SoftwareUpdate.SoftwareUpdateView({ el: '#page-software-update' });
                };
                SoftwareUpdatePage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    console.log('SoftwareUpdatePage.onPageRemove()');
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return SoftwareUpdatePage;
            }(CDP.Framework.Page));
            var softwareUpdatePage = new SoftwareUpdatePage;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdatePage.js.map