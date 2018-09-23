var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var SubWindowHandler = Handler.subWindowHandler;
                var SoftwareUpdateHandler = (function (_super) {
                    __extends(SoftwareUpdateHandler, _super);
                    function SoftwareUpdateHandler() {
                        _super.call(this);
                        this.appUpdateNotified = false;
                        this.deviceUpdateNotified = {};
                    }
                    SoftwareUpdateHandler.prototype.initialize = function () {
                    };
                    SoftwareUpdateHandler.prototype.startSoftwareUpdate = function () {
                        console.log('SoftwareUpdateHandler.startSoftwareUpdate()');
                        var self = this;
                        var isForegroundTaskStarted = SubWindowHandler.startSoftwareUpdate();
                        if (!isForegroundTaskStarted) {
                            return;
                        }
                        var closeAppRequired = false;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var isDialogOpened = self.startCheckForUpdate(function (error, updateCheckResult) {
                                    if (error) {
                                        self.showUpdateCheckError(error);
                                        reject(error);
                                        return;
                                    }
                                    else if (updateCheckResult && !updateCheckResult.app && !updateCheckResult.device) {
                                        if (updateCheckResult.appError) {
                                            self.showUpdateCheckError(updateCheckResult.appError);
                                            reject(error);
                                            return;
                                        }
                                        if (updateCheckResult.deviceError) {
                                            self.showUpdateCheckError(updateCheckResult.deviceError);
                                            reject(error);
                                            return;
                                        }
                                        self.showUpdateNotFound();
                                        reject();
                                        return;
                                    }
                                    resolve(updateCheckResult);
                                });
                                if (!isDialogOpened) {
                                    reject();
                                }
                            });
                        })
                            .then(function (updateCheckResult) {
                            return new Promise(function (resolve, reject) {
                                if (updateCheckResult.app) {
                                    self.showUpdateInfoAndStartUpdate(updateCheckResult.app, function (error) {
                                        if (error) {
                                            resolve(updateCheckResult);
                                            return;
                                        }
                                        closeAppRequired = true;
                                        reject();
                                    });
                                }
                                else {
                                    resolve(updateCheckResult);
                                }
                            });
                        })
                            .then(function (updateCheckResult) {
                            return new Promise(function (resolve, reject) {
                                if (!updateCheckResult.device.isUsb) {
                                    self.showDeviceUpdateFoundByNoUsb();
                                    self.deviceUpdateNotified[updateCheckResult.device.deviceId] = true;
                                    reject();
                                    return;
                                }
                                if (updateCheckResult.device) {
                                    self.showUpdateInfoAndStartUpdate(updateCheckResult.device, function (error) {
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        resolve();
                                    });
                                }
                                else {
                                    resolve();
                                }
                            });
                        })
                            .catch(function (error) {
                            if (error) {
                                console.warn('startSoftwareUpdate', error);
                            }
                            return Promise.resolve();
                        })
                            .then(function () {
                            if (isForegroundTaskStarted) {
                                SubWindowHandler.endSoftwareUpdate();
                            }
                            if (closeAppRequired) {
                                self.trigger('forceCloseAppRequired');
                            }
                        });
                    };
                    SoftwareUpdateHandler.prototype.startAppAndDeviceUpdateInBackground = function () {
                        console.log('SoftwareUpdateHandler.startAppAndDeviceUpdateInBackground()');
                        var self = this;
                        var closeAppRequired = false;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                self.startAppUpdateInBackground(function (closeRequired) {
                                    closeAppRequired = closeRequired;
                                    if (closeAppRequired) {
                                        reject();
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                self.startDeviceUpdateInBackground(function () {
                                    resolve();
                                });
                            });
                        })
                            .catch(function () {
                            if (closeAppRequired) {
                                self.trigger('forceCloseAppRequired');
                            }
                        });
                    };
                    SoftwareUpdateHandler.prototype.startAppUpdateInBackground = function (callback) {
                        console.log('SoftwareUpdateHandler.startAppUpdateInBackground()');
                        var closeAppRequired = false;
                        if (this.appUpdateNotified) {
                            callback(closeAppRequired);
                            return;
                        }
                        var self = this;
                        var isForegroundTaskStarted = false;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                resolve();
                                /*
                                Handler.softwareUpdateUtils.removeDownloadDir({
                                    success: function () {
                                        resolve();
                                    },
                                    error: function (err) {
                                        console.warn('error: ' + err);
                                        resolve(err);
                                    }
                                });*/
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.checkForAppUpdate({
                                    success: function (updateInfo) {
                                        if (updateInfo) {
                                            resolve(updateInfo);
                                        }
                                        else {
                                            reject();
                                        }
                                    },
                                    error: function (err) {
                                        console.warn('error: ' + err);
                                        reject(err);
                                    }
                                });
                            });
                        })
                            .then(function (updateInfo) {
                            var _this = this;
                            return new Promise(function (resolve, reject) {
                                if (_this.appUpdateNotified) {
                                    reject();
                                    return;
                                }
                                isForegroundTaskStarted = SubWindowHandler.startSoftwareUpdate();
                                if (!isForegroundTaskStarted) {
                                    reject();
                                    return;
                                }
                                self.showUpdateInfoAndStartUpdate(updateInfo, function (error) {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }
                                    closeAppRequired = true;
                                    resolve();
                                });
                            });
                        })
                            .catch(function (error) {
                            if (error) {
                                console.warn('startAppUpdateInBackground', error);
                            }
                            return Promise.resolve();
                        })
                            .then(function () {
                            if (isForegroundTaskStarted) {
                                SubWindowHandler.endSoftwareUpdate();
                            }
                            callback(closeAppRequired);
                        });
                    };
                    SoftwareUpdateHandler.prototype.startDeviceAndAppUpdateInBackground = function () {
                        console.log('SoftwareUpdateHandler.startDeviceAndAppUpdateInBackground()');
                        var self = this;
                        var closeAppRequired = false;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                self.startDeviceUpdateInBackground(function () {
                                    resolve();
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                self.startAppUpdateInBackground(function (closeRequired) {
                                    closeAppRequired = closeRequired;
                                    if (closeAppRequired) {
                                        reject();
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        })
                            .catch(function () {
                            if (closeAppRequired) {
                                self.trigger('forceCloseAppRequired');
                            }
                        });
                    };
                    SoftwareUpdateHandler.prototype.startDeviceUpdateInBackground = function (callback) {
                        console.log('SoftwareUpdateHandler.startDeviceUpdateInBackground()');
                        var self = this;
                        var currentDeviceId = null;
                        var isForegroundTaskStarted = false;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.getDeviceId({
                                    success: function (deviceId) {
                                        if (deviceId in self.deviceUpdateNotified) {
                                            reject();
                                            return;
                                        }
                                        currentDeviceId = deviceId;
                                        resolve();
                                    },
                                    error: function (err) {
                                        console.warn('getDeviceId: ' + err);
                                        reject(err);
                                    }
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.checkForDeviceUpdate({
                                    success: function (updateInfo) {
                                        if (updateInfo) {
                                            resolve(updateInfo);
                                        }
                                        else {
                                            reject();
                                        }
                                    },
                                    error: function (err) {
                                        console.warn('checkForDeviceUpdate: ' + err);
                                        reject(err);
                                    }
                                });
                            });
                        })
                            .then(function (updateInfo) {
                            return new Promise(function (resolve, reject) {
                                if (updateInfo.deviceId in self.deviceUpdateNotified) {
                                    reject();
                                    return;
                                }
                                isForegroundTaskStarted = SubWindowHandler.startSoftwareUpdate();
                                if (!isForegroundTaskStarted) {
                                    reject();
                                    return;
                                }
                                if (!updateInfo.isUsb) {
                                    self.showDeviceUpdateFoundByNoUsb();
                                    self.deviceUpdateNotified[updateInfo.deviceId] = true;
                                    reject();
                                    return;
                                }
                                self.showUpdateInfoAndStartUpdate(updateInfo, function (error) {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }
                                    resolve();
                                });
                            });
                        })
                            .then(function () {
                            return Promise.resolve();
                        }, function (error) {
                            if (error) {
                                console.warn('startDeviceUpdateInBackground: ', error);
                            }
                            return Promise.resolve();
                        })
                            .then(function () {
                            if (isForegroundTaskStarted) {
                                SubWindowHandler.endSoftwareUpdate();
                            }
                            callback();
                        });
                    };
                    SoftwareUpdateHandler.prototype.showUpdateInfoAndStartUpdate = function (updateInfo, callback) {
                        var self = this;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var isDialogOpened = SubWindowHandler.openWindowSoftwareUpdateFound(updateInfo, {
                                    onDownloadClicked: function () {
                                        resolve(updateInfo.updater);
                                    },
                                    onCancelled: function () {
                                        reject(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Software update is cancelled.'));
                                    }
                                });
                                if (!isDialogOpened) {
                                    reject();
                                }
                                else {
                                    if (updateInfo.updateType === Handler.UPDATE_TYPE.APP) {
                                        self.appUpdateNotified = true;
                                    }
                                    else {
                                        var deviceId = updateInfo.deviceId;
                                        self.deviceUpdateNotified[deviceId] = true;
                                    }
                                }
                            });
                        })
                            .then(function (updater) {
                            return new Promise(function (resolve, reject) {
                                var isDialogOpened = true; /*self.startDownloadUpdater(updateInfo.updateType, updater, function (error, filePath) {
                                    if (error || filePath === null) {
                                        reject(error);
                                        return;
                                    }

                                    resolve(filePath);
                                });*/
                                filepath = userfilepath
                                resolve(filepath);
                                if (!isDialogOpened) {
                                    reject();
                                }
                            });
                        })
                            .then(function (filePath) {
                            return new Promise(function (resolve, reject) {
                                if (updateInfo.updateType === Handler.UPDATE_TYPE.APP) {
                                    self.startAppUpdate(filePath, function (error) {
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        resolve();
                                    });
                                }
                                else {
                                    self.startDeviceUpdate(filePath, updateInfo.updater.size, updateInfo.deviceId, updateInfo.currentVersion, function (error) {
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        resolve();
                                    });
                                }
                            });
                        })
                            .then(function () {
                            callback(null);
                        }, function (error) {t
                            if (error) {
                                console.warn('showUpdateInfoAndStartUpdate', error);
                            }
                            callback(error);
                        });
                    };
                    SoftwareUpdateHandler.prototype.startCheckForUpdate = function (callback) {
                        var checkCompleted = false;
                        var self = this;
                        var isOpened = SubWindowHandler.openWindowSoftwareUpdateCheck({
                            onDialogShown: function () {
                                self.checkForUpdate(function (error, updateCheckResult) {
                                    checkCompleted = true;
                                    SubWindowHandler.closeWindowSoftwareUpdateCheck();
                                    if (error) {
                                        callback(error, null);
                                        return;
                                    }
                                    callback(null, updateCheckResult);
                                });
                            },
                            onCancelled: function () {
                                if (checkCompleted) {
                                    return;
                                }
                                Handler.softwareUpdateUtils.stopCheckingForUpdate({
                                    success: function (data) {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Software update is cancelled.'));
                                    },
                                    error: function (error) {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Software update is cancelled.'));
                                    }
                                });
                            },
                        });
                        return isOpened;
                    };
                    SoftwareUpdateHandler.prototype.checkForUpdate = function (callback) {
                        var appUpdateInfo = null;
                        var deviceUpdateInfo = null;
                        var appError = null;
                        var deviceError = null;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (!Handler.softwareUpdateUtils.isCheckingForUpdate()) {
                                    resolve();
                                }
                                Handler.softwareUpdateUtils.stopCheckingForUpdate({
                                    success: function (data) {
                                        resolve();
                                    },
                                    error: function (error) {
                                        resolve();
                                    }
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.checkForAppUpdate({
                                    success: function (updateInfo) {
                                        if (updateInfo) {
                                            appUpdateInfo = updateInfo;
                                        }
                                        resolve();
                                    },
                                    error: function (err) {
                                        console.warn('checkForAppUpdate', err);
                                        appError = err;
                                        resolve();
                                    }
                                });
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.checkForDeviceUpdate({
                                    success: function (updateInfo) {
                                        if (updateInfo) {
                                            deviceUpdateInfo = updateInfo;
                                        }
                                        resolve();
                                    },
                                    error: function (err) {
                                        if (err.mwCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                                            resolve();
                                            return;
                                        }
                                        console.warn('checkForDeviceUpdate', err);
                                        deviceError = err;
                                        resolve();
                                    }
                                });
                            });
                        })
                            .then(function () {
                            callback(null, {
                                app: appUpdateInfo,
                                appError: appError,
                                device: deviceUpdateInfo,
                                deviceError: deviceError
                            });
                        }, function (error) {
                            callback(error);
                        });
                    };
                    SoftwareUpdateHandler.prototype.showUpdateCheckError = function (error) {
                        var msgId = 'dialog.error.message.88';
                        switch (error.mwCode) {
                            case DPMW.mwe.E_MW_CANCELLED:
                                return;
                            case DPMW.mwe.E_MW_EXT_HTTP_ERROR:
                                if (error.cause && error.cause.code
                                    && (error.cause.code === 'ENOTFOUND' || error.cause.code === 'ESOCKETTIMEDOUT')) {
                                    msgId = 'dialog.error.message.33';
                                }
                                break;
                        }
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(error) })
                        }, function (response) { });
                    };
                    SoftwareUpdateHandler.prototype.showUpdateNotFound = function () {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.title.softwareUpdate'),
                            message: $.i18n.t('dialog.notice.latestSoftware.message')
                        }, function (response) {
                        });
                    };
                    SoftwareUpdateHandler.prototype.showDeviceUpdateFoundByNoUsb = function () {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.title.softwareUpdate'),
                            message: $.i18n.t('dialog.notice.newerSoftwareFoundByWiFi.message', {
                                menu: { category: { help: $.i18n.t('menu.category.help') } },
                                func: { app: { softwareUpdate: $.i18n.t('func.app.softwareUpdate') } },
                            }),
                        }, function (response) {
                        });
                    };
                    SoftwareUpdateHandler.prototype.startDownloadUpdater = function (updateType, updater, callback) {
                        var downloadCompleted = false;
                        var self = this;
                        var isOpened = SubWindowHandler.openWindowSoftwareUpdateDownloadProgress(updateType, {
                            onDialogShown: function () {
                                self.downloadUpdater(updateType, updater, function (error, filePath) {
                                    downloadCompleted = true;
                                    SubWindowHandler.closeWindowSoftwareUpdateDownloadProgress();
                                    if (error) {
                                        self.showDownloadError(error);
                                        callback(error);
                                        return;
                                    }
                                    callback(null, filePath);
                                });
                            },
                            onCancelled: function () {
                                if (downloadCompleted) {
                                    return;
                                }
                                Handler.softwareUpdateUtils.stopDonwloading({
                                    success: function (data) {
                                        SubWindowHandler.closeWindowSoftwareUpdateDownloadProgress();
                                    },
                                    error: function (error) {
                                        SubWindowHandler.closeWindowSoftwareUpdateDownloadProgress();
                                    }
                                });
                            },
                        });
                        return isOpened;
                    };
                    SoftwareUpdateHandler.prototype.downloadUpdater = function (updateType, updater, callback) {
                        var updateInfo = null;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (updateType === Handler.UPDATE_TYPE.APP) {
                                    Handler.softwareUpdateUtils.downloadAppUpdater(updater, {
                                        success: function (filePath) {
                                            console.log('success: ' + filePath);
                                            resolve(filePath);
                                        },
                                        error: function (err) {
                                            console.warn('error: ' + err);
                                            reject(err);
                                        }
                                    });
                                }
                                else {
                                    Handler.softwareUpdateUtils.downloadDeviceUpdater(updater, {
                                        success: function (filePath) {
                                            console.log('success: ' + filePath);
                                            resolve(filePath);
                                        },
                                        error: function (err) {
                                            console.warn('error: ' + err);
                                            reject(err);
                                        }
                                    });
                                }
                            });
                        })
                            .then(function (filePath) {
                            callback(null, filePath);
                        }, function (error) {
                            callback(error);
                        });
                    };
                    SoftwareUpdateHandler.prototype.showDownloadError = function (error) {
                        var msgId = 'dialog.error.message.87';
                        switch (error.mwCode) {
                            case DPMW.mwe.E_MW_CANCELLED:
                                return;
                            case DPMW.mwe.E_MW_EXT_HTTP_ERROR:
                                if (error.cause && error.cause.code
                                    && (error.cause.code === 'ENOTFOUND' || error.cause.code === 'ESOCKETTIMEDOUT')) {
                                    msgId = 'dialog.error.message.34';
                                }
                                break;
                            case DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED:
                                if (error.cause && error.cause.code === 'ENOSPC') {
                                    msgId = 'dialog.error.message.87';
                                }
                                break;
                        }
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(error) })
                        }, function (response) { });
                    };
                    SoftwareUpdateHandler.prototype.startAppUpdate = function (filePath, callback) {
                        var err = null;
                        var self = this;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (Handler.transferProgressHandler.isUploadRunning()
                                    || Handler.transferProgressHandler.isDownloadRunning()
                                    || Handler.syncHandler.isSyncRunning()) {
                                    self.confirmStopTransferForUpdate(Handler.UPDATE_TYPE.APP, function (doesContinue) {
                                        if (doesContinue) {
                                            resolve();
                                        }
                                        else {
                                            reject(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Software update is cancelled.'));
                                        }
                                    });
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.startAppUpdate(filePath, {
                                    success: function (data) {
                                        resolve();
                                    },
                                    error: function (err) {
                                        self.showAppUpdateError(err);
                                        reject(err);
                                    }
                                });
                            });
                        })
                            .catch(function (err) {
                            return new Promise(function (resolve, reject) {
                                var fs = require('fs');
                                fs.unlink(filePath, function (error) {
                                    if (error) {
                                        console.warn('[ERROR] fs.unlink(' + filePath + ') : ' + error);
                                    }
                                    reject(err);
                                });
                            });
                        })
                            .then(function () {
                            callback(null);
                        }, function (error) {
                            callback(error);
                        });
                    };
                    SoftwareUpdateHandler.prototype.showAppUpdateError = function (error) {
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                        }, function (response) { });
                    };
                    SoftwareUpdateHandler.prototype.startDeviceUpdate = function (filePath, fileSize, deviceId, deviceVersion, callback) {
                        var err = null;
                        var self = this;
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (true) {/*
                                    self.confirmStopTransferForUpdate(Handler.UPDATE_TYPE.DEVICE, function (doesContinue) {
                                        if (true) {
                                            resolve();
                                        }
                                        else {
                                            reject(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Software update is cancelled.'));
                                        }
                                    });
                                    return;*/
                                }
                                resolve();
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                filePath = userfilepath;
                                var isDialogOpened = self.startTransferDeviceUpdater(filePath, fileSize, deviceId, deviceVersion, function (error) {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }
                                    resolve();
                                });
                                if (!isDialogOpened) {
                                    reject();
                                }
                            });
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.startDeviceUpdate(deviceId, deviceVersion, {
                                    success: function (data) {
                                        self.showDeviceUpdateStrated();
                                        resolve();
                                    },
                                    error: function (err) {
                                        console.warn('error: ' + err);
                                        self.showDeviceUpdateError(err);
                                        reject(err);
                                    }
                                });
                            });
                        })
                            .catch(function (error) {
                            err = error;
                            Promise.resolve();
                        })
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                var fs = require('fs');
                                fs.unlink(filePath, function (error) {
                                    if (error) {
                                        console.warn('[ERROR] fs.unlink(' + filePath + ') : ' + error);
                                    }
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            });
                        })
                            .then(function () {
                            callback(null);
                        }, function (error) {
                            callback(error);
                        });
                    };
                    SoftwareUpdateHandler.prototype.confirmStopTransferForUpdate = function (updateType, callback) {
                        var messageId = null;
                        if (updateType === Handler.UPDATE_TYPE.APP) {
                            messageId = 'dialog.confirm.abortExit.message';
                        }
                        else {
                            messageId = 'dialog.confirm.abortTransferByUpdate.message';
                        }
                        View.Dialog.openYesNoDialog({
                            title: $.i18n.t('dialog.confirm.abortTransferByUpdate.title'),
                            message: $.i18n.t(messageId)
                        }, function (response) {
                            callback(response === 0);
                        });
                    };
                    SoftwareUpdateHandler.prototype.startTransferDeviceUpdater = function (filePath, fileSize, deviceId, deviceVersion, callback) {
                        var transferCompleted = false;
                        var self = this;
                        var isOpened = SubWindowHandler.openWindowSoftwareUpdateTransferProgress(View.SoftwareUpdate.UPDATE_TYPE.DEVICE, {
                            onDialogShown: function () {
                                self.transferDeviceUpdater(filePath, fileSize, deviceId, deviceVersion, function (error) {
                                    transferCompleted = true;
                                    SubWindowHandler.closeWindowSoftwareUpdateTransferProgress();
                                    if (error) {
                                        self.showDeviceTransferError(error);
                                        callback(error);
                                        return;
                                    }
                                    callback(null);
                                });
                            },
                            onCancelled: function () {
                                if (transferCompleted) {
                                    return;
                                }
                                Handler.softwareUpdateUtils.stopTransferring({
                                    success: function (data) {
                                        SubWindowHandler.closeWindowSoftwareUpdateTransferProgress();
                                    },
                                    error: function (error) {
                                        SubWindowHandler.closeWindowSoftwareUpdateTransferProgress();
                                    }
                                });
                            },
                        });
                        return isOpened;
                    };
                    SoftwareUpdateHandler.prototype.transferDeviceUpdater = function (filePath, fileSize, deviceId, deviceVersion, callback) {
                        var self = this;
                        var hasErrorDetected = false;
                        this.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, function () {
                            if (!DPMW.appCtrl.currentDevice || !DPMW.appCtrl.currentDevice.isConnected()) {
                                console.log('device is disconnected');
                                if (!hasErrorDetected) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                                    self.stopTransferAndShowError(err);
                                }
                            }
                        });
                        this.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE, function () {
                            if (!DPMW.appCtrl.currentDevice ||
                                DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE) !== DPMW.Model.Device.VALUE_PHY_TYPE_USB) {
                                console.log('physical type is changed');
                                if (!hasErrorDetected) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not connected by USB.');
                                    self.stopTransferAndShowError(err);
                                }
                            }
                        });
                        Handler.softwareUpdateUtils.transferDeviceUpdater(filePath, fileSize, deviceId, deviceVersion, {
                            success: function (data) {
                                self.stopListening(DPMW.appCtrl.currentDevice);
                                callback(null);
                            },
                            error: function (err) {
                                self.stopListening(DPMW.appCtrl.currentDevice);
                                hasErrorDetected = true;
                                callback(err);
                            }
                        });
                    };
                    SoftwareUpdateHandler.prototype.stopTransferAndShowError = function (error, callback) {
                        Promise.resolve()
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                Handler.softwareUpdateUtils.stopTransferring({
                                    success: function (data) {
                                        resolve();
                                    },
                                    error: function (error) {
                                        console.warn('stopTransferring', error);
                                        resolve();
                                    }
                                });
                            });
                        })
                            .then(function () {
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t('dialog.error.message.35', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                            }, function (response) {
                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    };
                    SoftwareUpdateHandler.prototype.showDeviceTransferError = function (error) {
                        var msgId = 'dialog.error.message.75';
                        switch (error.mwCode) {
                            case DPMW.mwe.E_MW_CANCELLED:
                                return;
                            case DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT:
                            case DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED:
                                msgId = 'dialog.error.message.78';
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(error), file: error.mwTargetName })
                                }, function (response) { });
                                return;
                            case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                msgId = 'dialog.error.message.35';
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                var statusCode = error.mwWebApiResCode;
                                var response = error.cause;
                                if (statusCode === 400 && response.error_code === '40001') {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (statusCode === 400 && response.error_code === '40002') {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (statusCode === 400 && response.error_code === '40010') {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (statusCode === 400 && response.error_code === '40011') {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (statusCode === 503 && response.error_code === '50301') {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (statusCode >= 400 && statusCode < 500) {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (statusCode >= 500 && statusCode < 600) {
                                    msgId = 'dialog.error.message.3';
                                }
                                else {
                                    msgId = 'dialog.error.message.35';
                                }
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE:
                                msgId = 'dialog.error.message.35';
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_ERROR:
                                msgId = 'dialog.error.message.35';
                                break;
                        }
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(error) })
                        }, function (response) { });
                    };
                    SoftwareUpdateHandler.prototype.showDeviceUpdateError = function (error) {
                        var msgId = 'dialog.error.message.75';
                        switch (error.mwCode) {
                            case DPMW.mwe.E_MW_CANCELLED:
                                return;
                            case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                msgId = 'dialog.error.message.65';
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                var statusCode = error.mwWebApiResCode;
                                var response = error.cause;
                                if (statusCode === 403 && response.error_code === '40302') {
                                    msgId = 'dialog.error.message.36';
                                }
                                else if (statusCode === 403 && response.error_code === '40303') {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (statusCode === 503 && response.error_code === '50301') {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (statusCode >= 400 && statusCode < 500) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (statusCode >= 500 && statusCode < 600) {
                                    msgId = 'dialog.error.message.3';
                                }
                                else {
                                    msgId = 'dialog.error.message.65';
                                }
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE:
                                msgId = 'dialog.error.message.65';
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_ERROR:
                                msgId = 'dialog.error.message.65';
                                break;
                        }
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(error) })
                        }, function (response) { });
                    };
                    SoftwareUpdateHandler.prototype.showDeviceUpdateStrated = function () {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.title.softwareUpdate'),
                            message: $.i18n.t('dialog.notice.updateTransfered.message')
                        }, function (response) {
                        });
                    };
                    return SoftwareUpdateHandler;
                }(Backbone.EventsAdopter));
                Handler.SoftwareUpdateHandler = SoftwareUpdateHandler;
                Handler.softwareUpdateHandler = new SoftwareUpdateHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateHandler.js.map