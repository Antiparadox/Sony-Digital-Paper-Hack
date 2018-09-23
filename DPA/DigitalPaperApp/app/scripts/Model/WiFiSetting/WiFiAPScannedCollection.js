var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiAPScannedCollection = (function (_super) {
            __extends(WiFiAPScannedCollection, _super);
            function WiFiAPScannedCollection(deviceModel) {
                _super.call(this, deviceModel);
                this.model = Model.WiFiAPStatusModel;
            }
            WiFiAPScannedCollection.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    method = Model.BackboneSyncDefs.METHOD_NAME_CREATE;
                    options.urlPath = '/system/controls/wifi_accesspoints/scan';
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiAPScannedCollection.prototype.parse = function (response, options) {
                var wifiAPStatusList;
                if (!response) {
                    return [];
                }
                wifiAPStatusList = response[Model.WiFiAPStatusDefs.PARSE_NAME_APLIST];
                if (!wifiAPStatusList) {
                    return [];
                }
                return wifiAPStatusList;
            };
            return WiFiAPScannedCollection;
        }(Model.BaseDPAPICollection));
        Model.WiFiAPScannedCollection = WiFiAPScannedCollection;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiAPScannedCollection.js.map