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
            var DateFormatModel = (function (_super) {
                __extends(DateFormatModel, _super);
                function DateFormatModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                DateFormatModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT] = null;
                    return attributes;
                };
                DateFormatModel.prototype.sync = function (method, model, options) {
                    options = options || {};
                    options.urlPath = '/system/configs/date_format';
                    options.valueAttribute = DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT;
                    DeviceSetting.syncValue(method, model, options);
                };
                return DateFormatModel;
            }(Model.BaseDPAPIModel));
            DeviceSetting.DateFormatModel = DateFormatModel;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DateFormatModel.js.map