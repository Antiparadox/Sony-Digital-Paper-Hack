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
            var DeviceMacAddressModel = (function (_super) {
                __extends(DeviceMacAddressModel, _super);
                function DeviceMacAddressModel(attributes, options) {
                    _super.call(this, attributes, options);
                    this.idTimer_ = null;
                }
                DeviceMacAddressModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_MAC_ADDRESS] = null;
                    return attributes;
                };
                DeviceMacAddressModel.prototype.close = function () {
                };
                DeviceMacAddressModel.prototype.sync = function (method, model, options) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = '/system/status/mac_address';
                            options.validStatuses = [200];
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                };
                DeviceMacAddressModel.prototype.parse = function (response, options) {
                    var newAttr = {};
                    if (response && response[Device.PARSE_NAME_VALUE]) {
                        newAttr[Device.ATTR_NAME_MAC_ADDRESS] = response[Device.PARSE_NAME_VALUE];
                    }
                    return newAttr;
                };
                return DeviceMacAddressModel;
            }(Model.BaseDPAPIModel));
            Device.DeviceMacAddressModel = DeviceMacAddressModel;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceMacAddressModel.js.map