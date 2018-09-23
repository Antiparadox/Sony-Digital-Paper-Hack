var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var Content = DPMW.Model.Content;
                var FileManageHandler = (function () {
                    function FileManageHandler() {
                        this.running_ = 0;
                    }
                    FileManageHandler.prototype.isRunning = function () {
                        return (this.running_ > 0);
                    };
                    FileManageHandler.prototype.incrementRunningCount = function () {
                        this.running_++;
                        return;
                    };
                    FileManageHandler.prototype.decrementRunningCount = function () {
                        this.running_--;
                        if (this.running_ < 0) {
                            throw new Error('running count shows negative value');
                        }
                        return;
                    };
                    FileManageHandler.prototype.copyDocument = function (entry, targetFolderId, targetFolderPath, newName, callbackOption) {
                        var _this = this;
                        if (this.isEmpty(entry) ||
                            typeof targetFolderId !== 'string' ||
                            this.isEmpty(callbackOption) ||
                            this.isEmpty(callbackOption.success) ||
                            this.isEmpty(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        this.incrementRunningCount();
                        var entryId = entry.get(Content.ATTR_NAME_ENTRY_ID);
                        var docName = entry.get(Content.ATTR_NAME_ENTRY_NAME);
                        DPMW.appCtrl.currentDevice.copyDocument(entryId, targetFolderId, newName, {
                            success: function (response, status, options) {
                                Handler.fetchHandler.performFetchForUpdate(targetFolderId, {
                                    error: function (modelOrCollection, response, options) {
                                        callbackOption.error(options.mwError);
                                    }
                                });
                                callbackOption.success();
                                _this.decrementRunningCount();
                            },
                            error: function (modelOrCollection, response, options) {
                                if (newName === null &&
                                    !_.isUndefined(response.status) &&
                                    !_.isUndefined(response.responseJSON) &&
                                    response.status === 400 &&
                                    response.responseJSON.error_code === '40007') {
                                    entry.fetch({
                                        success: function (modelOrCollection, response, options) {
                                            _this.renameDuplicateEntryName(entry, targetFolderPath, 1, function (newName) {
                                                _this.copyDocument(entry, targetFolderId, targetFolderPath, newName, callbackOption);
                                                _this.decrementRunningCount();
                                            }, callbackOption);
                                        },
                                        error: function (modelOrCollection, jqxhr, options) {
                                            callbackOption.error(options.mwError);
                                            _this.decrementRunningCount();
                                        }
                                    });
                                }
                                else {
                                    options.mwError.mwTargetName = docName;
                                    callbackOption.error(options.mwError);
                                    _this.decrementRunningCount();
                                }
                            }
                        });
                    };
                    FileManageHandler.prototype.copyFolder = function (entry, targetFolderId, targetFolderPath, newName, callbackOption) {
                        var _this = this;
                        if (this.isEmpty(entry) ||
                            typeof targetFolderId !== 'string' ||
                            typeof targetFolderPath !== 'string' ||
                            typeof newName !== 'string' ||
                            this.isEmpty(callbackOption) ||
                            this.isEmpty(callbackOption.success) ||
                            this.isEmpty(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        var folderName = entry.get(Content.ATTR_NAME_ENTRY_NAME);
                        var path = entry.get(Content.ATTR_NAME_ENTRY_PATH);
                        var folderId = entry.get(Content.ATTR_NAME_ENTRY_ID);
                        if (this.isDescendant(path, targetFolderPath)) {
                            var error = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED, 'Copy path is not correct.');
                            error.mwTargetName = folderName;
                            callbackOption.error(error);
                            return;
                        }
                        this.incrementRunningCount();
                        DPMW.appCtrl.currentDevice.createFolder(targetFolderId, newName, {
                            success: function (modelOrCollection, response, options) {
                                var newFolderId = response.responseJSON.folder_id;
                                Handler.fetchHandler.performFetchForUpdate(targetFolderId, {
                                    error: function (modelOrCollection, response, options) {
                                        callbackOption.error(options.mwError);
                                    }
                                });
                                var copyPasteCollection = DPMW.appCtrl.currentDevice.getFolderEntityCollection(folderId);
                                copyPasteCollection.fetch({
                                    success: function () {
                                        _this.copyFolderOrDocRecursively(copyPasteCollection, newFolderId, folderName, 0, {
                                            success: function () {
                                                copyPasteCollection.release();
                                                copyPasteCollection = null;
                                                callbackOption.success();
                                                _this.decrementRunningCount();
                                            },
                                            error: function (mwError) {
                                                copyPasteCollection.release();
                                                copyPasteCollection = null;
                                                callbackOption.error(mwError);
                                                _this.decrementRunningCount();
                                            }
                                        });
                                    },
                                    error: function (modelOrCollection, response, options) {
                                        copyPasteCollection.release();
                                        copyPasteCollection = null;
                                        callbackOption.error(options.mwError);
                                        _this.decrementRunningCount();
                                    }
                                });
                            },
                            error: function (modelOrCollection, response, options) {
                                if (!_.isUndefined(response.status) &&
                                    !_.isUndefined(response.responseJSON) &&
                                    response.status === 400 &&
                                    response.responseJSON.error_code === '40007') {
                                    _this.renameDuplicateEntryName(entry, targetFolderPath, 1, function (newName) {
                                        _this.copyFolder(entry, targetFolderId, targetFolderPath, newName, callbackOption);
                                        _this.decrementRunningCount();
                                    }, callbackOption);
                                }
                                else {
                                    callbackOption.error(options.mwError);
                                    _this.decrementRunningCount();
                                }
                            }
                        });
                    };
                    FileManageHandler.prototype.copyFolderOrDocRecursively = function (result, targetFolderId, targetFolderPath, index, callbackOption) {
                        var _this = this;
                        if (result.length <= index) {
                            callbackOption.success();
                            return;
                        }
                        var model = result.at(index);
                        var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                        var entryId = model.get(Content.ATTR_NAME_ENTRY_ID);
                        var entryName = model.get(Content.ATTR_NAME_ENTRY_NAME);
                        if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                            this.copyDocument(model, targetFolderId, targetFolderPath, entryName, {
                                success: function () {
                                    _this.copyFolderOrDocRecursively(result, targetFolderId, targetFolderPath, index + 1, callbackOption);
                                }, error: function (mwError) {
                                    if (!_.isUndefined(callbackOption.error)) {
                                        callbackOption.error(mwError);
                                    }
                                }
                            });
                        }
                        else if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                            this.copyFolder(model, targetFolderId, targetFolderPath, entryName, {
                                success: function () {
                                    _this.copyFolderOrDocRecursively(result, targetFolderId, targetFolderPath, index + 1, callbackOption);
                                }, error: function (error) {
                                    if (!_.isUndefined(callbackOption.error)) {
                                        callbackOption.error(error);
                                    }
                                }
                            });
                        }
                    };
                    FileManageHandler.prototype.moveDocument = function (entry, targetFolderId, targetFolderPath, newName, callbackOption) {
                        var _this = this;
                        if (this.isEmpty(entry) ||
                            typeof targetFolderId !== 'string' ||
                            this.isEmpty(callbackOption) ||
                            this.isEmpty(callbackOption.success) ||
                            this.isEmpty(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        var docName = entry.get(Content.ATTR_NAME_ENTRY_NAME);
                        this.incrementRunningCount();
                        entry.save({ "parent_folder_id": targetFolderId, 'entry_name': newName }, {
                            success: function (model, res, options) {
                                Handler.fetchHandler.performFetchForUpdate(targetFolderId, {
                                    error: function (modelOrCollection, response, options) {
                                        callbackOption.error(options.mwError);
                                    }
                                });
                                callbackOption.success();
                                _this.decrementRunningCount();
                            }, error: function (model, response, options) {
                                if (newName === null &&
                                    !_.isUndefined(response.status) &&
                                    !_.isUndefined(response.responseJSON) &&
                                    response.status === 400 &&
                                    response.responseJSON.error_code === '40007') {
                                    entry.fetch({
                                        success: function (modelOrCollection, response, options) {
                                            _this.renameDuplicateEntryName(entry, targetFolderPath, 1, function (newName) {
                                                _this.moveDocument(entry, targetFolderId, targetFolderPath, newName, callbackOption);
                                                _this.decrementRunningCount();
                                            }, callbackOption);
                                        },
                                        error: function (modelOrCollection, jqxhr, options) {
                                            callbackOption.error(options.mwError);
                                            _this.decrementRunningCount();
                                        }
                                    });
                                }
                                else {
                                    callbackOption.error(options.mwError);
                                    _this.decrementRunningCount();
                                }
                            }
                        });
                    };
                    FileManageHandler.prototype.moveFolder = function (entry, targetFolderId, targetFolderPath, newName, callbackOption) {
                        var _this = this;
                        if (this.isEmpty(entry) ||
                            typeof targetFolderId !== 'string' ||
                            typeof targetFolderPath !== 'string' ||
                            typeof newName !== 'string' ||
                            this.isEmpty(callbackOption) ||
                            this.isEmpty(callbackOption.success) ||
                            this.isEmpty(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        var folderName = entry.get(Content.ATTR_NAME_ENTRY_NAME);
                        var path = entry.get(Content.ATTR_NAME_ENTRY_PATH);
                        if (this.isDescendant(path, targetFolderPath)) {
                            var error = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED, 'Copy path is not correct.');
                            error.mwTargetName = folderName;
                            callbackOption.error(error);
                            return;
                        }
                        this.incrementRunningCount();
                        entry.save({ "parent_folder_id": targetFolderId, 'entry_name': newName }, {
                            success: function (modelOrCollection, response, options) {
                                Handler.fetchHandler.performFetchForUpdate(targetFolderId, {
                                    error: function (modelOrCollection, response, options) {
                                        callbackOption.error(options.mwError);
                                    }
                                });
                                callbackOption.success();
                                _this.decrementRunningCount();
                            },
                            error: function (modelOrCollection, response, options) {
                                if (!_.isUndefined(response.status) &&
                                    !_.isUndefined(response.responseJSON) &&
                                    response.status === 400 &&
                                    response.responseJSON.error_code === '40007') {
                                    _this.renameDuplicateEntryName(entry, targetFolderPath, 1, function (newName) {
                                        _this.moveFolder(entry, targetFolderId, targetFolderPath, newName, callbackOption);
                                        _this.decrementRunningCount();
                                    }, callbackOption);
                                }
                                else {
                                    options.mwError.mwTargetName = folderName;
                                    callbackOption.error(options.mwError);
                                    _this.decrementRunningCount();
                                }
                            }
                        });
                    };
                    FileManageHandler.prototype.renameDuplicateEntryName = function (entry, targetFolderPath, index, callback, callbackOption) {
                        var _this = this;
                        var entryName = entry.get(Content.ATTR_NAME_ENTRY_NAME);
                        var entryType = entry.get(Content.ATTR_NAME_ENTRY_TYPE);
                        var newEntryName;
                        var resovlePath = null;
                        if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                            newEntryName = entryName + ' (' + index + ')';
                        }
                        else {
                            var ext = entryName.substr(-4);
                            newEntryName = entryName.substr(0, entryName.length - 4) + ' (' + index + ')' + ext;
                        }
                        resovlePath = DPMW.Utils.PathUtils.addSeparator(targetFolderPath) + newEntryName;
                        var collection = new DPMW.Model.Content.EntityCollection(DPMW.appCtrl.currentDevice);
                        collection.getEntityModelByPath(resovlePath, {
                            success: function (modelOrCollection, res, options) {
                                _this.renameDuplicateEntryName(entry, targetFolderPath, index + 1, callback, callbackOption);
                            },
                            error: function (modelOrCollection, response, options) {
                                if (!_.isUndefined(response.status) &&
                                    !_.isUndefined(response.responseJSON) &&
                                    response.status === 404 &&
                                    response.responseJSON.error_code === '40401') {
                                    callback(newEntryName);
                                }
                                else {
                                    callbackOption.error(options.mwError);
                                }
                            } });
                    };
                    FileManageHandler.prototype.deleteDocument = function (doc, callbackOption) {
                        var _this = this;
                        if (this.isEmpty(doc) ||
                            this.isEmpty(callbackOption) ||
                            this.isEmpty(callbackOption.success) ||
                            this.isEmpty(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        this.incrementRunningCount();
                        var parentFolderId = doc.get(Content.ATTR_NAME_PARENT_FOLDER_ID);
                        var docName = doc.get(Content.ATTR_NAME_ENTRY_NAME);
                        doc.destroy({
                            success: function () {
                                Handler.fetchHandler.performFetchForUpdate(parentFolderId, {
                                    error: function (modelOrCollection, jqxhr, opt) {
                                        callbackOption.error(opt.mwError);
                                    }
                                });
                                callbackOption.success();
                                _this.decrementRunningCount();
                            },
                            error: function (modelOrCollection, response, opt) {
                                opt.mwError.mwTargetName = docName;
                                callbackOption.error(opt.mwError);
                                _this.decrementRunningCount();
                            }
                        });
                    };
                    FileManageHandler.prototype.deleteFolder = function (folder, callbackOption) {
                        var _this = this;
                        if (this.isEmpty(folder) ||
                            this.isEmpty(callbackOption) ||
                            this.isEmpty(callbackOption.success) ||
                            this.isEmpty(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        var folderId = folder.get(Content.ATTR_NAME_ENTRY_ID);
                        var folderName = folder.get(Content.ATTR_NAME_ENTRY_NAME);
                        var parentFolderId = folder.get(Content.ATTR_NAME_PARENT_FOLDER_ID);
                        var deleteCollection = DPMW.appCtrl.currentDevice.getFolderEntityCollection(folderId);
                        this.incrementRunningCount();
                        deleteCollection.fetch({
                            argParams: {},
                            success: function (modelOrCollection, response, options) {
                                var deleteArray = deleteCollection.toArray().slice();
                                _this.deleteFolderOrDocRecursively(deleteArray, 0, {
                                    success: function () {
                                        deleteCollection.release();
                                        deleteCollection = null;
                                        folder.destroy({
                                            success: function (modelOrCollection, response, options) {
                                                Handler.fetchHandler.performFetchForUpdate(parentFolderId, {
                                                    error: function (modelOrCollection, jqxhr, opt) {
                                                        callbackOption.error(opt.mwError);
                                                    }
                                                });
                                                callbackOption.success();
                                                _this.decrementRunningCount();
                                            },
                                            error: function (modelOrCollection, response, options) {
                                                options.mwError.mwTargetName = folderName;
                                                callbackOption.error(options.mwError);
                                                _this.decrementRunningCount();
                                            },
                                        });
                                    },
                                    error: function (modelOrCollection, response, options) {
                                        deleteCollection.release();
                                        deleteCollection = null;
                                        callbackOption.error(options.mwError);
                                        _this.decrementRunningCount();
                                    }
                                });
                            },
                            error: function (modelOrCollection, response, options) {
                                deleteCollection.release();
                                deleteCollection = null;
                                callbackOption.error(options.mwError);
                                _this.decrementRunningCount();
                            }
                        });
                    };
                    FileManageHandler.prototype.deleteFolderOrDocRecursively = function (deleteCollection, index, callbackOption) {
                        var _this = this;
                        if (index === deleteCollection.length) {
                            callbackOption.success();
                            return;
                        }
                        var entity = deleteCollection[index];
                        var entityType = entity.get(DPMW.Model.Content.ATTR_NAME_ENTRY_TYPE);
                        if (entityType === DPMW.Model.Content.VALUE_ENTRY_TYPE_FILE) {
                            this.deleteDocument(entity, {
                                success: function () {
                                    _this.deleteFolderOrDocRecursively(deleteCollection, index + 1, callbackOption);
                                },
                                error: function (error) {
                                    if (!_.isUndefined(error.response.status) &&
                                        !_.isUndefined(error.response.responseJSON) &&
                                        error.response.status === 404 &&
                                        error.response.responseJSON.error_code === '40401') {
                                        _this.deleteFolderOrDocRecursively(deleteCollection, index + 1, callbackOption);
                                    }
                                    else {
                                        callbackOption.error(error);
                                    }
                                }
                            });
                        }
                        else if (entityType === DPMW.Model.Content.VALUE_ENTRY_TYPE_FOLDER) {
                            this.deleteFolder(entity, {
                                success: function () {
                                    _this.deleteFolderOrDocRecursively(deleteCollection, index + 1, callbackOption);
                                },
                                error: function (error) {
                                    callbackOption.error(error);
                                }
                            });
                        }
                        else {
                            throw new Error('Entity type is illegal.');
                        }
                    };
                    FileManageHandler.prototype.isEmpty = function (val) {
                        return _.isUndefined(val) || _.isNull(val);
                    };
                    FileManageHandler.prototype.isDescendant = function (ancestor, descendant) {
                        if (typeof ancestor !== 'string' || typeof descendant !== 'string') {
                            throw new Error('Paramater  is invlalid.');
                        }
                        var ancestorPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(ancestor) + DPMW.Utils.PathUtils.SEPARATOR;
                        var descendantPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(descendant) + DPMW.Utils.PathUtils.SEPARATOR;
                        return descendantPath.indexOf(ancestorPath) === 0;
                    };
                    return FileManageHandler;
                }());
                Handler.FileManageHandler = FileManageHandler;
                Handler.fileManageHandler = new FileManageHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FileManageHandler.js.map