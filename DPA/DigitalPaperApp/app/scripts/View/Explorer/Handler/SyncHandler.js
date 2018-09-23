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
                var syncFolderPairStore = DPMW.Model.FolderSync.syncFolderPairStore;
                var path = require('path');
                var SyncHandler = (function (_super) {
                    __extends(SyncHandler, _super);
                    function SyncHandler() {
                        _super.call(this);
                        this.syncTransferCount_ = 0;
                        this.running_ = false;
                        this.errors_ = [];
                    }
                    SyncHandler.prototype.initialize = function () {
                        var _this = this;
                        this.syncType_ = null;
                        this.lastSyncResult_ = null;
                        Handler.syncFolderPairHandler.on('transferStart', function (value) {
                            if (typeof value.localFilePath === 'string') {
                                value.filename = path.basename(value.localFilePath);
                            }
                            else if (typeof value.remoteFilePath === 'string') {
                                value.filename = path.basename(value.remoteFilePath);
                            }
                            _this.trigger('transferStart', value);
                        });
                        Handler.syncFolderPairHandler.on('transferSucceed', function (value) {
                            if (typeof value.localFilePath === 'string') {
                                value.filename = path.basename(value.localFilePath);
                            }
                            else if (typeof value.remoteFilePath === 'string') {
                                value.filename = path.basename(value.remoteFilePath);
                            }
                            _this.syncTransferCount_++;
                            _this.trigger('transferSucceed', value);
                        });
                        Handler.syncFolderPairHandler.on('transferFailed', function (err, value) {
                            if (typeof value.localFilePath === 'string') {
                                value.filename = path.basename(value.localFilePath);
                            }
                            else if (typeof value.remoteFilePath === 'string') {
                                value.filename = path.basename(value.remoteFilePath);
                            }
                            _this.trigger('transferFailed', err, value);
                        });
                        Handler.syncFolderPairHandler.on('syncFileFailed', function (err, value) {
                            err.mwTarget = value;
                            _this.errors_.push(err);
                            _this.trigger('syncFileFailed', err, value);
                        });
                        Handler.syncFolderPairHandler.initialize();
                    };
                    SyncHandler.prototype.syncAllPairs = function (syncType, options) {
                        var _this = this;
                        if (this.running_) {
                            throw new Error('sync is already running. wrong call');
                        }
                        if (!DPMW.appCtrl.currentDevice) {
                            throw new Error('currentDevice looks null');
                        }
                        if (DPMW.appCtrl.currentDevice.deviceFirmwareModel.isUploading()) {
                            var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'firmware uploading.');
                            if (typeof options.error === 'function') {
                                options.error(mwerr);
                            }
                            return;
                        }
                        this.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, this.onConnectionStateChanged);
                        this.running_ = true;
                        this.resetCounters_();
                        syncFolderPairStore.getFolderPairs(function (err, pairs) {
                            if (err) {
                                _this.running_ = false;
                                if (typeof options.error === 'function') {
                                    options.error(err);
                                }
                                _this.trigger('syncAllFailed', err, _this.syncType_);
                                return;
                            }
                            if (pairs === null || pairs.length <= 0) {
                                _this.running_ = false;
                                var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'No setting is found for folder sync.');
                                if (typeof options.error === 'function') {
                                    options.error(mwerr);
                                }
                                _this.trigger('syncAllFailed', mwerr, _this.syncType_);
                                return;
                            }
                            var argOptions = _.clone(options);
                            argOptions.success = function () {
                                _this.stopListening(DPMW.appCtrl.currentDevice);
                                Handler.syncFolderPairHandler.clearCancel();
                                _this.running_ = false;
                                var now = new Date();
                                _this.setLastSyncDate_(now);
                                _this.setLastSyncExecutedDate(now);
                                if (typeof options.success === 'function') {
                                    options.success();
                                }
                                _this.lastSyncResult_ = SyncResult.Succeed;
                                _this.trigger('syncAllSucceed', _this.syncType_);
                                console.log('syncAll done.');
                            };
                            argOptions.error = function (err) {
                                _this.stopListening(DPMW.appCtrl.currentDevice);
                                Handler.syncFolderPairHandler.clearCancel();
                                _this.running_ = false;
                                _this.setLastSyncExecutedDate(new Date());
                                if (typeof options.error === 'function') {
                                    options.error(err);
                                }
                                if (err.mwCode === DPMW.mwe.E_MW_CANCELLED || err.mwCode === DPMW.mwe.E_MW_ABORTED) {
                                    _this.lastSyncResult_ = SyncResult.Aborted;
                                }
                                else {
                                    _this.lastSyncResult_ = SyncResult.Failed;
                                }
                                _this.trigger('syncAllFailed', err, _this.syncType_);
                                console.log('syncAll fail.');
                            };
                            _this.syncType_ = syncType;
                            _this.trigger('syncAllStart');
                            console.log('syncAll start.');
                            _this.syncPairSeq_(pairs, argOptions);
                        });
                    };
                    SyncHandler.prototype.cancelSync = function (options) {
                        if (!this.running_) {
                            if (options.error) {
                                options.error(DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'Not running'));
                            }
                            return;
                        }
                        this.lastSyncResult_ = SyncResult.Aborted;
                        var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                        if (fileTransfer.isRunning()) {
                            fileTransfer.cancelAllTasks(function (err) {
                            });
                        }
                        Handler.syncFolderPairHandler.cancelSync(function (err) {
                            if (err) {
                                if (typeof options.error === 'function') {
                                    options.error(err);
                                }
                                return;
                            }
                            if (typeof options.success === 'function') {
                                options.success();
                            }
                        });
                    };
                    SyncHandler.prototype.onConnectionStateChanged = function (modelOrCollection, options) {
                        var state = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE);
                        if (state === DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED) {
                            this.cancelSync({});
                        }
                    };
                    SyncHandler.prototype.syncPairSeq_ = function (pairs, options) {
                        var _this = this;
                        if (!Array.isArray(pairs)) {
                            throw new TypeError('pairs argument must be an array.');
                        }
                        if (pairs.length <= 0) {
                            options.success();
                            return;
                        }
                        var pair = pairs.shift();
                        this.trigger('syncPairStart', pair);
                        Handler.syncFolderPairHandler.syncFolderPair(pair.syncId, pair.localFolderPath, pair.remoteFolderPath, function (err) {
                            if (err) {
                                if (err.mwCode === DPMW.mwe.E_MW_SYNC_REMOTE_FOLDER_NOT_FOUND ||
                                    err.mwCode === DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND) {
                                    console.log(err);
                                    _this.trigger('syncPairFailed', err, pair);
                                    err.mwTarget = pair;
                                    _this.errors_.push(err);
                                    _this.syncPairSeq_(pairs, options);
                                    return;
                                }
                                options.error(err);
                                _this.trigger('syncPairFailed', err, pair);
                                return;
                            }
                            _this.trigger('syncPairSucceed', pair);
                            _this.syncPairSeq_(pairs, options);
                        });
                    };
                    SyncHandler.prototype.resetCounters_ = function () {
                        this.syncTransferCount_ = 0;
                        this.errors_ = [];
                    };
                    SyncHandler.prototype.getSyncAllTransferedCount = function () {
                        return this.syncTransferCount_;
                    };
                    SyncHandler.prototype.getLastSyncDate = function () {
                        var lastSyncDateStr = localStorage.getItem('lastSyncDate');
                        if (typeof lastSyncDateStr !== 'string') {
                            return null;
                        }
                        return new Date(lastSyncDateStr);
                    };
                    SyncHandler.prototype.setLastSyncDate_ = function (date) {
                        localStorage.setItem('lastSyncDate', date.toISOString());
                    };
                    SyncHandler.prototype.getLastSyncExecutedDate = function () {
                        var lastSyncDateStr = localStorage.getItem(DPMW.Utils.LocalStorageItemName.LAST_SYNC_EXECUTED_DATE);
                        if (typeof lastSyncDateStr !== 'string') {
                            return null;
                        }
                        return new Date(lastSyncDateStr);
                    };
                    SyncHandler.prototype.setLastSyncExecutedDate = function (date) {
                        localStorage.setItem(DPMW.Utils.LocalStorageItemName.LAST_SYNC_EXECUTED_DATE, date.toISOString());
                    };
                    SyncHandler.prototype.isSyncRunning = function () {
                        return this.running_;
                    };
                    SyncHandler.prototype.getLastErrors = function () {
                        return this.errors_.slice(0);
                    };
                    SyncHandler.prototype.resetState = function () {
                        this.errors_ = [];
                        this.syncType_ = null;
                        this.lastSyncResult_ = null;
                        this.running_ = false;
                        this.syncTransferCount_ = 0;
                    };
                    SyncHandler.prototype.getLastSyncType = function () {
                        return this.syncType_;
                    };
                    SyncHandler.prototype.getLastSyncResult = function () {
                        return this.lastSyncResult_;
                    };
                    return SyncHandler;
                }(Backbone.EventsAdopter));
                Handler.SyncHandler = SyncHandler;
                (function (SyncType) {
                    SyncType[SyncType["Manual"] = 0] = "Manual";
                    SyncType[SyncType["Auto"] = 1] = "Auto";
                })(Handler.SyncType || (Handler.SyncType = {}));
                var SyncType = Handler.SyncType;
                (function (SyncResult) {
                    SyncResult[SyncResult["Succeed"] = 0] = "Succeed";
                    SyncResult[SyncResult["Failed"] = 1] = "Failed";
                    SyncResult[SyncResult["Aborted"] = 2] = "Aborted";
                })(Handler.SyncResult || (Handler.SyncResult = {}));
                var SyncResult = Handler.SyncResult;
                Handler.syncHandler = new SyncHandler();
                Handler.syncHandler.initialize();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SyncHandler.js.map