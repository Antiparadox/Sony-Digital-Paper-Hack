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
            var TimeFormatModel = (function (_super) {
                __extends(TimeFormatModel, _super);
                function TimeFormatModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                TimeFormatModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT] = null;
                    return attributes;
                };
                TimeFormatModel.prototype.sync = function (method, model, options) {
                    options = options || {};
                    options.urlPath = '/system/configs/time_format';
                    options.valueAttribute = DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT;
                    DeviceSetting.syncValue(method, model, options);
                };
                return TimeFormatModel;
            }(Model.BaseDPAPIModel));
            DeviceSetting.TimeFormatModel = TimeFormatModel;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=TimeFormatModel.js.map