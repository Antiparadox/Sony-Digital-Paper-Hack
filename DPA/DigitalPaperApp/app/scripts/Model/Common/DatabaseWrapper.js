var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var Remote = require('electron').remote;
        var SQLite3 = (function () {
            if ((process.env.MW_DEBUGGABLE === 'true') && (Remote.process.argv.indexOf('--sql-debug') >= 0)) {
                return Remote.require('sqlite3').verbose();
            }
            else {
                return Remote.require('sqlite3');
            }
        })();
        var SQLog = (function () {
            if ((process.env.MW_DEBUGGABLE === 'true') && (Remote.process.argv.indexOf('--sql-debug') >= 0)) {
                return function (message) { console.log('[ SQL ]  ' + message); };
            }
            else {
                return function () { };
            }
        })();
        var DatabaseWrapper = (function () {
            function DatabaseWrapper() {
                this.db = null;
            }
            DatabaseWrapper.prototype.open = function (databaseFilePath) {
                var thiz = this;
                return new Promise(function (resolve, reject) {
                    SQLog('(open)');
                    thiz.db = new SQLite3.Database(databaseFilePath, function (error) {
                        if (!error) {
                            resolve();
                        }
                        else {
                            reject(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_CREATE_FAILED, 'SQLite3.Database() failed. ' + error));
                        }
                    });
                });
            };
            DatabaseWrapper.prototype.close = function () {
                var thiz = this;
                return new Promise(function (resolve, reject) {
                    SQLog('(close)');
                    thiz.db.close(function (error) {
                        if (!error) {
                            resolve();
                        }
                        else {
                            reject(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_CREATE_FAILED, 'SQLite3.close() failed. ' + error));
                        }
                    });
                });
            };
            DatabaseWrapper.prototype.sqlGetOne = function (sql) {
                var thiz = this;
                if (this.db) {
                    return new Promise(function (resolve, reject) {
                        SQLog(sql);
                        thiz.db.get(sql, [], function (error, row) {
                            if (!error) {
                                resolve(row);
                            }
                            else {
                                reject(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, 'SQLite3.get() failed. ' + error));
                            }
                        });
                    });
                }
                else {
                    return this.databaseIsNotLoadedError();
                }
            };
            DatabaseWrapper.prototype.sqlGetAll = function (sql) {
                var thiz = this;
                if (this.db) {
                    return new Promise(function (resolve, reject) {
                        SQLog(sql);
                        thiz.db.all(sql, [], function (error, rows) {
                            if (!error) {
                                resolve(rows);
                            }
                            else {
                                reject(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_READ_FAILED, 'SQLite3.all() failed. ' + error));
                            }
                        });
                    });
                }
                else {
                    return this.databaseIsNotLoadedError();
                }
            };
            DatabaseWrapper.prototype.sqlRun = function (sql) {
                var thiz = this;
                if (this.db) {
                    return new Promise(function (resolve, reject) {
                        SQLog(sql);
                        thiz.db.run(sql, [], function (error) {
                            if (!error) {
                                resolve();
                            }
                            else {
                                reject(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_WRITE_FAILED, 'SQLite3.run() failed. ' + error));
                            }
                        });
                    });
                }
                else {
                    return this.databaseIsNotLoadedError();
                }
            };
            DatabaseWrapper.prototype.tableExists = function (tableName) {
                var sql = "SELECT COUNT(*) AS count FROM sqlite_master WHERE type='table' AND name='" + tableName + "';";
                return this.sqlGetOne(sql);
            };
            DatabaseWrapper.prototype.indexExists = function (indexName) {
                var sql = "SELECT COUNT(*) AS count FROM sqlite_master WHERE type='index' AND name='" + indexName + "';";
                return this.sqlGetOne(sql);
            };
            DatabaseWrapper.prototype.triggerExists = function (triggerName) {
                var sql = "SELECT COUNT(*) AS count FROM sqlite_master WHERE type='trigger' AND name='" + triggerName + "';";
                return this.sqlGetOne(sql);
            };
            DatabaseWrapper.prototype.dropTable = function (tableName) {
                var sql = "DROP TABLE " + tableName + ";";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.dropIndex = function (indexName) {
                var sql = "DROP INDEX " + indexName + ";";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.dropTrigger = function (triggerName) {
                var sql = "DROP TRIGGER " + triggerName + ";";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.createTableIfNotExists = function (tableName, sql) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return thiz.tableExists(tableName);
                }).then(function (row) {
                    if ((row) && (row.count) && (row.count > 0)) {
                        return Promise.resolve();
                    }
                    else {
                        return thiz.sqlRun(sql);
                    }
                });
            };
            DatabaseWrapper.prototype.createIndexIfNotExists = function (indexName, sql) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return thiz.indexExists(indexName);
                }).then(function (row) {
                    if ((row) && (row.count) && (row.count > 0)) {
                        return Promise.resolve();
                    }
                    else {
                        return thiz.sqlRun(sql);
                    }
                });
            };
            DatabaseWrapper.prototype.createTriggerIfNotExists = function (triggerName, sql) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return thiz.triggerExists(triggerName);
                }).then(function (row) {
                    if ((row) && (row.count) && (row.count > 0)) {
                        return Promise.resolve();
                    }
                    else {
                        return thiz.sqlRun(sql);
                    }
                });
            };
            DatabaseWrapper.prototype.dropTableIfExists = function (tableName) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return thiz.tableExists(tableName);
                }).then(function (row) {
                    if ((row) && (row.count) && (row.count > 0)) {
                        return thiz.dropTable(tableName);
                    }
                    else {
                        return Promise.resolve();
                    }
                });
            };
            DatabaseWrapper.prototype.dropIndexIfExists = function (indexName) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return thiz.indexExists(indexName);
                }).then(function (row) {
                    if ((row) && (row.count) && (row.count > 0)) {
                        return thiz.dropIndex(indexName);
                    }
                    else {
                        return Promise.resolve();
                    }
                });
            };
            DatabaseWrapper.prototype.dropTriggerIfExists = function (triggerName) {
                var thiz = this;
                return Promise.resolve().then(function () {
                    return thiz.triggerExists(triggerName);
                }).then(function (row) {
                    if ((row) && (row.count) && (row.count > 0)) {
                        return thiz.dropTrigger(triggerName);
                    }
                    else {
                        return Promise.resolve();
                    }
                });
            };
            DatabaseWrapper.prototype.beginTransaction = function () {
                var sql = "BEGIN TRANSACTION;";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.commitTransaction = function () {
                var sql = "COMMIT;";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.rollbackTransaction = function () {
                var sql = "ROLLBACK;";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.compact = function () {
                var sql = "VACUUM;";
                return this.sqlRun(sql);
            };
            DatabaseWrapper.prototype.databaseIsNotLoadedError = function () {
                return Promise.reject(DPMW.mwe.genError(DPMW.mwe.E_MW_DB_INVALID_ACCESS, 'Database is not loaded.'));
            };
            return DatabaseWrapper;
        }());
        Model.DatabaseWrapper = DatabaseWrapper;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DatabaseWrapper.js.map