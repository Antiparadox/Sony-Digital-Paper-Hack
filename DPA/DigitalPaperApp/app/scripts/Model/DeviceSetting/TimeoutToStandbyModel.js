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
            var TimeoutToStandbyModel = (function (_super) {
                __extends(TimeoutToStandbyModel, _super);
                function TimeoutToStandbyModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                TimeoutToStandbyModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY] = null;
                    return attributes;
                };
                TimeoutToStandbyModel.prototype.sync = function (method, model, options) {
                    options = options || {};
                    options.urlPath = '/system/configs/timeout_to_standby';
                    options.valueAttribute = DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY;
                    DeviceSetting.syncValue(method, model, options);
                };
                return TimeoutToStandbyModel;
            }(Model.BaseDPAPIModel));
            DeviceSetting.TimeoutToStandbyModel = TimeoutToStandbyModel;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=TimeoutToStandbyModel.js.map