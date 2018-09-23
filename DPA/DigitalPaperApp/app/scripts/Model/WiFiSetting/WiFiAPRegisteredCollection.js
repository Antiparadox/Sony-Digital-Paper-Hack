var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiAPRegisteredCollection = (function (_super) {
            __extends(WiFiAPRegisteredCollection, _super);
            function WiFiAPRegisteredCollection(deviceModel) {
                _super.call(this, deviceModel);
                this.model = Model.WiFiAPConfigModel;
            }
            WiFiAPRegisteredCollection.prototype.create = function (attributes, options) {
                options = $.extend(true, { wait: true }, options);
                return _super.prototype.create.call(this, attributes, $.extend(true, options, { parse: false }));
            };
            WiFiAPRegisteredCollection.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    options.urlPath = "/system/configs/wifi_accesspoints";
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiAPRegisteredCollection.prototype.parse = function (response, options) {
                var wifiAPConfigList;
                if (!response) {
                    return [];
                }
                wifiAPConfigList = response[Model.WiFiAPConfigDefs.PARSE_NAME_APLIST];
                if (!wifiAPConfigList) {
                    return [];
                }
                for (var i in wifiAPConfigList) {
                    var apConfig = wifiAPConfigList[i];
                    apConfig['id'] = apConfig[Model.WiFiAPConfigDefs.ATTR_NAME_SSID] + '_'
                        + apConfig[Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY];
                }
                return wifiAPConfigList;
            };
            return WiFiAPRegisteredCollection;
        }(Model.BaseDPAPICollection));
        Model.WiFiAPRegisteredCollection = WiFiAPRegisteredCollection;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiAPRegisteredCollection.js.map