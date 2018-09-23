var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var BaseDPAPICollection = (function (_super) {
            __extends(BaseDPAPICollection, _super);
            function BaseDPAPICollection(deviceModel, models, options) {
                _super.call(this, models, options);
                this.deviceModel_ = null;
                this.referenceCount = 0;
                if (!deviceModel) {
                    throw new TypeError('deviceModel is not set');
                }
                this.deviceModel_ = deviceModel;
            }
            BaseDPAPICollection.prototype.getDeviceModel = function () {
                return this.deviceModel_;
            };
            BaseDPAPICollection.prototype.create = function (attributes, options) {
                return _super.prototype.create.call(this, attributes, $.extend(true, { wait: true, deviceModel: this.deviceModel_ }, options));
            };
            BaseDPAPICollection.prototype.fetch = function (options) {
                var options = options || {};
                options['deviceModel'] = this.deviceModel_;
                return _super.prototype.fetch.call(this, options);
            };
            BaseDPAPICollection.prototype.addReference = function () {
                this.referenceCount++;
            };
            BaseDPAPICollection.prototype.release = function () {
                if (this.referenceCount <= 0) {
                    throw new Error('invalid release');
                }
                this.referenceCount--;
                if (this.referenceCount <= 0) {
                    this.invalidate();
                }
            };
            BaseDPAPICollection.prototype.invalidate = function () {
            };
            return BaseDPAPICollection;
        }(Backbone.Collection));
        Model.BaseDPAPICollection = BaseDPAPICollection;
        var BaseCollection = (function (_super) {
            __extends(BaseCollection, _super);
            function BaseCollection(models, options) {
                _super.call(this, models, options);
            }
            BaseCollection.prototype.create = function (attributes, options) {
                return _super.prototype.create.call(this, attributes, $.extend(true, { wait: true }, options));
            };
            return BaseCollection;
        }(Backbone.Collection));
        Model.BaseCollection = BaseCollection;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=BaseCollection.js.map