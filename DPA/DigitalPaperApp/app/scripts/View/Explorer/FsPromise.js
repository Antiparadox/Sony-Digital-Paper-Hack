var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var FsPromise;
            (function (FsPromise) {
                var fs = require('fs');
                var path = require('path');
                function lstat(path) {
                    return new Promise(function (resolve, reject) {
                        fs.stat(path, function (error, stats) {
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
                        var path_1 = pathArray[i];
                        promiseArray.push(this.lstat(path_1));
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
                function findFilesArray(findPathArray, targetExt) {
                    return Promise.resolve(true)
                        .then(function onFulfilled(pathStatArray) {
                        var promiseArray = [];
                        for (var i = 0; i < findPathArray.length; i++) {
                            var findPath = findPathArray[i];
                            promiseArray.push(findFiles(findPath, targetExt));
                        }
                        return Promise.all(promiseArray);
                    })
                        .then(function onFulfilled(foundFilePathArrayArray) {
                        return new Promise(function (resolve, reject) {
                            var findFileResultArray = [];
                            for (var i = 0; i < foundFilePathArrayArray.length; i++) {
                                var findPath = findPathArray[i];
                                var foundFilePathArray = foundFilePathArrayArray[i];
                                if (foundFilePathArray && foundFilePathArray.length > 0) {
                                    findFileResultArray.push({
                                        findPath: findPath,
                                        foundPathArray: foundFilePathArray
                                    });
                                }
                            }
                            resolve(findFileResultArray);
                        });
                    });
                }
                FsPromise.findFilesArray = findFilesArray;
                function findFiles(findPath, targetExt) {
                    var foundFilePathArray = [];
                    return Promise.resolve(true)
                        .then(function onFulfilled() {
                        return FsPromise.lstat(findPath);
                    })
                        .then(function onFulfilled(pathStat) {
                        if (pathStat.stats.isDirectory()) {
                            return Promise.resolve(findFilesRecursively_(pathStat.path, targetExt, foundFilePathArray));
                        }
                        else if (hasTargetExt_(pathStat.path, targetExt)) {
                            foundFilePathArray.push(pathStat.path);
                        }
                    })
                        .then(function onFulfilled() {
                        return new Promise(function (resolve, reject) {
                            resolve(foundFilePathArray);
                        });
                    });
                }
                FsPromise.findFiles = findFiles;
                function findFilesRecursively_(dirPath, targetExt, foundFilePathArray) {
                    return Promise.resolve(true)
                        .then(function onFulfilled() {
                        return FsPromise.readdir(dirPath);
                    })
                        .then(function onFulfilled(childNameArray) {
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
                                promiseArray.push(findFilesRecursively_(child.path, targetExt, foundFilePathArray));
                            }
                            else if (hasTargetExt_(child.path, targetExt)) {
                                foundFilePathArray.push(child.path);
                            }
                        }
                        return Promise.all(promiseArray);
                    });
                }
                function hasTargetExt_(filePath, targetExt) {
                    if (!filePath || filePath.length === 0) {
                        return false;
                    }
                    var fileName = path.basename(filePath);
                    var fileExt = path.extname(filePath);
                    if (fileExt.length === 0 && fileName.length > 0) {
                        fileExt = fileName;
                    }
                    return (fileExt.toLowerCase() === targetExt.toLowerCase());
                }
            })(FsPromise = Explorer.FsPromise || (Explorer.FsPromise = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FsPromise.js.map