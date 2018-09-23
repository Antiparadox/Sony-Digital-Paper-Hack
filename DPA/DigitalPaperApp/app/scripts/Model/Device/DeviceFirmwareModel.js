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
            var DeviceFirmwareModel = (function (_super) {
                __extends(DeviceFirmwareModel, _super);
                function DeviceFirmwareModel(attributes, options) {
                    var _this = this;
                    _super.call(this, attributes, options);
                    this.deviceFirmwareVersionModel_ = null;
                    this.deviceAPIVersionModel_ = null;
                    if (!options || !options.stub) {
                        this.fileTransfer_ = DPMW.appCtrl.currentDevice.getFirmwareTransfer();
                    }
                    var deviceFirmwareVersionModel = new Device.DeviceFirmwareVersionModel(null, { deviceModel: this.deviceModel_ });
                    var deviceAPIVersionModel = new Device.DeviceAPIVersionModel(null, { deviceModel: this.deviceModel_ });
                    this.listenTo(deviceFirmwareVersionModel, 'change', function () {
                        _this.set(Device.ATTR_NAME_VERSION, deviceFirmwareVersionModel.get(Device.ATTR_NAME_VERSION));
                    });
                    this.listenTo(deviceAPIVersionModel, 'change', function () {
                        _this.set(Device.ATTR_NAME_API_VERSION, deviceAPIVersionModel.get(Device.ATTR_NAME_API_VERSION));
                    });
                    this.deviceFirmwareVersionModel_ = deviceFirmwareVersionModel;
                    this.deviceAPIVersionModel_ = deviceAPIVersionModel;
                }
                DeviceFirmwareModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_VERSION] = null;
                    attributes[Device.ATTR_NAME_UPDATER_VERSION] = null;
                    attributes[Device.ATTR_NAME_API_VERSION] = null;
                    return attributes;
                };
                DeviceFirmwareModel.prototype.close = function () {
                };
                DeviceFirmwareModel.prototype.sync = function (method, model, options) {
                    var attr = {};
                    var dfs = [];
                    if (model.deviceFirmwareVersionModel_) {
                        var dfFwVer_1 = $.Deferred();
                        dfs.push(dfFwVer_1);
                        model.deviceFirmwareVersionModel_.fetch({
                            success: function (model, res, options) {
                                attr[Device.ATTR_NAME_VERSION] = model.get(Device.ATTR_NAME_VERSION);
                                dfFwVer_1.resolve(attr);
                            },
                            error: function (model, res, options) {
                                dfFwVer_1.reject(res);
                            }
                        });
                    }
                    if (model.deviceAPIVersionModel_) {
                        var dfAPIVer_1 = $.Deferred();
                        dfs.push(dfAPIVer_1);
                        model.deviceAPIVersionModel_.fetch({
                            success: function (model, res, options) {
                                attr[Device.ATTR_NAME_API_VERSION] = model.get(Device.ATTR_NAME_API_VERSION);
                                dfAPIVer_1.resolve(attr);
                            },
                            error: function (model, res, options) {
                                dfAPIVer_1.reject(res);
                            }
                        });
                    }
                    var dfUpVer = $.Deferred();
                    dfs.push(dfUpVer);
                    model.getUpdaterVersion({
                        success: function (res) {
                            attr[Device.ATTR_NAME_UPDATER_VERSION] = res;
                            dfUpVer.resolve(attr);
                        },
                        error: function (err) {
                            if (model) {
                                model.set(Device.ATTR_NAME_UPDATER_VERSION, null);
                            }
                            if (options) {
                                options = $.extend(true, options, { mwError: err });
                            }
                            dfUpVer.reject(null);
                        }
                    });
                    return $.when.apply(model, dfs)
                        .done(function (res) {
                        if (options && options.success) {
                            options.success(res);
                        }
                    })
                        .fail(function (res) {
                        if (options && options.error) {
                            options.error(res);
                        }
                    });
                };
                Object.defineProperty(DeviceFirmwareModel.prototype, "deviceFirmwareVersionModel", {
                    get: function () {
                        return this.deviceFirmwareVersionModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DeviceFirmwareModel.prototype, "deviceAPIVersionModel", {
                    get: function () {
                        return this.deviceAPIVersionModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                DeviceFirmwareModel.prototype.uploadFirmware = function (filePath, options) {
                    if (typeof filePath !== 'string') {
                        throw new TypeError('filePath must be string');
                    }
                    var model = this;
                    this.fileTransfer_.uploadFirmware(filePath, null, function (err, task) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (options && options.error) {
                                options.error(model, null, resOptions);
                            }
                            return;
                        }
                        if (options && options.success) {
                            var resOptions = $.extend(true, options, { task: task });
                            options.success(model, null, resOptions);
                        }
                    });
                };
                DeviceFirmwareModel.prototype.getCurrentUploadBytes = function () {
                    return this.fileTransfer_.getCurrentBytesTransferred();
                };
                DeviceFirmwareModel.prototype.getTotalUploadBytes = function () {
                    return this.fileTransfer_.getCurrentBytesTotal();
                };
                DeviceFirmwareModel.prototype.isUploading = function () {
                    return this.fileTransfer_.isRunning();
                };
                DeviceFirmwareModel.prototype.cancelUpload = function (options) {
                    var model = this;
                    this.fileTransfer_.cancelAllTasks(function (err) {
                        if (err) {
                            if (options && options.error) {
                                options.mwError = err;
                                options.error(model, null, options);
                            }
                            return;
                        }
                        if (options && options.success) {
                            options.success(model, null, options);
                        }
                    });
                };
                DeviceFirmwareModel.prototype.startFirmwareUpdate = function (options) {
                    var _this = this;
                    Model.BackboneSync.callWebApi(this, 'GET', '/system/controls/update_firmware/precheck', null, [200], {
                        success: function (model, res, opt) {
                            console.log('[SUCCESS] precheck');
                            Model.BackboneSync.callWebApi(_this, 'PUT', '/system/controls/update_firmware', null, [204], options);
                        },
                        error: function (model, res, opt) {
                            console.log('[ERROR] precheck');
                            if (options && options.error) {
                                options.error(model, res, opt);
                            }
                        }
                    });
                };
                DeviceFirmwareModel.prototype.updateFirmware = function (options) {
                    var _this = this;
                    var model = this;
                    var error = function (err) {
                        if (options && options.error) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            options.error(model, null, resOptions);
                        }
                    };
                    model.downloadUpdater({
                        success: function (filePath) {
                            if (!filePath) {
                                filePath = options ? options.reserve : null;
                                if (!filePath) {
                                    error(DPMW.mwe.genError('error', 'Update file not found'));
                                    alert('update file not found');
                                    return;
                                }
                            }
                            model.fileTransfer_.uploadFirmware(filePath, null, function (err) {
                                if (err) {
                                    error(err);
                                    alert('failed to upload file: ' + JSON.stringify(err));
                                    return;
                                }
                                model.fileTransfer_.callWebApi('GET', '/system/controls/update_firmware/precheck', null, function (err, res, status) {
                                    if (err) {
                                        error(err);
                                        alert('failed to check status: ' + JSON.stringify(err));
                                        return;
                                    }
                                    if (res.image_file !== 'ok') {
                                        error(DPMW.mwe.genError('error', 'File is not uploaded'));
                                        alert('file is not uploaded!');
                                        return;
                                    }
                                    if (res.battery !== 'ok') {
                                        error(DPMW.mwe.genError('error', 'Battery is not enough'));
                                        alert('battery is not enough!');
                                        return;
                                    }
                                    _this.fileTransfer_.callWebApi('PUT', '/system/controls/update_firmware', null, function (err, res, status) {
                                        if (err) {
                                            error(err);
                                            alert('failed to check status: ' + JSON.stringify(err));
                                            return;
                                        }
                                        if (status !== 204) {
                                            error(DPMW.mwe.genError('error', 'Failed to update firmware'));
                                            alert('failed to update firmware: status = ' + JSON.stringify(status));
                                            return;
                                        }
                                        if (options && options.success) {
                                            options.success(model, null, options);
                                        }
                                        model.fetch();
                                    });
                                });
                            });
                        },
                        error: function (err) {
                            error(err);
                        }
                    });
                };
                DeviceFirmwareModel.prototype.isUpdate = function () {
                    return true;
                };
                DeviceFirmwareModel.prototype.getUpdaterVersion = function (callback) {
                    setTimeout(function () {
                        if (callback && callback.success) {
                            callback.success('9.9.9');
                        }
                    }, 0);
                };
                DeviceFirmwareModel.prototype.downloadUpdater = function (callback) {
                    setTimeout(function () {
                        if (callback && callback.success) {
                            callback.success(null);
                        }
                    }, 0);
                };
                return DeviceFirmwareModel;
            }(Model.BaseDPAPIModel));
            Device.DeviceFirmwareModel = DeviceFirmwareModel;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceFirmwareModel.js.map