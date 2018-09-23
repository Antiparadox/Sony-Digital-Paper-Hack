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
            var TimeZoneModel = (function (_super) {
                __extends(TimeZoneModel, _super);
                function TimeZoneModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                TimeZoneModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE] = null;
                    return attributes;
                };
                TimeZoneModel.prototype.sync = function (method, model, options) {
                    options = options || {};
                    options.urlPath = '/system/configs/timezone';
                    options.valueAttribute = DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE;
                    DeviceSetting.syncValue(method, model, options);
                };
                return TimeZoneModel;
            }(Model.BaseDPAPIModel));
            DeviceSetting.TimeZoneModel = TimeZoneModel;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=TimeZoneModel.js.map