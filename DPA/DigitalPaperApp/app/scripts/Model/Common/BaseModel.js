var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var BaseModel = (function (_super) {
            __extends(BaseModel, _super);
            function BaseModel(attributes, options) {
                _super.call(this, attributes, $.extend(true, { parse: true }, options));
            }
            BaseModel.prototype.toJSON = function (options) {
                return $.extend(true, {}, this.attributes);
            };
            return BaseModel;
        }(Backbone.Model));
        Model.BaseModel = BaseModel;
        var BaseDPAPIModel = (function (_super) {
            __extends(BaseDPAPIModel, _super);
            function BaseDPAPIModel(attributes, options) {
                _super.call(this, attributes, $.extend(true, { parse: true }, options));
                this.deviceModel_ = null;
                this.referenceCount = 0;
                if (!options || !options.deviceModel) {
                    console.error('deviceModel is not set');
                    throw new TypeError('deviceModel is not set');
                }
                this.deviceModel_ = options.deviceModel;
            }
            BaseDPAPIModel.prototype.getDeviceModel = function () {
                return this.deviceModel_;
            };
            BaseDPAPIModel.prototype.save = function (attributes, options) {
                _super.prototype.save.call(this, attributes, $.extend(true, { wait: true }, options));
            };
            BaseDPAPIModel.prototype.destroy = function (options) {
                _super.prototype.destroy.call(this, $.extend(true, { wait: true }, options));
            };
            BaseDPAPIModel.prototype.addReference = function () {
                this.referenceCount++;
            };
            BaseDPAPIModel.prototype.release = function () {
                if (this.referenceCount <= 0) {
                    throw new Error('invalid release');
                }
                this.referenceCount--;
                if (this.referenceCount <= 0) {
                    this.invalidate();
                }
            };
            BaseDPAPIModel.prototype.invalidate = function () {
            };
            return BaseDPAPIModel;
        }(BaseModel));
        Model.BaseDPAPIModel = BaseDPAPIModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=BaseModel.js.map