var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var Path = require('path');
        var Process = require('electron').remote.process;
        var AppDataStore = (function () {
            function AppDataStore() {
                this.databaseWrapper = new Model.DatabaseWrapper();
                this.state = Model.AppDataStoreDefs.State.STOPPED;
            }
            AppDataStore.prototype.start = function (callback) {
                if (!callback) {
                    throw new Error('Invalid argument.');
                }
                if (this.state === Model.AppDataStoreDefs.State.STOPPED) {
                    this.state = Model.AppDataStoreDefs.State.STARTING;
                    var thiz_1 = this;
                    Promise.resolve().then(function () {
                        return thiz_1.setUp(thiz_1.getDatabaseDirectoryPath(), thiz_1.getDatabaseFilePath(), thiz_1.getPurgationMarkerFilePath());
                    }).then(function () {
                        thiz_1.state = Model.AppDataStoreDefs.State.STARTED;
                        callback();
                    }).catch(function (error) {
                        thiz_1.state = Model.AppDataStoreDefs.State.STOPPED;
                        callback(error);
                    });
                }
                else {
                    Promise.resolve().then(function () {
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'state is not STOPPED.'));
                    });
                }
            };
            AppDataStore.prototype.stop = function (forced, callback) {
                if (!callback) {
                    throw new Error('Invalid argument.');
                }
                var thiz = this;
                if ((this.state === Model.AppDataStoreDefs.State.STARTED) || (forced)) {
                    this.state = Model.AppDataStoreDefs.State.STOPPING;
                    Promise.resolve().then(function () {
                        return thiz.databaseWrapper.close();
                    }).then(function () {
                        thiz.state = Model.AppDataStoreDefs.State.STOPPED;
                        callback();
                    }).catch(function (error) {
                        thiz.state = Model.AppDataStoreDefs.State.STOPPED;
                        callback(error);
                    });
                }
                else {
                    Promise.resolve().then(function () {
                        thiz.state = Model.AppDataStoreDefs.State.STOPPED;
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'state is not STARTED.'));
                    });
                }
            };
            AppDataStore.prototype.reset = function (callback) {
                if (!callback) {
                    throw new Error('Invalid argument.');
                }
                if ((this.state === Model.AppDataStoreDefs.State.STOPPED)
                    || (this.state === Model.AppDataStoreDefs.State.STARTED)) {
                    var opened_1 = (this.state == Model.AppDataStoreDefs.State.STARTED);
                    this.state = Model.AppDataStoreDefs.State.RESETTING;
                    var thiz_2 = this;
                    Promise.resolve().then(function () {
                        return thiz_2.purge(thiz_2.getDatabaseFilePath(), thiz_2.getPurgationMarkerFilePath(), opened_1);
                    }).then(function () {
                        thiz_2.state = Model.AppDataStoreDefs.State.STARTING;
                        return thiz_2.setUp(thiz_2.getDatabaseDirectoryPath(), thiz_2.getDatabaseFilePath(), thiz_2.getPurgationMarkerFilePath());
                    }).then(function () {
                        thiz_2.state = Model.AppDataStoreDefs.State.STARTED;
                        callback();
                    }).catch(function (error) {
                        thiz_2.state = Model.AppDataStoreDefs.State.STOPPED;
                        callback(error);
                    });
                }
                else {
                    Promise.resolve().then(function () {
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'state is neither STOPPED nor STARTED.'));
                    });
                }
            };
            AppDataStore.prototype.compact = function (callback) {
                if (!callback) {
                    throw new Error('Invalid argument.');
                }
                if (this.state === Model.AppDataStoreDefs.State.STARTED) {
                    this.state = Model.AppDataStoreDefs.State.COMPACTING;
                    var thiz_3 = this;
                    Promise.resolve().then(function () {
                        return thiz_3.databaseWrapper.compact();
                    }).then(function () {
                        thiz_3.state = Model.AppDataStoreDefs.State.STARTED;
                        callback();
                    }).catch(function (error) {
                        thiz_3.state = Model.AppDataStoreDefs.State.STARTED;
                        callback(error);
                    });
                }
                else {
                    Promise.resolve().then(function () {
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'state is not STARTED.'));
                    });
                }
            };
            AppDataStore.prototype.clear = function (callback) {
                if (!callback) {
                    throw new Error('Invalid argument.');
                }
                if (this.state === Model.AppDataStoreDefs.State.STARTED) {
                    this.state = Model.AppDataStoreDefs.State.CLEARING;
                    var thiz_4 = this;
                    Promise.resolve().then(function () {
                        var sql = "DELETE FROM sync_folder_pair;";
                        return thiz_4.databaseWrapper.sqlRun(sql);
                    }).then(function () {
                        return thiz_4.databaseWrapper.compact();
                    }).then(function () {
                        thiz_4.state = Model.AppDataStoreDefs.State.STARTED;
                        callback();
                    }).catch(function (error) {
                        thiz_4.state = Model.AppDataStoreDefs.State.STARTED;
                        callback(error);
                    });
                }
                else {
                    Promise.resolve().then(function () {
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'state is not STARTED.'));
                    });
                }
            };
            AppDataStore.prototype.check = function (callback) {
                if (!callback) {
                    throw new Error('Invalid argument.');
                }
                if (this.state === Model.AppDataStoreDefs.State.STARTED) {
                    this.state = Model.AppDataStoreDefs.State.CHECKING;
                    var thiz_5 = this;
                    var fileStampRows_1 = [];
                    var syncFolderPairRows_1 = [];
                    Promise.resolve().then(function () {
                        var sql = "SELECT * FROM file_stamp;";
                        return thiz_5.databaseWrapper.sqlGetAll(sql);
                    }).then(function (rows) {
                        fileStampRows_1 = rows;
                        var sql = "SELECT * FROM sync_folder_pair;";
                        return thiz_5.databaseWrapper.sqlGetAll(sql);
                    }).then(function (rows) {
                        syncFolderPairRows_1 = rows;
                        var uniqueFileStampSyncIds = {};
                        if (fileStampRows_1) {
                            for (var _i = 0, fileStampRows_2 = fileStampRows_1; _i < fileStampRows_2.length; _i++) {
                                var row = fileStampRows_2[_i];
                                uniqueFileStampSyncIds[row.syncId] = true;
                            }
                        }
                        var uniqueSyncFolderPairSyncIds = {};
                        if (syncFolderPairRows_1) {
                            for (var _a = 0, syncFolderPairRows_2 = syncFolderPairRows_1; _a < syncFolderPairRows_2.length; _a++) {
                                var row = syncFolderPairRows_2[_a];
                                uniqueSyncFolderPairSyncIds[row.syncId] = true;
                            }
                        }
                        var invalidSyncIds = [];
                        Object.keys(uniqueFileStampSyncIds).forEach(function (syncId) {
                            if (!uniqueSyncFolderPairSyncIds[syncId]) {
                                invalidSyncIds.push(syncId);
                            }
                        });
                        thiz_5.state = Model.AppDataStoreDefs.State.STARTED;
                        callback(undefined, invalidSyncIds);
                    }).catch(function (error) {
                        thiz_5.state = Model.AppDataStoreDefs.State.STARTED;
                        callback(error);
                    });
                }
                else {
                    Promise.resolve().then(function () {
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'state is not STARTED.'));
                    });
                }
            };
            AppDataStore.prototype.getDatabaseWrapper = function () {
                if (this.state === Model.AppDataStoreDefs.State.STARTED) {
                    return this.databaseWrapper;
                }
                else {
                    return null;
                }
            };
            AppDataStore.prototype.getState = function () {
                return this.state;
            };
            AppDataStore.prototype.setUp = function (databaseDirecotryPath, databaseFilePath, purgationMarkerFilePath) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return DPMW.Utils.LocalFilePromiseUtils.makeDirectoryIfNotExists(databaseDirecotryPath);
                }).then(function () {
                    return DPMW.Utils.LocalFilePromiseUtils.existsFile(purgationMarkerFilePath);
                }).then(function (purgationMakerFileExists) {
                    if (purgationMakerFileExists) {
                        return thiz.purge(databaseFilePath, purgationMarkerFilePath, false);
                    }
                }).then(function () {
                    return thiz.databaseWrapper.open(databaseFilePath);
                }).then(function () {
                    var sql = "CREATE TABLE sync_folder_pair "
                        + "( syncId INTEGER PRIMARY KEY, "
                        + "localFolderPath TEXT NOT NULL, "
                        + "remoteFolderPath TEXT NOT NULL );";
                    return thiz.databaseWrapper.createTableIfNotExists('sync_folder_pair', sql);
                }).then(function () {
                    var sql = "CREATE TABLE file_stamp "
                        + "( syncId TEXT NOT NULL, "
                        + "localFolderPath TEXT NOT NULL, localFileName TEXT NOT NULL, localStamp TEXT NOT NULL, "
                        + "remoteFolderPath TEXT NOT NULL, remoteFileName TEXT NOT NULL, remoteStamp TEXT NOT NULL );";
                    return thiz.databaseWrapper.createTableIfNotExists('file_stamp', sql);
                }).then(function () {
                    var sql = "CREATE UNIQUE INDEX sync_folder_pair_local_and_remote_folder_paths "
                        + "ON sync_folder_pair ( localFolderPath, remoteFolderPath );";
                    return thiz.databaseWrapper.createIndexIfNotExists('sync_folder_pair_local_and_remote_folder_paths', sql);
                }).then(function () {
                    var sql = "CREATE INDEX file_stamp_sync_id "
                        + "ON file_stamp ( syncId );";
                    return thiz.databaseWrapper.createIndexIfNotExists('file_stamp_sync_id', sql);
                }).then(function () {
                    var sql = "CREATE UNIQUE INDEX file_stamp_local_file_path "
                        + "ON file_stamp ( localFolderPath, localFileName );";
                    return thiz.databaseWrapper.createIndexIfNotExists('file_stamp_local_file_path', sql);
                }).then(function () {
                    var sql = "CREATE UNIQUE INDEX file_stamp_remote_file_path "
                        + "ON file_stamp ( remoteFolderPath, remoteFileName );";
                    return thiz.databaseWrapper.createIndexIfNotExists('file_stamp_remote_file_path', sql);
                }).then(function () {
                    var sql = "CREATE TRIGGER delete_sync_folder_pair DELETE ON sync_folder_pair "
                        + "BEGIN "
                        + "  DELETE FROM file_stamp WHERE syncId = OLD.syncId; "
                        + "END;";
                    return thiz.databaseWrapper.createTriggerIfNotExists('delete_sync_folder_pair', sql);
                });
            };
            AppDataStore.prototype.purge = function (databaseFilePath, purgartionMarkerFilePath, opened) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return DPMW.Utils.LocalFilePromiseUtils.touchFile(purgartionMarkerFilePath);
                }).then(function () {
                    if (opened) {
                        return thiz.databaseWrapper.dropTableIfExists('file_stamp');
                    }
                }).then(function () {
                    if (opened) {
                        return thiz.databaseWrapper.dropTableIfExists('sync_folder_pair');
                    }
                }).then(function () {
                    return thiz.databaseWrapper.compact();
                }).then(function () {
                    if (opened) {
                        return thiz.databaseWrapper.close();
                    }
                }).then(function () {
                    return DPMW.Utils.LocalFilePromiseUtils.removeFileIfPossible(databaseFilePath);
                }).then(function () {
                    return DPMW.Utils.LocalFilePromiseUtils.removeFileIfExists(purgartionMarkerFilePath);
                });
            };
            AppDataStore.prototype.getDatabaseDirectoryPath = function () {
                return Process.env.MW_USER_DATA_DIR_PATH;
            };
            AppDataStore.prototype.getDatabaseFilePath = function () {
                return Path.join(this.getDatabaseDirectoryPath(), Model.AppDataStoreDefs.Settigns.DB_FILE_NAME);
            };
            AppDataStore.prototype.getPurgationMarkerFilePath = function () {
                return this.getDatabaseFilePath() + '.purgation';
            };
            return AppDataStore;
        }());
        Model.AppDataStore = AppDataStore;
        Model.appDataStore = new AppDataStore();
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=AppDataStore.js.map