var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiAPWpsModel = (function (_super) {
            __extends(WiFiAPWpsModel, _super);
            function WiFiAPWpsModel(attributes, options) {
                _super.call(this, attributes, options);
                this.idTimer_ = null;
            }
            WiFiAPWpsModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.WiFiAPWpsDefs.ATTR_NAME_STATE] = null;
                return attributes;
            };
            WiFiAPWpsModel.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    options.urlPath = '/system/status/wps_state';
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiAPWpsModel.prototype.parse = function (response, options) {
                var newAttr = {};
                if (response && response[Model.WiFiAPWpsDefs.PARSE_NAME_VALUE]) {
                    newAttr[Model.WiFiAPWpsDefs.ATTR_NAME_STATE] = response[Model.WiFiAPWpsDefs.PARSE_NAME_VALUE];
                }
                return newAttr;
            };
            WiFiAPWpsModel.prototype.startFetchPolling = function (interval) {
                var model = this;
                interval = interval ? interval : Model.Device.DEFAULT_FETCH_INTERVAL_TIME;
                var func = function () {
                    model.fetch();
                };
                this.idTimer_ = setInterval(func, interval);
            };
            WiFiAPWpsModel.prototype.cancelFetchPolling = function () {
                if (!this.idTimer_) {
                    return;
                }
                clearInterval(this.idTimer_);
            };
            WiFiAPWpsModel.prototype.startButton = function (options) {
                Model.BackboneSync.callWebApi(this, 'PUT', '/system/controls/wps_start/button', null, [204], options);
            };
            WiFiAPWpsModel.prototype.startPin = function (options) {
                Model.BackboneSync.callWebApi(this, 'PUT', '/system/controls/wps_start/pin', null, [200], options);
            };
            WiFiAPWpsModel.prototype.cancel = function (options) {
                Model.BackboneSync.callWebApi(this, 'PUT', '/system/controls/wps_cancel', null, [204], options);
            };
            return WiFiAPWpsModel;
        }(Model.BaseDPAPIModel));
        Model.WiFiAPWpsModel = WiFiAPWpsModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiAPWpsModel.js.map