var DPMW;
(function (DPMW) {
    var App;
    (function (App) {
        var AppCtrl = (function () {
            function AppCtrl() {
                this.devices_ = null;
                this.currentDevice_ = null;
                this.currentDeviceId_ = null;
                this.currentDeviceInfo_ = null;
                this.currentDeviceName_ = null;
                this.initialized_ = false;
                this.master_ = false;
            }
            AppCtrl.prototype.initializeMaster = function (options) {
                if (this.initialized_) {
                    throw new Error('initialize is called more than once.');
                }
                this.initialized_ = true;
                this.master_ = true;
                var deviceId = null;
                var deviceInfo = null;
                var argv = require('electron').remote.process.argv;
                var len = argv.length;
                for (var i = 0; i < len; i++) {
                    var arg = argv[i];
                    if (arg === '--deviceid') {
                        if (i + 1 >= len) {
                            alert('deviceId is not set. Please add --deviceid <device id> to command line option.');
                            close();
                            throw new Error('Device Id is not specified');
                        }
                        deviceId = argv[i + 1];
                    }
                    if (arg === '--clear-deviceid') {
                        localStorage.removeItem('deviceId');
                        localStorage.removeItem('deviceInfo');
                    }
                }
                if (typeof deviceId !== 'string') {
                    deviceId = localStorage.getItem('deviceId');
                    var deviceInfoStr = localStorage.getItem('deviceInfo');
                    if (typeof deviceInfoStr === 'string') {
                        deviceInfo = JSON.parse(deviceInfoStr);
                        if (process.env.MW_SKU_CODE && deviceInfo && deviceInfo.sku_code) {
                            deviceInfo.sku_code = process.env.MW_SKU_CODE;
                        }
                    }
                }
                if (typeof deviceId === 'string') {
                    this.currentDeviceId_ = deviceId;
                    this.currentDeviceInfo_ = deviceInfo;
                }
                DPMW.Model.appDataStore.start(function (err) {
                    if (err) {
                        if (options && options.error) {
                            options.error(err);
                        }
                        return;
                    }
                    if (options && options.success) {
                        options.success();
                    }
                });
                return;
            };
            AppCtrl.prototype.initializeNew = function (deviceId, options) {
                if (this.initialized_) {
                    throw new Error('initialize is called more than once.');
                }
                if (typeof deviceId === 'string') {
                    this.currentDeviceId_ = deviceId;
                    var deviceInfoStr = localStorage.getItem('deviceInfo');
                    if (typeof deviceInfoStr === 'string') {
                        this.currentDeviceInfo_ = JSON.parse(deviceInfoStr);
                        if (process.env.MW_SKU_CODE && this.currentDeviceInfo_ && this.currentDeviceInfo_.sku_code) {
                            this.currentDeviceInfo_.sku_code = process.env.MW_SKU_CODE;
                        }
                    }
                }
                else {
                    this.currentDeviceId_ = null;
                    this.currentDeviceInfo_ = null;
                }
                this.initialized_ = true;
                if (options && options.success) {
                    options.success();
                }
                return;
            };
            AppCtrl.prototype.terminate = function () {
                var oldCurrentDevice = this.currentDevice_;
                this.currentDevice_ = null;
                if (oldCurrentDevice) {
                    oldCurrentDevice.close();
                }
                if (this.devices_) {
                    this.devices_.close();
                    this.devices_ = null;
                }
                if (this.master_) {
                    if (DPMW.Model.appDataStore) {
                        DPMW.Model.appDataStore.stop(true, function (error) {
                            console.log(error);
                        });
                    }
                }
            };
            AppCtrl.prototype.connectDevice = function (options) {
                if (!this.initialized_) {
                    throw new Error('must be initialized before this call.');
                }
                if (typeof this.currentDeviceId_ !== 'string') {
                    throw new Error('initialize does not called. or device is not registered.');
                }
                if (this.currentDevice_) {
                    throw new Error('current device already exists');
                }
                var attr = {};
                attr[DPMW.Model.Device.ATTR_NAME_DEVICE_ID] = this.currentDeviceId_;
                if (this.currentDeviceColor) {
                    attr[DPMW.Model.Device.ATTR_NAME_DEVICE_COLOR] = this.currentDeviceColor;
                }
                if (this.currentDeviceSku) {
                    attr[DPMW.Model.Device.ATTR_NAME_SKU_CODE] = this.currentDeviceSku;
                }
                this.currentDevice_ = new DPMW.Model.Device.DeviceModel(attr);
                this.currentDevice_.connect({ success: function () {
                        options.success();
                    }, error: function (model, res, options_) {
                        options.error(options_.mwError);
                    } });
            };
            AppCtrl.prototype.changeCurrentDevice = function (deviceId, options) {
                if (!this.initialized_) {
                    throw new Error('must be initialized before this call.');
                }
                var deviceModel = this.devices.get(deviceId);
                if (!deviceModel) {
                    throw new Error('device could not be found');
                }
                var deviceInfo = {
                    sku_code: deviceModel.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE),
                    device_color: deviceModel.get(DPMW.Model.Device.ATTR_NAME_DEVICE_COLOR),
                };
                if (this.master_) {
                    localStorage.removeItem('lastSyncDate');
                    localStorage.removeItem(DPMW.Utils.LocalStorageItemName.LAST_SYNC_EXECUTED_DATE);
                    localStorage.setItem('deviceId', deviceId);
                    localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
                }
                this.currentDeviceId_ = deviceId;
                this.currentDeviceInfo_ = deviceInfo;
                var oldCurrentDevice = this.currentDevice_;
                this.currentDevice_ = null;
                if (oldCurrentDevice) {
                    oldCurrentDevice.close();
                }
                var attr = {};
                attr[DPMW.Model.Device.ATTR_NAME_DEVICE_ID] = this.currentDeviceId_;
                this.currentDevice_ = new DPMW.Model.Device.DeviceModel(attr);
                this.currentDevice_.connect(options);
            };
            AppCtrl.prototype.clearCurrentDevice = function () {
                if (this.master_) {
                    localStorage.removeItem('deviceId');
                    localStorage.removeItem('deviceInfo');
                    {
                        var process_1 = require('electron').remote.process;
                        if (process_1 && process_1.env.MW_USER_DATA_DIR_PATH) {
                            try {
                                var path = require('path');
                                var workspaceFilePath = path.join(process_1.env.MW_USER_DATA_DIR_PATH, 'workspace.dat');
                                var fs = require('fs');
                                fs.unlinkSync(workspaceFilePath);
                            }
                            catch (err) {
                            }
                        }
                    }
                }
                this.currentDeviceId_ = null;
                this.currentDeviceInfo_ = null;
                var oldCurrentDevice = this.currentDevice_;
                this.currentDevice_ = null;
                if (oldCurrentDevice) {
                    oldCurrentDevice.close();
                }
            };
            Object.defineProperty(AppCtrl.prototype, "devices", {
                get: function () {
                    if (!this.initialized_) {
                        throw new Error('must be initialized before this call.');
                    }
                    if (!this.devices_) {
                        this.devices_ = new DPMW.Model.Device.DeviceCollection();
                    }
                    return this.devices_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppCtrl.prototype, "currentDevice", {
                get: function () {
                    if (!this.initialized_) {
                        throw new Error('must be initialized before this call.');
                    }
                    return this.currentDevice_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppCtrl.prototype, "currentDeviceId", {
                get: function () {
                    if (!this.initialized_) {
                        throw new Error('must be initialized before this call.');
                    }
                    return this.currentDeviceId_;
                },
                set: function (deviceId) {
                    throw new Error('currentDeviceId can not be set. use initialize instead.');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppCtrl.prototype, "currentDeviceColor", {
                get: function () {
                    if (!this.initialized_) {
                        throw new Error('must be initialized before this call.');
                    }
                    if (!this.currentDeviceInfo_) {
                        return null;
                    }
                    return this.currentDeviceInfo_.device_color;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppCtrl.prototype, "currentDeviceSku", {
                get: function () {
                    if (!this.initialized_) {
                        throw new Error('must be initialized before this call.');
                    }
                    if (!this.currentDeviceInfo_) {
                        return null;
                    }
                    return this.currentDeviceInfo_.sku_code;
                },
                enumerable: true,
                configurable: true
            });
            AppCtrl.prototype.registerCurrentDevice = function (options) {
                if (!this.initialized_) {
                    throw new Error('must be initialized before this call.');
                }
                var attr = {};
                if (!this.currentDeviceId_) {
                    if (options && options.error) {
                        options.error(new Error('currentDevice is not set.'));
                    }
                    return;
                }
                attr[DPMW.Model.Device.ATTR_NAME_DEVICE_ID] = this.currentDeviceId_;
                attr[DPMW.Model.Device.ATTR_NAME_DEVICE_NAME] = this.currentDeviceName_;
                if (!this.currentDevice_) {
                    this.currentDevice_ = new DPMW.Model.Device.DeviceModel(attr);
                }
                else {
                    this.currentDevice_.init(this.currentDeviceId_, this.currentDeviceName_);
                }
                if (!options || !options.notConnect) {
                    this.currentDevice_.connect(options);
                }
                return;
            };
            return AppCtrl;
        }());
        App.AppCtrl = AppCtrl;
    })(App = DPMW.App || (DPMW.App = {}));
    DPMW.appCtrl = new App.AppCtrl();
})(DPMW || (DPMW = {}));
//# sourceMappingURL=AppCtrl.js.map