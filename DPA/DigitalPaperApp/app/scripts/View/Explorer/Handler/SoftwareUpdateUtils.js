var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var Device = DPMW.Model.Device;
                var transferProgressHandler = DPMW.View.Explorer.Handler.transferProgressHandler;
                var syncHandler = DPMW.View.Explorer.Handler.syncHandler;
                var UPDATE_TYPE;
                (function (UPDATE_TYPE) {
                    UPDATE_TYPE.APP = 'app';
                    UPDATE_TYPE.DEVICE = 'device';
                })(UPDATE_TYPE = Handler.UPDATE_TYPE || (Handler.UPDATE_TYPE = {}));
                var UpdateInfo = (function () {
                    function UpdateInfo() {
                    }
                    return UpdateInfo;
                }());
                Handler.UpdateInfo = UpdateInfo;
                var AutoMagicClient = require('electron').remote.require('mw-automagic-client');
                var SoftwareUpdateUtils = (function () {
                    function SoftwareUpdateUtils() {
                        this.downloadProgress = { current: 0, total: 0 };
                        this.transferProgress = { current: 0, total: 0 };
                    }
                    SoftwareUpdateUtils.prototype.checkForAppUpdate = function (callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        var appVersion = process.env.MW_APP_VERSION;
                        var appLanguage = $.i18n.t('app.language.name');
                        AutoMagicClient.checkForAppUpdate(appVersion, appLanguage, function (error, update) {
                            if (error) {
                                callback.error(error);
                                return;
                            }
                            callback.success(update);
                        });
                    };
                    SoftwareUpdateUtils.prototype.isCheckingForAppUpdate = function () {
                        return AutoMagicClient.isCheckingForAppUpdate();
                    };
                    SoftwareUpdateUtils.prototype.stopCheckingForAppUpdate = function (callback) {
                        if (!callback || !callback.success) {
                            throw new Error('callback must be specified.');
                        }
                        AutoMagicClient.stopCheckingForAppUpdate(function () {
                            callback.success();
                        });
                    };
                    SoftwareUpdateUtils.prototype.getDeviceId = function (callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        var device = DPMW.appCtrl.currentDevice;
                        if (!device || !device.isConnected()) {
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                            callback.error(err);
                            return;
                        }
                        var deviceId = device.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID);
                        if (!deviceId) {
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                            callback.error(err);
                            return;
                        }
                        callback.success(deviceId);
                    };
                    SoftwareUpdateUtils.prototype.checkForDeviceUpdate = function (callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        var appLanguage = $.i18n.t('app.language.name');
                        var deviceVersion = null;
                        var deviceModelName = null;
                        var deviceSkuCode = null;
                        var deviceId = null;
                        var device = DPMW.appCtrl.currentDevice;
                        Promise.resolve(true)
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (!device || !device.isConnected()) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var deviceVersionModel = device.deviceFirmwareModel.deviceFirmwareVersionModel;
                                deviceVersionModel.fetch({
                                    success: function (model, res, opt) {
                                        //deviceVersion = deviceVersionModel.get(Device.ATTR_NAME_VERSION);
                                        deviceVersion = '1.2.01.04200';
                                        deviceModelName = deviceVersionModel.get(Device.ATTR_NAME_MODEL_NAME);
                                        deviceSkuCode = device.get(Device.ATTR_NAME_SKU_CODE);
                                        deviceId = device.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID);
                                        resolve();
                                    },
                                    error: function (model, res, opt) {
                                        if (!opt || typeof opt.mwError === 'undefined') {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                            reject(err);
                                            return;
                                        }
                                        reject(opt.mwError);
                                    }
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                AutoMagicClient.checkForDeviceUpdate(deviceVersion, deviceModelName, deviceSkuCode, appLanguage, function (error, updateInfo) {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }
                                    resolve(updateInfo);
                                });
                            });
                        })
                            .then(function (updateInfo) {
                            return new Promise(function (resolve, reject) {
                                if (!updateInfo) {
                                    resolve(null);
                                    return;
                                }
                                var physicalType = device.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE);
                                updateInfo.isUsb = (physicalType === DPMW.Model.Device.VALUE_PHY_TYPE_USB);
                                updateInfo.deviceId = deviceId;
                                resolve(updateInfo);
                            });
                        })
                            .then(function onFulfilled(updateInfo) {
                            callback.success(updateInfo);
                        }, function onRejected(error) {
                            callback.error(error);
                        });
                    };
                    SoftwareUpdateUtils.prototype.isCheckingForDeviceUpdate = function () {
                        return AutoMagicClient.isCheckingForDeviceUpdate();
                    };
                    SoftwareUpdateUtils.prototype.stopCheckingForDeviceUpdate = function (callback) {
                        if (!callback || !callback.success) {
                            throw new Error('callback must be specified.');
                        }
                        AutoMagicClient.stopCheckingForDeviceUpdate(function () {
                            callback.success();
                        });
                    };
                    SoftwareUpdateUtils.prototype.isCheckingForUpdate = function () {
                        return AutoMagicClient.isCheckingForAppUpdate()
                            || AutoMagicClient.isCheckingForDeviceUpdate();
                    };
                    SoftwareUpdateUtils.prototype.stopCheckingForUpdate = function (callback) {
                        if (!callback || !callback.success) {
                            throw new Error('callback must be specified.');
                        }
                        AutoMagicClient.stopCheckingForAppUpdate(function () {
                            AutoMagicClient.stopCheckingForDeviceUpdate(function () {
                                callback.success();
                            });
                        });
                    };
                    SoftwareUpdateUtils.prototype.downloadAppUpdater = function (updater, callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        if (this.isDownloading()) {
                            var error = DPMW.mwe.genError(DPMW.mwe.E_MW_ALREADY_RUNNING, 'Download is already running.');
                            callback.error(error);
                        }
                        this.downloadProgress = { current: 0, total: 0 };
                        var dstDirPath = process.env.MW_UPDATER_DIR_PATH;
                        var self = this;
                        AutoMagicClient.downloadAppUpdater(updater, dstDirPath, function (error, filePath) {
                            if (error) {
                                callback.error(error);
                                return;
                            }
                            self.downloadProgress.current = self.downloadProgress.total;
                            callback.success(filePath);
                        });
                    };
                    SoftwareUpdateUtils.prototype.downloadDeviceUpdater = function (updater, callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        if (this.isDownloading()) {
                            var error = DPMW.mwe.genError(DPMW.mwe.E_MW_ALREADY_RUNNING, 'Download is already running.');
                            callback.error(error);
                        }
                        this.downloadProgress = { current: 0, total: 0 };
                        var dstDirPath = process.env.MW_UPDATER_DIR_PATH;
                        var self = this;
                        filePath ='/Users/zhangyinuo/Library/Application Support/Sony Corporation/Digital Paper App/DigitalPaperApp/ws3ae0c7b2ee28497abcc55ef6dd9def8f/updater/FwUpdater.pkg'
                        callback.success(filePath);
                        /*setTimeout(function () {
                            AutoMagicClient.downloadDeviceUpdater(updater, dstDirPath, function (error, filePath) {
                                if (error) {
                                    callback.error(error);
                                    return;
                                }
                                self.downloadProgress.current = self.downloadProgress.total;
                                callback.success(filePath);
                            });
                        });*/
                    };
                    SoftwareUpdateUtils.prototype.isDownloading = function () {
                        return AutoMagicClient.isDownloading();
                    };
                    SoftwareUpdateUtils.prototype.getDownloadProgress = function () {
                        var progress = AutoMagicClient.getDownloadProgress();
                        console.log('[download] ' + progress.current + ' / ' + progress.total);
                        if (progress.total > 0) {
                            this.downloadProgress.current = progress.current;
                            this.downloadProgress.total = progress.total;
                        }
                        return this.downloadProgress;
                    };
                    SoftwareUpdateUtils.prototype.stopDonwloading = function (callback) {
                        if (!callback || !callback.success) {
                            throw new Error('callback must be specified.');
                        }
                        AutoMagicClient.stopDownloading(function () {
                            callback.success();
                        });
                    };
                    SoftwareUpdateUtils.prototype.removeDownloadDir = function (callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        var dstDirPath = process.env.MW_UPDATER_DIR_PATH;
                        Promise.resolve(dstDirPath)
                            .then(function (dirPath) {
                            return new Promise(function (resolve, reject) {
                                var fs = require('fs');
                                fs.lstat(dirPath, function (err, stats) {
                                    if (err && err.code === 'ENOENT') {
                                        resolve(null);
                                        return;
                                    }
                                    resolve(dirPath);
                                });
                            });
                        })
                            .then(function (dirPath) {
                            if (dirPath) {
                                return Handler.FsPromise.removeDirRecursively(dirPath);
                            }
                            else {
                                return Promise.resolve();
                            }
                        })
                            .then(function () {
                            callback.success();
                        }, function (error) {
                            callback.error(error);
                        });
                    };
                    SoftwareUpdateUtils.prototype.stopContentTransfer = function () {
                        return Promise.resolve(true)
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                transferProgressHandler.cancelAllDownloadTasks(function (error) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    resolve();
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                transferProgressHandler.cancelAllUploadTasks(function (error) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    resolve();
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                syncHandler.cancelSync({
                                    success: function () {
                                        resolve();
                                    },
                                    error: function (err) {
                                        console.log(err);
                                        resolve();
                                    }
                                });
                            });
                        });
                    };
                    SoftwareUpdateUtils.prototype.startAppUpdate = function (filePath, callback) {
                        if (typeof filePath !== 'string') {
                            throw new Error('filePath must be specified.');
                        }
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        var self = this;
                        Promise.resolve(true)
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var fs = require('fs');
                                fs.stat(filePath, function (error, stats) {
                                    if (error) {
                                        var err = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Failed to read file.', error);
                                        reject(err);
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        })
                            .then(function () {
                            return self.stopContentTransfer();
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var spawn = require('child_process').spawn;
                                switch (process.platform) {
                                    case 'win32':
                                        spawn(filePath, [], { detached: true });
                                        break;
                                    case 'darwin':
                                        spawn('open', [filePath], { detached: true });
                                        break;
                                }
                                resolve();
                            });
                        })
                            .then(function onFulfilled() {
                            callback.success();
                        }, function onRejected(error) {
                            callback.error(error);
                        });
                    };
                    SoftwareUpdateUtils.prototype.transferDeviceUpdater = function (filePath, fileSize, deviceId, deviceVersion, callback) {
                        if (typeof filePath !== 'string') {
                            throw new Error('filePath must be specified.');
                        }
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        if (this.isTransferring()) {
                            var error = DPMW.mwe.genError(DPMW.mwe.E_MW_ALREADY_RUNNING, 'Transfer is already running.');
                            callback.error(error);
                        }
                        this.transferProgress = { current: 0, total: fileSize };
                        var self = this;
                        var device = DPMW.appCtrl.currentDevice;
                        Promise.resolve(true)
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (!device || !device.isConnected()) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                                    reject(err);
                                    return;
                                }
                                var currentDeviceId = device.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID);
                                if (deviceId !== currentDeviceId) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is changed.');
                                    reject(err);
                                    return;
                                }
                                var physicalType = device.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE);
                                if (physicalType !== DPMW.Model.Device.VALUE_PHY_TYPE_USB) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not connected by USB.');
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var deviceVersionModel = device.deviceFirmwareModel.deviceFirmwareVersionModel;
                                deviceVersionModel.fetch({
                                    success: function (model, res, opt) {
                                        var currnetDeviceVersion = deviceVersionModel.get(Device.ATTR_NAME_VERSION);
                                        if (false) {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device version is changed.');
                                            reject(err);
                                            return;
                                        }
                                        resolve();
                                    },
                                    error: function (model, res, opt) {
                                        if (!opt || typeof opt.mwError === 'undefined') {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                            reject(err);
                                            return;
                                        }
                                        reject(opt.mwError);
                                    }
                                });
                            });
                        })
                            .then(function () {
                            return self.stopContentTransfer();
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                device.deviceFirmwareModel.uploadFirmware(filePath, {
                                    success: function (model, res, opt) {
                                        resolve();
                                        self.transferProgress.current = self.transferProgress.total;
                                    },
                                    error: function (model, res, opt) {
                                        if (!opt || typeof opt.mwError === 'undefined') {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                            reject(err);
                                            return;
                                        }
                                        reject(opt.mwError);
                                    }
                                });
                            });
                        })
                            .then(function onFulfilled() {
                            callback.success();
                        }, function onRejected(error) {
                            callback.error(error);
                        });
                    };
                    SoftwareUpdateUtils.prototype.getTransferProgress = function () {
                        var current = 0;
                        var total = 0;
                        var device = DPMW.appCtrl.currentDevice;
                        if (device && device.deviceFirmwareModel) {
                            current = device.deviceFirmwareModel.getCurrentUploadBytes();
                            total = device.deviceFirmwareModel.getTotalUploadBytes();
                        }
                        console.log('[transfer] ' + current + ' / ' + total);
                        if (total > 0) {
                            this.transferProgress.current = current;
                            this.transferProgress.total = total;
                        }
                        return this.transferProgress;
                    };
                    SoftwareUpdateUtils.prototype.isTransferring = function () {
                        var device = DPMW.appCtrl.currentDevice;
                        if (device && device.deviceFirmwareModel) {
                            return device.deviceFirmwareModel.isUploading();
                        }
                        else {
                            return false;
                        }
                    };
                    SoftwareUpdateUtils.prototype.stopTransferring = function (callback) {
                        if (!callback || !callback.success) {
                            throw new Error('callback must be specified.');
                        }
                        var device = DPMW.appCtrl.currentDevice;
                        if (!device || !device.deviceFirmwareModel) {
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                            callback.error(err);
                            return;
                        }
                        device.deviceFirmwareModel.cancelUpload({
                            success: function (model, res, opt) {
                                callback.success();
                            },
                            error: function (model, res, opt) {
                                if (!opt || typeof opt.mwError === 'undefined') {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                    callback.error(err);
                                    return;
                                }
                                callback.error(opt.mwError);
                            }
                        });
                    };
                    SoftwareUpdateUtils.prototype.startDeviceUpdate = function (deviceId, deviceVersion, callback) {
                        if (!callback || !callback.success || !callback.error) {
                            throw new Error('callback must be specified.');
                        }
                        var device = DPMW.appCtrl.currentDevice;
                        Promise.resolve(true)
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (!device || !device.isConnected()) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                                    reject(err);
                                    return;
                                }
                                var currentDeviceId = device.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID);
                                if (deviceId !== currentDeviceId) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is changed.');
                                    reject(err);
                                    return;
                                }
                                var physicalType = device.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE);
                                if (physicalType !== DPMW.Model.Device.VALUE_PHY_TYPE_USB) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not connected by USB.');
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var deviceVersionModel = device.deviceFirmwareModel.deviceFirmwareVersionModel;
                                deviceVersionModel.fetch({
                                    success: function (model, res, opt) {
                                        var currnetDeviceVersion = deviceVersionModel.get(Device.ATTR_NAME_VERSION);
                                        if (false) {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device version is changed.');
                                            reject(err);
                                            return;
                                        }
                                        resolve();
                                    },
                                    error: function (model, res, opt) {
                                        if (!opt || typeof opt.mwError === 'undefined') {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                            reject(err);
                                            return;
                                        }
                                        reject(opt.mwError);
                                    }
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                device.deviceFirmwareModel.startFirmwareUpdate({
                                    success: function (model, res, opt) {
                                        callback.success();
                                    },
                                    error: function (model, res, opt) {
                                        if (!opt || typeof opt.mwError === 'undefined') {
                                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                            callback.error(err);
                                            return;
                                        }
                                        callback.error(opt.mwError);
                                    }
                                });
                            });
                        })
                            .then(function onFulfilled() {
                            callback.success();
                        }, function onRejected(error) {
                            callback.error(error);
                        });
                    };
                    return SoftwareUpdateUtils;
                }());
                Handler.SoftwareUpdateUtils = SoftwareUpdateUtils;
                Handler.softwareUpdateUtils = new SoftwareUpdateUtils();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateUtils.js.map