var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var fileStampStore = DPMW.Model.FolderSync.fileStampStore;
                var LocalFileStampHandler = (function () {
                    function LocalFileStampHandler() {
                        this.crypto = require('crypto');
                        this.fs = require('fs');
                    }
                    LocalFileStampHandler.prototype.getFileDiffType = function (syncId, filePath, callback) {
                        var _this = this;
                        fileStampStore.getLocalStamp(syncId, filePath, function (error, oldStamp) {
                            if (!oldStamp) {
                                callback(null, Handler.DiffType.Added);
                                return;
                            }
                            _this.calculateFileStamp(filePath, function (error, newStamp) {
                                if (error) {
                                    callback(error, null);
                                    return;
                                }
                                if (newStamp === null) {
                                    callback(null, Handler.DiffType.Removed);
                                    return;
                                }
                                if (newStamp === oldStamp) {
                                    callback(null, Handler.DiffType.Stay);
                                    return;
                                }
                                else {
                                    callback(null, Handler.DiffType.Modified);
                                    return;
                                }
                            });
                        });
                    };
                    LocalFileStampHandler.prototype.calculateFileStamp = function (filePath, callback) {
                        var _this = this;
                        var me = this;
                        me.fs.open(filePath, 'r', function (err, fd) {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    callback(null, null);
                                }
                                else {
                                    callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Failed to read file.', err), null);
                                }
                                return;
                            }
                            me.fs.stat(filePath, function (err, stat) {
                                if (err) {
                                    _this.fs.close(fd, function () {
                                        if (err.code === 'ENOENT') {
                                            callback(null, null);
                                        }
                                        else {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Failed to read file.', err), null);
                                        }
                                    });
                                    return;
                                }
                                if (stat.size > Handler.MAXSIZE) {
                                    _this.fs.close(fd, function () {
                                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_SIZE_EXCEED, 'File size too big.'), null);
                                    });
                                    return;
                                }
                                me.calculatePartialStamp(fd, 0, null, stat.size, function (err, stamp) {
                                    if (err) {
                                        _this.fs.close(fd, function () {
                                            callback(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'Partial Hash calculation failed .', err), null);
                                        });
                                        return;
                                    }
                                    _this.fs.close(fd, function () {
                                        callback(null, stamp);
                                    });
                                });
                            });
                        });
                    };
                    LocalFileStampHandler.prototype.calculatePartialStamp = function (fd, position, hash, totalSize, callback) {
                        var remain = totalSize - position;
                        var length = remain > Handler.PARTSIZE ? Handler.PARTSIZE : remain;
                        var me = this;
                        var buf = Buffer.alloc(length);
                        var curHash;
                        if (hash) {
                            curHash = hash;
                        }
                        else {
                            curHash = this.crypto.createHash(Handler.ALGORITHM);
                        }
                        me.fs.read(fd, buf, 0, length, position, function (err, bytesRead, buffer) {
                            if (err) {
                                callback(err, null);
                            }
                            curHash.update(buffer);
                            var nextPosition = position + length;
                            if (nextPosition >= totalSize) {
                                callback(null, curHash.digest('hex'));
                                return;
                            }
                            me.calculatePartialStamp(fd, nextPosition, curHash, totalSize, callback);
                        });
                    };
                    return LocalFileStampHandler;
                }());
                Handler.LocalFileStampHandler = LocalFileStampHandler;
                Handler.MAXSIZE = 1024 * 1024 * 1024 * 3;
                Handler.PARTSIZE = 1024 * 1024;
                Handler.ALGORITHM = 'md5';
                Handler.localFileStampHandler = new LocalFileStampHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=LocalFileStampHandler.js.map