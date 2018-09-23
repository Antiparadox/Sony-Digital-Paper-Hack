var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var FS = require('fs');
        var LocalFilePromiseUtils = (function () {
            function LocalFilePromiseUtils() {
            }
            LocalFilePromiseUtils.existsFile = function (filePath) {
                return new Promise(function (resolve, reject) {
                    try {
                        var fileExists = FS.existsSync(filePath);
                        resolve(fileExists);
                    }
                    catch (error) {
                        reject(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'existsSync() failed. ' + error));
                    }
                });
            };
            LocalFilePromiseUtils.touchFile = function (filePath) {
                return new Promise(function (resolve, reject) {
                    try {
                        var fd = FS.openSync(filePath, 'w');
                        FS.closeSync(fd);
                        resolve();
                    }
                    catch (error) {
                        reject(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'openSync() or closeSync() failed. ' + error));
                    }
                });
            };
            LocalFilePromiseUtils.makeDirectory = function (directoryPath) {
                return new Promise(function (resolve, reject) {
                    FS.mkdir(directoryPath, function (error) {
                        if (!error) {
                            resolve();
                        }
                        else {
                            reject(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'mkdir() failed. ' + error));
                        }
                    });
                });
            };
            LocalFilePromiseUtils.makeDirectoryIfNotExists = function (directoryPath) {
                return Promise.resolve().then(function () {
                    return LocalFilePromiseUtils.existsFile(directoryPath);
                }).then(function (fileExists) {
                    if (!fileExists) {
                        return LocalFilePromiseUtils.makeDirectory(directoryPath);
                    }
                });
            };
            LocalFilePromiseUtils.removeFile = function (filePath) {
                return new Promise(function (resolve, reject) {
                    FS.unlink(filePath, function (error) {
                        if (!error) {
                            resolve();
                        }
                        else {
                            reject(DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_UNLINK_LOCAL_FAILED, 'unlinkSync() failed. ' + error));
                        }
                    });
                });
            };
            LocalFilePromiseUtils.removeFileIfExists = function (filePath) {
                return Promise.resolve().then(function () {
                    return LocalFilePromiseUtils.existsFile(filePath);
                }).then(function (fileExists) {
                    if (fileExists) {
                        return LocalFilePromiseUtils.removeFile(filePath);
                    }
                });
            };
            LocalFilePromiseUtils.removeFileIfPossible = function (filePath) {
                return Promise.resolve().then(function () {
                    return LocalFilePromiseUtils.removeFileIfExists(filePath);
                }).catch(function (error) {
                    console.log('removeFileIfPossible() failed. ' + error);
                });
            };
            return LocalFilePromiseUtils;
        }());
        Utils.LocalFilePromiseUtils = LocalFilePromiseUtils;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=LocalFilePromiseUtils.js.map