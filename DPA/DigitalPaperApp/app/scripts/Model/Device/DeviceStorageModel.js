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
            var DeviceStorageModel = (function (_super) {
                __extends(DeviceStorageModel, _super);
                function DeviceStorageModel(attributes, options) {
                    _super.call(this, attributes, options);
                    this.idTimer_ = null;
                }
                DeviceStorageModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_CAPACITY] = null;
                    attributes[Device.ATTR_NAME_AVAILABLE] = null;
                    return attributes;
                };
                DeviceStorageModel.prototype.close = function () {
                };
                DeviceStorageModel.prototype.sync = function (method, model, options) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = '/system/status/storage';
                            options.validStatuses = [200];
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                };
                DeviceStorageModel.prototype.startFetchPolling = function (interval) {
                    var model = this;
                    interval = interval ? interval : Device.DEFAULT_FETCH_INTERVAL_TIME;
                    var func = function () {
                        model.fetch({
                            error: function (model, res, options) {
                                model.cancelFetchPolling();
                                model.trigger('error', model, null, options);
                            },
                        });
                    };
                    this.idTimer_ = setInterval(func, interval);
                };
                DeviceStorageModel.prototype.cancelFetchPolling = function () {
                    if (!this.idTimer_) {
                        return;
                    }
                    clearInterval(this.idTimer_);
                };
                return DeviceStorageModel;
            }(Model.BaseDPAPIModel));
            Device.DeviceStorageModel = DeviceStorageModel;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceStorageModel.js.map