var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var Device;
        (function (Device) {
            var DeviceAPIVersionModel = (function (_super) {
                __extends(DeviceAPIVersionModel, _super);
                function DeviceAPIVersionModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                DeviceAPIVersionModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_API_VERSION] = null;
                    return attributes;
                };
                DeviceAPIVersionModel.prototype.sync = function (method, model, options) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = '/api_version';
                            options.validStatuses = [200];
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                };
                DeviceAPIVersionModel.prototype.parse = function (response, options) {
                    var newAttr = {};
                    if (response && response[Device.PARSE_NAME_VALUE]) {
                        newAttr[Device.ATTR_NAME_API_VERSION] = response[Device.PARSE_NAME_VALUE];
                    }
                    return newAttr;
                };
                return DeviceAPIVersionModel;
            }(Model.BaseDPAPIModel));
            Device.DeviceAPIVersionModel = DeviceAPIVersionModel;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceAPIVersionModel.js.map