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
                var fileStampStore = DPMW.Model.FolderSync.fileStampStore;
                var fs = require('fs');
                var path = require('path');
                var SyncFolderPairHandler = (function (_super) {
                    __extends(SyncFolderPairHandler, _super);
                    function SyncFolderPairHandler() {
                        _super.call(this);
                        this.cancelingCallback_ = null;
                        this.canceling_ = false;
                    }
                    SyncFolderPairHandler.prototype.initialize = function () {
                        var _this = this;
                        Handler.syncTransferHandler.on('fileSyncFailed', function (err, value) {
                            _this.trigger('syncFileFailed', err, value);
                        });
                        Handler.syncTransferHandler.on('transferStart', function (value) {
                            _this.trigger('transferStart', value);
                        });
                        Handler.syncTransferHandler.on('transferSucceed', function (value) {
                            _this.trigger('transferSucceed', value);
                        });
                        Handler.syncTransferHandler.on('transferFailed', function (err, value) {
                            _this.trigger('transferFailed', err, value);
                        });
                    };
                    SyncFolderPairHandler.prototype.isRunning = function () {
                        return false;
                    };
                    SyncFolderPairHandler.prototype.syncFolderPair = function (syncId, localFolderPath, remoteFolderPath, callback) {
                        var _this = this;
                        if (typeof syncId !== 'string') {
                            throw new TypeError('syncId must be set');
                        }
                        if (typeof localFolderPath !== 'string') {
                            throw new TypeError('localFolderPath must be set');
                        }
                        if (typeof remoteFolderPath !== 'string') {
                            throw new TypeError('remoteFolderPath must be set');
                        }
                        this.checkLocalFolderExists_(localFolderPath, function (err) {
                            if (err) {
                                callback(err);
                                _this.trigger('syncPairFailed', err);
                                return;
                            }
                            _this.checkRemoteFolderExists_(remoteFolderPath, function (err, folderId) {
                                if (err) {
                                    callback(err);
                                    _this.trigger('syncPairFailed', err);
                                    return;
                                }
                                _this.syncFolderRecursive_(syncId, localFolderPath, remoteFolderPath, folderId, localFolderPath, remoteFolderPath, function (err) {
                                    if (err) {
                                        callback(err);
                                        _this.trigger('syncPairFailed', err);
                                        return;
                                    }
                                    callback();
                                    _this.trigger('syncPairSucceed');
                                });
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.checkLocalFolderExists_ = function (localFolderPath, callback) {
                        fs.stat(localFolderPath, function (err, stat) {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    var mwerr_1 = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND, 'could not read local dir', err);
                                    callback(mwerr_1);
                                    return;
                                }
                                var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'could not get stat of dir', err);
                                callback(mwerr);
                                return;
                            }
                            if (!stat.isDirectory()) {
                                var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND, 'could not read dir');
                                callback(mwerr);
                                return;
                            }
                            callback(null);
                        });
                    };
                    SyncFolderPairHandler.prototype.checkRemoteFolderExists_ = function (remoteFolderPath, callback) {
                        var entity = DPMW.appCtrl.currentDevice.getEntityModelByPath(remoteFolderPath);
                        entity.fetch({ success: function (modelOrCollection, response, options) {
                                if (!entity.isFolder()) {
                                    entity.release();
                                    entity = null;
                                    var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_REMOTE_FOLDER_NOT_FOUND, 'could not read dir');
                                    callback(mwerr, null);
                                    return;
                                }
                                var folderId = entity.getId();
                                entity.release();
                                entity = null;
                                callback(null, folderId);
                            }, error: function (modelOrCollection, jqxhr, options) {
                                entity.release();
                                entity = null;
                                if (!options || !options.mwError) {
                                    var mwerr_2 = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'could not fetch.');
                                    callback(mwerr_2, null);
                                    return;
                                }
                                var mwerr = options.mwError;
                                if (mwerr.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                    mwerr.mwWebApiResCode === 404 &&
                                    mwerr.cause.error_code === '40401') {
                                    var wrapErr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_REMOTE_FOLDER_NOT_FOUND, 'could not read dir', mwerr);
                                    callback(wrapErr, null);
                                    return;
                                }
                                callback(mwerr, null);
                            } });
                    };
                    SyncFolderPairHandler.prototype.cancelSync = function (callback) {
                        if (this.canceling_) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_ALREADY_RUNNING, 'Cancel is already called'));
                            return;
                        }
                        this.canceling_ = true;
                        this.cancelingCallback_ = callback;
                        return;
                    };
                    SyncFolderPairHandler.prototype.checkCanceling_ = function () {
                        if (this.canceling_) {
                            this.cancelingCallback_();
                            this.cancelingCallback_ = null;
                            this.canceling_ = false;
                            return true;
                        }
                        return false;
                    };
                    SyncFolderPairHandler.prototype.clearCancel = function () {
                        if (this.canceling_) {
                            this.cancelingCallback_();
                            this.cancelingCallback_ = null;
                            this.canceling_ = false;
                        }
                    };
                    SyncFolderPairHandler.prototype.syncFolderRecursive_ = function (syncId, localFolderPath, remoteFolderPath, folderId, localRootFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        if (this.checkCanceling_()) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Cancelled'));
                            return;
                        }
                        this.getRemoteFolderChanges_(syncId, folderId, remoteFolderPath, localFolderPath, remoteRootFolderPath, function (err, remoteAddedDocs, remoteModifiedDocs, remoteRemoved, remoteFolders, remoteNames, remoteNameStampMap, remoteLocalNameMap, remoteAddedLocalNameMap) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            _this.getLocalFolderChanges_(syncId, localFolderPath, remoteFolderPath, localRootFolderPath, function (err, localAdded, localModified, localRemoved, localFolders, localNames, localRemoteNameMap) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                var localOnlyAdded = localAdded.slice(0);
                                var localOnlyModified = localModified.slice(0);
                                var localOnlyRemoved = localRemoved.slice(0);
                                var localModifiedRemoteRemoved = [];
                                var remoteOnlyAdded = [];
                                var remoteOnlyModified = [];
                                var remoteOnlyRemoved = [];
                                var remoteModifiedLocalRemoved = [];
                                var remoteOnlyAddedLocalNameConflict = [];
                                var bothModified = [];
                                var bothAdded = [];
                                var bothRemoved = [];
                                for (var i = 0; i < remoteRemoved.length; i++) {
                                    var rRemoved = remoteRemoved[i];
                                    if (localAdded.indexOf(remoteLocalNameMap[rRemoved]) >= 0) {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend. may be database corrupt.'));
                                        return;
                                    }
                                    if (localModified.indexOf(remoteLocalNameMap[rRemoved]) >= 0) {
                                        localModifiedRemoteRemoved.push(rRemoved);
                                        var lomIndex = localOnlyModified.indexOf(remoteLocalNameMap[rRemoved]);
                                        if (lomIndex < 0) {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                            return;
                                        }
                                        localOnlyModified.splice(lomIndex, 1);
                                    }
                                    else if (localRemoved.indexOf(remoteLocalNameMap[rRemoved]) >= 0) {
                                        bothRemoved.push(rRemoved);
                                        var lorIndex = localOnlyRemoved.indexOf(remoteLocalNameMap[rRemoved]);
                                        if (lorIndex < 0) {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                            return;
                                        }
                                        localOnlyRemoved.splice(lorIndex, 1);
                                    }
                                    else {
                                        remoteOnlyRemoved.push(rRemoved);
                                    }
                                }
                                for (var i = 0; i < remoteAddedDocs.length; i++) {
                                    var remoteAddedDoc = remoteAddedDocs[i];
                                    var remoteAddedName = remoteAddedDoc.getName();
                                    if (!(remoteAddedName in remoteAddedLocalNameMap)) {
                                        remoteOnlyAdded.push(remoteAddedName);
                                        continue;
                                    }
                                    var remoteAddedLocalName = remoteAddedLocalNameMap[remoteAddedName];
                                    if (typeof remoteAddedLocalName === 'undefined') {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                        return;
                                    }
                                    if (localModified.indexOf(remoteAddedLocalName) >= 0) {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend. may be database corrupt.'));
                                        return;
                                    }
                                    if (localRemoved.indexOf(remoteAddedLocalName) >= 0) {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend. may be database corrupt.'));
                                        return;
                                    }
                                    if (localAdded.indexOf(remoteAddedLocalName) >= 0) {
                                        bothAdded.push(remoteAddedName);
                                        var loaIndex = localOnlyAdded.indexOf(remoteAddedLocalName);
                                        if (loaIndex < 0) {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                            return;
                                        }
                                        localOnlyAdded.splice(loaIndex, 1);
                                    }
                                    else {
                                        remoteOnlyAddedLocalNameConflict.push(remoteAddedName);
                                        if (localNames.indexOf(remoteAddedLocalName) >= 0) {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                            return;
                                        }
                                    }
                                }
                                for (var i = 0; i < remoteModifiedDocs.length; i++) {
                                    var remoteModifiedDoc = remoteModifiedDocs[i];
                                    var remoteModifiedName = remoteModifiedDoc.getName();
                                    if (localAdded.indexOf(remoteLocalNameMap[remoteModifiedName]) >= 0) {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend. may be database corrupt.'));
                                        return;
                                    }
                                    if (localModified.indexOf(remoteLocalNameMap[remoteModifiedName]) >= 0) {
                                        bothModified.push(remoteModifiedName);
                                        var lomIndex = localOnlyModified.indexOf(remoteLocalNameMap[remoteModifiedName]);
                                        if (lomIndex < 0) {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                            return;
                                        }
                                        localOnlyModified.splice(lomIndex, 1);
                                    }
                                    else if (localRemoved.indexOf(remoteLocalNameMap[remoteModifiedName]) >= 0) {
                                        remoteModifiedLocalRemoved.push(remoteModifiedName);
                                        var lorIndex = localOnlyRemoved.indexOf(remoteLocalNameMap[remoteModifiedName]);
                                        if (lorIndex < 0) {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                            return;
                                        }
                                        localOnlyRemoved.splice(lorIndex, 1);
                                    }
                                    else {
                                        remoteOnlyModified.push(remoteModifiedName);
                                    }
                                }
                                var preventNameSet = {};
                                var val = {};
                                for (var i = 0; i < localNames.length; i++) {
                                    preventNameSet[localNames[i]] = val;
                                }
                                for (var i = 0; i < remoteNames.length; i++) {
                                    preventNameSet[remoteNames[i]] = val;
                                }
                                var preventNames = Object.keys(preventNameSet);
                                for (var i = 0; i < remoteOnlyAddedLocalNameConflict.length; i++) {
                                    var conflictName = remoteOnlyAddedLocalNameConflict[i];
                                    var err_1 = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_PATH_CONFLICT, 'Remote added but this conflict with another synced file.');
                                    var failedSyncInfo = {
                                        localFilePath: localFolderPath + '/' + remoteAddedLocalNameMap[conflictName],
                                        localDiffType: Handler.DiffType.Stay,
                                        remoteFilePath: remoteFolderPath + '/' + conflictName,
                                        remoteDiffType: Handler.DiffType.Added,
                                    };
                                    _this.trigger('syncFileFailed', err_1, failedSyncInfo);
                                }
                                for (var i = 0; i < localOnlyModified.length; i++) {
                                    localOnlyModified[i] = localRemoteNameMap[localOnlyModified[i]];
                                    if (typeof localOnlyModified[i] !== 'string') {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                        return;
                                    }
                                }
                                for (var i = 0; i < localOnlyRemoved.length; i++) {
                                    localOnlyRemoved[i] = localRemoteNameMap[localOnlyRemoved[i]];
                                    if (typeof localOnlyRemoved[i] !== 'string') {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                        return;
                                    }
                                }
                                _this.syncFolderFiles_(syncId, localFolderPath, remoteFolderPath, localOnlyAdded, localOnlyModified, localOnlyRemoved, localModifiedRemoteRemoved, remoteOnlyAdded, remoteOnlyModified, remoteOnlyRemoved, remoteModifiedLocalRemoved, bothAdded, bothModified, bothRemoved, preventNames, remoteNameStampMap, function (err, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    _this.syncFolderFolders_(syncId, localFolderPath, remoteFolderPath, localFolders, remoteFolders, localRootFolderPath, remoteRootFolderPath, function (err, localRemovedCount, remoteRemovedCount) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        localRemovingCount += localRemovedCount;
                                        remoteRemovingCount += remoteRemovedCount;
                                        if (typeof folderId === 'string') {
                                            Handler.fetchHandler.performFetchForUpdate(folderId, { success: function () {
                                                    callback(null, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount);
                                                }, error: function () {
                                                    callback(null, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount);
                                                } });
                                            return;
                                        }
                                        callback(null, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount);
                                    });
                                });
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.getRemoteFolderChanges_ = function (syncId, folderId, remoteFolderPath, localFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        if (folderId === null) {
                            fileStampStore.getStampListByRemoteFolder(syncId, remoteFolderPath, function (err, stamps) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                var remoteLocalNameMap = {};
                                var allNames = [];
                                var removed = [];
                                for (var i = 0; i < stamps.length; i++) {
                                    var stamp = stamps[i];
                                    var filename = stamp.remoteFileName;
                                    removed.push(filename);
                                    allNames.push(filename);
                                    remoteLocalNameMap[stamp.remoteFileName] = stamp.localFileName;
                                }
                                callback(null, [], [], removed, [], allNames, {}, remoteLocalNameMap, {});
                            });
                            return;
                        }
                        var entityCollection = DPMW.appCtrl.currentDevice.getFolderEntityCollection(folderId);
                        entityCollection.fetch({ success: function (modelOrCollection, response, options) {
                                var entities = entityCollection.sliceOrdered(0);
                                entityCollection.release();
                                entityCollection = null;
                                var remoteNameStampMap = {};
                                for (var i = 0; i < entities.length; i++) {
                                    var entity = entities[i];
                                    remoteNameStampMap[entity.getName()] = entity.getStamp();
                                }
                                fileStampStore.getStampListByRemoteFolder(syncId, remoteFolderPath, function (err, stamps) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    var remoteLocalNameMap = {};
                                    var stampMap = {};
                                    for (var i = 0; i < stamps.length; i++) {
                                        var stamp = stamps[i];
                                        var filename = stamp.remoteFileName;
                                        stampMap[filename] = stamp.remoteStamp;
                                        remoteLocalNameMap[stamp.remoteFileName] = stamp.localFileName;
                                    }
                                    var remoteAddedEntities = [];
                                    var remoteModifiedEntities = [];
                                    var remoteRemovedFiles = [];
                                    var folderEntities = [];
                                    var allNames = [];
                                    for (var i = 0; i < entities.length; i++) {
                                        var entity = entities[i];
                                        allNames.push(entity.getName());
                                        if (!entity.isDocument()) {
                                            if (entity.isFolder()) {
                                                folderEntities.push(entity);
                                            }
                                            else {
                                                console.warn('not file nor directory: ', entity);
                                            }
                                            continue;
                                        }
                                        var stamp = stampMap[entity.getName()];
                                        if (typeof stamp !== 'string') {
                                            remoteAddedEntities.push(entity);
                                            continue;
                                        }
                                        if (stamp !== entity.getStamp()) {
                                            remoteModifiedEntities.push(entity);
                                            delete stampMap[entity.getName()];
                                            continue;
                                        }
                                        else {
                                            delete stampMap[entity.getName()];
                                            continue;
                                        }
                                    }
                                    remoteRemovedFiles = Object.keys(stampMap);
                                    allNames = allNames.concat(remoteRemovedFiles);
                                    _this.getRemoteAddedLocalNames_(remoteFolderPath, remoteAddedEntities, localFolderPath, function (err, remoteAddedLocalNameMap, localConflictRemoteNamesMap) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        callback(null, remoteAddedEntities, remoteModifiedEntities, remoteRemovedFiles, folderEntities, allNames, remoteNameStampMap, remoteLocalNameMap, remoteAddedLocalNameMap);
                                    });
                                });
                            }, error: function (modelOrCollection, jqxhr, options) {
                                entityCollection.release();
                                entityCollection = null;
                                if (!options || !options.mwError) {
                                    var mwerr_3 = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'could not fetch.');
                                    callback(mwerr_3);
                                    return;
                                }
                                var mwerr = options.mwError;
                                if (mwerr.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                    mwerr.mwWebApiResCode === 404 &&
                                    mwerr.cause.error_code === '40401') {
                                    _this.checkRemoteFolderExists_(remoteRootFolderPath, function (err, _) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        fileStampStore.getStampListByRemoteFolder(syncId, remoteFolderPath, function (err, stamps) {
                                            if (err) {
                                                callback(err);
                                                return;
                                            }
                                            var remoteLocalNameMap = {};
                                            var removed = [];
                                            for (var i = 0; i < stamps.length; i++) {
                                                var stamp = stamps[i];
                                                var filename = stamp.remoteFileName;
                                                removed.push(filename);
                                                remoteLocalNameMap[stamp.remoteFileName] = stamp.localFileName;
                                            }
                                            callback(null, [], [], removed, [], [], {}, remoteLocalNameMap, {});
                                        });
                                    });
                                    return;
                                }
                                callback(mwerr);
                            } });
                    };
                    SyncFolderPairHandler.prototype.getRemoteAddedLocalNames_ = function (remoteFolderPath, remoteAddedEntities, localFolderPath, callback) {
                        this.getRemoteAddedLocalNamesSeq_(remoteFolderPath, remoteAddedEntities.slice(0), localFolderPath, {}, {}, callback);
                    };
                    SyncFolderPairHandler.prototype.getRemoteAddedLocalNamesSeq_ = function (remoteFolderPath, remoteAddedEntities, localFolderPath, remoteAddedLocalNameMap, localRemoteAddedNamesMap, callback) {
                        var _this = this;
                        if (remoteAddedEntities.length <= 0) {
                            for (var key in localRemoteAddedNamesMap) {
                                if (localRemoteAddedNamesMap[key].length <= 1) {
                                    delete localRemoteAddedNamesMap[key];
                                }
                            }
                            callback(null, remoteAddedLocalNameMap, localRemoteAddedNamesMap);
                            return;
                        }
                        var remoteAddedEntity = remoteAddedEntities.pop();
                        var remoteAddedName = remoteAddedEntity.getName();
                        var localAddedNameCandidate = Handler.FileTransferUtils.replaceInvalidCharsInPath(remoteAddedName);
                        fs.realpath(localFolderPath + '/' + localAddedNameCandidate, function (err, localRealPath) {
                            if (err) {
                                if (err.code == 'ENOENT') {
                                    _this.getRemoteAddedLocalNamesSeq_(remoteFolderPath, remoteAddedEntities, localFolderPath, remoteAddedLocalNameMap, localRemoteAddedNamesMap, callback);
                                    return;
                                }
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, err));
                                return;
                            }
                            var localRealName = path.basename(localRealPath);
                            remoteAddedLocalNameMap[remoteAddedName] = localRealName;
                            if (localRealName in localRemoteAddedNamesMap) {
                                localRemoteAddedNamesMap[localRealName].push(remoteAddedName);
                            }
                            else {
                                localRemoteAddedNamesMap[localRealName] = [remoteAddedName];
                            }
                            _this.getRemoteAddedLocalNamesSeq_(remoteFolderPath, remoteAddedEntities, localFolderPath, remoteAddedLocalNameMap, localRemoteAddedNamesMap, callback);
                        });
                    };
                    SyncFolderPairHandler.prototype.getLocalFolderChanges_ = function (syncId, localFolderPath, remoteFolderPath, localRootFolderPath, callback) {
                        var _this = this;
                        fs.readdir(localFolderPath, function (err, files) {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    _this.checkLocalFolderExists_(localRootFolderPath, function (err) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        fileStampStore.getStampListByRemoteFolder(syncId, remoteFolderPath, function (err, stamps) {
                                            if (err) {
                                                callback(err);
                                                return;
                                            }
                                            var localRemoteNameMap = {};
                                            var removed = [];
                                            var allNames = [];
                                            for (var i = 0; i < stamps.length; i++) {
                                                var stamp = stamps[i];
                                                var filename = stamp.localFileName;
                                                removed.push(filename);
                                                allNames.push(filename);
                                                localRemoteNameMap[stamp.localFileName] = stamp.remoteFileName;
                                            }
                                            callback(null, [], [], removed, [], allNames, localRemoteNameMap);
                                        });
                                    });
                                    return;
                                }
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to read local dir'));
                                return;
                            }
                            files = DPMW.Utils.PathUtils.normalizeReaddirResult(files);
                            fileStampStore.getStampListByRemoteFolder(syncId, remoteFolderPath, function (err, stamps) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                var localRemoteNameMap = {};
                                var stampMap = {};
                                var differStamps = [];
                                for (var i = 0; i < stamps.length; i++) {
                                    var stamp = stamps[i];
                                    var filename = stamp.localFileName;
                                    stampMap[filename] = stamp.localStamp;
                                    localRemoteNameMap[stamp.localFileName] = stamp.remoteFileName;
                                    if (stamp.localFolderPath !== localFolderPath) {
                                        differStamps.push(stamp);
                                    }
                                }
                                _this.updateLocalFolderCaseInStamps_(syncId, localFolderPath, differStamps, function (err) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    _this.getLocalFileChanges_(syncId, localFolderPath, files, stampMap, function (err, added, modified, removed, folders) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        var allNames = files.concat(removed);
                                        callback(null, added, modified, removed, folders, allNames, localRemoteNameMap);
                                    });
                                });
                                return;
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.updateLocalFolderCaseInStamps_ = function (syncId, localFolderPath, stamps, callback) {
                        this.updateLocalFolderCaseInStampsSeq_(syncId, localFolderPath, stamps.slice(0), callback);
                    };
                    SyncFolderPairHandler.prototype.updateLocalFolderCaseInStampsSeq_ = function (syncId, localFolderPath, stamps, callback) {
                        var _this = this;
                        if (stamps.length <= 0) {
                            callback(null);
                            return;
                        }
                        var stamp = stamps.pop();
                        fileStampStore.setStamp(syncId, localFolderPath + '/' + stamp.localFileName, stamp.localStamp, stamp.remoteFolderPath + '/' + stamp.remoteFileName, stamp.remoteStamp, function (err) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            _this.updateLocalFolderCaseInStampsSeq_(syncId, localFolderPath, stamps, callback);
                        });
                    };
                    SyncFolderPairHandler.prototype.getLocalFileChanges_ = function (syncId, localFolderPath, files, removedMap, callback) {
                        this.getLocalFileChangesSeq_(syncId, localFolderPath, files, [], [], removedMap, [], callback);
                    };
                    SyncFolderPairHandler.prototype.getLocalFileChangesSeq_ = function (syncId, localFolderPath, files, added, modified, removedMap, folders, callback) {
                        var _this = this;
                        if (files.length <= 0) {
                            callback(null, added, modified, Object.keys(removedMap), folders);
                            return;
                        }
                        if (this.checkCanceling_()) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Cancelled'));
                            return;
                        }
                        var filename = files.pop();
                        var filepath = localFolderPath + '/' + filename;
                        fs.stat(filepath, function (err, stat) {
                            if (err) {
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'could not get file stat.', err));
                                return;
                            }
                            if (!stat.isFile()) {
                                delete removedMap[filepath];
                                if (stat.isDirectory()) {
                                    folders.push(filename);
                                }
                                else {
                                    console.warn('file not directory: ', filepath);
                                }
                                _this.getLocalFileChangesSeq_(syncId, localFolderPath, files, added, modified, removedMap, folders, callback);
                                return;
                            }
                            if (filename.slice(filename.length - 4).toLowerCase() !== '.pdf') {
                                _this.getLocalFileChangesSeq_(syncId, localFolderPath, files, added, modified, removedMap, folders, callback);
                                return;
                            }
                            Handler.localFileStampHandler.getFileDiffType(syncId, filepath, function (err, diffType) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                if (diffType === Handler.DiffType.Added) {
                                    added.push(filename);
                                }
                                else if (diffType === Handler.DiffType.Modified) {
                                    modified.push(filename);
                                    delete removedMap[filename];
                                }
                                else if (diffType === Handler.DiffType.Stay) {
                                    delete removedMap[filename];
                                }
                                else {
                                    callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                    return;
                                }
                                _this.getLocalFileChangesSeq_(syncId, localFolderPath, files, added, modified, removedMap, folders, callback);
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFiles_ = function (syncId, localFolderPath, remoteFolderPath, localOnlyAdded, localOnlyModified, localOnlyRemoved, localModifiedRemoteRemoved, remoteOnlyAdded, remoteOnlyModified, remoteOnlyRemoved, remoteModifiedLocalRemoved, bothAdded, bothModified, bothRemoved, preventNames, remoteNameStampMap, callback) {
                        var _this = this;
                        if (!remoteNameStampMap) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'remoteNameStampMap is not set'));
                            return;
                        }
                        console.log('For syncId: ', syncId);
                        console.log('  localFolderPath: ', localFolderPath);
                        console.log('  remoteFolderPath: ', remoteFolderPath);
                        console.log('  localOnlyAdded: ', localOnlyAdded);
                        console.log('  localOnlyModified: ', localOnlyModified);
                        console.log('  localOnlyRemoved: ', localOnlyRemoved);
                        console.log('  localModifiedRemoteRemoved: ', localModifiedRemoteRemoved);
                        console.log('  remoteOnlyAdded: ', remoteOnlyAdded);
                        console.log('  remoteOnlyModified: ', remoteOnlyModified);
                        console.log('  remoteOnlyRemoved: ', remoteOnlyRemoved);
                        console.log('  remoteModifiedLocalRemoved: ', remoteModifiedLocalRemoved);
                        console.log('  bothAdded: ', bothAdded);
                        console.log('  bothModified: ', bothModified);
                        console.log('  bothRemoved: ', bothRemoved);
                        console.log('  preventNames: ', preventNames);
                        var localAddingCount = 0;
                        var localRemovingCount = 0;
                        var remoteAddingCount = 0;
                        var remoteRemovingCount = 0;
                        Promise.resolve().then(function () {
                            console.log('handling localOnlyAdded...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, localOnlyAdded, Handler.DiffType.Added, Handler.DiffType.Stay, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            remoteAddingCount += count;
                            console.log('handling localOnlyModified...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, localOnlyModified, Handler.DiffType.Modified, Handler.DiffType.Stay, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            console.log('handling localOnlyRemoved...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, localOnlyRemoved, Handler.DiffType.Removed, Handler.DiffType.Stay, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            remoteRemovingCount += count;
                            console.log('handling localModifiedRemoteRemoved...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, localModifiedRemoteRemoved, Handler.DiffType.Modified, Handler.DiffType.Removed, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            remoteAddingCount += count;
                            console.log('handling remoteOnlyAdded...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, remoteOnlyAdded, Handler.DiffType.Stay, Handler.DiffType.Added, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            localAddingCount += count;
                            console.log('handling remoteOnlyModified...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, remoteOnlyModified, Handler.DiffType.Stay, Handler.DiffType.Modified, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            console.log('handling remoteOnlyRemoved...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, remoteOnlyRemoved, Handler.DiffType.Stay, Handler.DiffType.Removed, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            localRemovingCount += count;
                            console.log('handling remoteModifiedLocalRemoved...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, remoteModifiedLocalRemoved, Handler.DiffType.Removed, Handler.DiffType.Modified, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            localAddingCount += count;
                            console.log('handling bothAdded...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, bothAdded, Handler.DiffType.Added, Handler.DiffType.Added, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            localAddingCount += count;
                            remoteAddingCount += count;
                            console.log('handling bothModified...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, bothModified, Handler.DiffType.Modified, Handler.DiffType.Modified, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            console.log('handling bothRemoved...');
                            return _this.syncFolderFilesSeqPromise_(syncId, localFolderPath, remoteFolderPath, bothRemoved, Handler.DiffType.Removed, Handler.DiffType.Removed, preventNames, remoteNameStampMap);
                        }).then(function (count) {
                            console.log('...sync done.');
                            callback(null, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount);
                        }, function (err) {
                            callback(err);
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFilesSeqPromise_ = function (syncId, localFolderPath, remoteFolderPath, fileNames, localDiff, remoteDiff, preventNames, remoteNameStampMap) {
                        var _this = this;
                        return new Promise(function (resolve, reject) {
                            _this.syncFolderFilesSeq_(syncId, localFolderPath, remoteFolderPath, fileNames.slice(0), localDiff, remoteDiff, preventNames, remoteNameStampMap, 0, function (err, count) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(count);
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFilesSeq_ = function (syncId, localFolderPath, remoteFolderPath, fileNames, localDiff, remoteDiff, preventNames, remoteNameStampMap, count, callback) {
                        var _this = this;
                        if (fileNames.length <= 0) {
                            callback(null, count);
                            return;
                        }
                        if (this.checkCanceling_()) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_CANCELLED, 'Cancelled'));
                            return;
                        }
                        var fileName = fileNames.pop();
                        var remoteStamp = (fileName in remoteNameStampMap ? remoteNameStampMap[fileName] : null);
                        console.log('trigger sync start for: ', localFolderPath + '/' + fileName);
                        Handler.syncTransferHandler.fileSync(syncId, localFolderPath + '/' + fileName, localDiff, remoteFolderPath + '/' + fileName, remoteStamp, remoteDiff, preventNames, function (err) {
                            console.log('trigger sync done for: ', localFolderPath + '/' + fileName, ', with: ', err);
                            if (err) {
                                if (err.mwCode === DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED ||
                                    err.mwCode === DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED ||
                                    err.mwCode === DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED ||
                                    err.mwCode === DPMW.mwe.E_MW_FILE_UNLINK_LOCAL_FAILED ||
                                    err.mwCode === DPMW.mwe.E_MW_DIR_CONFLICT_WZ_FILE ||
                                    err.mwCode === DPMW.mwe.E_MW_FILE_CONFLICT_WZ_DIR ||
                                    err.mwCode === DPMW.mwe.E_MW_SYNC_LOCAL_PATH_CONFLICT ||
                                    err.mwCode === DPMW.mwe.E_MW_SYNC_REMOTE_PATH_CONFLICT ||
                                    err.mwCode === DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED) {
                                    console.warn('Skipping file transfer error: ', err);
                                    _this.syncFolderFilesSeq_(syncId, localFolderPath, remoteFolderPath, fileNames, localDiff, remoteDiff, preventNames, remoteNameStampMap, count, callback);
                                    return;
                                }
                                callback(err);
                                return;
                            }
                            _this.syncFolderFilesSeq_(syncId, localFolderPath, remoteFolderPath, fileNames, localDiff, remoteDiff, preventNames, remoteNameStampMap, count + 1, callback);
                        });
                        return;
                    };
                    SyncFolderPairHandler.prototype.syncFolderFolders_ = function (syncId, localFolderPath, remoteFolderPath, localFolders, remoteFolders, localRootFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        fileStampStore.getFolderListByRemoteFolder(syncId, remoteFolderPath, function (err, remoteDbSubFolders) {
                            if (err) {
                                callback(err, null, null);
                                return;
                            }
                            for (var i = 0; i < remoteFolders.length; i++) {
                                var remoteSubFolder = remoteFolders[i];
                                var remoteSubFolderName = remoteSubFolder.getName();
                                var rdsfIndex = remoteDbSubFolders.indexOf(remoteSubFolderName);
                                if (rdsfIndex >= 0) {
                                    remoteDbSubFolders.splice(rdsfIndex, 1);
                                }
                            }
                            _this.syncFolderFoldersRemoteRemoved_(syncId, localFolderPath, remoteFolderPath, remoteDbSubFolders, localRootFolderPath, remoteRootFolderPath, function (err, localRemovedCountRR, remoteRemovedCountRR) {
                                if (err) {
                                    callback(err, null, null);
                                    return;
                                }
                                _this.syncFolderFoldersExists_(syncId, localFolderPath, remoteFolderPath, localFolders, remoteFolders, localRootFolderPath, remoteRootFolderPath, function (err, localRemovedCountEx, remoteRemovedCountEx) {
                                    if (err) {
                                        callback(err, null, null);
                                        return;
                                    }
                                    callback(null, localRemovedCountRR + localRemovedCountEx, remoteRemovedCountRR + remoteRemovedCountEx);
                                });
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersExists_ = function (syncId, localFolderPath, remoteFolderPath, localFolders, remoteFolders, localRootFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        this.getRemoteAddedLocalNames_(remoteFolderPath, remoteFolders, localFolderPath, function (err, remoteLocalNameMap, localConflictRemoteNamesMap) {
                            if (err) {
                                callback(err, null, null);
                                return;
                            }
                            var localOnlyFolders = localFolders.slice(0);
                            for (var remoteName in remoteLocalNameMap) {
                                var localName = remoteLocalNameMap[remoteName];
                                var lofIndex = localOnlyFolders.indexOf(localName);
                                if (lofIndex >= 0) {
                                    localOnlyFolders.splice(lofIndex, 1);
                                }
                            }
                            _this.getRemoteFoldersLocalConflict_(syncId, remoteFolderPath, localConflictRemoteNamesMap, function (err, remoteResolvedSubFolders, remoteConflictSubFolders) {
                                if (err) {
                                    callback(err, null, null);
                                    return;
                                }
                                for (var i = 0; i < remoteConflictSubFolders.length; i++) {
                                    var conflictName = remoteConflictSubFolders[i];
                                    var err_2 = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_PATH_CONFLICT, 'Remote added but this conflict with another synced file.');
                                    var failedSyncInfo = {
                                        localFilePath: localFolderPath + '/' + remoteLocalNameMap[conflictName],
                                        localDiffType: Handler.DiffType.Stay,
                                        remoteFilePath: remoteFolderPath + '/' + conflictName,
                                        remoteDiffType: Handler.DiffType.Added,
                                    };
                                    _this.trigger('syncFileFailed', err_2, failedSyncInfo);
                                }
                                var remoteResolvedFolders = [];
                                for (var i = 0; i < remoteFolders.length; i++) {
                                    var remoteSubFolder = remoteFolders[i];
                                    var remoteSubFolderName = remoteSubFolder.getName();
                                    if (remoteConflictSubFolders.indexOf(remoteSubFolderName) < 0) {
                                        remoteResolvedFolders.push(remoteSubFolder);
                                    }
                                }
                                _this.syncFolderFoldersRemote_(syncId, localFolderPath, remoteFolderPath, remoteResolvedFolders, remoteLocalNameMap, localRootFolderPath, remoteRootFolderPath, function (err, localRemovedCount, remoteRemovedCount) {
                                    if (err) {
                                        callback(err, null, null);
                                        return;
                                    }
                                    var localRemovingCount = localRemovedCount;
                                    var remoteRemovingCount = remoteRemovedCount;
                                    _this.syncFolderFoldersLocalOnly_(syncId, localFolderPath, remoteFolderPath, localOnlyFolders, localRootFolderPath, remoteRootFolderPath, function (err, localRemovedCount, remoteRemovedCount) {
                                        if (err) {
                                            callback(err, null, null);
                                            return;
                                        }
                                        localRemovingCount += localRemovedCount;
                                        remoteRemovingCount += remoteRemovedCount;
                                        callback(null, localRemovingCount, remoteRemovingCount);
                                    });
                                });
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersRemoteRemoved_ = function (syncId, localFolderPath, remoteFolderPath, remoteRemovedSubFolderNames, localRootFolderPath, remoteRootFolderPath, callback) {
                        this.syncFolderFoldersRemoteRemovedSeq_(syncId, localFolderPath, remoteFolderPath, remoteRemovedSubFolderNames.slice(0), 0, 0, localRootFolderPath, remoteRootFolderPath, callback);
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersRemoteRemovedSeq_ = function (syncId, localFolderPath, remoteFolderPath, remoteRemovedSubFolderNames, localRemovedCount, remoteRemovedCount, localRootFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        if (remoteRemovedSubFolderNames.length <= 0) {
                            callback(null, localRemovedCount, remoteRemovedCount);
                            return;
                        }
                        var remoteSubFolderName = remoteRemovedSubFolderNames.pop();
                        var remoteSubFolderPath = remoteFolderPath + '/' + remoteSubFolderName;
                        var localSubFolderNameCandidate = Handler.FileTransferUtils.replaceInvalidCharsInPath(remoteSubFolderName);
                        fs.realpath(localFolderPath + '/' + localSubFolderNameCandidate, function (err, localRealPath) {
                            var localSubFolderName = null;
                            if (err) {
                                if (err.code != 'ENOENT') {
                                    callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Failed to get realpath', err));
                                    return;
                                }
                                localSubFolderName = localSubFolderNameCandidate;
                            }
                            else {
                                localSubFolderName = path.basename(localRealPath);
                            }
                            var localSubFolderPath = localFolderPath + '/' + localSubFolderName;
                            _this.syncFolderRecursive_(syncId, localSubFolderPath, remoteSubFolderPath, null, localRootFolderPath, remoteRootFolderPath, function (err, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                var localFolderRemoving = (localRemovingCount > 0 && localAddingCount <= 0);
                                _this.removeLocalFolderIfEmpty_(localFolderRemoving, localSubFolderPath, function (err, localRemoved) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    if (localRemoved) {
                                        localRemovedCount += 1;
                                    }
                                    _this.syncFolderFoldersRemoteRemovedSeq_(syncId, localFolderPath, remoteFolderPath, remoteRemovedSubFolderNames, localRemovedCount, remoteRemovedCount, localRootFolderPath, remoteRootFolderPath, callback);
                                    return;
                                });
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersRemote_ = function (syncId, localFolderPath, remoteFolderPath, remoteSubFolders, remoteLocalNameMap, localRootFolderPath, remoteRootFolderPath, callback) {
                        this.syncFolderFoldersRemoteSeq_(syncId, localFolderPath, remoteFolderPath, remoteSubFolders.slice(0), remoteLocalNameMap, 0, 0, localRootFolderPath, remoteRootFolderPath, callback);
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersRemoteSeq_ = function (syncId, localFolderPath, remoteFolderPath, remoteSubFolders, remoteLocalNameMap, localRemovedCount, remoteRemovedCount, localRootFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        if (remoteSubFolders.length <= 0) {
                            callback(null, localRemovedCount, remoteRemovedCount);
                            return;
                        }
                        var remoteSubFolder = remoteSubFolders.pop();
                        var remoteSubFolderName = remoteSubFolder.getName();
                        var localSubFolderName = null;
                        if (remoteSubFolderName in remoteLocalNameMap) {
                            localSubFolderName = remoteLocalNameMap[remoteSubFolderName];
                        }
                        else {
                            localSubFolderName = Handler.FileTransferUtils.replaceInvalidCharsInPath(remoteSubFolderName);
                        }
                        var remoteSubFolderPath = remoteFolderPath + '/' + remoteSubFolderName;
                        if (remoteSubFolder.getPath() !== remoteSubFolderPath) {
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED, 'Remote folder looks moved');
                            callback(err);
                            var failedSyncInfo = {
                                localFilePath: localFolderPath + '/' + localSubFolderName,
                                localDiffType: Handler.DiffType.Stay,
                                remoteFilePath: remoteFolderPath + '/' + remoteSubFolderPath,
                                remoteDiffType: Handler.DiffType.Removed,
                            };
                            this.trigger('syncFileFailed', err, failedSyncInfo);
                            return;
                        }
                        var localSubFolderPath = localFolderPath + '/' + localSubFolderName;
                        if (!remoteSubFolder.isFolder()) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happen. should be checked internally before this part.'));
                            return;
                        }
                        var folderId = remoteSubFolder.getId();
                        this.syncFolderRecursive_(syncId, localSubFolderPath, remoteSubFolderPath, folderId, localRootFolderPath, remoteRootFolderPath, function (err, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            var remoteFolderRemoving = (remoteRemovingCount > 0 && remoteAddingCount <= 0);
                            var localFolderRemoving = (localRemovingCount > 0 && localAddingCount <= 0);
                            _this.removeRemoteFolderIfEmpty_(remoteFolderRemoving, remoteSubFolder, function (err, remoteRemoved) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                if (remoteRemoved) {
                                    remoteRemovedCount += 1;
                                }
                                _this.removeLocalFolderIfEmpty_(localFolderRemoving, localSubFolderPath, function (err, localRemoved) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    if (localRemoved) {
                                        localRemovedCount += 1;
                                    }
                                    _this.syncFolderFoldersRemoteSeq_(syncId, localFolderPath, remoteFolderPath, remoteSubFolders, remoteLocalNameMap, localRemovedCount, remoteRemovedCount, localRootFolderPath, remoteRootFolderPath, callback);
                                });
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersLocalOnly_ = function (syncId, localFolderPath, remoteFolderPath, localOnlySubFolderNames, localRootFolderPath, remoteRootFolderPath, callback) {
                        this.syncFolderFoldersLocalOnlySeq_(syncId, localFolderPath, remoteFolderPath, localOnlySubFolderNames.slice(0), 0, 0, localRootFolderPath, remoteRootFolderPath, callback);
                    };
                    SyncFolderPairHandler.prototype.syncFolderFoldersLocalOnlySeq_ = function (syncId, localFolderPath, remoteFolderPath, localOnlySubFolderNames, localRemovedCount, remoteRemovedCount, localRootFolderPath, remoteRootFolderPath, callback) {
                        var _this = this;
                        if (localOnlySubFolderNames.length <= 0) {
                            callback(null, localRemovedCount, remoteRemovedCount);
                            return;
                        }
                        var localSubFolderName = localOnlySubFolderNames.pop();
                        var remoteSubFolderPath = remoteFolderPath + '/' + localSubFolderName;
                        var localSubFolderPath = localFolderPath + '/' + localSubFolderName;
                        this.syncFolderRecursive_(syncId, localSubFolderPath, remoteSubFolderPath, null, localRootFolderPath, remoteRootFolderPath, function (err, localAddingCount, localRemovingCount, remoteAddingCount, remoteRemovingCount) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            var localFolderRemoving = (localRemovingCount > 0 && localAddingCount <= 0);
                            _this.removeLocalFolderIfEmpty_(localFolderRemoving, localSubFolderPath, function (err, localRemoved) {
                                if (err) {
                                    callback(err);
                                    return;
                                }
                                if (localRemoved) {
                                    localRemovedCount += 1;
                                }
                                _this.syncFolderFoldersLocalOnlySeq_(syncId, localFolderPath, remoteFolderPath, localOnlySubFolderNames, localRemovedCount, remoteRemovedCount, localRootFolderPath, remoteRootFolderPath, callback);
                                return;
                            });
                        });
                        return;
                    };
                    SyncFolderPairHandler.prototype.removeRemoteFolderIfEmpty_ = function (trigger, folderEntity, callback) {
                        if (!trigger) {
                            callback(null, false);
                            return;
                        }
                        var entityCollection = DPMW.appCtrl.currentDevice.getFolderEntityCollection(folderEntity.getId());
                        entityCollection.fetch({ success: function (modelOrCollection, response, options) {
                                var length = entityCollection.lengthTotal;
                                entityCollection.release();
                                entityCollection = null;
                                if (length > 0) {
                                    callback(null, false);
                                    return;
                                }
                                folderEntity.destroy({
                                    success: function (modelOrCollection, jqxhr, options) {
                                        callback(null, true);
                                    },
                                    error: function (modelOrCollection, jqxhr, options) {
                                        console.warn('Coult not remove remote folder: ', options.mwError);
                                        callback(null, false);
                                    }
                                });
                                return;
                            }, error: function (modelOrCollection, jqxhr, options) {
                                entityCollection.release();
                                entityCollection = null;
                                console.warn('Coult not fetch remote folder: ', options.mwError);
                                callback(null, false);
                            } });
                    };
                    SyncFolderPairHandler.prototype.removeLocalFolderIfEmpty_ = function (trigger, folderPath, callback) {
                        var _this = this;
                        if (!trigger) {
                            callback(null, false);
                            return;
                        }
                        fs.readdir(folderPath, function (err, files) {
                            if (err) {
                                console.warn('Coult not remote dir: ', err);
                                callback(null, false);
                            }
                            files = DPMW.Utils.PathUtils.normalizeReaddirResult(files);
                            if (files.length > 0) {
                                callback(null, false);
                                return;
                            }
                            fs.rmdir(folderPath, function (err) {
                                if (err) {
                                    console.warn('Coult not removed file: ', err);
                                    callback(null, false);
                                    return;
                                }
                                _this.removeLocalFolderWait_(folderPath, 4, callback);
                            });
                        });
                    };
                    SyncFolderPairHandler.prototype.removeLocalFolderWait_ = function (folderPath, retryCount, callback) {
                        var _this = this;
                        fs.stat(folderPath, function (err, stat) {
                            if (err.code === 'ENOENT') {
                                callback(null, true);
                                return;
                            }
                            if (err.code === 'EPERM') {
                                console.warn('Folder looks being removed: ', folderPath);
                                if (retryCount <= 0) {
                                    callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Failed to read stat.', err), null);
                                    return;
                                }
                                setTimeout(function () {
                                    _this.removeLocalFolderWait_(folderPath, retryCount - 1, callback);
                                }, 200);
                                return;
                            }
                            if (err) {
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Failed to read stat.', err), null);
                                return;
                            }
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_UNLINK_LOCAL_FAILED, 'Failed to unlink dir'), null);
                            return;
                        });
                    };
                    SyncFolderPairHandler.prototype.getRemoteFoldersLocalConflict_ = function (syncId, remoteFolderPath, localConflictRemoteNamesMap, callback) {
                        var localConflictNames = Object.keys(localConflictRemoteNamesMap);
                        this.getRemoteFoldersLocalConflictSeq_(syncId, remoteFolderPath, localConflictRemoteNamesMap, localConflictNames, [], [], callback);
                    };
                    SyncFolderPairHandler.prototype.getRemoteFoldersLocalConflictSeq_ = function (syncId, remoteFolderPath, localConflictRemoteNamesMap, localConflictNames, remoteResolvedSubFolders, remoteConflictSubFolders, callback) {
                        var _this = this;
                        if (localConflictNames.length <= 0) {
                            callback(null, remoteResolvedSubFolders, remoteConflictSubFolders);
                            return;
                        }
                        var localConflictName = localConflictNames.pop();
                        var conflictNames = localConflictRemoteNamesMap[localConflictName];
                        conflictNames.sort();
                        this.getRemoteExistingSubFolder_(syncId, remoteFolderPath, conflictNames, function (err, resolvedName) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            if (typeof resolvedName !== 'string') {
                                remoteResolvedSubFolders.push(conflictNames[0]);
                                remoteConflictSubFolders = remoteConflictSubFolders.concat(conflictNames.slice(1));
                                _this.getRemoteFoldersLocalConflictSeq_(syncId, remoteFolderPath, localConflictRemoteNamesMap, localConflictNames, remoteResolvedSubFolders, remoteConflictSubFolders, callback);
                                return;
                            }
                            var crnIndex = conflictNames.indexOf(resolvedName);
                            if (crnIndex < 0) {
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'can not be happend.'));
                                return;
                            }
                            remoteResolvedSubFolders.push(resolvedName);
                            remoteConflictSubFolders = remoteConflictSubFolders.concat(conflictNames.slice(0, crnIndex));
                            remoteConflictSubFolders = remoteConflictSubFolders.concat(conflictNames.slice(crnIndex + 1));
                            _this.getRemoteFoldersLocalConflictSeq_(syncId, remoteFolderPath, localConflictRemoteNamesMap, localConflictNames, remoteResolvedSubFolders, remoteConflictSubFolders, callback);
                        });
                    };
                    SyncFolderPairHandler.prototype.getRemoteExistingSubFolder_ = function (syncId, remoteFolderPath, remoteSubFolders, callback) {
                        this.getRemoteExistingSubFolderSeq_(syncId, remoteFolderPath, remoteSubFolders.slice(0), callback);
                    };
                    SyncFolderPairHandler.prototype.getRemoteExistingSubFolderSeq_ = function (syncId, remoteFolderPath, remoteSubFolders, callback) {
                        var _this = this;
                        if (remoteSubFolders.length <= 0) {
                            callback(null, null);
                            return;
                        }
                        var remoteSubFolder = remoteSubFolders.pop();
                        fileStampStore.getStampListByRemoteFolder(syncId, remoteFolderPath + '/' + remoteSubFolder, function (err, stamps) {
                            if (stamps.length > 0) {
                                callback(null, remoteSubFolder);
                                return;
                            }
                            _this.getRemoteExistingSubFolderSeq_(syncId, remoteFolderPath, remoteSubFolders, callback);
                        });
                    };
                    SyncFolderPairHandler.prototype.syncRemoveLocalFilesSeq_ = function (localFolderPath, remoteRemovedFiles, callback) {
                        var _this = this;
                        if (remoteRemovedFiles.length <= 0) {
                            callback(null);
                            return;
                        }
                        var filename = remoteRemovedFiles.pop();
                        var filepath = localFolderPath + '/' + filename;
                        fs.unlink(filepath, function (err) {
                            if (err) {
                                var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_UNLINK_LOCAL_FAILED, 'Failed to remove file');
                                mwerr.mwTargetName = filepath;
                                _this.trigger('syncFileFailed', mwerr);
                            }
                            _this.syncRemoveLocalFilesSeq_(localFolderPath, remoteRemovedFiles, callback);
                        });
                    };
                    return SyncFolderPairHandler;
                }(Backbone.EventsAdopter));
                Handler.SyncFolderPairHandler = SyncFolderPairHandler;
                Handler.syncFolderPairHandler = new SyncFolderPairHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SyncFolderPairHandler.js.map