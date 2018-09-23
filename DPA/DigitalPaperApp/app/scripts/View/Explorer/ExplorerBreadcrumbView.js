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
            var fetchHandler = DPMW.View.Explorer.Handler.fetchHandler;
            var viewStatus = DPMW.View.Explorer.Status.viewStatus;
            var syncFolderPairStore = DPMW.Model.FolderSync.syncFolderPairStore;
            var Content = DPMW.Model.Content;
            var ExplorerBreadcrumbView = (function (_super) {
                __extends(ExplorerBreadcrumbView, _super);
                function ExplorerBreadcrumbView(options) {
                    _super.call(this, options);
                    this.listenTo(viewStatus, 'viewTypeChanged', this.onViewTypeChanged);
                    this.listenTo(viewStatus, 'folderChanged', this.onFolderChanged);
                    this.listenTo(this, 'resize', this.onResize);
                    var viewType = viewStatus.getViewType();
                    if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS) {
                        this.$el.html('<span>' + $.i18n.t('content.navi.label.searchPath') + '</span>');
                        this.$el.append('<span class="space"></span>');
                        this.$el.append('<label>' + $.i18n.t('content.navi.allDoc') + '</label>');
                    }
                    else if (viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.renderBreadcrumbList($('#breadcrumb').width());
                    }
                    else if (viewType === Explorer.VIEW_TYPE_DOCUMENTS) {
                        this.$el.html('');
                        this.$el.html('<label>' + $.i18n.t('content.navi.allDoc') + '</label>');
                    }
                    else if (viewType === Explorer.VIEW_TYPE_FOLDER) {
                        this.renderBreadcrumbList($('#breadcrumb').width());
                    }
                    else {
                        throw new Error('ViewType is invalid');
                    }
                }
                ExplorerBreadcrumbView.prototype.initialize = function () {
                };
                ExplorerBreadcrumbView.prototype.events = function () {
                    return {};
                };
                ExplorerBreadcrumbView.prototype.onFolderChanged = function (folderId, folderPath) {
                    var viewType = viewStatus.getViewType();
                    if (viewType === Explorer.VIEW_TYPE_FOLDER) {
                        this.renderBreadcrumbList($('#breadcrumb').width());
                    }
                };
                ExplorerBreadcrumbView.prototype.onResize = function () {
                    var viewType = viewStatus.getViewType();
                    if ($('#breadcrumb').width() <= 250) {
                        return;
                    }
                    if (viewType === Explorer.VIEW_TYPE_FOLDER ||
                        viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.renderBreadcrumbList($('#breadcrumb').width());
                    }
                };
                ExplorerBreadcrumbView.prototype.openPankuzu = function (ev) {
                    var _this = this;
                    var path = $(ev.target).attr("data-folder-path");
                    var model = DPMW.appCtrl.currentDevice.getEntityModelByPath(path);
                    model.fetch({
                        success: function (modelOrCollection, res, options) {
                            if (viewStatus.getViewType() === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS) {
                                viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                            }
                            else if (viewStatus.getViewType() === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                                viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                            }
                            viewStatus.changeFolder(model.get(DPMW.Model.Content.ATTR_NAME_ENTRY_ID), path);
                            fetchHandler.performFetch({
                                error: _this.onFetchError
                            });
                        },
                        error: function (modelOrCollection, response, options) {
                            var err;
                            if (!options || !options.mwError) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Error object does not passed');
                            }
                            else {
                                err = options.mwError;
                            }
                            var errCode = DPMW.mwe.genUserErrorCode(err);
                            var errorInfo = { msgId: null, type: null };
                            switch (err.mwCode) {
                                case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                    var statusCode = void 0;
                                    var webApiResCode = void 0;
                                    if (response) {
                                        statusCode = response.status;
                                        if (response.responseJSON && typeof response.responseJSON.error_code === 'string') {
                                            webApiResCode = response.responseJSON.error_code;
                                        }
                                    }
                                    if (404 === statusCode) {
                                        if ('40401' === webApiResCode) {
                                            if (path) {
                                                errorInfo.msgId = 'dialog.error.message.57';
                                                errorInfo.type = 'none';
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(errorInfo.msgId, { folder: path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                }, function (response) { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else if (408 === statusCode) {
                                        if ('40800' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.72';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else {
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                    }
                                    break;
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerBreadcrumbView.prototype.onFetchError = function (odelOrCollection, response, options) {
                    var err;
                    if (!options || !options.mwError) {
                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Error object does not passed');
                    }
                    else {
                        err = options.mwError;
                    }
                    var errCode = DPMW.mwe.genUserErrorCode(err);
                    var errorInfo = { msgId: null, type: null };
                    switch (err.mwCode) {
                        case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                            var statusCode = void 0;
                            var webApiResCode = void 0;
                            if (response) {
                                statusCode = response.status;
                                if (response.responseJSON && typeof response.responseJSON.error_code === 'string') {
                                    webApiResCode = response.responseJSON.error_code;
                                }
                            }
                            if (400 === statusCode) {
                                if ('40002' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                else if ('40005' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                else {
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                }
                            }
                            else if (404 === statusCode) {
                                if ('40401' === webApiResCode) {
                                    if (err.cause && err.cause.path) {
                                        errorInfo.msgId = 'dialog.error.message.57';
                                        errorInfo.type = 'none';
                                        View.Dialog.openErrorDialog({
                                            message: $.i18n.t(errorInfo.msgId, { folder: err.cause.path, errorCode: errCode }),
                                            type: errorInfo.type,
                                        }, function (response) { });
                                        return;
                                    }
                                    else {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                }
                                else {
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                }
                            }
                            else if (408 === statusCode) {
                                if ('40800' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.72';
                                    errorInfo.type = 'none';
                                }
                                else {
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                }
                            }
                            else {
                                errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                            }
                            break;
                        default:
                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                            break;
                    }
                    View.Dialog.openErrorDialog({
                        message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                        type: errorInfo.type,
                    }, function (response) {
                    });
                };
                ExplorerBreadcrumbView.prototype.renderBreadcrumbList = function (dsiplayWidth) {
                    var _this = this;
                    this.$el.html('');
                    var path = viewStatus.getFolderPath();
                    var pathArray = path.split('/');
                    var dirCount = 0;
                    if (viewStatus.getViewType() === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.$el.html('<span sytle="color:#808080">' + $.i18n.t('content.navi.label.searchPath') + '</span>');
                        this.$el.append('<span class="space"></span>');
                    }
                    var syncPahtArray = [];
                    var syncPath = '';
                    syncPath = pathArray[0];
                    for (var j = 1; j < pathArray.length; j++) {
                        syncPath += '/' + pathArray[j];
                        syncPahtArray[j - 1] = syncPath;
                    }
                    syncFolderPairStore.filterSpecifiedPathIsRemoteFolderPath(syncPahtArray, function (error, filteredPaths) {
                        if (!_.isUndefined(error)) {
                            filteredPaths = [];
                        }
                        _this.$el.html('');
                        var isSyncFolder = false;
                        for (var i = 0; i < pathArray.length; i++) {
                            var folderPath = _this.getFolderPath(pathArray, i);
                            var folderName = '';
                            if (i === 0) {
                                folderName = $.i18n.t('content.navi.root');
                            }
                            else {
                                folderName = pathArray[i];
                            }
                            if (i != 0) {
                                var img = null;
                                if (filteredPaths.indexOf(folderPath) >= 0 || isSyncFolder) {
                                    img = $('<img src="../res/image/svg/Asset_Altair_Main_List_breadcrumb_Folder_Sync.svg" />');
                                    isSyncFolder = true;
                                }
                                else {
                                    img = $('<img src="../res/image/svg/Asset_Altair_Main_List_breadcrumb_Folder.svg" />');
                                }
                                _this.$el.append(img);
                            }
                            var pankuzu = null;
                            if (i === pathArray.length - 1) {
                                pankuzu = $("<span class='dispFolder'/>");
                                pankuzu.text(folderName);
                            }
                            else {
                                pankuzu = $("<a data-folder-path='" + folderPath + "'/>");
                                pankuzu.text(folderName);
                                pankuzu.bind('click', _this.openPankuzu.bind(_this));
                            }
                            _this.$el.append(pankuzu);
                            dirCount++;
                            pankuzu.bind('dragover', _this.onDragOverBreadcrumb.bind(_this));
                            pankuzu.bind('drop', _this.onDropBreadcrumb.bind(_this));
                            if (i < pathArray.length - 1) {
                                _this.$el.append('<span class="sign">&nbsp;&gt;&nbsp;</span>');
                            }
                        }
                        var breadcrumbSize = _this.$el.width();
                        var abbrev = $.i18n.t('content.navi.abbrev');
                        while (breadcrumbSize > (dsiplayWidth - 50)) {
                            if (dirCount <= 2)
                                break;
                            var linkArray = _this.$el.find("a");
                            var imgArray = _this.$el.find("img");
                            var signArray = _this.$el.find("span.sign");
                            var node = linkArray[1];
                            node.text = abbrev;
                            node.className = 'ui-state-disabled';
                            if (linkArray.length === imgArray.length) {
                                node = imgArray[0];
                                node.remove();
                            }
                            if (linkArray.length >= 3) {
                                node = linkArray[2];
                                node.remove();
                            }
                            if (signArray.length >= 3) {
                                node = signArray[2];
                                node.remove();
                            }
                            if (imgArray.length >= 2) {
                                node = imgArray[1];
                                node.remove();
                            }
                            dirCount = $('#breadcrumb a').length;
                            breadcrumbSize = _this.$el.width();
                        }
                        if (breadcrumbSize > (dsiplayWidth - 50)) {
                            var origiWidht = _this.$el.find('.dispFolder').width();
                            var diff = breadcrumbSize - dsiplayWidth;
                            _this.$el.find('.dispFolder').width(origiWidht - diff - 40);
                        }
                    });
                };
                ExplorerBreadcrumbView.prototype.getFolderPath = function (pathArray, index) {
                    var folderPath = "";
                    for (var i = 0; i < index + 1; i++) {
                        folderPath += pathArray[i];
                        if (i < index) {
                            folderPath += "/";
                        }
                    }
                    return folderPath;
                };
                ExplorerBreadcrumbView.prototype.onViewTypeChanged = function () {
                    var viewType = viewStatus.getViewType();
                    if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS) {
                        this.$el.html('<span>' + $.i18n.t('content.navi.label.searchPath') + '</span>');
                        this.$el.append('<span class="space"></span>');
                        this.$el.append('<label>' + $.i18n.t('content.navi.allDoc') + '</label>');
                    }
                    else if (viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.renderBreadcrumbList($('#breadcrumb').width());
                    }
                    else if (viewType === Explorer.VIEW_TYPE_DOCUMENTS) {
                        this.$el.html('');
                        this.$el.html('<label>' + $.i18n.t('content.navi.allDoc') + '</label>');
                    }
                    else if (viewType === Explorer.VIEW_TYPE_FOLDER) {
                        this.renderBreadcrumbList($('#breadcrumb').width());
                    }
                };
                ExplorerBreadcrumbView.prototype.getFolderPathByEv = function (ev) {
                    var folderPath = ev.target.getAttribute('data-folder-path');
                    return folderPath;
                };
                ExplorerBreadcrumbView.prototype.onDragOverBreadcrumb = function (ev) {
                    console.log('onDragOverBreadcrumb: ', ev);
                    var folderPath = this.getFolderPathByEv(ev);
                    if (typeof folderPath !== 'string') {
                        ev.originalEvent.dataTransfer.dropEffect = "none";
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    if (Explorer.Handler.dragAndDropHandler.isDroppable(folderPath)) {
                        if (this.isDragFromExternal(ev)) {
                            ev.originalEvent.dataTransfer.dropEffect = "copy";
                        }
                        else {
                            ev.originalEvent.dataTransfer.dropEffect = "move";
                        }
                    }
                    else {
                        ev.originalEvent.dataTransfer.dropEffect = "none";
                    }
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                };
                ExplorerBreadcrumbView.prototype.onDropBreadcrumb = function (ev) {
                    var _this = this;
                    console.log('onDropBreadcrumb: ', ev);
                    var folderPath = this.getFolderPathByEv(ev);
                    if (typeof folderPath !== 'string') {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var filepaths = [];
                    for (var i = 0; i < ev.originalEvent.dataTransfer.files.length; i++) {
                        filepaths.push(ev.originalEvent.dataTransfer.files[i].path);
                    }
                    if (filepaths.length <= 0) {
                        var draggingEntites = Explorer.Handler.dragAndDropHandler.getDraggingEntities();
                        Explorer.Handler.dragAndDropHandler.setCanClear(false);
                        var entryPaths = this.filterSyncFolderPathArray(draggingEntites);
                        if (entryPaths.length > 0) {
                            syncFolderPairStore.filterRemoteFolderContaninsPath(entryPaths, function (error, filterSyncFolderPair) {
                                if (!error) {
                                    if (filterSyncFolderPair.length > 0) {
                                        if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                            var syncRunningError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期中には、リネーム・削除・移動できません。');
                                            View.Dialog.openErrorDialog({
                                                message: $.i18n.t('dialog.error.message.89', { errorCode: DPMW.mwe.genUserErrorCode(syncRunningError) }),
                                                type: 'none',
                                            }, function () { });
                                            return;
                                        }
                                        View.Dialog.openYesNoDialog({
                                            type: 'warning',
                                            title: $.i18n.t('dialog.confirm.resetAndExit.title'),
                                            message: $.i18n.t('dialog.confirm.releaseSyncSettingByOperation.message'),
                                        }, function (res) {
                                            if (res === 0) {
                                                _this.removeSyncPair(filterSyncFolderPair)
                                                    .then(function () {
                                                    _this.onDropBreadcrumInternal(folderPath, filepaths);
                                                }).
                                                    catch(function (errorRemove) {
                                                    View.Dialog.openErrorDialog({
                                                        message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(errorRemove) }),
                                                        type: 'none',
                                                    }, function (response) {
                                                    });
                                                });
                                            }
                                            else {
                                                Explorer.Handler.dragAndDropHandler.setCanClear(true);
                                                if (Explorer.Handler.dragAndDropHandler.isDarggging()) {
                                                    Explorer.Handler.dragAndDropHandler.endDrag();
                                                }
                                                return;
                                            }
                                        });
                                    }
                                    else {
                                        _this.onDropBreadcrumInternal(folderPath, filepaths);
                                    }
                                }
                                else {
                                    _this.onDropBreadcrumInternal(folderPath, filepaths);
                                }
                            });
                        }
                        else {
                            this.onDropBreadcrumInternal(folderPath, filepaths);
                        }
                    }
                    else {
                        this.onDropBreadcrumInternal(folderPath, filepaths);
                    }
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                };
                ExplorerBreadcrumbView.prototype.onDropBreadcrumInternal = function (folderPath, filepaths) {
                    Explorer.Handler.dragAndDropHandler.drop(null, folderPath, filepaths, {
                        success: function () {
                            Explorer.Handler.dragAndDropHandler.setCanClear(true);
                            if (Explorer.Handler.dragAndDropHandler.isDarggging()) {
                                Explorer.Handler.dragAndDropHandler.endDrag();
                            }
                        },
                        error: function (err) {
                            Explorer.Handler.dragAndDropHandler.setCanClear(true);
                            if (Explorer.Handler.dragAndDropHandler.isDarggging()) {
                                Explorer.Handler.dragAndDropHandler.endDrag();
                            }
                            if (!err) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Error object does not passed');
                            }
                            var errCode = DPMW.mwe.genUserErrorCode(err);
                            var errorInfo = { msgId: null, type: null };
                            switch (err.mwCode) {
                                case DPMW.mwe.E_MW_CANCELLED:
                                    return;
                                case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                    errorInfo.msgId = 'dialog.error.message.65';
                                    errorInfo.type = 'none';
                                    break;
                                case DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED:
                                    if (err.cause && err.cause.path) {
                                        errorInfo.msgId = 'dialog.error.message.78';
                                        errorInfo.type = 'none';
                                        var dialogOptions_1 = {
                                            message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                            type: errorInfo.type,
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_1, function () { });
                                        return;
                                    }
                                    else {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    break;
                                case DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT:
                                    if (err.cause && err.cause.path) {
                                        errorInfo.msgId = 'dialog.error.message.14';
                                        errorInfo.type = 'none';
                                        var dialogOptions_2 = {
                                            message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                            type: errorInfo.type,
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_2, function () { });
                                        return;
                                    }
                                    else {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    break;
                                case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                    var statusCode = void 0;
                                    var webApiResCode = void 0;
                                    statusCode = err.mwWebApiResCode;
                                    if (err.cause && typeof err.cause.error_code === 'string') {
                                        webApiResCode = err.cause.error_code;
                                    }
                                    if (400 === statusCode) {
                                        if ('40001' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else if ('40002' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else if ('40006' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.74';
                                            errorInfo.type = 'none';
                                        }
                                        else if ('40007' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.79';
                                                errorInfo.type = 'none';
                                                var dialogOptions_3 = {
                                                    message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                };
                                                DPMW.View.Dialog.openErrorDialog(dialogOptions_3, function () { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if ('40010' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.14';
                                                errorInfo.type = 'none';
                                                var dialogOptions_4 = {
                                                    message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                };
                                                DPMW.View.Dialog.openErrorDialog(dialogOptions_4, function () { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if ('40011' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else if ('40012' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.79';
                                                errorInfo.type = 'none';
                                                var dialogOptions_5 = {
                                                    message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                };
                                                DPMW.View.Dialog.openErrorDialog(dialogOptions_5, function () { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if ('40017' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.79';
                                                errorInfo.type = 'none';
                                                var dialogOptions_6 = {
                                                    message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                };
                                                DPMW.View.Dialog.openErrorDialog(dialogOptions_6, function () { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else if (404 === statusCode) {
                                        if ('40401' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.79';
                                                errorInfo.type = 'none';
                                                var dialogOptions_7 = {
                                                    message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                };
                                                DPMW.View.Dialog.openErrorDialog(dialogOptions_7, function () { });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.75';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else if (408 === statusCode) {
                                        if ('40800' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.72';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else if (507 === statusCode) {
                                        if ('50701' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.23';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                        }
                                    }
                                    else {
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                    }
                                    break;
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            var dialogOptions = {
                                message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                type: errorInfo.type,
                            };
                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                        }
                    });
                };
                ExplorerBreadcrumbView.prototype.filterSyncFolderPathArray = function (selections) {
                    if (!_.isArray(selections)) {
                        throw new Error('Invalid argument.');
                    }
                    var entryPaths = [];
                    for (var i = 0; i < selections.length; i++) {
                        var model = selections[i];
                        var entryPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                        var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                        if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                            entryPaths.push(entryPath);
                        }
                    }
                    return entryPaths;
                };
                ExplorerBreadcrumbView.prototype.removeSyncPair = function (filterSyncFolderPair) {
                    return new Promise(function (resolve, reject) {
                        if (filterSyncFolderPair && filterSyncFolderPair.length > 0) {
                            var syncIds = new Array();
                            for (var i = 0; i < filterSyncFolderPair.length; i++) {
                                syncIds.push(filterSyncFolderPair[i].syncId);
                            }
                            syncFolderPairStore.removeMultiFolderPair(syncIds, function (error) {
                                if (!error) {
                                    resolve();
                                }
                                else {
                                    reject(error);
                                }
                            });
                        }
                        else {
                            resolve();
                        }
                    });
                };
                ExplorerBreadcrumbView.prototype.isDragFromExternal = function (ev) {
                    if (ev.originalEvent.dataTransfer.files.length > 0) {
                        return true;
                    }
                    return false;
                };
                return ExplorerBreadcrumbView;
            }(Backbone.View));
            Explorer.ExplorerBreadcrumbView = ExplorerBreadcrumbView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerBreadcrumbView.js.map