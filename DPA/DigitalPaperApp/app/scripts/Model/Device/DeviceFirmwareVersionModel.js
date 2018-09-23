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
            var DeviceFirmwareVersionModel = (function (_super) {
                __extends(DeviceFirmwareVersionModel, _super);
                function DeviceFirmwareVersionModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                DeviceFirmwareVersionModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_VERSION] = null;
                    attributes[Device.ATTR_NAME_MODEL_NAME] = null;
                    return attributes;
                };
                DeviceFirmwareVersionModel.prototype.close = function () {
                };
                DeviceFirmwareVersionModel.prototype.sync = function (method, model, options) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = '/system/status/firmware_version';
                            options.validStatuses = [200];
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                };
                DeviceFirmwareVersionModel.prototype.parse = function (response, options) {
                    var newAttr = {};
                    if (response) {
                        if (response[Device.PARSE_NAME_VALUE]) {
                            newAttr[Device.ATTR_NAME_VERSION] = response[Device.PARSE_NAME_VALUE];
                        }
                        if (response[Device.PARSE_NAME_MODEL_NAME]) {
                            newAttr[Device.ATTR_NAME_MODEL_NAME] = response[Device.PARSE_NAME_MODEL_NAME];
                        }
                    }
                    return newAttr;
                };
                return DeviceFirmwareVersionModel;
            }(Model.BaseDPAPIModel));
            Device.DeviceFirmwareVersionModel = DeviceFirmwareVersionModel;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceFirmwareVersionModel.js.map