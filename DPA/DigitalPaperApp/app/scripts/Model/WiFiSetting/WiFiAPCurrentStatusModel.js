var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiAPCurrentStatusModel = (function (_super) {
            __extends(WiFiAPCurrentStatusModel, _super);
            function WiFiAPCurrentStatusModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            WiFiAPCurrentStatusModel.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    options.urlPath = '/system/status/wifi_state';
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiAPCurrentStatusModel.prototype.parse = function (response, options) {
                var ssid;
                ssid = response[Model.WiFiAPStatusDefs.ATTR_NAME_SSID];
                if (typeof ssid === 'string') {
                    response[Model.WiFiAPStatusDefs.ATTR_NAME_SSID] = window.atob(ssid);
                }
                return response;
            };
            return WiFiAPCurrentStatusModel;
        }(Model.WiFiAPStatusModel));
        Model.WiFiAPCurrentStatusModel = WiFiAPCurrentStatusModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiAPCurrentStatusModel.js.map