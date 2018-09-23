var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var DeviceSearch;
        (function (DeviceSearch) {
            var DeviceSearchPage = (function (_super) {
                __extends(DeviceSearchPage, _super);
                function DeviceSearchPage() {
                    _super.call(this, "/templates/device_search.html", "page-device-search-view", { route: "device_search" });
                    this._view = null;
                }
                DeviceSearchPage.prototype.onPageInit = function (event) {
                    _super.prototype.onPageInit.call(this, event);
                    console.log("DeviceSearchPage.onPageInit()");
                    this._view = new DeviceSearch.DeviceListView({ el: "#page-device-search-view" });
                };
                DeviceSearchPage.prototype.onPageBeforeCreate = function (event) {
                    console.log("DeviceSearchPage.onPageBeforeCreate()");
                };
                DeviceSearchPage.prototype.onPageBeforeShow = function (event) {
                    console.log("DeviceSearchPage.onPageBeforeShow()");
                };
                DeviceSearchPage.prototype.onPageRemove = function (event) {
                    _super.prototype.onPageRemove.call(this, event);
                    console.log("DeviceSearchPage.onPageRemove()");
                    if (this._view) {
                        this._view.stopListening();
                        this._view = null;
                    }
                };
                return DeviceSearchPage;
            }(CDP.Framework.Page));
            DeviceSearch.DeviceSearchPage = DeviceSearchPage;
            var deviceSearch = new DeviceSearchPage;
        })(DeviceSearch = View.DeviceSearch || (View.DeviceSearch = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceSearchPage.js.map