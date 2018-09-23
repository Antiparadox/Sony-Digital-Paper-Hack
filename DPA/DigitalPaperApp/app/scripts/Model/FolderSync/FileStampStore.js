var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var FolderSync;
        (function (FolderSync) {
            var Path = require('path');
            var _SQ = DPMW.Utils.DatabaseUtils.singleQuotes;
            var _ESC = DPMW.Utils.DatabaseUtils.escape;
            var FileStampStore = (function () {
                function FileStampStore() {
                }
                FileStampStore.prototype.setStamp = function (syncId, localFilePath, localStamp, remoteFilePath, remoteStamp, callback) {
                    if (!syncId || !localFilePath || !localStamp || !remoteFilePath || !remoteStamp || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_1 = _ESC(syncId);
                        var localFilePathParts = this.parseLocalFilePath(localFilePath);
                        var escapedLocalFolderPath_1 = _ESC(localFilePathParts.dir);
                        var escapedLocalFileName_1 = _ESC(localFilePathParts.base);
                        var escapedLocalStamp_1 = _ESC(localStamp);
                        var remoteFilePathParts = this.parseRemoteFilePath(remoteFilePath);
                        var escapedRemoteFolderPath_1 = _ESC(remoteFilePathParts.dir);
                        var escapedRemoteFileName_1 = _ESC(remoteFilePathParts.base);
                        var escapedRemoteStamp_1 = _ESC(remoteStamp);
                        var oldRow_1 = undefined;
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_1)
                                + " AND remoteFileName=" + _SQ(escapedRemoteFileName_1)
                                + " AND syncId=" + _SQ(escapedSyncId_1) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            oldRow_1 = row;
                            if (!oldRow_1) {
                                var sql = "INSERT INTO file_stamp"
                                    + " VALUES( " + _SQ(escapedSyncId_1)
                                    + ", " + _SQ(escapedLocalFolderPath_1) + ", " + _SQ(escapedLocalFileName_1) + ", " + _SQ(escapedLocalStamp_1)
                                    + ", " + _SQ(escapedRemoteFolderPath_1) + ", " + _SQ(escapedRemoteFileName_1) + ", " + _SQ(escapedRemoteStamp_1) + " );";
                                return databaseWrapper.sqlRun(sql);
                            }
                            else {
                                var sql = "UPDATE file_stamp"
                                    + " SET syncId=" + _SQ(escapedSyncId_1)
                                    + ", localFolderPath=" + _SQ(escapedLocalFolderPath_1)
                                    + ", localFileName=" + _SQ(escapedLocalFileName_1)
                                    + ", localStamp=" + _SQ(escapedLocalStamp_1)
                                    + ", remoteStamp=" + _SQ(escapedRemoteStamp_1)
                                    + " WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_1)
                                    + " AND remoteFileName=" + _SQ(escapedRemoteFileName_1)
                                    + " AND syncId=" + _SQ(escapedSyncId_1) + ";";
                                return databaseWrapper.sqlRun(sql);
                            }
                        }).then(function () {
                            var oldLocalStamp = oldRow_1 ? oldRow_1.localStamp : undefined;
                            var oldRemoteStamp = oldRow_1 ? oldRow_1.remoteStamp : undefined;
                            callback(undefined, oldLocalStamp, oldRemoteStamp);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[FileStampStore.setStamp()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.setStamp()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.getLocalStamp = function (syncId, localFilePath, callback) {
                    if (!syncId || !localFilePath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_2 = _ESC(syncId);
                        var localFilePathParts = this.parseLocalFilePath(localFilePath);
                        var escapedLocalFolderPath_2 = _ESC(localFilePathParts.dir);
                        var escapedLocalFileName_2 = _ESC(localFilePathParts.base);
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE localFolderPath=" + _SQ(escapedLocalFolderPath_2)
                                + " AND localFileName=" + _SQ(escapedLocalFileName_2)
                                + " AND syncId=" + _SQ(escapedSyncId_2) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            var safeLocalStamp = row ? row.localStamp : undefined;
                            callback(undefined, safeLocalStamp, row);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, '[FileStampStore.getLocalStamp()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.getLocalStamp()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.getRemoteStamp = function (syncId, remoteFilePath, callback) {
                    if (!syncId || !remoteFilePath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_3 = _ESC(syncId);
                        var remoteFilePathParts = this.parseRemoteFilePath(remoteFilePath);
                        var escapedRemoteFolderPath_2 = _ESC(remoteFilePathParts.dir);
                        var escapedRemoteFileName_2 = _ESC(remoteFilePathParts.base);
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_2)
                                + " AND remoteFileName=" + _SQ(escapedRemoteFileName_2)
                                + " AND syncId=" + _SQ(escapedSyncId_3) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            var safeRemoteStamp = row ? row.remoteStamp : undefined;
                            callback(undefined, safeRemoteStamp, row);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, '[FileStampStore.getRemoteStamp()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.getRemoteStamp()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.removeStampByLocal = function (syncId, localFilePath, callback) {
                    if (!syncId || !localFilePath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_4 = _ESC(syncId);
                        var localFilePathParts = this.parseLocalFilePath(localFilePath);
                        var escapedLocalFolderPath_3 = _ESC(localFilePathParts.dir);
                        var escapedLocalFileName_3 = _ESC(localFilePathParts.base);
                        var oldRow_2 = undefined;
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE localFolderPath=" + _SQ(escapedLocalFolderPath_3)
                                + " AND localFileName=" + _SQ(escapedLocalFileName_3)
                                + " AND syncId=" + _SQ(escapedSyncId_4) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            oldRow_2 = row;
                            var sql = "DELETE FROM file_stamp"
                                + " WHERE localFolderPath=" + _SQ(escapedLocalFolderPath_3)
                                + " AND localFileName=" + _SQ(escapedLocalFileName_3)
                                + " AND syncId=" + _SQ(escapedSyncId_4) + ";";
                            return databaseWrapper.sqlRun(sql);
                        }).then(function () {
                            var safeOldLocalStamp = oldRow_2 ? oldRow_2.localStamp : undefined;
                            callback(undefined, safeOldLocalStamp);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[FileStampStore.removeStampByLocal()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.removeStampByLocal()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.removeStampByRemote = function (syncId, remoteFilePath, callback) {
                    if (!syncId || !remoteFilePath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_5 = _ESC(syncId);
                        var remoteFilePathParts = this.parseRemoteFilePath(remoteFilePath);
                        var escapedRemoteFolderPath_3 = _ESC(remoteFilePathParts.dir);
                        var escapedRemoteFileName_3 = _ESC(remoteFilePathParts.base);
                        var oldRow_3 = undefined;
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_3)
                                + " AND remoteFileName=" + _SQ(escapedRemoteFileName_3)
                                + " AND syncId=" + _SQ(escapedSyncId_5) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            oldRow_3 = row;
                            var sql = "DELETE FROM file_stamp"
                                + " WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_3)
                                + " AND remoteFileName=" + _SQ(escapedRemoteFileName_3)
                                + " AND syncId=" + _SQ(escapedSyncId_5) + ";";
                            return databaseWrapper.sqlRun(sql);
                        }).then(function () {
                            var safeOldRemoteStamp = oldRow_3 ? oldRow_3.remoteStamp : undefined;
                            callback(undefined, safeOldRemoteStamp);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[FileStampStore.removeStampByRemote()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.removeStampByRemote()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.removeStampBySyncId = function (syncId, callback) {
                    if (!syncId || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_6 = _ESC(syncId);
                        Promise.resolve().then(function () {
                            var sql = "DELETE FROM file_stamp WHERE syncId=" + _SQ(escapedSyncId_6) + ";";
                            return databaseWrapper.sqlRun(sql);
                        }).then(function () {
                            callback();
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[FileStampStore.removeStampBySyncId()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.removeStampBySyncId()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.getStampList = function (syncId, callback) {
                    if (!syncId || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_7 = _ESC(syncId);
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp WHERE syncId=" + _SQ(escapedSyncId_7) + ";";
                            return databaseWrapper.sqlGetAll(sql);
                        }).then(function (rows) {
                            callback(undefined, rows);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, '[FileStampStore.getStampList()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.getStampList()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.getStampListByLocalFolder = function (syncId, localFolderPath, callback) {
                    if (!syncId || !localFolderPath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_8 = _ESC(syncId);
                        var canonicalizedLocalFolderPath = DPMW.Utils.PathUtils.canonicalize(localFolderPath);
                        var escapedLocalFolderPath_4 = _ESC(canonicalizedLocalFolderPath);
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE localFolderPath=" + _SQ(escapedLocalFolderPath_4)
                                + " AND syncId=" + _SQ(escapedSyncId_8) + ";";
                            return databaseWrapper.sqlGetAll(sql);
                        }).then(function (rows) {
                            callback(undefined, rows);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, '[FileStampStore.getStampListByLocalFolder()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.getStampListByLocalFolder()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.getStampListByRemoteFolder = function (syncId, remoteFolderPath, callback) {
                    if (!syncId || !remoteFolderPath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_9 = _ESC(syncId);
                        var canonicalizedRemoteFolderPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(remoteFolderPath);
                        var escapedRemoteFolderPath_4 = _ESC(canonicalizedRemoteFolderPath);
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM file_stamp"
                                + " WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_4)
                                + " AND syncId=" + _SQ(escapedSyncId_9) + ";";
                            return databaseWrapper.sqlGetAll(sql);
                        }).then(function (rows) {
                            callback(undefined, rows);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, '[FileStampStore.getStampListByRemoteFolder()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.getStampListByRemoteFolder()] databaseWrapper is null.'));
                        });
                    }
                };
                FileStampStore.prototype.getFolderListByRemoteFolder = function (syncId, remoteFolderPath, callback) {
                    if (!syncId || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_10 = _ESC(syncId);
                        var canonicalizedRemoteFolderPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(remoteFolderPath);
                        canonicalizedRemoteFolderPath += DPMW.Utils.PathUtils.SEPARATOR;
                        var escapedRemoteFolderPath_5 = _ESC(canonicalizedRemoteFolderPath);
                        var delimIndex_1 = canonicalizedRemoteFolderPath.length + 1;
                        Promise.resolve().then(function () {
                            var sql = "SELECT substr(remoteFolderPath, " + delimIndex_1.toString() + ") as folder"
                                + " FROM file_stamp"
                                + " WHERE syncId=" + _SQ(escapedSyncId_10)
                                + " AND substr(remoteFolderPath, 0, " + delimIndex_1.toString() + ")"
                                + "=" + _SQ(escapedRemoteFolderPath_5) + ";";
                            return databaseWrapper.sqlGetAll(sql);
                        }).then(function (rows) {
                            var folders = [];
                            for (var i = 0; i < rows.length; i++) {
                                var folder = rows[i].folder;
                                var postDelimIndex = folder.indexOf('/');
                                if (postDelimIndex >= 0) {
                                    folder = folder.slice(0, postDelimIndex);
                                }
                                if (folders.indexOf(folder) < 0) {
                                    folders.push(folder);
                                }
                            }
                            callback(undefined, folders);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, '[FileStampStore.getFolderListByRemoteFolder()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[FileStampStore.getStampList()] getFolderListByRemoteFolder is null.'));
                        });
                    }
                };
                FileStampStore.prototype.parseLocalFilePath = function (filePath) {
                    return Path.parse(DPMW.Utils.PathUtils.canonicalize(filePath));
                };
                FileStampStore.prototype.parseRemoteFilePath = function (filePath) {
                    var canonicalizedFilePath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(filePath);
                    var delimindex = canonicalizedFilePath.lastIndexOf('/');
                    if (delimindex < 0) {
                        throw new Error('wrong value');
                    }
                    var resObj = {
                        dir: canonicalizedFilePath.slice(0, delimindex),
                        base: canonicalizedFilePath.slice(delimindex + 1)
                    };
                    return resObj;
                };
                return FileStampStore;
            }());
            FolderSync.FileStampStore = FileStampStore;
            FolderSync.fileStampStore = new FileStampStore();
        })(FolderSync = Model.FolderSync || (Model.FolderSync = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FileStampStore.js.map