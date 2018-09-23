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
                var path = require('path');
                var DeviceHandler = (function (_super) {
                    __extends(DeviceHandler, _super);
                    function DeviceHandler() {
                        _super.call(this);
                    }
                    DeviceHandler.prototype.takeScreenshot = function (filePath, options) {
                        var fileName = path.basename(filePath);
                        var fileExt = path.extname(filePath);
                        if (fileExt.length === 0 && fileName.toLowerCase() === '.png') {
                            fileName = '.png';
                            fileExt = '.png';
                        }
                        if (fileExt.toLowerCase() !== '.png') {
                            throw new Error('An invalid file path is specified. file: ' + filePath);
                        }
                        DPMW.appCtrl.currentDevice.screenCapture(filePath, options);
                    };
                    DeviceHandler.prototype.takeScreenshotWithoutSaving = function (options) {
                        DPMW.appCtrl.currentDevice.screenCaptureWithoutSaving(options);
                    };
                    DeviceHandler.prototype.queryBaseUrl = function () {
                        return DPMW.appCtrl.currentDevice.queryBaseUrl();
                    };
                    DeviceHandler.prototype.tryToAuth = function (callback) {
                        return DPMW.appCtrl.currentDevice.tryToAuth(callback);
                    };
                    DeviceHandler.prototype.setCurrentDateTime = function (options) {
                        var now = new Date().toISOString();
                        var dateTime = now.substring(0, 19) + 'Z';
                        DPMW.appCtrl.currentDevice.setDateTime(dateTime, options);
                    };
                    DeviceHandler.prototype.uploadAndOpenDocument = function (filePath, options) {
                        if (!filePath || filePath.length === 0) {
                            throw new Error('An empty file path is specified.');
                        }
                        var fileName = path.basename(filePath);
                        var fileExt = path.extname(filePath);
                        if (fileExt.length === 0 && fileName.toLowerCase() === '.pdf') {
                            fileName = '.pdf';
                            fileExt = '.pdf';
                        }
                        if (fileExt.toLowerCase() !== '.pdf') {
                            throw new Error('An invalid file path is specified. file: ' + filePath);
                        }
                        var fs = require('fs');
                        var self = this;
                        self.trigger('printStarted');
                        var dstFolderId = null;
                        Promise.resolve(true)
                            .then(function () {
                            return new Promise(function (resolve, reject) {
                                if (!DPMW.appCtrl.currentDevice || !DPMW.appCtrl.currentDevice.isConnected()) {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function onFullfilled() {
                            return new Promise(function (resolve, reject) {
                                fs.stat(filePath, function (err, stat) {
                                    if (err || !stat.isFile()) {
                                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT, 'A valid file is not found. file: ' + filePath, err);
                                        reject(error);
                                        return;
                                    }
                                    resolve(filePath);
                                });
                            });
                        })
                            .then(function onFullfilled(filePath) {
                            return new Promise(function (resolve, reject) {
                                DPMW.appCtrl.currentDevice.printDocument(filePath, fileName, {
                                    success: function (modelOrCollection, res, options) {
                                        if (!options || !options.task || typeof (options.task.folderId) !== 'string') {
                                            var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                            console.error('[ERROR] device.printDocument(' + filePath + ') : ' + error);
                                            reject(error);
                                            return;
                                        }
                                        if (!options || !options.task || typeof (options.task.documentId) !== 'string') {
                                            var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                            console.error('[ERROR] device.printDocument(' + filePath + ') : ' + error);
                                            reject(error);
                                            return;
                                        }
                                        resolve(options.task);
                                    },
                                    error: function (modelOrCollection, res, options) {
                                        var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                        console.error('[ERROR] device.printDocument(' + filePath + ') : ' + error);
                                        reject(error);
                                    }
                                });
                            });
                        })
                            .then(function onFullfilled(task) {
                            return new Promise(function (resolve, reject) {
                                DPMW.appCtrl.currentDevice.openDocument(task.documentId, {
                                    success: function (modelOrCollection, res, options) {
                                        console.log('[SUCCESS] device.openDocument(' + filePath + ') : ' + task.documentId);
                                        resolve(task.folderId);
                                    },
                                    error: function (modelOrCollection, res, options) {
                                        var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                        console.error('[ERROR] device.openDocument(' + filePath + ') : ' + error);
                                        resolve(task.folderId);
                                    }
                                });
                            });
                        })
                            .then(function onFulfilled(folderId) {
                            return new Promise(function (resolve, reject) {
                                self.trigger('printSucceeded');
                                dstFolderId = folderId;
                                resolve(null);
                            });
                        }, function onRejected(error) {
                            return new Promise(function (resolve, reject) {
                                error.mwTargetName = filePath;
                                self.trigger('printFailed', error);
                                resolve(error);
                            });
                        })
                            .then(function onFullfilled(error) {
                            return new Promise(function (resolve, reject) {
                                fs.unlink(filePath, function (err) {
                                    if (err) {
                                        console.error('[ERROR] fs.unlink(' + filePath + ') : ' + err);
                                    }
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        resolve(dstFolderId);
                                    }
                                });
                            });
                        })
                            .then(function onFullfilled(folderId) {
                            return Handler.FileTransferUtils.fetchFolderIfNeeded(folderId);
                        })
                            .then(function onFulfilled(folderId) {
                            if (options && options.success) {
                                options.success();
                            }
                        }, function onRejected(error) {
                            if (options && options.error) {
                                options.error(error);
                            }
                        });
                    };
                    DeviceHandler.prototype.getCurrentUploadToOpenProgress = function () {
                        if (!DPMW.appCtrl.currentDevice) {
                            return { currentBytes: 0, totalBytes: 0 };
                        }
                        var total = DPMW.appCtrl.currentDevice.currentPrintBytesTotal();
                        var current = DPMW.appCtrl.currentDevice.currentPrintBytesTransferred();
                        return { currentBytes: current, totalBytes: total };
                    };
                    DeviceHandler.prototype.getWaitingUploadToOpenCount = function () {
                        if (!DPMW.appCtrl.currentDevice) {
                            return 0;
                        }
                        return DPMW.appCtrl.currentDevice.waitingPrintsCount();
                    };
                    DeviceHandler.prototype.stopAllUploadToOpen = function (callbackOptions) {
                        if (!DPMW.appCtrl.currentDevice) {
                            if (callbackOptions) {
                                callbackOptions.success();
                            }
                            return;
                        }
                        DPMW.appCtrl.currentDevice.cancelAllPrintDocument({
                            success: function (modelOrCollection, res, options) {
                                console.log("[SUCCESS] device.cancelAllPrintDocument()");
                                if (callbackOptions) {
                                    callbackOptions.success();
                                }
                            },
                            error: function (modelOrCollection, res, options) {
                                console.error("[ERROR] device.cancelAllPrintDocument() : " + options);
                                if (callbackOptions) {
                                    callbackOptions.success();
                                }
                            }
                        });
                    };
                    return DeviceHandler;
                }(Backbone.EventsAdopter));
                Handler.DeviceHandler = DeviceHandler;
                Handler.deviceHandler = new DeviceHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceHandler.js.map