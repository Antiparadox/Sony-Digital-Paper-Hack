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
                var localFileStampHandler = DPMW.View.Explorer.Handler.localFileStampHandler;
                var fileStampStore = DPMW.Model.FolderSync.fileStampStore;
                var fileTransferUtils = DPMW.View.Explorer.Handler.FileTransferUtils;
                var CONFLICT_SUFFIX = '_conflicted_';
                var SyncTransferHandler = (function (_super) {
                    __extends(SyncTransferHandler, _super);
                    function SyncTransferHandler() {
                        _super.call(this);
                        this.fs = require('fs');
                        this.crypto = require('crypto');
                        this.path = require('path');
                    }
                    SyncTransferHandler.prototype.fileSync = function (syncId, localPath, localDiffType, remotePath, remoteStamp, remoteDiffType, disabledFileNameList, callback) {
                        var _this = this;
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: localDiffType,
                            remoteFilePath: remotePath,
                            remoteDiffType: remoteDiffType
                        };
                        var tempPath = this.getReplacedInvalidCharsPath(localPath);
                        this.checkRealPathConflict(syncId, tempPath, remotePath, function (err, realPath, isFromDatabase) {
                            if (err) {
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            if (localDiffType === DiffType.Added && isFromDatabase) {
                                if (isFromDatabase) {
                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_PATH_CONFLICT, 'remote path conflict with database.');
                                    _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                    callback(mwErr);
                                    return;
                                }
                            }
                            if (localDiffType === DiffType.Stay && remoteDiffType === DiffType.Added) {
                                _this.syncLocalStayRemoteAdded(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Stay && remoteDiffType === DiffType.Modified) {
                                _this.syncLocalStayRemoteModified(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Stay && remoteDiffType === DiffType.Removed) {
                                _this.syncLocalStayRemoteRemoved(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Added && remoteDiffType === DiffType.Stay) {
                                _this.syncLocalAddedRemoteStay(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Modified && remoteDiffType === DiffType.Stay) {
                                _this.syncLocalModifiedRemoteStay(syncId, realPath, remotePath, remoteStamp, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Removed && remoteDiffType === DiffType.Stay) {
                                _this.syncLocalRemovedRemoteStay(syncId, realPath, remotePath, remoteStamp, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Modified && remoteDiffType === DiffType.Removed) {
                                _this.syncLocalModifiedRemoteRemoved(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Removed && remoteDiffType === DiffType.Modified) {
                                _this.syncLocalRemovedRemoteModified(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Removed && remoteDiffType === DiffType.Removed) {
                                _this.syncLocalRemovedRemoteRemoved(syncId, realPath, remotePath, disabledFileNameList, callback);
                            }
                            else if (localDiffType === DiffType.Modified && remoteDiffType === DiffType.Modified) {
                                _this.syncLocalModifiedRemoteModified(syncId, realPath, remotePath, disabledFileNameList, false, callback);
                            }
                            else if (localDiffType === DiffType.Added && remoteDiffType === DiffType.Added) {
                                _this.syncLocalAddedRemoteAdded(syncId, realPath, remotePath, disabledFileNameList, false, callback);
                            }
                            else {
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'bad DiffType pair.'));
                                return;
                            }
                        });
                    };
                    SyncTransferHandler.prototype.getReplacedInvalidCharsPath = function (localPath) {
                        var boundary = localPath.lastIndexOf('/');
                        var folder = localPath.slice(0, boundary);
                        var baseName = localPath.slice(boundary + 1);
                        var replacedBaseName = fileTransferUtils.replaceInvalidCharsInPath(baseName);
                        return folder + "/" + replacedBaseName;
                    };
                    SyncTransferHandler.prototype.checkRealPathConflict = function (syncId, localPath, remotePath, callback) {
                        var _this = this;
                        fileStampStore.getRemoteStamp(syncId, remotePath, function (err, localStamp, stamp) {
                            if (err) {
                                callback(err, null, null);
                                return;
                            }
                            if (stamp) {
                                callback(null, stamp.localFolderPath + "/" + stamp.localFileName, true);
                                return;
                            }
                            else {
                                _this.getRealPath(syncId, localPath, function (err, realPath) {
                                    if (err) {
                                        var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'getRealPath failed.', err);
                                        callback(mwErr, null, null);
                                        return;
                                    }
                                    fileStampStore.getLocalStamp(syncId, realPath, function (err, localStamp, stamp) {
                                        if (err) {
                                            callback(err, null, null);
                                            return;
                                        }
                                        if (stamp) {
                                            var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_PATH_CONFLICT, 'local path conflict.');
                                            callback(mwErr, null, null);
                                            return;
                                        }
                                        else {
                                            callback(null, realPath, false);
                                        }
                                    });
                                });
                            }
                        });
                    };
                    SyncTransferHandler.prototype.getRealPath = function (syncId, localPath, callback) {
                        var _this = this;
                        this.fs.realpath(localPath, function (err, resolvedPath) {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    var tempFile_1 = localPath.slice(0, -4) + ".$nc";
                                    _this.makeDirRecursive(_this.path.dirname(tempFile_1), function (err, parentDir) {
                                        if (err) {
                                            callback(err, null);
                                            return;
                                        }
                                        _this.fs.writeFile(tempFile_1, '', function (err) {
                                            if (err) {
                                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'failed to create temp file for get real path.', err);
                                                callback(mwErr, null);
                                                return;
                                            }
                                            _this.fs.realpath(tempFile_1, function (err, resolvedPath) {
                                                if (err) {
                                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to get realpath.', err);
                                                    callback(mwErr, null);
                                                    return;
                                                }
                                                var realPath = "" + resolvedPath.slice(0, -4) + localPath.slice(-4);
                                                _this.fs.unlink(resolvedPath, function () {
                                                    var path = _this.path.dirname(resolvedPath);
                                                    if (process.platform === 'win32') {
                                                        path = path.replace(/\\/g, '/');
                                                    }
                                                    _this.removeDirRecursive(parentDir, path, function () {
                                                        callback(null, realPath);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                    return;
                                }
                                else {
                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to get realpath.', err);
                                    callback(mwErr, null);
                                }
                                return;
                            }
                            callback(null, resolvedPath);
                        });
                    };
                    SyncTransferHandler.prototype.makeDirRecursive = function (dirPath, callback) {
                        var _this = this;
                        this.fs.stat(dirPath, function (err, stat) {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    var parentDir = _this.path.dirname(dirPath);
                                    var baseName = _this.path.basename(dirPath);
                                    _this.makeDirRecursive(parentDir, function (err, parentPath) {
                                        _this.fs.mkdir(dirPath, function (err) {
                                            if (err) {
                                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'fs.mkdir failed', stat));
                                                return;
                                            }
                                            callback(null, parentPath);
                                        });
                                    });
                                }
                                return;
                            }
                            if (!stat.isDirectory()) {
                                callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DIR_CONFLICT_WZ_FILE, 'file exists', stat));
                                return;
                            }
                            callback(null, dirPath);
                        });
                    };
                    SyncTransferHandler.prototype.removeDirRecursive = function (parentPath, path, callback) {
                        var _this = this;
                        if (parentPath === path) {
                            callback(null);
                            return;
                        }
                        var parent = this.path.dirname(path);
                        this.fs.rmdir(path, function (err) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            _this.removeDirRecursive(parentPath, parent, callback);
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalStayRemoteAdded = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var transferInfo = {
                            transferType: TransferType.DownloadNewFile,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Stay,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Added,
                        };
                        var tempFilePath = this.getTempFilePath(localPath);
                        this.trigger('transferStart', transferInfo);
                        this.downloadFileForSync(remotePath, tempFilePath, function (err, downloadStamp, remoteStamp) {
                            if (err) {
                                _this.trigger('transferFailed', err, transferInfo);
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            _this.resolveDownloadedTempFile(syncId, localPath, tempFilePath, fileList, function (err, localFileExist, newFilePath) {
                                if (localFileExist === true) {
                                    failedSyncInfo.localFilePath = localPath;
                                    failedSyncInfo.localDiffType = DiffType.Added;
                                }
                                if (err) {
                                    _this.trigger('transferFailed', err, transferInfo);
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                fileStampStore.setStamp(syncId, localPath, downloadStamp, remotePath, remoteStamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    if (!newFilePath) {
                                        callback(null);
                                        return;
                                    }
                                    var fileName = _this.path.basename(newFilePath);
                                    var folder = _this.path.dirname(remotePath);
                                    var remoteFilePath = folder + "/" + fileName;
                                    transferInfo = {
                                        transferType: TransferType.UploadNewFile,
                                        localFilePath: newFilePath,
                                        remoteFilePath: remoteFilePath,
                                    };
                                    failedSyncInfo = {
                                        localFilePath: newFilePath,
                                        localDiffType: DiffType.Added,
                                        remoteFilePath: remoteFilePath,
                                        remoteDiffType: DiffType.Stay,
                                    };
                                    _this.trigger('transferStart', transferInfo);
                                    localFileStampHandler.calculateFileStamp(newFilePath, function (error, newLocalStamp) {
                                        if (error) {
                                            _this.trigger('transferFailed', error, transferInfo);
                                            _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                            callback(error);
                                            return;
                                        }
                                        if (newLocalStamp === downloadStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                        else {
                                            _this.uploadNewFileForConflict(syncId, newFilePath, newLocalStamp, folder, fileName, function (err) {
                                                if (err) {
                                                    _this.trigger('transferFailed', err, transferInfo);
                                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                                    callback(err);
                                                    return;
                                                }
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalStayRemoteModified = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var transferInfo = {
                            transferType: TransferType.DownloadToOverwrite,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Stay,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Modified,
                        };
                        var tempFilePath = this.getTempFilePath(localPath);
                        this.trigger('transferStart', transferInfo);
                        this.downloadFileForSync(remotePath, tempFilePath, function (err, downloadStamp, remoteStamp) {
                            if (err) {
                                _this.trigger('transferFailed', err, transferInfo);
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            _this.resolveDownloadedTempFile(syncId, localPath, tempFilePath, fileList, function (err, localFileExist, newFilePath) {
                                if (localFileExist === false) {
                                    failedSyncInfo.localDiffType = DiffType.Removed;
                                }
                                if (err) {
                                    _this.trigger('transferFailed', err, transferInfo);
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                fileStampStore.setStamp(syncId, localPath, downloadStamp, remotePath, remoteStamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    if (!newFilePath) {
                                        callback(null);
                                        return;
                                    }
                                    localFileStampHandler.calculateFileStamp(newFilePath, function (error, newLocalStamp) {
                                        if (error) {
                                            callback(error);
                                            return;
                                        }
                                        if (lStamp === newLocalStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                callback(null);
                                                return;
                                            });
                                        }
                                        else if (newLocalStamp === downloadStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                callback(null);
                                                return;
                                            });
                                        }
                                        else {
                                            var fileName = _this.path.basename(newFilePath);
                                            var folder = _this.path.dirname(remotePath);
                                            var remoteFilePath = folder + "/" + fileName;
                                            transferInfo = {
                                                transferType: TransferType.UploadNewFile,
                                                localFilePath: newFilePath,
                                                remoteFilePath: remoteFilePath,
                                            };
                                            failedSyncInfo = {
                                                localFilePath: newFilePath,
                                                localDiffType: DiffType.Added,
                                                remoteFilePath: remoteFilePath,
                                                remoteDiffType: DiffType.Stay,
                                            };
                                            _this.trigger('transferStart', transferInfo);
                                            _this.uploadNewFileForConflict(syncId, newFilePath, newLocalStamp, folder, fileName, function (err) {
                                                if (err) {
                                                    _this.trigger('transferFailed', err, transferInfo);
                                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                                    callback(err);
                                                    return;
                                                }
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalStayRemoteRemoved = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Stay,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Removed,
                        };
                        this.getFilePathForConflict(localPath, fileList, function (err, newFilePath) {
                            if (err) {
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            _this.fs.rename(localPath, newFilePath, function (err) {
                                if (err) {
                                    if (err.code === 'ENOENT') {
                                        _this.syncLocalRemovedRemoteRemoved(syncId, localPath, remotePath, fileList, callback);
                                    }
                                    else {
                                        var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED, 'failed to rename file.', err);
                                        _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                        callback(mwErr);
                                    }
                                    return;
                                }
                                localFileStampHandler.calculateFileStamp(newFilePath, function (error, curLocalStamp) {
                                    if (error) {
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    fileStampStore.getLocalStamp(syncId, localPath, function (err, oldLocalStamp) {
                                        if (err) {
                                            _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                            callback(err);
                                            return;
                                        }
                                        if (curLocalStamp === oldLocalStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err && err.code !== 'ENOENT') {
                                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_UNLINK_LOCAL_FAILED, 'failed to delete file.', err);
                                                    _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                    callback(mwErr);
                                                    return;
                                                }
                                                fileStampStore.removeStampByLocal(syncId, localPath, function (error, stamp) {
                                                    if (error) {
                                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                                        callback(error);
                                                        return;
                                                    }
                                                    callback(null);
                                                });
                                            });
                                        }
                                        else {
                                            failedSyncInfo.localDiffType = DiffType.Modified;
                                            var transferInfo_1 = {
                                                transferType: TransferType.UploadNewFile,
                                                localFilePath: localPath,
                                                remoteFilePath: remotePath,
                                            };
                                            _this.trigger('transferStart', transferInfo_1);
                                            _this.fs.stat(localPath, function (err, stat) {
                                                if (err) {
                                                    if (err.code === 'ENOENT') {
                                                        _this.fs.rename(newFilePath, localPath, function (err) {
                                                            if (err) {
                                                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED, 'failed to rename file.', err);
                                                                _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                                callback(mwErr);
                                                                return;
                                                            }
                                                            var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                                                            var fileName = _this.path.basename(remotePath);
                                                            var parentFolderPath = _this.path.dirname(remotePath);
                                                            fileTransfer.uploadDocumentByPath(parentFolderPath, localPath, fileName, { rename: false }, function (error, res) {
                                                                if (error) {
                                                                    _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                                                    _this.trigger('transferFailed', error, transferInfo_1);
                                                                    callback(error);
                                                                    return;
                                                                }
                                                                var remoteFilePath = parentFolderPath + "/" + fileName;
                                                                var actRemotePath = res.parentFolderPath + '/' + res.filename;
                                                                if (actRemotePath !== remoteFilePath) {
                                                                    console.warn('file name is changed when uploading.');
                                                                }
                                                                fileStampStore.setStamp(syncId, localPath, curLocalStamp, actRemotePath, res.stamp, function (error, lStamp, rStamp) {
                                                                    if (error) {
                                                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                                                        _this.trigger('transferFailed', error, transferInfo_1);
                                                                        callback(error);
                                                                        return;
                                                                    }
                                                                    callback(null);
                                                                });
                                                                Handler.fetchHandler.performFetchForUpdate(res.folderId, {
                                                                    error: function () {
                                                                    }
                                                                });
                                                            });
                                                        });
                                                    }
                                                    else {
                                                        var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to read file.', err);
                                                        _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                        callback(mwErr);
                                                    }
                                                    return;
                                                }
                                                else {
                                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'local file updated.', err);
                                                    _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                    callback(mwErr);
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalAddedRemoteStay = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                        var transferInfo = {
                            transferType: TransferType.UploadNewFile,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Added,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Stay,
                        };
                        this.trigger('transferStart', transferInfo);
                        localFileStampHandler.calculateFileStamp(localPath, function (error, localStamp) {
                            if (error) {
                                _this.trigger('transferFailed', error, transferInfo);
                                _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                callback(error);
                                return;
                            }
                            var parentFolderPath = _this.path.dirname(remotePath);
                            var filename = _this.path.basename(remotePath);
                            fileTransfer.uploadDocumentByPath(parentFolderPath, localPath, filename, { rename: false }, function (error, res) {
                                if (error) {
                                    _this.trigger('transferFailed', error, transferInfo);
                                    if (error.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                        error.mwWebApiResCode === 400 &&
                                        error.cause.error_code === '40007') {
                                        _this.syncLocalAddedRemoteAdded(syncId, localPath, remotePath, fileList, true, callback);
                                        return;
                                    }
                                    _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                    callback(error);
                                    return;
                                }
                                var actRemotePath = res.parentFolderPath + '/' + res.filename;
                                if (actRemotePath !== remotePath) {
                                    console.warn('file name is changed when uploading.');
                                }
                                fileStampStore.setStamp(syncId, localPath, localStamp, actRemotePath, res.stamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    callback(null);
                                });
                                Handler.fetchHandler.performFetchForUpdate(res.folderId, {
                                    error: function (modelOrCollection, jqxhr, opt) {
                                    }
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalModifiedRemoteStay = function (syncId, localPath, remotePath, remoteStamp, fileList, callback) {
                        var _this = this;
                        var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                        var transferInfo = {
                            transferType: TransferType.UploadNewFile,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Added,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Stay,
                        };
                        this.trigger('transferStart', transferInfo);
                        localFileStampHandler.calculateFileStamp(localPath, function (error, localStamp) {
                            if (error) {
                                _this.trigger('transferFailed', error, transferInfo);
                                _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                callback(error);
                                return;
                            }
                            fileTransfer.uploadOverwriteDocumentByPath(remotePath, localPath, remoteStamp, function (error, res) {
                                if (error) {
                                    _this.trigger('transferFailed', error, transferInfo);
                                    if (error &&
                                        error.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                        error.mwWebApiResCode === 400 &&
                                        error.cause.error_code === '40017') {
                                        _this.syncLocalModifiedRemoteModified(syncId, localPath, remotePath, fileList, false, callback);
                                        return;
                                    }
                                    _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                    callback(error);
                                    return;
                                }
                                fileStampStore.setStamp(syncId, localPath, localStamp, remotePath, res.stamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    callback(null);
                                });
                                Handler.fetchHandler.performFetchForUpdate(res.folderId, {
                                    error: function (modelOrCollection, jqxhr, opt) {
                                    }
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalRemovedRemoteStay = function (syncId, localPath, remotePath, remoteStamp, fileList, callback) {
                        var _this = this;
                        var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Removed,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Stay,
                        };
                        this.fs.stat(localPath, function (err, stat) {
                            if (!err) {
                                if (stat.isDirectory()) {
                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_CONFLICT_WZ_DIR, 'exist same name folder.');
                                    _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                    callback(mwErr);
                                    return;
                                }
                                _this.syncLocalModifiedRemoteStay(syncId, localPath, remotePath, remoteStamp, fileList, callback);
                                return;
                            }
                            if (err.code !== 'ENOENT') {
                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to check local file existence.', err);
                                _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                callback(mwErr);
                                return;
                            }
                            var doc;
                            doc = DPMW.appCtrl.currentDevice.getEntityModelByPath(remotePath);
                            doc.fetch({
                                error: function (modelOrCollection, res, options) {
                                    doc.release();
                                    if (options && options.mwError) {
                                        var mwErr = options.mwError;
                                        if (mwErr.mwWebApiResCode === 404 && mwErr.cause.error_code === '40401') {
                                            fileStampStore.removeStampByRemote(syncId, remotePath, function (error, stamp) {
                                                if (error) {
                                                    callback(error);
                                                    return;
                                                }
                                                callback(null);
                                            });
                                        }
                                        else {
                                            _this.trigger('fileSyncFailed', options.mwError, failedSyncInfo);
                                            callback(options.mwError);
                                        }
                                    }
                                    else {
                                        var mwError = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'remote docment fetch error.');
                                        _this.trigger('fileSyncFailed', mwError, failedSyncInfo);
                                        callback(mwError);
                                    }
                                },
                                success: function (model, res, options) {
                                    var curStamp = doc.getStamp();
                                    if (curStamp === remoteStamp) {
                                        Handler.fileManageHandler.deleteDocument(doc, {
                                            success: function () {
                                                fileStampStore.removeStampByRemote(syncId, remotePath, function (error, stamp) {
                                                    doc.release();
                                                    if (error) {
                                                        callback(error);
                                                        return;
                                                    }
                                                    callback(null);
                                                });
                                            },
                                            error: function (mwErr) {
                                                doc.release();
                                                if (mwErr) {
                                                    if (mwErr.mwWebApiResCode === 404 && mwErr.cause.error_code === '40401') {
                                                        fileStampStore.removeStampByRemote(syncId, remotePath, function (error, stamp) {
                                                            if (error) {
                                                                callback(error);
                                                                return;
                                                            }
                                                            callback(null);
                                                        });
                                                    }
                                                    else {
                                                        _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                        callback(mwErr);
                                                    }
                                                }
                                                else {
                                                    var mwError = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'remote docment fetch error.');
                                                    _this.trigger('fileSyncFailed', mwError, failedSyncInfo);
                                                    callback(mwError);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        var transferInfo_2 = {
                                            transferType: TransferType.DownloadNewFile,
                                            localFilePath: localPath,
                                            remoteFilePath: remotePath,
                                        };
                                        failedSyncInfo = {
                                            localFilePath: localPath,
                                            localDiffType: DiffType.Removed,
                                            remoteFilePath: remotePath,
                                            remoteDiffType: DiffType.Modified,
                                        };
                                        _this.trigger('transferStart', transferInfo_2);
                                        var tempFilePath_1 = _this.getTempFilePath(localPath);
                                        fileTransfer.downloadDocument(doc.getId(), tempFilePath_1, { rename: false }, function (err, res) {
                                            if (err) {
                                                doc.release();
                                                _this.trigger('transferFailed', err, transferInfo_2);
                                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                                callback(err);
                                                return;
                                            }
                                            localFileStampHandler.calculateFileStamp(tempFilePath_1, function (error, localStamp) {
                                                if (error) {
                                                    _this.fs.unlink(tempFilePath_1, function () {
                                                        doc.release();
                                                        _this.trigger('transferFailed', error, transferInfo_2);
                                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                                        callback(error);
                                                    });
                                                    return;
                                                }
                                                _this.fs.stat(localPath, function (err, stats) {
                                                    if (err) {
                                                        if (err.code === 'ENOENT') {
                                                            _this.fs.rename(tempFilePath_1, localPath, function (err) {
                                                                if (err) {
                                                                    _this.fs.unlink(tempFilePath_1, function () {
                                                                        doc.release();
                                                                        var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED, 'failed to rename local file.', err);
                                                                        _this.trigger('transferFailed', mwErr, transferInfo_2);
                                                                        _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                                        callback(mwErr);
                                                                    });
                                                                    return;
                                                                }
                                                                fileStampStore.setStamp(syncId, localPath, localStamp, remotePath, res.stamp, function (error, lStamp, rStamp) {
                                                                    if (error) {
                                                                        doc.release();
                                                                        _this.trigger('transferFailed', error, transferInfo_2);
                                                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                                                        callback(error);
                                                                        return;
                                                                    }
                                                                    doc.release();
                                                                    _this.trigger('transferSucceed', transferInfo_2);
                                                                    callback(null);
                                                                });
                                                            });
                                                        }
                                                        else {
                                                            _this.fs.unlink(tempFilePath_1, function () {
                                                                doc.release();
                                                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to rename local file.', err);
                                                                _this.trigger('transferFailed', mwErr, transferInfo_2);
                                                                _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                                callback(mwErr);
                                                            });
                                                        }
                                                    }
                                                    else {
                                                        failedSyncInfo.localFilePath = localPath;
                                                        failedSyncInfo.localDiffType = DiffType.Modified;
                                                        _this.fs.unlink(tempFilePath_1, function () {
                                                            doc.release();
                                                            var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to rename local file.');
                                                            _this.trigger('transferFailed', mwErr, transferInfo_2);
                                                            _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                                            callback(mwErr);
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalModifiedRemoteRemoved = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                        var transferInfo = {
                            transferType: TransferType.UploadToOverwrite,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Modified,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Removed,
                        };
                        this.trigger('transferStart', transferInfo);
                        localFileStampHandler.calculateFileStamp(localPath, function (error, localStamp) {
                            if (error) {
                                _this.trigger('transferFailed', error, transferInfo);
                                _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                callback(error);
                                return;
                            }
                            var parentFolderPath = _this.path.dirname(remotePath);
                            var filename = _this.path.basename(remotePath);
                            fileTransfer.uploadDocumentByPath(parentFolderPath, localPath, filename, { rename: false }, function (error, res) {
                                if (error) {
                                    _this.trigger('transferFailed', error, transferInfo);
                                    if (error &&
                                        error.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                        error.mwWebApiResCode === 400 &&
                                        error.cause.error_code === '40007') {
                                        _this.syncLocalModifiedRemoteModified(syncId, localPath, remotePath, fileList, true, callback);
                                        return;
                                    }
                                    _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                    callback(error);
                                    return;
                                }
                                var actRemotePath = res.parentFolderPath + '/' + res.filename;
                                if (actRemotePath !== remotePath) {
                                    console.warn('file name is changed when uploading.');
                                }
                                fileStampStore.setStamp(syncId, localPath, localStamp, actRemotePath, res.stamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    callback(null);
                                });
                                Handler.fetchHandler.performFetchForUpdate(res.folderId, {
                                    error: function (modelOrCollection, jqxhr, opt) {
                                    }
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalRemovedRemoteModified = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var transferInfo = {
                            transferType: TransferType.DownloadNewFile,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Removed,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Modified
                        };
                        var tempFilePath = this.getTempFilePath(localPath);
                        this.trigger('transferStart', transferInfo);
                        this.downloadFileForSync(remotePath, tempFilePath, function (err, downloadStamp, remoteStamp) {
                            if (err) {
                                _this.trigger('transferFailed', err, transferInfo);
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            _this.resolveDownloadedTempFile(syncId, localPath, tempFilePath, fileList, function (err, localFileExist, newFilePath) {
                                if (localFileExist === true) {
                                    failedSyncInfo.localDiffType = DiffType.Modified;
                                }
                                if (err) {
                                    _this.trigger('transferFailed', err, transferInfo);
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                fileStampStore.setStamp(syncId, localPath, downloadStamp, remotePath, remoteStamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    if (!newFilePath) {
                                        callback(null);
                                        return;
                                    }
                                    localFileStampHandler.calculateFileStamp(newFilePath, function (error, newLocalStamp) {
                                        if (error) {
                                            callback(error);
                                            return;
                                        }
                                        if (lStamp === newLocalStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                callback(null);
                                                return;
                                            });
                                        }
                                        else if (newLocalStamp === downloadStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                callback(null);
                                                return;
                                            });
                                        }
                                        else {
                                            var fileName = _this.path.basename(newFilePath);
                                            var folder = _this.path.dirname(remotePath);
                                            var remoteFilePath = folder + "/" + fileName;
                                            transferInfo = {
                                                transferType: TransferType.UploadNewFile,
                                                localFilePath: newFilePath,
                                                remoteFilePath: remoteFilePath,
                                            };
                                            failedSyncInfo = {
                                                localFilePath: newFilePath,
                                                localDiffType: DiffType.Added,
                                                remoteFilePath: remoteFilePath,
                                                remoteDiffType: DiffType.Stay,
                                            };
                                            _this.trigger('transferStart', transferInfo);
                                            _this.uploadNewFileForConflict(syncId, newFilePath, newLocalStamp, folder, fileName, function (err) {
                                                if (err) {
                                                    _this.trigger('transferFailed', err, transferInfo);
                                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                                    callback(err);
                                                    return;
                                                }
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalRemovedRemoteRemoved = function (syncId, localPath, remotePath, fileList, callback) {
                        var _this = this;
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Removed,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Removed,
                        };
                        fileStampStore.removeStampByLocal(syncId, localPath, function (err, stamp) {
                            if (err) {
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            callback(null);
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalModifiedRemoteModified = function (syncId, localPath, remotePath, fileList, uploadConflicted, callback) {
                        var _this = this;
                        var transferInfo = {
                            transferType: TransferType.DownloadToOverwrite,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Modified,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Modified,
                        };
                        var tempFilePath = this.getTempFilePath(localPath);
                        this.trigger('transferStart', transferInfo);
                        this.downloadFileForSync(remotePath, tempFilePath, function (err, downloadStamp, remoteStamp) {
                            if (err) {
                                _this.trigger('transferFailed', err, transferInfo);
                                if (uploadConflicted &&
                                    err.mwCode === DPMW.mwe.E_MW_SYNC_REMOTE_PATH_CONFLICT) {
                                    failedSyncInfo.remoteDiffType = DiffType.Removed;
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                if (uploadConflicted &&
                                    err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                    err.mwWebApiResCode === 404 &&
                                    err.cause.error_code === '40401') {
                                    fileStampStore.removeStampByRemote(syncId, remotePath, function (err, stamp) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        callback(null);
                                    });
                                    return;
                                }
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            _this.resolveDownloadedTempFile(syncId, localPath, tempFilePath, fileList, function (err, localFileExist, newFilePath) {
                                if (localFileExist === false) {
                                    failedSyncInfo.localDiffType = DiffType.Removed;
                                }
                                if (err) {
                                    _this.trigger('transferFailed', err, transferInfo);
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                fileStampStore.setStamp(syncId, localPath, downloadStamp, remotePath, remoteStamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    if (!newFilePath) {
                                        callback(null);
                                        return;
                                    }
                                    localFileStampHandler.calculateFileStamp(newFilePath, function (error, newLocalStamp) {
                                        if (error) {
                                            callback(error);
                                            return;
                                        }
                                        if (lStamp === newLocalStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                callback(null);
                                                return;
                                            });
                                        }
                                        else if (newLocalStamp === downloadStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                callback(null);
                                                return;
                                            });
                                        }
                                        else {
                                            var fileName = _this.path.basename(newFilePath);
                                            var folder = _this.path.dirname(remotePath);
                                            var remoteFilePath = folder + "/" + fileName;
                                            transferInfo = {
                                                transferType: TransferType.UploadNewFile,
                                                localFilePath: newFilePath,
                                                remoteFilePath: remoteFilePath,
                                            };
                                            failedSyncInfo = {
                                                localFilePath: newFilePath,
                                                localDiffType: DiffType.Modified,
                                                remoteFilePath: remoteFilePath,
                                                remoteDiffType: DiffType.Stay,
                                            };
                                            _this.trigger('transferStart', transferInfo);
                                            _this.uploadNewFileForConflict(syncId, newFilePath, newLocalStamp, folder, fileName, function (err) {
                                                if (err) {
                                                    _this.trigger('transferFailed', err, transferInfo);
                                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                                    callback(err);
                                                    return;
                                                }
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.syncLocalAddedRemoteAdded = function (syncId, localPath, remotePath, fileList, uploadConflicted, callback) {
                        var _this = this;
                        var transferInfo = {
                            transferType: TransferType.DownloadToOverwrite,
                            localFilePath: localPath,
                            remoteFilePath: remotePath,
                        };
                        var failedSyncInfo = {
                            localFilePath: localPath,
                            localDiffType: DiffType.Added,
                            remoteFilePath: remotePath,
                            remoteDiffType: DiffType.Added,
                        };
                        var tempFilePath = this.getTempFilePath(localPath);
                        this.trigger('transferStart', transferInfo);
                        this.downloadFileForSync(remotePath, tempFilePath, function (err, downloadStamp, remoteStamp) {
                            if (err) {
                                _this.trigger('transferFailed', err, transferInfo);
                                if (uploadConflicted &&
                                    err.mwCode === DPMW.mwe.E_MW_SYNC_REMOTE_PATH_CONFLICT) {
                                    failedSyncInfo.remoteDiffType = DiffType.Stay;
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                if (uploadConflicted &&
                                    err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS &&
                                    err.mwWebApiResCode === 404 &&
                                    err.cause.error_code === '40401') {
                                    failedSyncInfo.remoteDiffType = DiffType.Stay;
                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_REMOTE_PATH_CONFLICT, 'remote path conflict on remote.');
                                    _this.trigger('fileSyncFailed', mwErr, failedSyncInfo);
                                    callback(mwErr);
                                    return;
                                }
                                _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                callback(err);
                                return;
                            }
                            _this.resolveDownloadedTempFile(syncId, localPath, tempFilePath, fileList, function (err, localFileExist, newFilePath) {
                                if (localFileExist === false) {
                                    failedSyncInfo.localDiffType = DiffType.Stay;
                                }
                                if (err) {
                                    _this.trigger('transferFailed', err, transferInfo);
                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                    callback(err);
                                    return;
                                }
                                fileStampStore.setStamp(syncId, localPath, downloadStamp, remotePath, remoteStamp, function (error, lStamp, rStamp) {
                                    if (error) {
                                        _this.trigger('transferFailed', error, transferInfo);
                                        _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                        callback(error);
                                        return;
                                    }
                                    _this.trigger('transferSucceed', transferInfo);
                                    if (!newFilePath) {
                                        callback(null);
                                        return;
                                    }
                                    var fileName = _this.path.basename(newFilePath);
                                    var folder = _this.path.dirname(remotePath);
                                    var remoteFilePath = folder + "/" + fileName;
                                    transferInfo = {
                                        transferType: TransferType.UploadNewFile,
                                        localFilePath: newFilePath,
                                        remoteFilePath: remoteFilePath,
                                    };
                                    failedSyncInfo = {
                                        localFilePath: newFilePath,
                                        localDiffType: DiffType.Added,
                                        remoteFilePath: remoteFilePath,
                                        remoteDiffType: DiffType.Stay,
                                    };
                                    _this.trigger('transferStart', transferInfo);
                                    localFileStampHandler.calculateFileStamp(newFilePath, function (error, newLocalStamp) {
                                        if (error) {
                                            _this.trigger('transferFailed', error, transferInfo);
                                            _this.trigger('fileSyncFailed', error, failedSyncInfo);
                                            callback(error);
                                            return;
                                        }
                                        if (newLocalStamp === downloadStamp) {
                                            _this.fs.unlink(newFilePath, function (err) {
                                                if (err) {
                                                }
                                                fileList.pop();
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                        else {
                                            _this.uploadNewFileForConflict(syncId, newFilePath, newLocalStamp, folder, fileName, function (err) {
                                                if (err) {
                                                    _this.trigger('transferFailed', err, transferInfo);
                                                    _this.trigger('fileSyncFailed', err, failedSyncInfo);
                                                    callback(err);
                                                    return;
                                                }
                                                _this.trigger('transferSucceed', transferInfo);
                                                callback(null);
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.getTempFilePath = function (localPath) {
                        var tempFileName = '$ync' + Date.now().toString();
                        var folder = this.path.dirname(localPath);
                        return folder + "/" + tempFileName;
                    };
                    SyncTransferHandler.prototype.downloadFileForSync = function (remotePath, tempFilePath, callback) {
                        var _this = this;
                        var doc;
                        doc = DPMW.appCtrl.currentDevice.getEntityModelByPath(remotePath);
                        doc.fetch({
                            error: function (modelOrCollection, response, options) {
                                doc.release();
                                if (options && options.mwError) {
                                    callback(options.mwError);
                                }
                                else {
                                    var mwError = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'remote docment fetch error.');
                                    callback(mwError);
                                }
                            },
                            success: function (model, response, options) {
                                var remoteFileId = doc.getId();
                                var actRemotePath = doc.getPath();
                                doc.release();
                                if (actRemotePath !== remotePath) {
                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_REMOTE_PATH_CONFLICT, 'remote path conflict on remote.');
                                    callback(mwErr);
                                    return;
                                }
                                var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                                fileTransfer.downloadDocument(remoteFileId, tempFilePath, { rename: false }, function (err, res) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    localFileStampHandler.calculateFileStamp(tempFilePath, function (error, localStamp) {
                                        if (error) {
                                            _this.fs.unlink(tempFilePath, function () {
                                                callback(error);
                                            });
                                            return;
                                        }
                                        callback(null, localStamp, res.stamp);
                                    });
                                });
                            }
                        });
                    };
                    SyncTransferHandler.prototype.resolveDownloadedTempFile = function (syncId, localPath, tempFilePath, fileList, callback) {
                        var _this = this;
                        this.fs.stat(localPath, function (err, stat) {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    _this.fs.rename(tempFilePath, localPath, function (err) {
                                        if (err) {
                                            _this.fs.unlink(tempFilePath, function () {
                                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED, 'failed to check local file existence.', err);
                                                callback(mwErr, false, null);
                                            });
                                            return;
                                        }
                                        callback(null, false, null);
                                    });
                                }
                                else {
                                    _this.fs.unlink(tempFilePath, function () {
                                        var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'failed to check local file existence.', err);
                                        callback(mwErr, null, null);
                                    });
                                }
                                return;
                            }
                            if (stat.isDirectory()) {
                                _this.fs.unlink(tempFilePath, function () {
                                    var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_CONFLICT_WZ_DIR, 'exist same name folder.');
                                    callback(mwErr, false, null);
                                });
                                return;
                            }
                            _this.getFilePathForConflict(localPath, fileList, function (err, newFilePath) {
                                if (err) {
                                    _this.fs.unlink(tempFilePath, function () {
                                        callback(err, true, null);
                                    });
                                    return;
                                }
                                _this.fs.rename(localPath, newFilePath, function (err) {
                                    if (err) {
                                        _this.fs.unlink(tempFilePath, function () {
                                            var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED, 'failed to rename local file.', err);
                                            callback(mwErr, true, null);
                                        });
                                        return;
                                    }
                                    var newfileName = _this.path.basename(newFilePath);
                                    fileList.push(newfileName);
                                    _this.fs.rename(tempFilePath, localPath, function (err) {
                                        if (err) {
                                            _this.fs.unlink(tempFilePath, function () {
                                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED, 'failed to rename temp file.', err);
                                                callback(mwErr, true, newFilePath);
                                            });
                                            return;
                                        }
                                        callback(null, true, newFilePath);
                                    });
                                });
                            });
                        });
                    };
                    SyncTransferHandler.prototype.uploadNewFileForConflict = function (syncId, newFilePath, newLocalStamp, parentFolderPath, filename, callback) {
                        var fileTransfer = DPMW.appCtrl.currentDevice.getSyncTransfer();
                        fileTransfer.uploadDocumentByPath(parentFolderPath, newFilePath, filename, { rename: false }, function (error, res) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            var remoteFilePath = parentFolderPath + "/" + filename;
                            var actRemotePath = res.parentFolderPath + '/' + res.filename;
                            if (actRemotePath !== remoteFilePath) {
                                console.warn('file name is changed when uploading.');
                            }
                            fileStampStore.setStamp(syncId, newFilePath, newLocalStamp, actRemotePath, res.stamp, function (error, lStamp, rStamp) {
                                if (error) {
                                    callback(error);
                                    return;
                                }
                                callback(null);
                            });
                            Handler.fetchHandler.performFetchForUpdate(res.folderId, {
                                error: function () {
                                }
                            });
                        });
                    };
                    SyncTransferHandler.prototype.getFilePathForConflict = function (filePath, fileList, callback) {
                        var _this = this;
                        var extnamePDF = this.path.extname(filePath);
                        if (extnamePDF.toLowerCase() !== '.pdf') {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'must be .pdf file.'), null);
                            return;
                        }
                        var now = new Date();
                        var suffix = CONFLICT_SUFFIX +
                            now.getFullYear() +
                            ('0' + (now.getMonth() + 1)).slice(-2) +
                            ('0' + now.getDate()).slice(-2) +
                            '-' +
                            ('0' + now.getHours()).slice(-2) +
                            ('0' + now.getMinutes()).slice(-2);
                        var basename = this.path.basename(filePath, extnamePDF);
                        var fileName = basename + suffix + extnamePDF;
                        var folder = this.path.dirname(filePath);
                        this.fs.readdir(folder, function (err, files) {
                            if (err) {
                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'could not read local file', err);
                                callback(mwErr, null);
                                return;
                            }
                            var newFileList = fileList.concat(files);
                            fileName = _this.getAvailableFileName(fileName, 1, newFileList);
                            callback(null, folder + "/" + fileName);
                        });
                    };
                    SyncTransferHandler.prototype.getAvailableFileName = function (fileName, index, fileList) {
                        if (fileList.indexOf(fileName) < 0) {
                            return fileName;
                        }
                        else {
                            var newName = fileName.slice(0, -4) + " (" + index + ")" + fileName.slice(-4);
                            return this.getAvailableFileName(newName, ++index, fileList);
                        }
                    };
                    return SyncTransferHandler;
                }(Backbone.EventsAdopter));
                Handler.SyncTransferHandler = SyncTransferHandler;
                (function (DiffType) {
                    DiffType[DiffType["Stay"] = 0] = "Stay";
                    DiffType[DiffType["Modified"] = 1] = "Modified";
                    DiffType[DiffType["Added"] = 2] = "Added";
                    DiffType[DiffType["Removed"] = 3] = "Removed";
                })(Handler.DiffType || (Handler.DiffType = {}));
                var DiffType = Handler.DiffType;
                (function (TransferType) {
                    TransferType[TransferType["UploadNewFile"] = 0] = "UploadNewFile";
                    TransferType[TransferType["UploadToOverwrite"] = 1] = "UploadToOverwrite";
                    TransferType[TransferType["DownloadNewFile"] = 2] = "DownloadNewFile";
                    TransferType[TransferType["DownloadToOverwrite"] = 3] = "DownloadToOverwrite";
                })(Handler.TransferType || (Handler.TransferType = {}));
                var TransferType = Handler.TransferType;
                Handler.syncTransferHandler = new SyncTransferHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SyncTransferHandler.js.map