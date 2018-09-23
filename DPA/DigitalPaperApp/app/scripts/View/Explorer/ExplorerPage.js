var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var ExplorerPage = (function (_super) {
                __extends(ExplorerPage, _super);
                function ExplorerPage() {
                    _super.call(this, "/templates/explorer_baseview.html", "page-main-function", { route: "explorer_baseview" });
                    this.view_ = null;
                }
                ExplorerPage.prototype.onPageInit = function (event) {
                    _super.prototype.onPageInit.call(this, event);
                    this.view_ = new Explorer.ExplorerBaseView({ el: "#page-main-function" });
                };
                ExplorerPage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    if (this.view_) {
                        this.view_.stopListening();
                        this.view_ = null;
                    }
                };
                ExplorerPage.prototype.onPageShow = function (event) {
                    _super.prototype.onPageShow.call(this, event);
                };
                return ExplorerPage;
            }(CDP.Framework.Page));
            if (!process.env.MW_DEV_APP_OLD) {
                var explorerPage = new ExplorerPage;
            }
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerPage.js.map