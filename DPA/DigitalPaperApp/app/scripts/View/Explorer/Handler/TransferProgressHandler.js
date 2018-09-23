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
                var TransferProgressHandler = (function (_super) {
                    __extends(TransferProgressHandler, _super);
                    function TransferProgressHandler() {
                        _super.call(this);
                        this.dragServer = Handler.dragAndDropHandler.getExternalServer();
                        this.uploadCounter_ = new Handler.TransferCounter();
                        this.initUploadEvents_();
                        this.printCounter_ = new Handler.TransferCounter();
                        this.initPrintEvents_();
                        this.downloadCounter_ = new Handler.TransferCounter();
                        this.initDownloadEvents_();
                        this.dragDownloadCounter_ = new Handler.TransferCounter();
                        this.initDragDownloadEvents_();
                    }
                    TransferProgressHandler.prototype.initUploadEvents_ = function () {
                        var self = this;
                        Handler.fileTransferHandler.on('uploadStarted', function () {
                            var isFirstUpload = !self.isUploadRunning();
                            self.uploadCounter_.addTask();
                            if (isFirstUpload) {
                                self.trigger('uploadProgressStarted');
                            }
                            self.trigger('uploadStarted');
                        });
                        Handler.fileTransferHandler.on('uploadSucceeded', function () {
                            self.uploadCounter_.setTaskSucceeded();
                            self.trigger('uploadSucceeded');
                            if (!self.hasUploadTasks()) {
                                self.setAllUploadTasksFinished();
                                self.trigger('uploadProgressFinished');
                            }
                        });
                        Handler.fileTransferHandler.on('uploadFailed', function (err) {
                            self.uploadCounter_.setTaskFailed(err);
                            self.trigger('uploadFailed', err);
                            self.cancelAllUploadTasks(function (err) {
                                if (!self.hasUploadTasks()) {
                                    self.setAllUploadTasksFinished();
                                    self.trigger('uploadProgressFinished');
                                }
                            });
                        });
                    };
                    TransferProgressHandler.prototype.initPrintEvents_ = function () {
                        var self = this;
                        Handler.deviceHandler.on('printStarted', function () {
                            var isFirstUpload = !self.isUploadRunning();
                            self.printCounter_.addTask();
                            if (isFirstUpload) {
                                self.trigger('uploadProgressStarted');
                            }
                            self.trigger('uploadStarted');
                        });
                        Handler.deviceHandler.on('printSucceeded', function () {
                            self.printCounter_.setTaskSucceeded();
                            self.trigger('uploadSucceeded');
                            if (!self.hasUploadTasks()) {
                                self.setAllUploadTasksFinished();
                                self.trigger('uploadProgressFinished');
                            }
                        });
                        Handler.deviceHandler.on('printFailed', function (err) {
                            self.printCounter_.setTaskFailed(err);
                            self.trigger('uploadFailed', err);
                            self.cancelAllUploadTasks(function (err) {
                                if (!self.hasUploadTasks()) {
                                    self.setAllUploadTasksFinished();
                                    self.trigger('uploadProgressFinished');
                                }
                            });
                        });
                    };
                    TransferProgressHandler.prototype.isUploadRunning = function () {
                        return this.uploadCounter_.isRunning() || this.printCounter_.isRunning();
                    };
                    TransferProgressHandler.prototype.hasUploadTasks = function () {
                        return (!this.uploadCounter_.isFinished() || !this.printCounter_.isFinished());
                    };
                    TransferProgressHandler.prototype.setAllUploadTasksFinished = function () {
                        this.uploadCounter_.setAllTaskFinished();
                        this.printCounter_.setAllTaskFinished();
                    };
                    TransferProgressHandler.prototype.getCurrentUploadProgress = function () {
                        var uploadCurrentFiles = this.uploadCounter_.getDoneCount();
                        var uploadTotalFiles = this.uploadCounter_.getTotalCount();
                        var isUploadFinished = (uploadCurrentFiles === uploadTotalFiles);
                        var uploadFileProgress = Handler.fileTransferHandler.getCurrentUploadProgress();
                        var uploadCurrentBytes = isUploadFinished ? 0 : this.getValidNumber_(uploadFileProgress.currentBytes);
                        var uploadTotalBytes = isUploadFinished ? 0 : this.getValidNumber_(uploadFileProgress.totalBytes);
                        var printCurrentFiles = this.printCounter_.getDoneCount();
                        var printTotalFiles = this.printCounter_.getTotalCount();
                        var isPrintFinished = (printCurrentFiles === printTotalFiles);
                        var printFileProgres = Handler.deviceHandler.getCurrentUploadToOpenProgress();
                        var printCurrentBytes = isPrintFinished ? 0 : this.getValidNumber_(printFileProgres.currentBytes);
                        var printTotalBytes = isPrintFinished ? 0 : this.getValidNumber_(printFileProgres.totalBytes);
                        var progress = 0.0;
                        var currentFiles = uploadCurrentFiles + printCurrentFiles;
                        var totalFiles = uploadTotalFiles + printTotalFiles;
                        if (totalFiles === 0) {
                            progress = 0.0;
                        }
                        else if (currentFiles === totalFiles) {
                            progress = 1.0;
                        }
                        else {
                            progress = currentFiles / totalFiles;
                            if (uploadTotalBytes !== 0) {
                                progress += (uploadCurrentBytes / uploadTotalBytes) / totalFiles;
                            }
                            if (printTotalBytes !== 0) {
                                progress += (printCurrentBytes / printTotalBytes) / totalFiles;
                            }
                        }
                        return { progress: progress, currentFiles: currentFiles, totalFiles: totalFiles };
                    };
                    TransferProgressHandler.prototype.cancelAllUploadTasks = function (callback) {
                        var self = this;
                        var uploadPromise = new Promise(function (resolve, reject) {
                            if (self.uploadCounter_.isCancelled()) {
                                resolve(null);
                                return;
                            }
                            Handler.fileTransferHandler.stopUploadDocuments({
                                success: function () {
                                    console.log("[SUCCESS] fileTransferHandler.stopUploadDocuments()");
                                    resolve(null);
                                },
                                error: function (err) {
                                    console.log("[ERROR] fileTransferHandler.stopUploadDocuments() " + err);
                                    resolve(err);
                                }
                            });
                        });
                        var printPromise = new Promise(function (resolve, reject) {
                            if (self.printCounter_.isCancelled()) {
                                resolve(null);
                                return;
                            }
                            Handler.deviceHandler.stopAllUploadToOpen({
                                success: function () {
                                    console.log("[SUCCESS] deviceHandler.stopAllUploadToOpen()");
                                    resolve(null);
                                },
                                error: function (err) {
                                    console.log("[ERROR] deviceHandler.stopAllUploadToOpen() " + err);
                                    resolve(err);
                                }
                            });
                        });
                        Promise.all([uploadPromise, printPromise])
                            .then(function onFulfilled(errArray) {
                            if (errArray[0] === null && errArray[1] === null) {
                                callback();
                                return;
                            }
                            if (errArray[0] !== null) {
                                callback(errArray[0]);
                                return;
                            }
                            if (errArray[1] !== null) {
                                callback(errArray[1]);
                                return;
                            }
                        });
                    };
                    TransferProgressHandler.prototype.initDownloadEvents_ = function () {
                        var self = this;
                        Handler.fileTransferHandler.on('downloadStarted', function () {
                            var isFirstDownload = !self.isDownloadRunning();
                            self.downloadCounter_.addTask();
                            if (isFirstDownload) {
                                self.trigger('downloadProgressStarted');
                            }
                            self.trigger('downloadStarted');
                        });
                        Handler.fileTransferHandler.on('downloadSucceeded', function () {
                            self.downloadCounter_.setTaskSucceeded();
                            self.trigger('downloadSucceeded');
                            if (!self.hasDownloadTasks()) {
                                self.setAllDownloadTasksFinished();
                                self.trigger('downloadProgressFinished');
                            }
                        });
                        Handler.fileTransferHandler.on('downloadFailed', function (err) {
                            self.downloadCounter_.setTaskFailed(err);
                            self.trigger('downloadFailed', err);
                            self.cancelAllDownloadTasks(function (err) {
                                if (!self.hasDownloadTasks()) {
                                    self.setAllDownloadTasksFinished();
                                    self.trigger('downloadProgressFinished');
                                }
                            });
                        });
                    };
                    TransferProgressHandler.prototype.initDragDownloadEvents_ = function () {
                        var self = this;
                        this.dragServer.on('downloadStart', function () {
                            var isFirstDownload = !self.isDownloadRunning();
                            self.dragDownloadCounter_.addTask();
                            if (isFirstDownload) {
                                self.trigger('downloadProgressStarted');
                            }
                            self.trigger('downloadStarted');
                        });
                        this.dragServer.on('downloadSuccess', function () {
                            self.dragDownloadCounter_.setTaskSucceeded();
                            self.trigger('downloadSucceeded');
                            if (!self.hasDownloadTasks()) {
                                self.setAllDownloadTasksFinished();
                                self.trigger('downloadProgressFinished');
                            }
                        });
                        this.dragServer.on('downloadError', function (err) {
                            self.dragDownloadCounter_.setTaskFailed(err);
                            self.trigger('downloadFailed', err);
                            self.cancelAllDownloadTasks(function (err) {
                                if (!self.hasDownloadTasks()) {
                                    self.setAllDownloadTasksFinished();
                                    self.trigger('downloadProgressFinished');
                                }
                            });
                        });
                    };
                    TransferProgressHandler.prototype.isDownloadRunning = function () {
                        return this.downloadCounter_.isRunning() || this.dragDownloadCounter_.isRunning();
                    };
                    TransferProgressHandler.prototype.hasDownloadTasks = function () {
                        return (!this.downloadCounter_.isFinished() || !this.dragDownloadCounter_.isFinished());
                    };
                    TransferProgressHandler.prototype.setAllDownloadTasksFinished = function () {
                        this.downloadCounter_.setAllTaskFinished();
                        this.dragDownloadCounter_.setAllTaskFinished();
                    };
                    TransferProgressHandler.prototype.getCurrentDownloadProgress = function () {
                        var downloadCurrentFiles = this.downloadCounter_.getDoneCount();
                        var downloadTotalFiles = this.downloadCounter_.getTotalCount();
                        var isDownloadFinished = (downloadCurrentFiles === downloadTotalFiles);
                        var downloadFileProgress = Handler.fileTransferHandler.getCurrentDownloadProgress();
                        var downloadCurrentBytes = isDownloadFinished ? 0 : this.getValidNumber_(downloadFileProgress.currentBytes);
                        var downloadTotalBytes = isDownloadFinished ? 0 : this.getValidNumber_(downloadFileProgress.totalBytes);
                        var dragDownloadCurrentFiles = this.dragDownloadCounter_.getDoneCount();
                        var dragDownloadTotalFiles = this.dragDownloadCounter_.getTotalCount();
                        var isDragDownloadFinished = (dragDownloadCurrentFiles === dragDownloadTotalFiles);
                        var dragDownloadStatusArray = isDragDownloadFinished ? [] : this.dragServer.getStatuses();
                        var progress = 0.0;
                        var currentFiles = downloadCurrentFiles + dragDownloadCurrentFiles;
                        var totalFiles = downloadTotalFiles + dragDownloadTotalFiles;
                        if (totalFiles === 0) {
                            progress = 0.0;
                        }
                        else if (currentFiles === totalFiles) {
                            progress = 1.0;
                        }
                        else {
                            progress = currentFiles / totalFiles;
                            if (downloadCurrentBytes !== 0) {
                                progress += (downloadCurrentBytes / downloadTotalBytes) / totalFiles;
                            }
                            for (var i = 0; i < dragDownloadStatusArray.length; i++) {
                                var dragDownloadStatus = dragDownloadStatusArray[i];
                                var currentBytes = this.getValidNumber_(dragDownloadStatus.transfered);
                                var totalBytes = this.getValidNumber_(dragDownloadStatus.total);
                                if (totalBytes !== 0) {
                                    progress += (currentBytes / totalBytes) / totalFiles;
                                }
                            }
                        }
                        return { progress: progress, currentFiles: currentFiles, totalFiles: totalFiles };
                    };
                    TransferProgressHandler.prototype.cancelAllDownloadTasks = function (callback) {
                        var self = this;
                        var downloadPromise = new Promise(function (resolve, reject) {
                            if (self.downloadCounter_.isCancelled()) {
                                resolve(null);
                                return;
                            }
                            Handler.fileTransferHandler.stopDownloadDocuments({
                                success: function () {
                                    console.log("[SUCCESS] fileTransferHandler.stopDownloadDocuments()");
                                    resolve(null);
                                },
                                error: function (err) {
                                    console.log("[ERROR] fileTransferHandler.stopDownloadDocuments() " + err);
                                    resolve(err);
                                }
                            });
                        });
                        var dragDonwloadPromise = new Promise(function (resolve, reject) {
                            if (self.dragDownloadCounter_.isCancelled()) {
                                resolve(null);
                                return;
                            }
                            self.dragServer.cancelAllDownloadTasks({
                                success: function () {
                                    console.log("[SUCCESS] dragServer.cancelAllDownloadTasks()");
                                    resolve(null);
                                },
                                error: function (err) {
                                    console.log("[ERROR] dragServer.cancelAllDownloadTasks() " + err);
                                    resolve(err);
                                }
                            });
                        });
                        Promise.all([downloadPromise, dragDonwloadPromise])
                            .then(function onFulfilled(errArray) {
                            if (errArray[0] === null && errArray[1] === null) {
                                callback();
                                return;
                            }
                            if (errArray[0] !== null) {
                                callback(errArray[0]);
                                return;
                            }
                            if (errArray[1] !== null) {
                                callback(errArray[1]);
                                return;
                            }
                        });
                    };
                    TransferProgressHandler.prototype.getValidNumber_ = function (value) {
                        return (value === null) ? 0 : value;
                    };
                    return TransferProgressHandler;
                }(Backbone.EventsAdopter));
                Handler.TransferProgressHandler = TransferProgressHandler;
                Handler.transferProgressHandler = new TransferProgressHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=TransferProgressHandler.js.map