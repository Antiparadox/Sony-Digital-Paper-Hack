var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var FileTransferUtils;
                (function (FileTransferUtils) {
                    var Content = DPMW.Model.Content;
                    var path = require('path');
                    function isDeviceConnected(device) {
                        return new Promise(function (resolve, reject) {
                            if (!device.isConnected()) {
                                var error = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'The device is not found.');
                                reject(error);
                                return;
                            }
                            resolve();
                        });
                    }
                    FileTransferUtils.isDeviceConnected = isDeviceConnected;
                    function fetchFolderListIfNeeded(affectedFolderIds) {
                        var firstError = null;
                        var self = this;
                        return Promise.resolve()
                            .then(function onFullfilled() {
                            var promiseArray = [];
                            for (var i = 0; i < affectedFolderIds.length; i++) {
                                var folderId = affectedFolderIds[i];
                                var promise = self.fetchFolderIfNeeded(folderId)
                                    .catch(function onRejected(err) {
                                    return new Promise(function (resolve, reject) {
                                        if (firstError === null) {
                                            firstError = err;
                                        }
                                        resolve();
                                    });
                                });
                                promiseArray.push(promise);
                            }
                            return Promise.all(promiseArray);
                        })
                            .then(function onFullfilled() {
                            return new Promise(function (resolve, reject) {
                                if (firstError !== null) {
                                    reject(firstError);
                                    return;
                                }
                                resolve();
                            });
                        });
                    }
                    FileTransferUtils.fetchFolderListIfNeeded = fetchFolderListIfNeeded;
                    function fetchFolderIfNeeded(folderId) {
                        return new Promise(function (resolve, reject) {
                            Handler.fetchHandler.performFetchForUpdate(folderId, {
                                success: function (modelOrCollection, res, options) {
                                    resolve();
                                },
                                error: function (modelOrCollection, jqxhr, options) {
                                    var error = (options && options.mwError) ? options.mwError : new Error('The error object is not passed.');
                                    console.error('[ERROR] fetchHandler.performFetchForUpdate(' + folderId + ') : ' + error);
                                    reject(error);
                                }
                            });
                        });
                    }
                    FileTransferUtils.fetchFolderIfNeeded = fetchFolderIfNeeded;
                    function splitPath(filePath) {
                        var splitPathArray = [];
                        this.splitPathRecursively_(filePath, splitPathArray);
                        return splitPathArray;
                    }
                    FileTransferUtils.splitPath = splitPath;
                    function splitPathRecursively_(filePath, splitPathArray) {
                        var result = path.parse(filePath);
                        if (result.root !== result.dir) {
                            this.splitPathRecursively_(result.dir, splitPathArray);
                        }
                        else {
                            splitPathArray.push(result.root);
                        }
                        splitPathArray.push(result.base);
                    }
                    FileTransferUtils.splitPathRecursively_ = splitPathRecursively_;
                    function getUploadParamArray(srcPathArray, dstArrayedFolderPath) {
                        var self = this;
                        return Promise.resolve(true)
                            .then(function onFullfilled() {
                            return Handler.FsPromise.findFilesArray(srcPathArray, '.pdf');
                        })
                            .then(function onFullfilled(findFileResultArray) {
                            return new Promise(function (resolve, reject) {
                                if (!findFileResultArray || findFileResultArray.length === 0) {
                                    var error = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT, 'No pdf file is found.');
                                    reject(error);
                                    return;
                                }
                                var uploadParamArray = [];
                                for (var i = 0; i < findFileResultArray.length; i++) {
                                    var result = findFileResultArray[i];
                                    var findDstPath = result.findDstPath;
                                    var foundFileStatsArray = result.foundStatsArray;
                                    for (var j = 0; j < foundFileStatsArray.length; j++) {
                                        var dstFileName = void 0;
                                        var dstFolderPath = void 0;
                                        var foundFileStats = foundFileStatsArray[j];
                                        var srcFilePath = foundFileStats.path;
                                        var srcFileSize = foundFileStats.stats.size;
                                        if (srcFileSize === 0) {
                                            console.log('[Warning] size:0 file:' + srcFilePath);
                                            continue;
                                        }
                                        var srcFileMode = foundFileStats.stats.mode;
                                        if ((srcFileMode & parseInt('400', 8)) === 0) {
                                            console.log('[Warning] mode:' + srcFileMode + ' file:' + srcFilePath);
                                            continue;
                                        }
                                        if (findDstPath.length === srcFilePath.length) {
                                            dstFileName = path.parse(srcFilePath).base;
                                            dstFolderPath = dstArrayedFolderPath.join(Handler.DEVICE_PATH_SEP) + (Handler.DEVICE_PATH_SEP);
                                        }
                                        else {
                                            var findDstArrayPath = self.splitPath(findDstPath);
                                            var dstFileArrayPath = self.splitPath(srcFilePath);
                                            dstFileArrayPath.splice(0, findDstArrayPath.length - 1);
                                            dstFileArrayPath = dstArrayedFolderPath.concat(dstFileArrayPath);
                                            dstFileName = dstFileArrayPath.pop();
                                            dstFolderPath = dstFileArrayPath.join(Handler.DEVICE_PATH_SEP) + (Handler.DEVICE_PATH_SEP);
                                        }
                                        uploadParamArray.push({
                                            srcFilePath: srcFilePath,
                                            dstFolderPath: dstFolderPath,
                                            dstFileName: dstFileName,
                                            fileSize: srcFileSize
                                        });
                                    }
                                }
                                if (!uploadParamArray || uploadParamArray.length === 0) {
                                    var error = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT, 'No pdf file is found.');
                                    reject(error);
                                    return;
                                }
                                resolve(uploadParamArray);
                            });
                        });
                    }
                    FileTransferUtils.getUploadParamArray = getUploadParamArray;
                    function getDownloadParamArray(srcEntryArray, dstDirPath) {
                        var self = this;
                        var downloadParamArray = [];
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            var promiseArray = [];
                            for (var i = 0; i < srcEntryArray.length; i++) {
                                var srcEntry = srcEntryArray[i];
                                if (srcEntry.get(Content.ATTR_NAME_ENTRY_TYPE) === Content.VALUE_ENTRY_TYPE_FILE) {
                                    promiseArray.push(getDownloadParamForDocument_(srcEntry, dstDirPath, downloadParamArray));
                                }
                                else {
                                    promiseArray.push(getDownloadParamForFolder_(srcEntry, dstDirPath, downloadParamArray));
                                }
                            }
                            return Promise.all(promiseArray);
                        })
                            .then(function onFulfilled() {
                            return new Promise(function (resolve, reject) {
                                if (downloadParamArray.length === 0) {
                                    var error = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT, 'No pdf file is found.');
                                    reject(error);
                                    return;
                                }
                                resolve(downloadParamArray);
                            });
                        });
                    }
                    FileTransferUtils.getDownloadParamArray = getDownloadParamArray;
                    function getDownloadParamForDocument_(srcDocument, dstDirPath, downloadParamArray) {
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return new Promise(function (resolve, reject) {
                                var fileName = srcDocument.get(Content.ATTR_NAME_ENTRY_NAME);
                                fileName = replaceInvalidCharsInPath(fileName);
                                downloadParamArray.push({
                                    documentId: srcDocument.get(Content.ATTR_NAME_ENTRY_ID),
                                    fileSize: srcDocument.get(Content.ATTR_NAME_FILE_SIZE),
                                    srcFilePath: srcDocument.get(Content.ATTR_NAME_ENTRY_PATH),
                                    dstFilePath: path.join(dstDirPath, fileName)
                                });
                                resolve();
                            });
                        });
                    }
                    function getDownloadParamForFolder_(srcFolder, dstDirPath, downloadParamArray) {
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return findDocuments_(srcFolder.get(Content.ATTR_NAME_ENTRY_ID));
                        })
                            .then(function onFulfilled(foundDocumentArray) {
                            return new Promise(function (resolve, reject) {
                                var path = require('path');
                                for (var i = 0; i < foundDocumentArray.length; i++) {
                                    var srcDocument = foundDocumentArray[i];
                                    var srcDocumentPath = srcDocument.get(Content.ATTR_NAME_ENTRY_PATH);
                                    var srcFolderPath = srcFolder.get(Content.ATTR_NAME_ENTRY_PATH);
                                    var srcFolderPathArray = srcFolderPath.split(Handler.DEVICE_PATH_SEP);
                                    var dstDocPathRemainArray = srcDocumentPath.split(Handler.DEVICE_PATH_SEP);
                                    dstDocPathRemainArray.splice(0, srcFolderPathArray.length - 1);
                                    if (dstDocPathRemainArray[0] === '') {
                                        dstDocPathRemainArray.shift();
                                    }
                                    var dstFilePath = dstDirPath;
                                    for (var i_1 = 0; i_1 < dstDocPathRemainArray.length; i_1++) {
                                        var baseName = dstDocPathRemainArray[i_1];
                                        baseName = replaceInvalidCharsInPath(baseName);
                                        if (baseName && baseName.length > 0) {
                                            dstFilePath = path.join(dstFilePath, baseName);
                                        }
                                    }
                                    downloadParamArray.push({
                                        documentId: srcDocument.get(Content.ATTR_NAME_ENTRY_ID),
                                        fileSize: srcDocument.get(Content.ATTR_NAME_FILE_SIZE),
                                        srcFilePath: srcDocumentPath,
                                        dstFilePath: dstFilePath
                                    });
                                }
                                resolve();
                            });
                        });
                    }
                    function replaceInvalidCharsInPath(fileName) {
                        if (process.platform === 'win32') {
                            return fileName.replace(/[\u0022\u002a\u002f\u003a\u003c\u003e\u003f\u005c\u007c]/g, '_');
                        }
                        else {
                            return fileName.replace(/[\u002f]/g, '_');
                        }
                    }
                    FileTransferUtils.replaceInvalidCharsInPath = replaceInvalidCharsInPath;
                    function findDocuments_(folderId) {
                        var foundDocumentArray = [];
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return findDocumentsRecursively_(folderId, foundDocumentArray);
                        })
                            .then(function onFulfilled() {
                            return new Promise(function (resolve, reject) {
                                resolve(foundDocumentArray);
                            });
                        });
                    }
                    function findDocumentsRecursively_(folderId, foundDocumentArray) {
                        return Promise.resolve(true)
                            .then(function onFulfilled() {
                            return new Promise(function (resolve, reject) {
                                var findCollection = DPMW.appCtrl.currentDevice.getFolderEntityCollection(folderId);
                                findCollection.fetch({
                                    argParams: {},
                                    success: function (collection, response, options) {
                                        var childEntryArray = [];
                                        for (var i = 0; i < findCollection.length; i++) {
                                            var child = findCollection.at(i);
                                            childEntryArray.push(child);
                                        }
                                        findCollection.release();
                                        resolve(childEntryArray);
                                    },
                                    error: function (collection, response, options) {
                                        var error = (options && options.mwError) ?
                                            options.mwError : new Error('The error object is not passed.');
                                        findCollection.release();
                                        reject(error);
                                    }
                                });
                            });
                        })
                            .then(function onFullfilled(childEntryInfoArray) {
                            var promiseArray = [];
                            for (var i = 0; i < childEntryInfoArray.length; i++) {
                                var child = childEntryInfoArray[i];
                                if (child.get(Content.ATTR_NAME_ENTRY_TYPE) === Content.VALUE_ENTRY_TYPE_FILE) {
                                    foundDocumentArray.push(child);
                                }
                                else {
                                    var folderId_1 = child.get(Content.ATTR_NAME_ENTRY_ID);
                                    promiseArray.push(findDocumentsRecursively_(folderId_1, foundDocumentArray));
                                }
                            }
                            return Promise.all(promiseArray);
                        });
                    }
                })(FileTransferUtils = Handler.FileTransferUtils || (Handler.FileTransferUtils = {}));
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FileTransferUtils.js.map