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
            var OwnerModel = (function (_super) {
                __extends(OwnerModel, _super);
                function OwnerModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                OwnerModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[DeviceSetting.OwnerDefs.ATTR_NAME_OWNER] = null;
                    return attributes;
                };
                OwnerModel.prototype.sync = function (method, model, options) {
                    options = options || {};
                    options.urlPath = '/system/configs/owner';
                    options.valueAttribute = DeviceSetting.OwnerDefs.ATTR_NAME_OWNER;
                    DeviceSetting.syncValue(method, model, options);
                };
                return OwnerModel;
            }(Model.BaseDPAPIModel));
            DeviceSetting.OwnerModel = OwnerModel;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=OwnerModel.js.map