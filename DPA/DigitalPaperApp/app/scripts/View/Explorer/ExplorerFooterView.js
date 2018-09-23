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
            var ProgressHandler = DPMW.View.Explorer.Handler.transferProgressHandler;
            var SyncHandler = DPMW.View.Explorer.Handler.syncHandler;
            var DiffType = DPMW.View.Explorer.Handler.DiffType;
            var UPDATE_PROGRESS_INTERVAL = 100;
            var SYNC_RESULT_DISPLY_TIMER = 5 * 1000;
            var ExplorerFooterView = (function (_super) {
                __extends(ExplorerFooterView, _super);
                function ExplorerFooterView(options) {
                    _super.call(this, options);
                    this.isUploading = false;
                    this.isDownloading = false;
                    this.isSyncing = false;
                    this.filename = '';
                    this.syncResultTimeoutId = null;
                }
                ExplorerFooterView.prototype.initialize = function (options) {
                    var _this = this;
                    $.get('../templates/explorer_footerview.html', function (data) {
                        _this.$el.html(data);
                        _this.$el.localize();
                        _this.footerAutoSyncResultDiv = _this.$('#footer_auto_sync_result');
                        _this.footerAutoSyncResultLbl = _this.$('#footer_auto_sync_txt');
                        _this.syncFileTransferDiv = _this.$('#sync_file_transfer');
                        _this.syncProgressInfoDiv = _this.$('#sync_progress_info');
                        _this.syncTransferDiv = _this.$('#sync_transfer');
                        _this.listenTo(_this, 'resize', _this.centerContents);
                        _this.setUploadProgress(0, 0, 0);
                        _this.setDownloadProgress(0, 0, 0);
                        _this.listenTo(ProgressHandler, 'uploadProgressStarted', function () {
                            _this.isUploading = true;
                            _this.showUploadProgress();
                            _this.updateUploadProgressRepeatedly();
                            _this.centerContents();
                        });
                        _this.listenTo(ProgressHandler, 'uploadProgressFinished', function () {
                            _this.updateUploadProgress();
                            _this.dissmissUploadProgress();
                            _this.isUploading = false;
                        });
                        _this.listenTo(ProgressHandler, 'uploadStarted', function () {
                            _this.updateUploadProgress();
                        });
                        _this.listenTo(ProgressHandler, 'uploadSucceeded', function () {
                            _this.updateUploadProgress();
                        });
                        _this.listenTo(ProgressHandler, 'uploadFailed', function () {
                            _this.updateUploadProgress();
                        });
                        _this.listenTo(ProgressHandler, 'downloadProgressStarted', function () {
                            _this.isDownloading = true;
                            _this.showDownloadProgress();
                            _this.updateDownloadProgressRepeatedly();
                            _this.centerContents();
                        });
                        _this.listenTo(ProgressHandler, 'downloadProgressFinished', function () {
                            _this.isDownloading = false;
                            _this.updateDownloadProgress();
                            _this.dissmissDownloadProgress();
                        });
                        _this.listenTo(ProgressHandler, 'downloadStarted', function () {
                            _this.updateDownloadProgress();
                        });
                        _this.listenTo(ProgressHandler, 'downloadSucceeded', function () {
                            _this.updateDownloadProgress();
                        });
                        _this.listenTo(ProgressHandler, 'downloadFailed', function () {
                            _this.updateDownloadProgress();
                        });
                        _this.listenTo(SyncHandler, 'syncAllStart', function () {
                            if (_this.syncResultTimeoutId !== null) {
                                clearTimeout(_this.syncResultTimeoutId);
                                _this.syncResultTimeoutId = null;
                                _this.dissmissSyncProgress();
                            }
                            _this.isSyncing = true;
                            _this.showSyncProgress();
                        });
                        _this.listenTo(SyncHandler, 'syncAllSucceed', function () {
                            _this.isSyncing = false;
                            _this.updateSyncProgress();
                            _this.syncSuccesed();
                        });
                        _this.listenTo(SyncHandler, 'syncAllFailed', function (err, value) {
                            _this.isSyncing = false;
                            _this.updateSyncProgress();
                            _this.syncFailed(err, value);
                        });
                        _this.listenTo(SyncHandler, 'transferStart', function (value) {
                            var fileName = value.filename;
                            if (typeof fileName !== 'string' || fileName === '') {
                                return;
                            }
                            _this.filename = fileName;
                            _this.updateSyncProgress();
                        });
                        _this.listenTo(SyncHandler, 'transferSucceed', function () {
                            _this.updateSyncProgress();
                        });
                        _this.listenTo(SyncHandler, 'transferFailed', function (err, value) {
                            _this.updateSyncProgress();
                        });
                    }, 'html');
                };
                ExplorerFooterView.prototype.events = function () {
                    return {
                        "click #download_cancel": "onCancelDownload",
                        "click #upload_cancel": "onCancelUpload",
                        "click #sync_cancel": "onCancelSync",
                        "click #footer_auto_sync_txt": "onClickAutoSyncResult"
                    };
                };
                ExplorerFooterView.prototype.onClickAutoSyncResult = function (e) {
                    this.showSyncErrorDailog();
                };
                ExplorerFooterView.prototype.showSyncErrorDailog = function () {
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
                ExplorerFooterView.prototype.syncSuccesed = function () {
                    var _this = this;
                    this.syncFileTransferDiv.hide();
                    this.syncProgressInfoDiv.hide();
                    this.syncTransferDiv.hide();
                    this.footerAutoSyncResultDiv.show();
                    var error = SyncHandler.getLastErrors();
                    if (error && error.length <= 0) {
                        this.footerAutoSyncResultLbl.text($.i18n.t('content.sub.label.syncstate.complete'));
                        if (this.footerAutoSyncResultLbl.hasClass('btn')) {
                            this.footerAutoSyncResultLbl.removeClass('btn');
                        }
                        if (!this.footerAutoSyncResultLbl.hasClass('lbl')) {
                            this.footerAutoSyncResultLbl.addClass('lbl');
                        }
                    }
                    else {
                        this.footerAutoSyncResultLbl.text($.i18n.t('content.sub.label.syncstate.finish'));
                        if (this.footerAutoSyncResultLbl.hasClass('lbl')) {
                            this.footerAutoSyncResultLbl.removeClass('lbl');
                        }
                        if (!this.footerAutoSyncResultLbl.hasClass('btn')) {
                            this.footerAutoSyncResultLbl.addClass('btn');
                        }
                    }
                    if (this.syncResultTimeoutId !== null) {
                        clearTimeout(this.syncResultTimeoutId);
                    }
                    this.syncResultTimeoutId = setTimeout(function () {
                        _this.dissmissSyncProgress();
                    }, SYNC_RESULT_DISPLY_TIMER);
                };
                ExplorerFooterView.prototype.syncFailed = function (err, value) {
                    var _this = this;
                    this.syncFileTransferDiv.hide();
                    this.syncProgressInfoDiv.hide();
                    this.syncTransferDiv.hide();
                    if (err && err.mwCode &&
                        err.mwCode === DPMW.mwe.E_MW_CANCELLED) {
                        this.footerAutoSyncResultLbl.text($.i18n.t('content.sub.label.syncstate.abort'));
                    }
                    else {
                        this.footerAutoSyncResultLbl.text($.i18n.t('content.sub.label.syncstate.error'));
                    }
                    if (this.footerAutoSyncResultLbl.hasClass('btn')) {
                        this.footerAutoSyncResultLbl.removeClass('btn');
                    }
                    if (!this.footerAutoSyncResultLbl.hasClass('lbl')) {
                        this.footerAutoSyncResultLbl.addClass('lbl');
                    }
                    this.footerAutoSyncResultDiv.show();
                    if (this.syncResultTimeoutId !== null) {
                        clearTimeout(this.syncResultTimeoutId);
                    }
                    this.syncResultTimeoutId = setTimeout(function () {
                        _this.dissmissSyncProgress();
                    }, SYNC_RESULT_DISPLY_TIMER);
                };
                ExplorerFooterView.prototype.onCancelDownload = function (ev) {
                    View.Dialog.openYesNoDialog({
                        title: $.i18n.t('dialog.confirm.abortImporting.title'),
                        message: $.i18n.t('dialog.confirm.abortImporting.message'),
                    }, function (response) {
                        if (response === 0) {
                            ProgressHandler.cancelAllDownloadTasks(function (err) {
                                return;
                            });
                        }
                    });
                };
                ExplorerFooterView.prototype.onCancelUpload = function (ev) {
                    View.Dialog.openYesNoDialog({
                        title: $.i18n.t('dialog.confirm.abortExporting.title'),
                        message: $.i18n.t('dialog.confirm.abortExporting.message'),
                    }, function (response) {
                        if (response === 0) {
                            ProgressHandler.cancelAllUploadTasks(function (err) {
                                return;
                            });
                        }
                    });
                };
                ExplorerFooterView.prototype.onCancelSync = function (ev) {
                    View.Dialog.openYesNoDialog({
                        title: $.i18n.t('dialog.confirm.abortSync.title'),
                        message: $.i18n.t('dialog.confirm.abortSync.message'),
                    }, function (response) {
                        if (response === 0) {
                            $('#sync_cancel').addClass('disabled_button');
                            SyncHandler.cancelSync({ error: function (err) {
                                    return;
                                }
                            });
                        }
                    });
                };
                ExplorerFooterView.prototype.updateSyncProgress = function () {
                    this.updateSyncProgressbar();
                    this.centerContents();
                };
                ExplorerFooterView.prototype.updateSyncProgressbar = function () {
                    var allTransferedCount = SyncHandler.getSyncAllTransferedCount();
                    this.setSyncProgress(allTransferedCount, this.filename);
                };
                ExplorerFooterView.prototype.setSyncProgress = function (current, name) {
                    this.setSyncCurrent(current);
                    this.setSyncFilename(name);
                };
                ExplorerFooterView.prototype.setSyncFilename = function (fileName) {
                    $('#sync_file_name').text(fileName);
                };
                ExplorerFooterView.prototype.setSyncCurrent = function (current) {
                    if (typeof current !== 'number' || current < 0) {
                        return;
                    }
                    $('#sync_current').text(current);
                };
                ExplorerFooterView.prototype.showSyncProgress = function () {
                    this.footerAutoSyncResultDiv.hide();
                    this.syncTransferDiv.css('display', 'inline-block');
                    this.syncFileTransferDiv.show();
                    this.syncProgressInfoDiv.show();
                    $('#sync_progress').css({ 'height': 32 + 'px', 'visibility': 'visible' });
                    this.trigger('footerSizeChanged');
                    this.centerContents();
                };
                ExplorerFooterView.prototype.dissmissSyncProgress = function () {
                    this.syncResultTimeoutId = null;
                    $('#sync_progress').css({ 'height': 0 + 'px', 'visibility': 'hidden' });
                    $('#sync_file_name').text('');
                    $('#sync_current').text(0);
                    $('#sync_cancel').removeClass('disabled_button');
                    this.trigger('footerSizeChanged');
                    this.footerAutoSyncResultDiv.hide();
                    this.syncFileTransferDiv.show();
                    this.syncTransferDiv.css('display', 'inline-block');
                    this.syncProgressInfoDiv.show();
                };
                ExplorerFooterView.prototype.updateUploadProgressRepeatedly = function () {
                    this.updateUploadProgressbar();
                    var _this = this;
                    setTimeout(function () {
                        if (_this.isUploading) {
                            _this.updateUploadProgressRepeatedly();
                        }
                    }, UPDATE_PROGRESS_INTERVAL);
                };
                ExplorerFooterView.prototype.updateDownloadProgressRepeatedly = function () {
                    this.updateDownloadProgressbar();
                    var _this = this;
                    setTimeout(function () {
                        if (_this.isDownloading) {
                            _this.updateDownloadProgressRepeatedly();
                        }
                    }, UPDATE_PROGRESS_INTERVAL);
                };
                ExplorerFooterView.prototype.updateUploadProgressbar = function () {
                    var progress = ProgressHandler.getCurrentUploadProgress();
                    this.setUploadProgress(progress.currentFiles, progress.totalFiles, progress.progress);
                };
                ExplorerFooterView.prototype.updateUploadProgress = function () {
                    this.updateUploadProgressbar();
                    this.centerContents();
                };
                ExplorerFooterView.prototype.updateDownloadProgressbar = function () {
                    var progress = ProgressHandler.getCurrentDownloadProgress();
                    this.setDownloadProgress(progress.currentFiles, progress.totalFiles, progress.progress);
                };
                ExplorerFooterView.prototype.updateDownloadProgress = function () {
                    this.updateDownloadProgressbar();
                    this.centerContents();
                };
                ExplorerFooterView.prototype.setUploadProgress = function (current, total, progress) {
                    this.setUploadCurrent(current);
                    this.setUploadTotal(total);
                    this.setUploadProgressBar(progress);
                };
                ExplorerFooterView.prototype.setDownloadProgress = function (current, total, progress) {
                    this.setDownloadCurrent(current);
                    this.setDownloadTotal(total);
                    this.setDownloadProgressBar(progress);
                };
                ExplorerFooterView.prototype.setUploadCurrent = function (current) {
                    $('#upload_current').html(this.transferFormNumber(current, 'left'));
                };
                ExplorerFooterView.prototype.setUploadTotal = function (total) {
                    $('#upload_total').html(this.transferFormNumber(total, 'right'));
                };
                ExplorerFooterView.prototype.setDownloadCurrent = function (current) {
                    $('#download_current').html(this.transferFormNumber(current, 'left'));
                };
                ExplorerFooterView.prototype.setDownloadTotal = function (total) {
                    $('#download_total').html(this.transferFormNumber(total, 'right'));
                };
                ExplorerFooterView.prototype.transferFormNumber = function (count, position) {
                    if (count > 999) {
                        return '' + count;
                    }
                    else if (count > 99) {
                        if (position === 'right') {
                            return count + '<span class="invisible_number">0</span>';
                        }
                        else {
                            return '<span class="invisible_number">0</span>' + count;
                        }
                    }
                    else if (count > 9) {
                        if (position === 'right') {
                            return count + '<span class="invisible_number">00</span>';
                        }
                        else {
                            return '<span class="invisible_number">00</span>' + count;
                        }
                    }
                    else {
                        if (position === 'right') {
                            return count + '<span class="invisible_number">000</span>';
                        }
                        else {
                            return '<span class="invisible_number">000</span>' + count;
                        }
                    }
                };
                ExplorerFooterView.prototype.centerContents = function () {
                    var syncProgressDisplay = $('#sync_progress').css('visibility');
                    var downloadProgressDisplay = $('#download_progress').css('visibility');
                    var uploadProgressDisplay = $('#upload_progress').css('visibility');
                    var positionObject = this.adjustProgressPosition(2);
                    if (positionObject === null) {
                        console.warn('invalid status.');
                        return;
                    }
                    $('.file_transfer').css({ width: positionObject.width, 'margin-left': positionObject.margin });
                    if (syncProgressDisplay === 'visible') {
                        if ($('#footerspace').length <= 0 ||
                            $('.transfer_cancel').length < 3) {
                            console.warn('invalid status.');
                            return;
                        }
                        var rightPosition = $('#footerspace').width() - $('.transfer_cancel').get(2).offsetLeft - $($('.transfer_cancel').get(2)).width();
                        $('#sync_transfer').css({ 'right': rightPosition });
                        this.adjustFileNameLength();
                    }
                };
                ExplorerFooterView.prototype.adjustProgressPosition = function (sequence) {
                    if ($('#footerspace').length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var footerWidth = $('#footerspace').width();
                    if ($($('.file_transfer').get(sequence)).length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var fileTransferOuterWidth = $($('.file_transfer').get(sequence)).outerWidth();
                    if ($($('.progress').get(sequence)).length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var progressOuterWidth = $($('.progress').get(sequence)).outerWidth(true);
                    if ($($('.transfer_finish').get(sequence)).length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var transferFinishOuterWidth = $($('.transfer_finish').get(sequence)).outerWidth(true);
                    if ($($('.transfer_cancel').get(sequence)).length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var transferCancelOuterWidth = $($('.transfer_cancel').get(sequence)).outerWidth(true);
                    var margin = (footerWidth - fileTransferOuterWidth - progressOuterWidth
                        - transferFinishOuterWidth - transferCancelOuterWidth) / 2;
                    $($('.file_transfer').get(sequence)).css({ 'margin-left': margin + 'px' });
                    return { 'margin': margin, 'width': fileTransferOuterWidth };
                };
                ExplorerFooterView.prototype.adjustFileNameLength = function () {
                    if ($($('.progress').get(2)).length <= 0 ||
                        $($('.transfer_finish').get(2)).length <= 0 ||
                        $($('.transfer_finish').get(0)).length <= 0 ||
                        $($('.loading_icon').get(0)).length <= 0) {
                        console.warn('invalid status.');
                        return;
                    }
                    var max = $($('.progress').get(2)).width() + $($('.transfer_finish').get(2)).outerWidth(true)
                        - $($('.transfer_finish').get(0)).outerWidth(true) - $($('.loading_icon').get(0)).outerWidth(true);
                    if ($('#sync_file_name').length <= 0) {
                        console.warn('invalid status.');
                        return;
                    }
                    var strWidth = $('#sync_file_name').width();
                    var keyWord = $('#sync_file_name').text();
                    var len = keyWord.length;
                    var idx = len;
                    var text = '';
                    var prefix = $.i18n.t('content.navi.abbrev');
                    if (strWidth < 0 || max < 0) {
                        console.warn('invalid status.');
                        return;
                    }
                    if (strWidth > max) {
                        while (strWidth > max) {
                            if (idx <= 0) {
                                break;
                            }
                            text = keyWord.substring(0, idx);
                            strWidth = this.getTextWidth(text + prefix);
                            if (typeof strWidth !== 'number') {
                                return;
                            }
                            idx--;
                        }
                        $('#sync_file_name').text(text + prefix);
                    }
                };
                ExplorerFooterView.prototype.getTextWidth = function (str) {
                    var element = $('#sync_ruler');
                    if (element.length <= 0) {
                        console.warn('invalid status.');
                        return null;
                    }
                    var width = element.text(str).width();
                    element.empty();
                    return width;
                };
                ExplorerFooterView.prototype.setUploadProgressBar = function (progress) {
                    if (progress < 0 || 1 < progress) {
                        return;
                    }
                    $('#upload_progress_bar').css('width', progress * 100 + '%');
                };
                ExplorerFooterView.prototype.setDownloadProgressBar = function (progress) {
                    if (progress < 0 || 1 < progress) {
                        return;
                    }
                    $('#download_progress_bar').css('width', progress * 100 + '%');
                };
                ExplorerFooterView.prototype.showDownloadProgress = function () {
                    $('#download_progress').css({ 'height': 32 + 'px', 'visibility': 'visible' });
                    this.trigger('footerSizeChanged');
                };
                ExplorerFooterView.prototype.dissmissDownloadProgress = function () {
                    $('#download_progress').css({ 'height': 0 + 'px', 'visibility': 'hidden' });
                    this.trigger('footerSizeChanged');
                };
                ExplorerFooterView.prototype.showUploadProgress = function () {
                    $('#upload_progress').css({ 'height': 32 + 'px', 'visibility': 'visible' });
                    this.trigger('footerSizeChanged');
                };
                ExplorerFooterView.prototype.dissmissUploadProgress = function () {
                    $('#upload_progress').css({ 'height': 0 + 'px', 'visibility': 'hidden' });
                    this.trigger('footerSizeChanged');
                };
                return ExplorerFooterView;
            }(Backbone.View));
            Explorer.ExplorerFooterView = ExplorerFooterView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerFooterView.js.map