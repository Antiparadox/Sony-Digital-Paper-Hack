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
            var DeviceCollection = (function (_super) {
                __extends(DeviceCollection, _super);
                function DeviceCollection(options) {
                    _super.call(this);
                    this.model = Device.DevicePrimitiveModel;
                    if (!options || !options.stub) {
                        this.connSelector_ = require('electron').remote.require('mw-conn-selector');
                        this.onDeviceAppearHandler_ = this.onDeviceAppear.bind(this);
                        this.onDeviceDisappearHandler_ = this.onDeviceDisappear.bind(this);
                        this.onDeviceConnChangeHandler_ = this.onDeviceConnChange.bind(this);
                        this.onErrorHandler_ = this.onError.bind(this);
                        this.connSelector_.on('deviceAppear', this.onDeviceAppearHandler_);
                        this.connSelector_.on('deviceDisappear', this.onDeviceDisappearHandler_);
                        this.connSelector_.on('deviceConnChanged', this.onDeviceConnChangeHandler_);
                        this.connSelector_.on('error', this.onErrorHandler_);
                        this.set(this.connSelector_.getDeviceList(), { silent: true });
                    }
                }
                DeviceCollection.prototype.close = function () {
                    this.connSelector_.removeListener('deviceAppear', this.onDeviceAppearHandler_);
                    this.connSelector_.removeListener('deviceDisappear', this.onDeviceDisappearHandler_);
                    this.connSelector_.removeListener('deviceConnChanged', this.onDeviceConnChangeHandler_);
                    this.connSelector_.removeListener('error', this.onErrorHandler_);
                    this.connSelector_ = null;
                };
                DeviceCollection.prototype.sync = function (method, model, options) {
                    if (!this.connSelector_) {
                        throw new Error('Failed to access a instance of connection selector.');
                    }
                    switch (method) {
                        case 'read':
                            var res = this.connSelector_.getDeviceList();
                            if (options && options.success) {
                                options.success(res);
                            }
                            break;
                        default:
                            throw new Error('Method is not allowed here: ' + method);
                    }
                    return null;
                };
                DeviceCollection.prototype.scanDevices = function (options) {
                    var collection = this;
                    if (!this.connSelector_) {
                        throw new Error('Failed to access a instance of connection selector.');
                    }
                    this.connSelector_.scanDevices(function (err) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (options && options.error) {
                                options.error(collection, null, resOptions);
                            }
                            collection.trigger('error', collection, null, resOptions);
                            return;
                        }
                        if (options && options.success) {
                            options.success(collection, null, options);
                        }
                    });
                };
                DeviceCollection.prototype.onDeviceAppear = function (arg) {
                    this.fetch();
                };
                DeviceCollection.prototype.onDeviceDisappear = function (arg) {
                    this.fetch();
                };
                DeviceCollection.prototype.onDeviceConnChange = function (arg) {
                    this.fetch();
                };
                DeviceCollection.prototype.onError = function (err) {
                    this.trigger('error', this, null, err);
                };
                return DeviceCollection;
            }(Model.BaseCollection));
            Device.DeviceCollection = DeviceCollection;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceCollection.js.map