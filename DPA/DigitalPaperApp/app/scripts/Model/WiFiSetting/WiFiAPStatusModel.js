var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiAPStatusModel = (function (_super) {
            __extends(WiFiAPStatusModel, _super);
            function WiFiAPStatusModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            WiFiAPStatusModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.WiFiAPStatusDefs.ATTR_NAME_SSID] = null;
                attributes[Model.WiFiAPStatusDefs.ATTR_NAME_SECURITY] = null;
                attributes[Model.WiFiAPStatusDefs.ATTR_NAME_STATE] = null;
                attributes[Model.WiFiAPStatusDefs.ATTR_NAME_FREQUENCY_BAND] = null;
                attributes[Model.WiFiAPStatusDefs.ATTR_NAME_RSSI_LEVEL] = null;
                return attributes;
            };
            WiFiAPStatusModel.prototype.sync = function (method, model, options) {
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiAPStatusModel.prototype.parse = function (response, options) {
                var ssid;
                if (!response) {
                    return null;
                }
                ssid = response[Model.WiFiAPStatusDefs.ATTR_NAME_SSID];
                if (!ssid) {
                    return null;
                }
                response[Model.WiFiAPStatusDefs.ATTR_NAME_SSID] = window.atob(ssid);
                return response;
            };
            return WiFiAPStatusModel;
        }(Model.BaseDPAPIModel));
        Model.WiFiAPStatusModel = WiFiAPStatusModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiAPStatusModel.js.map