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
                var FileTransferHandler = (function (_super) {
                    __extends(FileTransferHandler, _super);
                    function FileTransferHandler() {
                        _super.call(this);
                    }
                    FileTransferHandler.prototype.uploadDocuments = function (srcPathArray, dstFolderPath, callbackOptions) {
                        if (!srcPathArray || srcPathArray.length === 0) {
                            throw new Error('srcPathArray must be non-empty array');
                        }
                        if (!dstFolderPath || dstFolderPath.length === 0) {
                            throw new Error('dstFolderPath must be non-empty string');
                        }
                        var dstArrayedFolderPath = dstFolderPath.split('/');
                        if (dstArrayedFolderPath.length === 0 || dstArrayedFolderPath[0] !== 'Document') {
                            throw new Error('dstFolderPath must be started with \'Document\' : ' + dstArrayedFolderPath);
                        }
                        if (dstArrayedFolderPath[dstArrayedFolderPath.length - 1] === '') {
                            dstArrayedFolderPath.pop();
                        }
                        var self = this;
                        var firstError = null;
                        Promise.resolve()
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
                            return Handler.FileTransferUtils.getUploadParamArray(srcPathArray, dstArrayedFolderPath);
                        })
                            .then(function onFullfilled(uploadParamArray) {
                            var promiseArray = [];
                            var _loop_1 = function(i) {
                                var uploadParam = uploadParamArray[i];
                                var promise = new Promise(function (resolve, reject) {
                                    self.trigger('uploadStarted');
                                    if (DPMW.appCtrl.currentDevice.deviceFirmwareModel.isUploading()) {
                                        var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'firmware uploading.');
                                        reject(mwerr);
                                        return;
                                    }
                                    DPMW.appCtrl.currentDevice.uploadDocumentByPath(uploadParam.srcFilePath, uploadParam.dstFolderPath, uploadParam.dstFileName, {
                                        success: function (modelOrCollection, res, options) {
                                            var affectedFolderIds = [];
                                            if (!options || !options.task || typeof (options.task.folderId) !== 'string') {
                                                var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                                console.error('[ERROR] device.uploadDocument(' + uploadParam + ') : ' + error);
                                                reject(error);
                                                return;
                                            }
                                            affectedFolderIds.push(options.task.folderId);
                                            if (options.task.affectedFolderIds) {
                                                for (var j = 0; j < options.task.affectedFolderIds.length; j++) {
                                                    affectedFolderIds.push(options.task.affectedFolderIds[j]);
                                                }
                                            }
                                            resolve(affectedFolderIds);
                                        },
                                        error: function (modelOrCollection, res, options) {
                                            var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                            console.error('[ERROR] device.uploadDocument(' + uploadParam + ') : ' + error);
                                            reject(error);
                                        }
                                    });
                                })
                                    .then(function onFulfilled(affectedFolderIds) {
                                    return new Promise(function (resolve, reject) {
                                        self.trigger('uploadSucceeded');
                                        resolve(affectedFolderIds);
                                    });
                                }, function onRejected(err) {
                                    return new Promise(function (resolve, reject) {
                                        err.mwTargetName = uploadParam.srcFilePath;
                                        self.trigger('uploadFailed', err);
                                        reject(err);
                                    });
                                })
                                    .then(function onFullfilled(affectedFolderIds) {
                                    return Handler.FileTransferUtils.fetchFolderListIfNeeded(affectedFolderIds);
                                })
                                    .catch(function onRejected(err) {
                                    return new Promise(function (resolve, reject) {
                                        if (firstError === null) {
                                            firstError = err;
                                        }
                                        resolve();
                                    });
                                });
                                promiseArray.push(promise);
                            };
                            for (var i = 0; i < uploadParamArray.length; i++) {
                                _loop_1(i);
                            }
                            return Promise.all(promiseArray);
                        })
                            .then(function onFullfilled() {
                            return new Promise(function (resolve, reject) {
                                if (firstError !== null) {
                                    reject(firstError);
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function onFulfilled() {
                            if (callbackOptions) {
                                callbackOptions.success();
                            }
                        }, function onRejected(err) {
                            if (callbackOptions) {
                                callbackOptions.error(err);
                            }
                        });
                    };
                    FileTransferHandler.prototype.getCurrentUploadProgress = function () {
                        if (!DPMW.appCtrl.currentDevice) {
                            return { currentBytes: 0, totalBytes: 0 };
                        }
                        var total = DPMW.appCtrl.currentDevice.currentUploadBytesTotal();
                        var current = DPMW.appCtrl.currentDevice.currentUploadBytesTransferred();
                        return { currentBytes: current, totalBytes: total };
                    };
                    FileTransferHandler.prototype.getWaitingUploadCount = function () {
                        if (!DPMW.appCtrl.currentDevice) {
                            return 0;
                        }
                        return DPMW.appCtrl.currentDevice.waitingUploadsCount();
                    };
                    FileTransferHandler.prototype.stopUploadDocuments = function (callbackOptions) {
                        if (!DPMW.appCtrl.currentDevice) {
                            if (callbackOptions) {
                                callbackOptions.success();
                            }
                            return;
                        }
                        DPMW.appCtrl.currentDevice.cancelAllUploadDocument({
                            success: function (modelOrCollection, res, options) {
                                console.log("[SUCCESS] device.cancelAllUploadDocument()");
                                if (callbackOptions) {
                                    callbackOptions.success();
                                }
                            },
                            error: function (modelOrCollection, res, options) {
                                console.error("[ERROR] device.cancelAllUploadDocument() : " + options);
                                if (callbackOptions) {
                                    callbackOptions.success();
                                }
                            }
                        });
                    };
                    FileTransferHandler.prototype.downloadDocuments = function (srcEntryArray, dstDirPath, callbackOptions) {
                        if (!srcEntryArray || srcEntryArray.length === 0) {
                            throw new Error('srcEntryArray must be non-empty array');
                        }
                        if (!dstDirPath || dstDirPath.length === 0) {
                            throw new Error('dstFolderPath must be non-empty string');
                        }
                        var self = this;
                        var firstError = null;
                        var downloadedPathArray = [];
                        Promise.resolve()
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
                            return Handler.FileTransferUtils.getDownloadParamArray(srcEntryArray, dstDirPath);
                        })
                            .then(function onFullfilled(downloadParamArray) {
                            var promiseArray = [];
                            var _loop_2 = function(i) {
                                var downloadParam = downloadParamArray[i];
                                var promise = new Promise(function (resolve, reject) {
                                    self.trigger('downloadStarted');
                                    DPMW.appCtrl.currentDevice.downloadDocument(downloadParam.documentId, downloadParam.dstFilePath, {
                                        success: function (modelOrCollection, res, options) {
                                            if (!options || !options.task || typeof (options.task.filepath) !== 'string') {
                                                var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                                console.error('[ERROR] device.downloadDocument(' + downloadParam.documentId + ') : ' + error);
                                                reject(error);
                                                return;
                                            }
                                            downloadedPathArray.push(options.task.filepath);
                                            self.trigger('downloadSucceeded');
                                            resolve();
                                        },
                                        error: function (modelOrCollection, res, options) {
                                            var err = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                            console.error('[ERROR] device.downloadDocument(' + downloadParam + ') : ' + err);
                                            err.mwTargetName = downloadParam.srcFilePath;
                                            self.trigger('downloadFailed', err);
                                            if (firstError === null) {
                                                firstError = err;
                                            }
                                            resolve();
                                        }
                                    });
                                });
                                promiseArray.push(promise);
                            };
                            for (var i = 0; i < downloadParamArray.length; i++) {
                                _loop_2(i);
                            }
                            return Promise.all(promiseArray);
                        })
                            .then(function onFullfilled() {
                            return new Promise(function (resolve, reject) {
                                if (firstError !== null) {
                                    reject(firstError);
                                    return;
                                }
                                resolve();
                            });
                        })
                            .then(function onFulfilled() {
                            if (callbackOptions) {
                                callbackOptions.success(downloadedPathArray);
                            }
                        }, function onRejected(err) {
                            if (callbackOptions) {
                                callbackOptions.error(err);
                            }
                        });
                    };
                    FileTransferHandler.prototype.getCurrentDownloadProgress = function () {
                        if (!DPMW.appCtrl.currentDevice) {
                            return { currentBytes: 0, totalBytes: 0 };
                        }
                        var total = DPMW.appCtrl.currentDevice.currentDownloadBytesTotal();
                        var current = DPMW.appCtrl.currentDevice.currentDownloadBytesTransferred();
                        return { currentBytes: current, totalBytes: total };
                    };
                    FileTransferHandler.prototype.getWaitingDownloadCount = function () {
                        if (!DPMW.appCtrl.currentDevice) {
                            return 0;
                        }
                        return DPMW.appCtrl.currentDevice.waitingDownloadsCount();
                    };
                    FileTransferHandler.prototype.stopDownloadDocuments = function (callbackOptions) {
                        if (!DPMW.appCtrl.currentDevice) {
                            if (callbackOptions) {
                                callbackOptions.success();
                            }
                            return;
                        }
                        DPMW.appCtrl.currentDevice.cancelAllDownloadDocument({
                            success: function (modelOrCollection, res, options) {
                                console.log("[SUCCESS] device.cancelAllDownloadDocument()");
                                if (callbackOptions) {
                                    callbackOptions.success();
                                }
                            },
                            error: function (modelOrCollection, res, options) {
                                console.error("[ERROR] device.cancelAllDownloadDocument() : " + options);
                                if (callbackOptions) {
                                    callbackOptions.success();
                                }
                            }
                        });
                    };
                    return FileTransferHandler;
                }(Backbone.EventsAdopter));
                Handler.FileTransferHandler = FileTransferHandler;
                Handler.fileTransferHandler = new FileTransferHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FileTransferHandler.js.map