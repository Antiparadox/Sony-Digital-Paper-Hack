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
            var viewStatus = DPMW.View.Explorer.Status.viewStatus;
            var selectionStatus = DPMW.View.Explorer.Status.selectionStatus;
            var fileManageHandler = DPMW.View.Explorer.Handler.fileManageHandler;
            var fileTransferHandler = DPMW.View.Explorer.Handler.fileTransferHandler;
            var fetchHandler = DPMW.View.Explorer.Handler.fetchHandler;
            var Content = DPMW.Model.Content;
            var syncFolderPairStore = DPMW.Model.FolderSync.syncFolderPairStore;
            var syncHandler = DPMW.View.Explorer.Handler.syncHandler;
            var DiffType = DPMW.View.Explorer.Handler.DiffType;
            var ExplorerOperationView = (function (_super) {
                __extends(ExplorerOperationView, _super);
                function ExplorerOperationView(options) {
                    _super.call(this, options);
                    this.tabIndexArray = {};
                }
                ExplorerOperationView.prototype.initialize = function (options) {
                    var _this = this;
                    var me = this;
                    $.get('../templates/explorer_operationview.html', function (data) {
                        _this.$el.html(data);
                        _this.newFolderButton = $('#new-folder-button');
                        _this.syncAddButtonEl = $('#sync-button');
                        _this.syncAddButtonElTabIndex = +$(_this.syncAddButtonEl).attr('tabindex');
                        _this.tabIndexArray['#sync-button'] = _this.syncAddButtonElTabIndex;
                        _this.deleteButton = $('#delete-button');
                        _this.deleteButtonTabIndex = +$(_this.deleteButton).attr('tabindex');
                        _this.tabIndexArray['#delete-button'] = _this.deleteButtonTabIndex;
                        _this.pickButton = $('#pick-button');
                        _this.pickButtonTabIndex = +$(_this.pickButton).attr('tabindex');
                        _this.tabIndexArray['#pick-button'] = _this.pickButtonTabIndex;
                        _this.$el.localize();
                        _this.listenTo(viewStatus, 'viewTypeChanged', _this.onViewTypeChanged);
                        _this.listenTo(selectionStatus, 'selectionsChanged', _this.onSelectionsChanged);
                        _this.onViewTypeChanged();
                        _this.onSelectionsChanged();
                    }, 'html');
                    this.listenTo(syncFolderPairStore, 'syncFolderPairChanged', this.onSyncFolderPairChanged);
                    this.listenTo(this, 'keydown', function (e) {
                        if (e.which === 13 || e.which === 32) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }
                    });
                    this.listenTo(this, "keyup", function (e) {
                        e.stopPropagation();
                        var activeElement = document.activeElement;
                        var activeElementId = activeElement.id;
                        var activeElementTabindex = $(activeElement).attr('tabIndex');
                        var code = e.which;
                        switch (code) {
                            case 32:
                            case 13:
                                me.enterKeyOnButton(activeElementId, e);
                                break;
                            default:
                                break;
                        }
                    });
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (!error) {
                            _this.syncPairExists = pairs.length > 0;
                        }
                        else {
                            _this.syncPairExists = false;
                        }
                    });
                };
                ExplorerOperationView.prototype.events = function () {
                    return {
                        "click #new-folder-button": "onCreateNewFolder",
                        "click #pick-button": "onPick",
                        "click #delete-button": "onDelete",
                        "click #sync-button": "onSync"
                    };
                };
                ExplorerOperationView.prototype.enterKeyOnButton = function (activeElementId, event) {
                    var me = this;
                    switch (activeElementId) {
                        case 'new-folder-button':
                            me.onCreateNewFolder(event);
                            break;
                        case 'pick-button':
                            me.onPick(event);
                            break;
                        case 'delete-button':
                            me.onDelete(event);
                            break;
                        case 'sync-button':
                            me.onSync(event);
                            break;
                        default:
                            break;
                    }
                };
                ExplorerOperationView.prototype.onSyncFolderPairChanged = function (type, changeFile, syncStillLeft) {
                    this.syncPairExists = syncStillLeft;
                };
                ExplorerOperationView.prototype.onSelectionsChanged = function () {
                    if (selectionStatus.getSelections().length === 0) {
                        this.disableButton('#delete-button');
                        this.disableButton('#pick-button');
                    }
                    else {
                        this.enableButton('#delete-button');
                        this.enableButton('#pick-button');
                    }
                };
                ExplorerOperationView.prototype.onViewTypeChanged = function () {
                    if (viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER) {
                        this.$('#new-folder-button').show();
                    }
                    else {
                        this.$('#new-folder-button').hide();
                    }
                    this.disableButton('#delete-button');
                    this.disableButton('#pick-button');
                };
                ExplorerOperationView.prototype.onCreateNewFolder = function (ev) {
                    if (ev.target.parentElement.hasAttribute("disabled"))
                        return;
                    var dialogController = null;
                    var handler = {
                        submit: function (detail, dialogController) {
                            var editbox = detail.editbox;
                            if (editbox.indexOf('/') > -1) {
                                var err = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED, 'A destination designated by user is not allowed part.');
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.18', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) {
                                });
                                return;
                            }
                            dialogController.success();
                            DPMW.appCtrl.currentDevice.createFolder(viewStatus.getFolderId(), editbox, {
                                success: function () {
                                    fetchHandler.performFetchForUpdate(viewStatus.getFolderId(), {
                                        error: function (modelOrCollection, response, options) {
                                            var err = null;
                                            var msgId = null;
                                            if (typeof options.mwError === 'undefined') {
                                                msgId = 'dialog.error.message.75';
                                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                            }
                                            else {
                                                err = options.mwError;
                                                var mwCode = options.mwError.mwCode;
                                                if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                                    if (response.status === 400 &&
                                                        typeof response.responseJSON !== 'undefined' &&
                                                        typeof response.responseJSON.error_code === 'string' &&
                                                        response.responseJSON.error_code === '40002') {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                    else if (response.status === 400 &&
                                                        typeof response.responseJSON !== 'undefined' &&
                                                        typeof response.responseJSON.error_code === 'string' &&
                                                        response.responseJSON.error_code === '40005') {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                    else if (response.status === 404 &&
                                                        typeof response.responseJSON !== 'undefined' &&
                                                        typeof response.responseJSON.error_code === 'string' &&
                                                        response.responseJSON.error_code === '40401') {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                    else if (response.status === 408 &&
                                                        typeof response.responseJSON !== 'undefined' &&
                                                        typeof response.responseJSON.error_code === 'string' &&
                                                        response.responseJSON.error_code === '40800') {
                                                        msgId = 'dialog.error.message.72';
                                                    }
                                                    else if (response.status >= 400 && response.status < 500) {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                    else if (response.status >= 500 && response.status < 600) {
                                                        msgId = 'dialog.error.message.3';
                                                    }
                                                    else {
                                                        msgId = 'dialog.error.message.65';
                                                    }
                                                }
                                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                                    msgId = 'dialog.error.message.65';
                                                }
                                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                                    msgId = 'diPalog.error.message.65';
                                                }
                                                else {
                                                    msgId = 'dialog.error.message.75';
                                                }
                                            }
                                            View.Dialog.openErrorDialog({
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                            }, function (response) {
                                            });
                                        }
                                    });
                                },
                                error: function (modelOrCollection, response, options) {
                                    var err = null;
                                    var msgId = null;
                                    if (typeof options.mwError === 'undefined') {
                                        msgId = 'dialog.error.message.75';
                                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                    }
                                    else {
                                        err = options.mwError;
                                        var mwCode = options.mwError.mwCode;
                                        if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                            if (response.status === 400 &&
                                                typeof response.responseJSON !== 'undefined' &&
                                                typeof response.responseJSON.error_code === 'string' &&
                                                response.responseJSON.error_code === '40001') {
                                                msgId = 'dialog.error.message.75';
                                            }
                                            else if (response.status === 400 &&
                                                typeof response.responseJSON !== 'undefined' &&
                                                typeof response.responseJSON.error_code === 'string' &&
                                                response.responseJSON.error_code === '40006') {
                                                msgId = 'dialog.error.message.75';
                                            }
                                            else if (response.status === 400 &&
                                                typeof response.responseJSON !== 'undefined' &&
                                                typeof response.responseJSON.error_code === 'string' &&
                                                response.responseJSON.error_code === '40007') {
                                                msgId = 'dialog.error.message.22';
                                            }
                                            else if (response.status === 400 &&
                                                typeof response.responseJSON !== 'undefined' &&
                                                typeof response.responseJSON.error_code === 'string' &&
                                                response.responseJSON.error_code === '40012') {
                                                msgId = 'dialog.error.message.75';
                                            }
                                            else if (response.status === 408 &&
                                                typeof response.responseJSON !== 'undefined' &&
                                                typeof response.responseJSON.error_code === 'string' &&
                                                response.responseJSON.error_code === '40800') {
                                                msgId = 'dialog.error.message.72';
                                            }
                                            else if (response.status >= 400 && response.status < 500) {
                                                msgId = 'dialog.error.message.75';
                                            }
                                            else if (response.status >= 500 && response.status < 600) {
                                                msgId = 'dialog.error.message.3';
                                            }
                                            else {
                                                msgId = 'dialog.error.message.65';
                                            }
                                        }
                                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                            msgId = 'dialog.error.message.65';
                                        }
                                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                            msgId = 'diPalog.error.message.65';
                                        }
                                        else {
                                            msgId = 'dialog.error.message.75';
                                        }
                                    }
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                    }, function (response) {
                                    });
                                }
                            });
                        }
                    };
                    var initInfo = new DPMW.View.Dialog.DialogInfo.DialogEditInfo();
                    initInfo.title = $.i18n.t('dialog.edit.newFolder.title');
                    initInfo.message = $.i18n.t('dialog.edit.newFolder.message');
                    initInfo.masking = false;
                    dialogController = View.Dialog.createDialogEdit(initInfo, handler);
                };
                ExplorerOperationView.prototype.onSync = function (ev) {
                    var _this = this;
                    var selections = selectionStatus.getSelections();
                    if (selections.length !== 1) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.syncSettingCondition.title'),
                            message: $.i18n.t('dialog.notice.syncSettingCondition.message'),
                        }, function (response) { });
                        return;
                    }
                    if (!selections[0].isFolder()) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.syncSettingCondition.title'),
                            message: $.i18n.t('dialog.notice.syncSettingCondition.message'),
                        }, function (response) { });
                        return;
                    }
                    if (syncHandler.isSyncRunning()) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.syncAddSyncing.title'),
                            message: $.i18n.t('dialog.notice.syncAddSyncing.message'),
                        }, function (response) { });
                        return;
                    }
                    var model = selections[0];
                    var remotePath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    if (!this.syncPairExists) {
                        var dialogController = null;
                        var initInfo = new DPMW.View.Dialog.DialogInfo.DialogSyncIntroductionInfo();
                        var handler = {
                            closed: function () {
                                var dialog = require('electron').remote.dialog;
                                var remote = require('electron').remote;
                                viewStatus.increaseSysDialogCount();
                                dialog.showOpenDialog(remote.getCurrentWindow(), {
                                    properties: ["openDirectory"]
                                }, function (selectedDirPath) {
                                    viewStatus.decreaseSysDialogCount();
                                    if (_.isUndefined(selectedDirPath)) {
                                        return;
                                    }
                                    syncFolderPairStore.addFolderPair(selectedDirPath[0], remotePath, function (error, addedPair) {
                                        if (!error) {
                                            if (DPMW.Utils.getAutoSyncSetting() === DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_ON) {
                                                return;
                                            }
                                            var title = $.i18n.t('dialog.confirm.syncNow.title');
                                            var msg = $.i18n.t('dialog.confirm.syncNow.message');
                                            var dialogOptions = {
                                                title: title,
                                                message: msg
                                            };
                                            DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                                                if (response === 0) {
                                                    _this.syncAllPairs();
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            View.Dialog.openErrorDialog({
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                            }, function (response) {
                                            });
                                        }
                                    });
                                });
                            }
                        };
                        dialogController = View.Dialog.openDialogSyncIntroduction(initInfo, handler);
                    }
                    else {
                        syncFolderPairStore.getFolderPairs(function (error, pairs) {
                            if (!error) {
                                if (pairs.length >= Explorer.SYNC_FOLDER_MAX) {
                                    View.Dialog.openOkDialog({
                                        title: $.i18n.t('dialog.notice.syncAddMax.title'),
                                        message: $.i18n.t('dialog.notice.syncAddMax.message'),
                                    }, function (response) { });
                                }
                                else {
                                    var remotePathArray_1 = [];
                                    remotePathArray_1[0] = remotePath;
                                    syncFolderPairStore.filterSpecifiedPathIsRemoteFolderPath(remotePathArray_1, function (error, filteredPaths) {
                                        if (error) {
                                            var dialogOptions = {
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                            };
                                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                            return;
                                        }
                                        if (filteredPaths.length > 0) {
                                            View.Dialog.openOkDialog({
                                                title: $.i18n.t('dialog.notice.syncAddDuplicate.title'),
                                                message: $.i18n.t('dialog.notice.syncAddDuplicate.message'),
                                            }, function (response) { });
                                            return;
                                        }
                                        syncFolderPairStore.filterRegisteredRemoteFolderPathContainsSpecifiedPath(remotePathArray_1, function (error, filteredPaths) {
                                            if (!error) {
                                                if (filteredPaths.length > 0) {
                                                    View.Dialog.openOkDialog({
                                                        title: $.i18n.t('dialog.notice.syncAddSyncSubfolder.title'),
                                                        message: $.i18n.t('dialog.notice.syncAddSyncSubfolder.message'),
                                                    }, function (response) { });
                                                }
                                                else {
                                                    syncFolderPairStore.
                                                        filterSpecifiedPathContainsRegisteredRemoteFolderPath(remotePathArray_1, function (error, filteredPaths1) {
                                                        if (!error) {
                                                            if (filteredPaths1.length > 0) {
                                                                View.Dialog.openOkDialog({
                                                                    title: $.i18n.t('dialog.notice.syncAddIncludeSyncFolder.title'),
                                                                    message: $.i18n.t('dialog.notice.syncAddIncludeSyncFolder.message'),
                                                                }, function (response) { });
                                                            }
                                                            else {
                                                                _this.syncAddIntenal(remotePath);
                                                            }
                                                        }
                                                        else {
                                                            var dialogOptions = {
                                                                title: $.i18n.t('dialog.title.error'),
                                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                                            };
                                                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                var dialogOptions = {
                                                    title: $.i18n.t('dialog.title.error'),
                                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                                };
                                                DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                            }
                                        });
                                    });
                                }
                            }
                            else {
                                var dialogOptions = {
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                };
                                DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                            }
                        });
                    }
                };
                ExplorerOperationView.prototype.syncAddIntenal = function (remotePath) {
                    var _this = this;
                    var dialog = require('electron').remote.dialog;
                    var remote = require('electron').remote;
                    viewStatus.increaseSysDialogCount();
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        properties: ["openDirectory"]
                    }, function (selectedDirPathArray) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(selectedDirPathArray)) {
                            return;
                        }
                        var selectedDirPath = selectedDirPathArray[0];
                        var title = $.i18n.t('dialog.notice.addedSyncFolder.title');
                        var msgID = null;
                        var msgError;
                        syncFolderPairStore.getFolderPairs(function (error, pairs) {
                            if (!error) {
                                var localPath_1 = DPMW.Utils.PathUtils.canonicalize(selectedDirPath) + DPMW.Utils.PathUtils.SEPARATOR;
                                pairs.forEach(function (syncFolderPair, index) {
                                    var sycnLocalPath = DPMW.Utils.PathUtils.canonicalize(syncFolderPair.localFolderPath) + DPMW.Utils.PathUtils.SEPARATOR;
                                    if (sycnLocalPath === localPath_1) {
                                        msgID = 'dialog.error.message.85';
                                        msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'この処理の過程でフォルダー選択ダイアログが開かれ、選択されたフォルダーが同期設定されていた場合');
                                        return;
                                    }
                                    if (sycnLocalPath.indexOf(localPath_1) === 0) {
                                        msgID = 'dialog.error.message.80';
                                        msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'この処理の過程でフォルダー選択ダイアログが開かれ、選択されたフォルダーの子孫が同期設定されていた場合');
                                        return;
                                    }
                                    if (localPath_1.indexOf(sycnLocalPath) === 0) {
                                        msgID = 'dialog.error.message.83';
                                        msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'この処理の過程でフォルダー選択ダイアログが開かれ、選択されたフォルダーが同期設定されたフォルダーに含まれていた場合');
                                        return;
                                    }
                                });
                                if (msgID === null) {
                                    syncFolderPairStore.addFolderPair(selectedDirPath, remotePath, function (error2, addedPair) {
                                        if (!error) {
                                            if (DPMW.Utils.getAutoSyncSetting() === DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_ON) {
                                                return;
                                            }
                                            var title_1 = $.i18n.t('dialog.confirm.syncNow.title');
                                            var msg = $.i18n.t('dialog.confirm.syncNow.message');
                                            var dialogOptions = {
                                                title: title_1,
                                                message: msg
                                            };
                                            DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                                                if (response === 0) {
                                                    _this.syncAllPairs();
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            View.Dialog.openErrorDialog({
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error2) })
                                            }, function (response) {
                                            });
                                        }
                                    });
                                }
                                else {
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgID, { errorCode: DPMW.mwe.genUserErrorCode(msgError) })
                                    }, function (response) {
                                    });
                                }
                            }
                        });
                    });
                };
                ExplorerOperationView.prototype.syncAllPairs = function () {
                    var _this = this;
                    Explorer.Handler.syncHandler.syncAllPairs(Explorer.Handler.SyncType.Manual, {
                        success: function () {
                            _this.showSyncErrorDailog();
                        }, error: function (err) {
                            if (err.mwCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.35', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_UO_NOT_ALLOWED) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_CANCELLED) {
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_DEVICE_CONN_FAILED) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                var msgId = void 0;
                                if (typeof err.cause !== 'undefined' &&
                                    typeof err.cause.error_code === 'string') {
                                    if (err.mwWebApiResCode === 408 && err.cause.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (err.mwWebApiResCode === 507 && (err.cause.error_code === '50701' || err.cause.error_code === '50700')) {
                                        msgId = 'dialog.error.message.24';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40001') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40002') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40006') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40010') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40011') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode >= 400 && err.mwWebApiResCode <= 599) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.86';
                                    }
                                }
                                else {
                                    msgId = 'dialog.error.message.65';
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_FILE_SIZE_EXCEED) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.23', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.86', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                            }
                        }
                    });
                };
                ExplorerOperationView.prototype.showSyncErrorDailog = function () {
                    var syncErrorArray = Explorer.Handler.syncHandler.getLastErrors();
                    if (!_.isUndefined(syncErrorArray) && syncErrorArray.length > 0) {
                        var localResultArray = [];
                        var remoteResultArray = [];
                        for (var i = 0; i < syncErrorArray.length; i++) {
                            var error = syncErrorArray[i];
                            var reulst = void 0;
                            if (error.mwCode === DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND) {
                                var syncFolderPair = error.mwTarget;
                                reulst = {
                                    path: syncFolderPair.localFolderPath,
                                    process: $.i18n.t('sync.ngResult.proc.PCnoRoot'),
                                };
                                localResultArray.push(reulst);
                            }
                            else if (error.mwCode === DPMW.mwe.E_MW_SYNC_REMOTE_FOLDER_NOT_FOUND) {
                                var syncFolderPair = error.mwTarget;
                                reulst = {
                                    path: syncFolderPair.remoteFolderPath,
                                    process: $.i18n.t('sync.ngResult.proc.DPnoRoot'),
                                };
                                remoteResultArray.push(reulst);
                            }
                            else {
                                var failedSyncInfo = error.mwTarget;
                                var localDiffType = failedSyncInfo.localDiffType;
                                var remoteDiffType = failedSyncInfo.remoteDiffType;
                                if (localDiffType === DiffType.Stay) {
                                    if (remoteDiffType === DiffType.Stay) {
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCadd'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCupdate'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCdelete'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed.');
                                    }
                                }
                                else if (localDiffType === DiffType.Added) {
                                    if (remoteDiffType === DiffType.Stay) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPadd'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCupdate'),
                                        };
                                        remoteResultArray.push(reulst);
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPupdate'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed. ');
                                    }
                                }
                                else if (localDiffType === DiffType.Modified) {
                                    if (remoteDiffType === DiffType.Stay) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPupdate'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCupdate'),
                                        };
                                        remoteResultArray.push(reulst);
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPupdate'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPadd'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed. ');
                                    }
                                }
                                else if (localDiffType === DiffType.Removed) {
                                    if (remoteDiffType === DiffType.Stay) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPdelete'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCadd'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed. ');
                                    }
                                }
                                else {
                                    console.error('LocalDiffType is Failed. ');
                                }
                            }
                        }
                        var dialogController = null;
                        var initInfo = new DPMW.View.Dialog.DialogInfo.DialogSyncResultInfo();
                        initInfo.remoteResultArray = remoteResultArray;
                        initInfo.localResultArray = localResultArray;
                        var handler = {
                            submit: function (detail, dialogController) {
                                dialogController.success();
                            }
                        };
                        dialogController = View.Dialog.openDialogSyncResult(initInfo, handler);
                    }
                };
                ExplorerOperationView.prototype.onPick = function (ev) {
                    if (ev.target.parentElement.hasAttribute("disabled"))
                        return;
                    var dialog = require('electron').remote.dialog;
                    var remote = require('electron').remote;
                    viewStatus.increaseSysDialogCount();
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        properties: ["openDirectory"]
                    }, function (selectedDirPath) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(selectedDirPath)) {
                            return;
                        }
                        var dstDirPath = selectedDirPath[0];
                        var selections = selectionStatus.getSelections();
                        if (!selections || selections.length === 0) {
                            return;
                        }
                        fileTransferHandler.downloadDocuments(selections, dstDirPath, {
                            success: function () {
                                console.log('success');
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                if (errCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (errCode === DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED) {
                                    msgId = "dialog.error.message.78";
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgId, {
                                            errorCode: DPMW.mwe.genUserErrorCode(err),
                                            file: err.mwTargetName
                                        }),
                                    }, function (response) {
                                    });
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT) {
                                    msgId = 'dialog.error.message.74';
                                }
                                else if (errCode === DPMW.mwe.E_MW_CANCELLED) {
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED) {
                                    if (err.cause.code === 'ENOSPC') {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.23', {
                                                errorCode: DPMW.mwe.genUserErrorCode(err)
                                            }),
                                        }, function (response) {
                                        });
                                    }
                                    else {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.79', {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                    }
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    var responseJSON = err.cause;
                                    var statusCode = err.mwWebApiResCode;
                                    if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40002') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40005') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 404 &&
                                        responseJSON.error_code === '40401') {
                                        msgId = 'dialog.error.message.14';
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                        return;
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.78';
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                        return;
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) {
                                });
                            }
                        });
                    });
                };
                ExplorerOperationView.prototype.onDelete = function (ev) {
                    var _this = this;
                    if (ev.target.parentElement.hasAttribute("disabled"))
                        return;
                    var selections = selectionStatus.getSelections();
                    var msg = $.i18n.t('dialog.confirm.delete.message');
                    var title = $.i18n.t('func.fileDP.delete');
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (error) {
                            var dialogOptions = {
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                            };
                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                            return;
                        }
                        if (pairs.length > 0) {
                            _this.syncPairExists = true;
                            var entryPaths = _this.filterSyncFolderPathArray(selections);
                            if (entryPaths.length !== 0) {
                                syncFolderPairStore.filterRemoteFolderContaninsPath(entryPaths, function (error, filterSyncFolderPair) {
                                    if (!error) {
                                        if (filterSyncFolderPair.length !== 0) {
                                            if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                                var syncRunningError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期中には、リネーム・削除・移動できません。');
                                                View.Dialog.openOkDialog({
                                                    title: $.i18n.t('dialog.title.error'),
                                                    message: $.i18n.t('dialog.error.message.89', { errorCode: DPMW.mwe.genUserErrorCode(syncRunningError) }),
                                                }, function () { });
                                                return;
                                            }
                                            var removeMsg = $.i18n.t('dialog.confirm.releaseSyncSettingByOperation.message');
                                            var removeTitle = $.i18n.t('dialog.confirm.releaseSyncFolder.title');
                                            _this.showConfirmDialog(removeMsg, removeTitle, function (res) {
                                                if (res === 0) {
                                                    _this.removeSyncPair(filterSyncFolderPair)
                                                        .then(function () {
                                                        _this.deleteRecursively(selections.slice());
                                                    })
                                                        .catch(function (errorRemove) {
                                                        View.Dialog.openErrorDialog({
                                                            title: $.i18n.t('dialog.title.error'),
                                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(errorRemove) })
                                                        }, function (response) {
                                                        });
                                                    });
                                                }
                                                else {
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            _this.showConfirmDialog(msg, title, _this.deleteFileAndDoc.bind(_this));
                                        }
                                    }
                                    else {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                        }, function (response) {
                                        });
                                    }
                                });
                            }
                            else {
                                _this.showConfirmDialog(msg, title, _this.deleteFileAndDoc.bind(_this));
                            }
                        }
                        else {
                            _this.syncPairExists = false;
                            _this.showConfirmDialog(msg, title, _this.deleteFileAndDoc.bind(_this));
                        }
                    });
                };
                ExplorerOperationView.prototype.deleteFileAndDoc = function (index) {
                    if (index == 1) {
                        return;
                    }
                    var selections = selectionStatus.getSelections();
                    this.deleteRecursively(selections.slice());
                };
                ExplorerOperationView.prototype.deleteRecursively = function (selections) {
                    var _this = this;
                    if (selections.length === 0)
                        return;
                    var entity = selections.pop();
                    var entityType = entity.get(DPMW.Model.Content.ATTR_NAME_ENTRY_TYPE);
                    if (entityType === DPMW.Model.Content.VALUE_ENTRY_TYPE_FILE) {
                        fileManageHandler.deleteDocument(entity, {
                            success: function () {
                                selectionStatus.deleteOneSelection(entity);
                                _this.deleteRecursively(selections);
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 404 &&
                                        responseJSON.error_code === '40401') {
                                        return;
                                    }
                                    else if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) {
                                });
                            }
                        });
                    }
                    else {
                        fileManageHandler.deleteFolder(entity, {
                            success: function () {
                                selectionStatus.deleteOneSelection(entity);
                                _this.deleteRecursively(selections);
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 404 &&
                                        responseJSON.error_code === '40401') {
                                        return;
                                    }
                                    else if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) {
                                });
                            }
                        });
                    }
                };
                ExplorerOperationView.prototype.disableButton = function (id) {
                    this.$(id).addClass('ui-state-disabled');
                    this.$(id).attr('tabindex', -1);
                    this.$(id).blur();
                };
                ExplorerOperationView.prototype.enableButton = function (id) {
                    this.$(id).removeClass('ui-state-disabled');
                    var tabIndex = this.tabIndexArray[id];
                    this.$(id).attr('tabindex', tabIndex);
                };
                ExplorerOperationView.prototype.showConfirmDialog = function (msg, titile, callback) {
                    if (titile === void 0) { titile = 'Digital Papger Message'; }
                    View.Dialog.openYesNoDialog({
                        type: 'warning',
                        title: titile,
                        message: msg,
                    }, callback);
                };
                ExplorerOperationView.prototype.filterSyncFolderPathArray = function (selections) {
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
                ExplorerOperationView.prototype.removeSyncPair = function (filterSyncFolderPair) {
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
                return ExplorerOperationView;
            }(Backbone.View));
            Explorer.ExplorerOperationView = ExplorerOperationView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerOperationView.js.map