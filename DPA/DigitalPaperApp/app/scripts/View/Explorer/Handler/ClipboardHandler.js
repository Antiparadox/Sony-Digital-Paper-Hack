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
                var Content = DPMW.Model.Content;
                var ClipboardHandler = (function (_super) {
                    __extends(ClipboardHandler, _super);
                    function ClipboardHandler() {
                        _super.apply(this, arguments);
                        this.COPY = 0;
                        this.CUT = 1;
                        this.elements_ = null;
                        this.pasting = false;
                    }
                    ClipboardHandler.prototype.isPasting = function () {
                        return this.pasting;
                    };
                    ClipboardHandler.prototype.isEmpty = function () {
                        return this.elements_ === null || this.elements_.length === 0;
                    };
                    ClipboardHandler.prototype.copy = function (list) {
                        if (!Array.isArray(list)) {
                            throw Error('Argument is invalid.');
                        }
                        this.elements_ = list.slice();
                        this.type = this.COPY;
                        this.trigger('clipboardChanged', this.elements_.slice(0));
                    };
                    ClipboardHandler.prototype.cut = function (list) {
                        if (!Array.isArray(list)) {
                            throw Error('Argument is invalid.');
                        }
                        this.elements_ = list.slice();
                        this.type = this.CUT;
                        this.trigger('clipboardChanged', this.elements_.slice(0));
                    };
                    ClipboardHandler.prototype.paste = function (targetFolderId, targetFolderPath, callbackOption) {
                        var _this = this;
                        if (typeof targetFolderId !== 'string' ||
                            typeof targetFolderPath !== 'string' ||
                            _.isUndefined(callbackOption) || _.isNull(callbackOption)) {
                            throw Error('Argument is invalid.');
                        }
                        if (_.isUndefined(callbackOption.success) ||
                            _.isUndefined(callbackOption.error)) {
                            throw Error('Argument is invalid.');
                        }
                        if (this.elements_ === null || this.elements_.length === 0) {
                            return;
                        }
                        var cloneElements = this.elements_.slice();
                        if (this.type === this.CUT) {
                            this.elements_ = null;
                            this.trigger('clipboardChanged', null);
                        }
                        this.pasting = true;
                        this.trigger('pasteStarted');
                        this.pasteInternal_(cloneElements, targetFolderId, targetFolderPath, {
                            success: function () {
                                _this.pasting = false;
                                _this.trigger('pasteSucceeded');
                                callbackOption.success();
                            },
                            error: function (mwError) {
                                _this.pasting = false;
                                _this.trigger('pasteFailed', mwError);
                                if (!_.isUndefined(mwError.status) &&
                                    !_.isUndefined(mwError.responseJSON)) {
                                    if (mwError.status === 404 &&
                                        mwError.responseJSON === '40401' &&
                                        _this.type === _this.COPY) {
                                        _this.elements_ = null;
                                        _this.trigger('clipboardChanged', null);
                                    }
                                }
                                callbackOption.error(mwError);
                            }
                        });
                    };
                    ClipboardHandler.prototype.pasteInternal_ = function (elements, targetFolderId, targetFolderPath, callbackOption) {
                        var _this = this;
                        if (elements.length === 0) {
                            callbackOption.success();
                            return;
                        }
                        var entity = elements.pop();
                        var entityType = entity.get(Content.ATTR_NAME_ENTRY_TYPE);
                        var entityName = entity.get(Content.ATTR_NAME_ENTRY_NAME);
                        if (this.type === this.COPY) {
                            if (entityType === Content.VALUE_ENTRY_TYPE_FILE) {
                                Handler.fileManageHandler.copyDocument(entity, targetFolderId, targetFolderPath, null, {
                                    success: function () {
                                        _this.pasteInternal_(elements, targetFolderId, targetFolderPath, callbackOption);
                                    },
                                    error: function (mwError) {
                                        callbackOption.error(mwError);
                                    }
                                });
                            }
                            else if (entityType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                Handler.fileManageHandler.copyFolder(entity, targetFolderId, targetFolderPath, entityName, {
                                    success: function () {
                                        _this.pasteInternal_(elements, targetFolderId, targetFolderPath, callbackOption);
                                    },
                                    error: function (mwError) {
                                        callbackOption.error(mwError);
                                    }
                                });
                            }
                            else {
                                throw new Error('Entity type is illegal.');
                            }
                        }
                        else {
                            if (entityType === Content.VALUE_ENTRY_TYPE_FILE) {
                                Handler.fileManageHandler.moveDocument(entity, targetFolderId, targetFolderPath, null, {
                                    success: function () {
                                        _this.pasteInternal_(elements, targetFolderId, targetFolderPath, callbackOption);
                                    },
                                    error: function (mwError) {
                                        elements.push(entity);
                                        mwError.elements = elements;
                                        callbackOption.error(mwError);
                                    }
                                });
                            }
                            else if (entityType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                Handler.fileManageHandler.moveFolder(entity, targetFolderId, targetFolderPath, entityName, {
                                    success: function () {
                                        _this.pasteInternal_(elements, targetFolderId, targetFolderPath, callbackOption);
                                    },
                                    error: function (mwError) {
                                        elements.push(entity);
                                        mwError.elements = elements;
                                        callbackOption.error(mwError);
                                    }
                                });
                            }
                            else {
                                throw new Error('Entity type is illegal.');
                            }
                        }
                    };
                    ClipboardHandler.prototype.clear = function () {
                        this.elements_ = null;
                        this.trigger('clipboardChanged', null);
                    };
                    ClipboardHandler.prototype.chkPasteable = function (targetFolderPath) {
                        if (_.isUndefined(this.elements_) || this.elements_.length === 0) {
                            return false;
                        }
                        else {
                            for (var i = 0; i <= this.elements_.length; i++) {
                                var entityModel = this.elements_[0];
                                var entityType = entityModel.get(Content.ATTR_NAME_ENTRY_TYPE);
                                if (entityType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                    var path = entityModel.get(Content.ATTR_NAME_ENTRY_PATH);
                                    if (targetFolderPath.indexOf(path) === 0) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        }
                    };
                    ClipboardHandler.prototype.isCut = function () {
                        return this.type === this.CUT;
                    };
                    ClipboardHandler.prototype.getClipboard = function () {
                        if (this.elements_ === null) {
                            return new Array();
                        }
                        else {
                            return this.elements_.slice();
                        }
                    };
                    return ClipboardHandler;
                }(Backbone.EventsAdopter));
                Handler.ClipboardHandler = ClipboardHandler;
                Handler.clipboardHandler = new ClipboardHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ClipboardHandler.js.map