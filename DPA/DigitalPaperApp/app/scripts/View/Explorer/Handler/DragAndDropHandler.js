var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var DragAndDropHandler = (function (_super) {
                    __extends(DragAndDropHandler, _super);
                    function DragAndDropHandler() {
                        _super.apply(this, arguments);
                        this.dragExternalServer_ = new Handler.DragExternalServer();
                        this.initialized_ = false;
                        this.dragging_ = false;
                        this.draggingEntities_ = null;
                        this.draggingFocusEntity_ = null;
                        this.draggingDownloadUrl_ = null;
                        this.canClear = true;
                    }
                    DragAndDropHandler.prototype.initialize = function (options) {
                        var _this = this;
                        this.dragExternalServer_.start(options);
                        this.dragExternalServer_.on('downloadError', function (err, task) {
                            err.mwTargetId = task.entryId;
                            if (_this.draggingFocusEntity_.getId() !== task.entryId) {
                                throw new Error('wrong entry id returned');
                            }
                            err.mwTargetName = _this.draggingFocusEntity_.getName();
                            _this.trigger('dropExternalError', err);
                        });
                        this.initialized_ = true;
                    };
                    DragAndDropHandler.prototype.getExternalServer = function () {
                        return this.dragExternalServer_;
                    };
                    DragAndDropHandler.prototype.startDrag = function (entities, focusEntity) {
                        if (!this.initialized_) {
                            throw new Error('Not yet initialized_.');
                        }
                        if (this.dragging_) {
                            throw new Error('Looks already dragging. Or endDrag() is not called.');
                        }
                        if (entities.indexOf(focusEntity) < 0) {
                            throw new Error('Wrong argument. focusEntity is not in entities.');
                        }
                        this.canClear = true;
                        this.dragging_ = true;
                        this.draggingEntities_ = entities.slice();
                        this.draggingFocusEntity_ = focusEntity;
                        if (!focusEntity.isDocument()) {
                            return null;
                        }
                        this.draggingDownloadUrl_ = this.dragExternalServer_.issueDownloadUrl(focusEntity.getId());
                        return this.draggingDownloadUrl_;
                    };
                    DragAndDropHandler.prototype.setCanClear = function (val) {
                        this.canClear = val;
                    };
                    DragAndDropHandler.prototype.isDarggging = function () {
                        return this.dragging_;
                    };
                    DragAndDropHandler.prototype.getDraggingEntities = function () {
                        if (this.draggingEntities_) {
                            return this.draggingEntities_.slice();
                        }
                        else {
                            return new Array();
                            ;
                        }
                    };
                    DragAndDropHandler.prototype.endDrag = function () {
                        var _this = this;
                        if (!this.initialized_) {
                            throw new Error('Not yet initialized.');
                        }
                        if (!this.dragging_) {
                            throw new Error('Not dragging. Or startDrag() is not called.');
                        }
                        if (!this.canClear)
                            return;
                        this.dragging_ = false;
                        this.draggingEntities_ = null;
                        setTimeout(function () {
                            console.log('delayed end drag.');
                        }, 0);
                        setTimeout(function () {
                            console.log('delayed end drag to cancel.');
                            if (typeof _this.draggingDownloadUrl_ === 'string') {
                                _this.dragExternalServer_.cancelDownloadUrl(_this.draggingDownloadUrl_);
                                _this.draggingDownloadUrl_ = null;
                            }
                        }, 60000);
                        return;
                    };
                    DragAndDropHandler.prototype.drop = function (targetFolderId, targetFolderPath, dataTransferFilePathes, options) {
                        var _this = this;
                        if (!this.draggingEntities_ && (!Array.isArray(dataTransferFilePathes) || dataTransferFilePathes.length === 0)) {
                            console.warn('drop called while not dragging nor no filepath passed.');
                            options.success();
                            return;
                        }
                        if (this.draggingDownloadUrl_) {
                            this.dragExternalServer_.cancelDownloadUrl(this.draggingDownloadUrl_);
                            this.draggingDownloadUrl_ = null;
                        }
                        this.trigger('dropStart');
                        var argOptions = _.clone(options);
                        if (this.draggingEntities_) {
                            argOptions.success = function () {
                                _this.draggingEntities_ = null;
                                _this.draggingFocusEntity_ = null;
                                if (Array.isArray(dataTransferFilePathes) && dataTransferFilePathes.length > 0) {
                                    var argOptionsExternal = _.clone(options);
                                    argOptionsExternal.success = function () {
                                        options.success();
                                        _this.trigger('dropSucceed');
                                    };
                                    argOptionsExternal.error = function (err) {
                                        options.error(err);
                                        _this.trigger('dropFailed', err);
                                    };
                                    _this.dropFromExternal_(dataTransferFilePathes, targetFolderPath, options);
                                    return;
                                }
                                options.success();
                                _this.trigger('dropSucceed');
                            };
                            argOptions.error = function (err) {
                                _this.draggingEntities_ = null;
                                _this.draggingFocusEntity_ = null;
                                options.error(err);
                                _this.trigger('dropFailed', err);
                            };
                            this.dropFromInternal_(targetFolderId, targetFolderPath, argOptions);
                        }
                        else if (Array.isArray(dataTransferFilePathes) && dataTransferFilePathes.length > 0) {
                            argOptions.success = function () {
                                options.success();
                                _this.trigger('dropSucceed');
                            };
                            argOptions.error = function (err) {
                                options.error(err);
                                _this.trigger('dropFailed', err);
                            };
                            this.dropFromExternal_(dataTransferFilePathes, targetFolderPath, options);
                            return;
                        }
                    };
                    DragAndDropHandler.prototype.isDroppable = function (targetFolderPath) {
                        if (typeof targetFolderPath !== 'string') {
                            return false;
                        }
                        else {
                            return true;
                        }
                    };
                    DragAndDropHandler.prototype.dropFromInternal_ = function (targetFolderId, targetFolderPath, options) {
                        var _this = this;
                        if (!this.draggingEntities_) {
                            throw new Error('not dragging');
                        }
                        var srcEntities = this.draggingEntities_.slice();
                        if (typeof targetFolderId !== 'string') {
                            var entity_1 = DPMW.appCtrl.currentDevice.getEntityModelByPath(targetFolderPath);
                            entity_1.fetch({
                                success: function (modelOrCollection, res, resOptions) {
                                    entity_1.release();
                                    var targetFolderId = entity_1.getId();
                                    _this.moveEntryInternal_(srcEntities, targetFolderId, targetFolderPath, options);
                                },
                                error: function (modelOrCollection, response, resOptions) {
                                    entity_1.release();
                                    var err = null;
                                    if (resOptions.mwError) {
                                        err = resOptions.mwError;
                                    }
                                    else {
                                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Unknown error');
                                    }
                                    if (typeof options.error === 'function') {
                                        options.error(err);
                                    }
                                }
                            });
                            return;
                        }
                        this.moveEntryInternal_(srcEntities, targetFolderId, targetFolderPath, options);
                        return;
                    };
                    DragAndDropHandler.prototype.moveEntryInternal_ = function (srcEntities, targetFolderId, targetFolderPath, options) {
                        var _this = this;
                        if (srcEntities.length <= 0) {
                            options.success();
                            return;
                        }
                        var entityModel = srcEntities.pop();
                        if (entityModel === null ||
                            typeof entityModel === 'undefined' ||
                            typeof entityModel.get !== 'function') {
                            throw Error('Argument is invalid.');
                        }
                        var parentFolderId = entityModel.get(DPMW.Model.Content.ATTR_NAME_PARENT_FOLDER_ID);
                        if (entityModel.isDocument()) {
                            Handler.fileManageHandler.moveDocument(entityModel, targetFolderId, targetFolderPath, entityModel.getName(), {
                                success: function () {
                                    Handler.fetchHandler.performFetchForUpdate(parentFolderId, {
                                        error: function (modelOrCollection, jqxhr, fetchOptions) {
                                        }
                                    });
                                    _this.moveEntryInternal_(srcEntities, targetFolderId, targetFolderPath, options);
                                }, error: function (err) {
                                    options.error(err);
                                }
                            });
                        }
                        else if (entityModel.isFolder()) {
                            Handler.fileManageHandler.moveFolder(entityModel, targetFolderId, targetFolderPath, entityModel.getName(), {
                                success: function () {
                                    Handler.fetchHandler.performFetchForUpdate(parentFolderId, {
                                        error: function (modelOrCollection, jqxhr, fetchOptions) {
                                        }
                                    });
                                    _this.moveEntryInternal_(srcEntities, targetFolderId, targetFolderPath, options);
                                }, error: function (err) {
                                    options.error(err);
                                }
                            });
                        }
                        return;
                    };
                    DragAndDropHandler.prototype.dropFromExternal_ = function (filePathes, targetFolderPath, options) {
                        Handler.fileTransferHandler.uploadDocuments(filePathes, targetFolderPath, options);
                    };
                    DragAndDropHandler.prototype.terminate = function () {
                    };
                    return DragAndDropHandler;
                }(Backbone.EventsAdopter));
                Handler.DragAndDropHandler = DragAndDropHandler;
                Handler.dragAndDropHandler = new DragAndDropHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DragAndDropHandler.js.map