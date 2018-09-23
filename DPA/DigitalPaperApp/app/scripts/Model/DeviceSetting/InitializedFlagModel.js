var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var DeviceSetting;
        (function (DeviceSetting) {
            var InitializedFlagModel = (function (_super) {
                __extends(InitializedFlagModel, _super);
                function InitializedFlagModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                InitializedFlagModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG] = null;
                    return attributes;
                };
                InitializedFlagModel.prototype.sync = function (method, model, options) {
                    options = options || {};
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = '/system/configs/initialized_flag';
                            options.validStatuses = [200];
                            options.valueAttribute = DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG;
                            break;
                        case Model.BackboneSyncDefs.METHOD_NAME_UPDATE:
                        case Model.BackboneSyncDefs.METHOD_NAME_CREATE:
                            options.urlPath = '/system/configs/initialized_flag';
                            options.validStatuses = [204];
                            options.valueAttribute = DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG;
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                    return DeviceSetting.syncValue(method, model, options);
                };
                return InitializedFlagModel;
            }(Model.BaseDPAPIModel));
            DeviceSetting.InitializedFlagModel = InitializedFlagModel;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitializedFlagModel.js.map