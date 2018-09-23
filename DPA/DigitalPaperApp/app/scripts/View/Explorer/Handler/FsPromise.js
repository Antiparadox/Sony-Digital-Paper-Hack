var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var FsPromise;
                (function (FsPromise) {
                    var fs = require('fs');
                    function lstat(path) {
                        return new Promise(function (resolve, reject) {
                            fs.lstat(path, function (error, stats) {
                                if (error) {
                                    console.error('[ERROR] fs.stat(' + path + ') : ' + error);
                                    reject(error);
                                    return;
                                }
                                resolve({ path: path, stats: stats });
                            });
                        });
                    }
                    FsPromise.lstat = lstat;
                    function lstatArray(pathArray) {
                        var promiseArray = [];
                        for (var i = 0; i < pathArray.length; i++) {
                            var path = pathArray[i];
                            promiseArray.push(this.lstat(path));
                        }
                        return Promise.all(promiseArray);
                    }
                    FsPromise.lstatArray = lstatArray;
                    function readdir(dirPath) {
                        return new Promise(function (resolve, reject) {
                            fs.readdir(dirPath, function (error, childArray) {
                                if (error) {
                                    console.error('[ERROR] fs.readdir(' + dirPath + ') : ' + error);
                                    reject(error);
                                    return;
                                }
                                resolve(childArray);
                            });
                        });
                    }
                    FsPromise.readdir = readdir;
                    function findFilesArray(findDstPathArray, targetExt) {
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            var promiseArray = [];
                            for (var i = 0; i < findDstPathArray.length; i++) {
                                var findDstPath = findDstPathArray[i];
                                promiseArray.push(findFiles(findDstPath, targetExt));
                            }
                            return Promise.all(promiseArray);
                        })
                            .then(function onFulfilled(foundFileStatsArrayArray) {
                            return new Promise(function (resolve, reject) {
                                var findFileResultArray = [];
                                for (var i = 0; i < foundFileStatsArrayArray.length; i++) {
                                    var findDstPath = findDstPathArray[i];
                                    var foundFileStatsArray = foundFileStatsArrayArray[i];
                                    if (foundFileStatsArray && foundFileStatsArray.length > 0) {
                                        findFileResultArray.push({
                                            findDstPath: findDstPath,
                                            foundStatsArray: foundFileStatsArray
                                        });
                                    }
                                }
                                resolve(findFileResultArray);
                            });
                        });
                    }
                    FsPromise.findFilesArray = findFilesArray;
                    function findFiles(findDstPath, targetExt) {
                        var foundFileStatsArray = [];
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return FsPromise.lstat(findDstPath);
                        })
                            .then(function onFulfilled(pathStat) {
                            if (pathStat.stats.isDirectory()) {
                                return Promise.resolve(findFilesRecursively_(pathStat.path, targetExt, foundFileStatsArray));
                            }
                            else if (hasTargetExt_(pathStat.path, targetExt)) {
                                foundFileStatsArray.push(pathStat);
                            }
                        })
                            .then(function onFulfilled() {
                            return new Promise(function (resolve, reject) {
                                resolve(foundFileStatsArray);
                            });
                        });
                    }
                    FsPromise.findFiles = findFiles;
                    function findFilesRecursively_(dirPath, targetExt, foundFileStatsArray) {
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return FsPromise.readdir(dirPath);
                        })
                            .then(function onFulfilled(childNameArray) {
                            var path = require('path');
                            var childPathArray = [];
                            for (var i = 0; i < childNameArray.length; i++) {
                                var childPath = path.resolve(dirPath, childNameArray[i]);
                                childPathArray.push(childPath);
                            }
                            return FsPromise.lstatArray(childPathArray);
                        })
                            .then(function onFulfilled(childStatArray) {
                            var promiseArray = [];
                            for (var i = 0; i < childStatArray.length; i++) {
                                var child = childStatArray[i];
                                if (child.stats.isDirectory()) {
                                    promiseArray.push(findFilesRecursively_(child.path, targetExt, foundFileStatsArray));
                                }
                                else if (hasTargetExt_(child.path, targetExt)) {
                                    foundFileStatsArray.push(child);
                                }
                            }
                            return Promise.all(promiseArray);
                        });
                    }
                    function hasTargetExt_(filePath, targetExt) {
                        if (!filePath || filePath.length === 0) {
                            return false;
                        }
                        var path = require('path');
                        var fileName = path.basename(filePath);
                        var fileExt = path.extname(filePath);
                        if (fileExt.length === 0 && fileName.length > 0) {
                            fileExt = fileName;
                        }
                        return (fileExt.toLowerCase() === targetExt.toLowerCase());
                    }
                    function removeDirRecursively(dirPath) {
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return FsPromise.readdir(dirPath);
                        })
                            .then(function onFulfilled(childNameArray) {
                            var path = require('path');
                            var childPathArray = [];
                            for (var i = 0; i < childNameArray.length; i++) {
                                var childPath = path.resolve(dirPath, childNameArray[i]);
                                childPathArray.push(childPath);
                            }
                            return FsPromise.lstatArray(childPathArray);
                        })
                            .then(function onFulfilled(childStatArray) {
                            var promiseArray = [];
                            for (var i = 0; i < childStatArray.length; i++) {
                                var child = childStatArray[i];
                                if (child.stats.isDirectory()) {
                                    promiseArray.push(FsPromise.removeDirRecursively(child.path));
                                }
                                else {
                                    promiseArray.push(FsPromise.unlink(child.path));
                                }
                            }
                            return Promise.all(promiseArray);
                        })
                            .then(function onFulfilled() {
                            return FsPromise.rmdir(dirPath);
                        });
                    }
                    FsPromise.removeDirRecursively = removeDirRecursively;
                    function unlink(filePath) {
                        return new Promise(function (resolve, reject) {
                            fs.unlink(filePath, function (error) {
                                if (error) {
                                    console.error('[ERROR] fs.unlink(' + filePath + ') : ' + error);
                                    reject(error);
                                    return;
                                }
                                resolve();
                            });
                        });
                    }
                    FsPromise.unlink = unlink;
                    function rmdir(dirPath) {
                        return new Promise(function (resolve, reject) {
                            fs.rmdir(dirPath, function (error) {
                                if (error) {
                                    console.error('[ERROR] fs.rmdir(' + dirPath + ') : ' + error);
                                    reject(error);
                                    return;
                                }
                                resolve();
                            });
                        });
                    }
                    FsPromise.rmdir = rmdir;
                })(FsPromise = Handler.FsPromise || (Handler.FsPromise = {}));
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FsPromise.js.map