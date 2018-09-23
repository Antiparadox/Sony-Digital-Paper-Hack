var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var FolderSync;
        (function (FolderSync) {
            var _SQ = DPMW.Utils.DatabaseUtils.singleQuotes;
            var _ESC = DPMW.Utils.DatabaseUtils.escape;
            var SyncFolderPairStore = (function (_super) {
                __extends(SyncFolderPairStore, _super);
                function SyncFolderPairStore() {
                    _super.call(this);
                }
                SyncFolderPairStore.prototype.addFolderPair = function (localFolderPath, remoteFolderPath, callback) {
                    if (!localFolderPath || !remoteFolderPath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var thiz = this;
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var canonicalizedLocalFolderPath = DPMW.Utils.PathUtils.canonicalize(localFolderPath);
                        var escapedLocalFolderPath_1 = _ESC(canonicalizedLocalFolderPath);
                        var canonicalizedRemoteFolderPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(remoteFolderPath);
                        var escapedRemoteFolderPath_1 = _ESC(canonicalizedRemoteFolderPath);
                        Promise.resolve().then(function () {
                            var sql = "INSERT INTO sync_folder_pair ( localFolderPath, remoteFolderPath ) "
                                + "VALUES ( " + _SQ(escapedLocalFolderPath_1) + ", " + _SQ(escapedRemoteFolderPath_1) + " );";
                            return databaseWrapper.sqlRun(sql);
                        }).then(function () {
                            var sql = "SELECT * FROM sync_folder_pair"
                                + " WHERE localFolderPath=" + _SQ(escapedLocalFolderPath_1)
                                + " AND remoteFolderPath=" + _SQ(escapedRemoteFolderPath_1) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            thiz.stringifySyncId(row);
                            var stillLeft = true;
                            callback(undefined, row);
                            thiz.trigger('syncFolderPairChanged', 'add', row, stillLeft);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[SyncFolderPairStore.addFolderPair()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[SyncFolderPairStore.addFolderPair()] databaseWrapper is null.'));
                        });
                    }
                };
                SyncFolderPairStore.prototype.removeMultiFolderPair = function (syncIds, callback) {
                    var _this = this;
                    if (!_.isArray(syncIds) || !_.isFunction(callback)) {
                        throw new Error('Invalid argument.');
                    }
                    if (syncIds.length === 0) {
                        callback(undefined, undefined);
                        return;
                    }
                    var syncId = syncIds.pop();
                    this.removeFolderPair(syncId, function (errorRemove, removedPair) {
                        if (_.isUndefined(errorRemove)) {
                            _this.removeMultiFolderPair(syncIds, callback);
                        }
                        else {
                            callback(errorRemove, removedPair);
                        }
                    });
                };
                SyncFolderPairStore.prototype.removeFolderPair = function (syncId, callback) {
                    if (!syncId || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var thiz = this;
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var escapedSyncId_1 = _ESC(syncId);
                        var rowToDelete_1 = undefined;
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM sync_folder_pair WHERE syncId=" + _SQ(escapedSyncId_1) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            rowToDelete_1 = row;
                            if (rowToDelete_1) {
                                var sql = "DELETE FROM sync_folder_pair WHERE syncId=" + _SQ(escapedSyncId_1) + ";";
                                return databaseWrapper.sqlRun(sql);
                            }
                        }).then(function () {
                            var sql = 'SELECT COUNT(*) AS cnt FROM sync_folder_pair;';
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            thiz.stringifySyncId(rowToDelete_1);
                            var stillLeft = (row) && (row.cnt > 0);
                            callback(undefined, rowToDelete_1);
                            if (rowToDelete_1) {
                                thiz.trigger('syncFolderPairChanged', 'remove', rowToDelete_1, stillLeft);
                            }
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[SyncFolderPairStore.removeFolderPair()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[SyncFolderPairStore.removeFolderPair()] databaseWrapper is null.'));
                        });
                    }
                };
                SyncFolderPairStore.prototype.removeFolderPairByRemoteFolderPath = function (remoteFolderPath, callback) {
                    if (!remoteFolderPath || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    var thiz = this;
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        var canonicalizedRemoteFolderPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(remoteFolderPath);
                        var escapedRemoteFolderPath_2 = _ESC(canonicalizedRemoteFolderPath);
                        var rowToDelete_2 = undefined;
                        Promise.resolve().then(function () {
                            var sql = "SELECT * FROM sync_folder_pair WHERE remoteFolderPath=" + _SQ(escapedRemoteFolderPath_2) + ";";
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            rowToDelete_2 = row;
                            if (rowToDelete_2) {
                                var sql = "DELETE FROM sync_folder_pair WHERE syncId=" + _SQ(rowToDelete_2.syncId) + ";";
                                return databaseWrapper.sqlRun(sql);
                            }
                        }).then(function () {
                            var sql = 'SELECT COUNT(*) AS cnt FROM sync_folder_pair;';
                            return databaseWrapper.sqlGetOne(sql);
                        }).then(function (row) {
                            thiz.stringifySyncId(rowToDelete_2);
                            var stillLeft = (row) && (row.cnt > 0);
                            callback(undefined, rowToDelete_2);
                            if (rowToDelete_2) {
                                thiz.trigger('syncFolderPairChanged', 'remove', rowToDelete_2, stillLeft);
                            }
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[SyncFolderPairStore.removeFolderPairByRemoteFolderPath()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[SyncFolderPairStore.removeFolderPair()] removeFolderPairByRemoteFolderPath is null.'));
                        });
                    }
                };
                SyncFolderPairStore.prototype.getFolderPairs = function (callback) {
                    if (!callback) {
                        throw new Error('Invalid argument.');
                    }
                    var thiz = this;
                    var databaseWrapper = Model.appDataStore.getDatabaseWrapper();
                    if (databaseWrapper) {
                        Promise.resolve().then(function () {
                            var sql = 'SELECT * FROM sync_folder_pair;';
                            return databaseWrapper.sqlGetAll(sql);
                        }).then(function (rows) {
                            thiz.stringifySyncId(rows);
                            callback(undefined, rows);
                        }).catch(function (error) {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, '[SyncFolderPairStore.getFolderPairs()]', error));
                        });
                    }
                    else {
                        Promise.resolve().then(function () {
                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, '[SyncFolderPairStore.getFolderPairs()] databaseWrapper is null.'));
                        });
                    }
                };
                SyncFolderPairStore.prototype.filterSpecifiedPathIsRemoteFolderPath = function (pathsToFilter, callback) {
                    if (!pathsToFilter || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    this.filterRemoteFolderPath(pathsToFilter, callback, function (pathsToFilter, registeredPaths) {
                        var filteredPaths = [];
                        pathsToFilter.forEach(function (path, index) {
                            var canonicalizedPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(path);
                            if (registeredPaths.indexOf(canonicalizedPath) >= 0) {
                                filteredPaths.push(path);
                            }
                        });
                        return filteredPaths;
                    });
                };
                SyncFolderPairStore.prototype.filterRemoteFolderContaninsPath = function (pathsToFilter, callback) {
                    var _this = this;
                    if (!_.isArray(pathsToFilter) || pathsToFilter.length === 0 || !_.isFunction(callback)) {
                        throw new Error('Invalid argument.');
                    }
                    this.getFolderPairs(function (error, pairs) {
                        if (!error) {
                            try {
                                var filterSyncFolderPair = [];
                                var registeredPaths = _this.extractRemoteFolderPaths(pairs);
                                var pairsLen = pairs.length;
                                if (pairsLen === 0) {
                                    callback(undefined, filterSyncFolderPair);
                                    return;
                                }
                                var pathsToFilterLen = pathsToFilter.length;
                                for (var i = 0; i < pathsToFilterLen; i++) {
                                    var pathLoop = DPMW.Utils.PathUtils.addSeparator(pathsToFilter[i]);
                                    for (var j = 0; j < pairsLen; j++) {
                                        var pairLoop = pairs[j];
                                        var pairRemotePath = DPMW.Utils.PathUtils.addSeparator(pairLoop.remoteFolderPath);
                                        if (pathLoop === pairRemotePath) {
                                            filterSyncFolderPair.push(pairLoop);
                                            break;
                                        }
                                        if (pairRemotePath.indexOf(pathLoop) >= 0) {
                                            filterSyncFolderPair.push(pairLoop);
                                        }
                                    }
                                }
                                callback(undefined, filterSyncFolderPair);
                            }
                            catch (error) {
                                callback(error);
                            }
                        }
                        else {
                            callback(error);
                        }
                    });
                };
                SyncFolderPairStore.prototype.filterRegisteredRemoteFolderPathContainsSpecifiedPath = function (pathsToFilter, callback) {
                    if (!pathsToFilter || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    this.filterRemoteFolderPath(pathsToFilter, callback, function (pathsToFilter, registeredPaths) {
                        var filteredPaths = [];
                        pathsToFilter.forEach(function (path, index) {
                            var descendant = new RemoteFolder(path);
                            for (var _i = 0, registeredPaths_1 = registeredPaths; _i < registeredPaths_1.length; _i++) {
                                var registeredPath = registeredPaths_1[_i];
                                var ancestor = new RemoteFolder(registeredPath);
                                if (ancestor.isAncestorOf(descendant)) {
                                    filteredPaths.push(path);
                                    break;
                                }
                            }
                        });
                        return filteredPaths;
                    });
                };
                SyncFolderPairStore.prototype.filterSpecifiedPathContainsRegisteredRemoteFolderPath = function (pathsToFilter, callback) {
                    if (!pathsToFilter || !callback) {
                        throw new Error('Invalid argument.');
                    }
                    this.filterRemoteFolderPath(pathsToFilter, callback, function (pathsToFilter, registeredPaths) {
                        var filteredPaths = [];
                        pathsToFilter.forEach(function (path, index) {
                            var ancestor = new RemoteFolder(path);
                            for (var _i = 0, registeredPaths_2 = registeredPaths; _i < registeredPaths_2.length; _i++) {
                                var registeredPath = registeredPaths_2[_i];
                                var descendant = new RemoteFolder(registeredPath);
                                if (ancestor.isAncestorOf(descendant)) {
                                    filteredPaths.push(path);
                                    break;
                                }
                            }
                        });
                        return filteredPaths;
                    });
                };
                SyncFolderPairStore.prototype.filterRemoteFolderPath = function (pathsToFilter, callback, filter) {
                    var thiz = this;
                    if ((pathsToFilter) && (pathsToFilter.length > 0)) {
                        this.getFolderPairs(function (error, pairs) {
                            if (!error) {
                                try {
                                    var registeredPaths = thiz.extractRemoteFolderPaths(pairs);
                                    var filteredPaths = filter(pathsToFilter, registeredPaths);
                                    callback(undefined, filteredPaths);
                                }
                                catch (error) {
                                    callback(error);
                                }
                            }
                            else {
                                callback(error);
                            }
                        });
                    }
                    else {
                        callback(undefined, []);
                    }
                };
                SyncFolderPairStore.prototype.extractRemoteFolderPaths = function (pairs) {
                    var remoteFolderPaths = [];
                    if (pairs) {
                        pairs.forEach(function (pair) {
                            remoteFolderPaths.push(pair.remoteFolderPath);
                        });
                    }
                    return remoteFolderPaths;
                };
                SyncFolderPairStore.prototype.stringifySyncId = function (rows) {
                    if (rows) {
                        if (Object.prototype.toString.call(rows) === '[object Array]') {
                            rows.forEach(function (row) {
                                row.syncId = '' + row.syncId;
                            });
                        }
                        else {
                            rows.syncId = '' + rows.syncId;
                        }
                    }
                    return rows;
                };
                return SyncFolderPairStore;
            }(Backbone.EventsAdopter));
            FolderSync.SyncFolderPairStore = SyncFolderPairStore;
            var RemoteFolder = (function () {
                function RemoteFolder(path) {
                    this.path = undefined;
                    this.path = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(path);
                }
                RemoteFolder.prototype.isAncestorOf = function (remoteFolder) {
                    var descendant = remoteFolder ? remoteFolder.path : undefined;
                    var ancestor = this.path;
                    if (descendant && ancestor) {
                        if (descendant.indexOf(ancestor) === 0) {
                            if (descendant.length === ancestor.length) {
                                return true;
                            }
                            if (descendant[ancestor.length] === DPMW.Utils.PathUtils.SEPARATOR) {
                                return true;
                            }
                            if (ancestor === DPMW.Utils.PathUtils.SEPARATOR) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                return RemoteFolder;
            }());
            FolderSync.syncFolderPairStore = new SyncFolderPairStore();
        })(FolderSync = Model.FolderSync || (Model.FolderSync = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SyncFolderPairStore.js.map