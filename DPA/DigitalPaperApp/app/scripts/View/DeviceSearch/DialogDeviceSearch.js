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
            var DialogDeviceSearch = (function (_super) {
                __extends(DialogDeviceSearch, _super);
                function DialogDeviceSearch(deviceListView) {
                    _super.call(this, View.Dialog.DialogName.WINDOW_DEVICE_SEARCH, deviceListView);
                    this.firstItem = $("#cancel-button");
                }
                DialogDeviceSearch.prototype.closeDialog = function (me) {
                    DPMW.appCtrl.terminate();
                    _super.prototype.closeDialog.call(this, me);
                };
                DialogDeviceSearch.prototype.getFirstAndLastItem = function () {
                    var submitBtTabindex = $("#submit-button", "#page-device-search-view").attr('tabindex');
                    if (submitBtTabindex === '1') {
                        this.firstItem = $("#submit-button");
                        this.lastItem = $("#cancel-button");
                    }
                    else {
                        this.firstItem = $("#cancel-button");
                        this.lastItem = $("#cancel-button");
                    }
                };
                return DialogDeviceSearch;
            }(View.Dialog.DialogBase));
            DeviceSearch.DialogDeviceSearch = DialogDeviceSearch;
        })(DeviceSearch = View.DeviceSearch || (View.DeviceSearch = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogDeviceSearch.js.map