var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var ExternalOutputPage = (function (_super) {
                __extends(ExternalOutputPage, _super);
                function ExternalOutputPage() {
                    _super.call(this, "/templates/external_output.html", "external-output-view", { route: "external_output" });
                    this._view = null;
                }
                ExternalOutputPage.prototype.onPageInit = function (event) {
                    console.log("ExternalOutputPage.onPageInit()");
                    console.log(event);
                    _super.prototype.onPageInit.call(this, event);
                    this._view = new ExternalOutput.ExternalOutputView({ el: "#external-output-view" });
                };
                ExternalOutputPage.prototype.onPageRemove = function (event) {
                    console.log("ExternalOutputPage.onPageRemove()");
                    _super.prototype.onPageRemove.call(this, event);
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return ExternalOutputPage;
            }(CDP.Framework.Page));
            var externalOutputPage = new ExternalOutputPage();
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExternalOutputPage.js.map