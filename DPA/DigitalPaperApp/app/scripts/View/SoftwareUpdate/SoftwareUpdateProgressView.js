var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var SoftwareUpdate;
        (function (SoftwareUpdate) {
            var UPDATE_PROGRESS_INTERVAL = 1000;
            var SoftwareUpdateProgressView = (function (_super) {
                __extends(SoftwareUpdateProgressView, _super);
                function SoftwareUpdateProgressView(options) {
                    _super.call(this, options);
                    this.startTime = 0;
                    this.isProgressing = true;
                    this.confirmDialogShow = false;
                }
                SoftwareUpdateProgressView.prototype.events = function () {
                    return {
                        'click #progress-cancel-button': this.cancel,
                        'keydown': this.keyHandler,
                    };
                };
                SoftwareUpdateProgressView.prototype.initialize = function () {
                    var _this = this;
                    this.listenTo(this, 'receiveProgress', this.updateProgress);
                    this.on('initValue', function (detail) {
                        _this.startTime = Date.now();
                        _this.updateProgress({ current: 0, total: 0 });
                        _this.render();
                    });
                    this.softwareUpdateProgressDialog = new SoftwareUpdate.SoftwareUpdateProgressDialog(this);
                    this.softwareUpdateProgressDialog.setBeforeCloseFunction(function () {
                        _this.cancel();
                        return false;
                    });
                    this.progressMessage = $('#download_transfer_progress');
                    this.requestProgressRepeatedly();
                    $('#download_progress_bar').css('width', 0);
                };
                SoftwareUpdateProgressView.prototype.render = function () {
                    if (this.softwareUpdateProgressDialog.initInfo.progressType === SoftwareUpdate.PROGRESS_TYPE.DOWNLOAD) {
                        this.progressMessage.text($.i18n.t('update.progress.downloadFile'));
                    }
                    else {
                        this.progressMessage.text($.i18n.t('update.progress.transferFile'));
                    }
                    return this;
                };
                SoftwareUpdateProgressView.prototype.cancel = function () {
                    if (this.confirmDialogShow === true) {
                        return;
                    }
                    else {
                        this.confirmDialogShow = true;
                    }
                    var _this = this;
                    var titleId = '';
                    var messageId = '';
                    if (this.softwareUpdateProgressDialog.initInfo.updateType === SoftwareUpdate.UPDATE_TYPE.APP) {
                        titleId = 'dialog.confirm.cancelDPAUpdate.title';
                        messageId = 'dialog.confirm.cancelDPAUpdate.message';
                    }
                    else {
                        titleId = 'dialog.confirm.cancelDPUpdate.title';
                        messageId = 'dialog.confirm.cancelDPUpdate.message';
                    }
                    View.Dialog.openYesNoDialog({
                        title: $.i18n.t(titleId),
                        message: $.i18n.t(messageId),
                    }, function (response) {
                        _this.confirmDialogShow = false;
                        if (response === 0) {
                            _this.isProgressing = false;
                            _this.softwareUpdateProgressDialog.cancel();
                            _this.softwareUpdateProgressDialog.closeDialog(_this.softwareUpdateProgressDialog);
                        }
                    });
                };
                SoftwareUpdateProgressView.prototype.updateProgress = function (progress) {
                    var currentBytes = progress.current;
                    var totalBytes = progress.total;
                    var remainBytes = totalBytes - currentBytes;
                    if (currentBytes === 0 || totalBytes === 0) {
                        $('#limit_time').text();
                        $('#remaining_time_unit').text();
                        return;
                    }
                    $('#download_current').text((currentBytes / 1024 / 1024).toFixed(2));
                    $('#download_total').text((totalBytes / 1024 / 1024).toFixed(2));
                    var progressRate = currentBytes / totalBytes * 100 + '%';
                    $('#download_progress_bar').css('width', progressRate);
                    var elapsedTime = Date.now() - this.startTime;
                    var remainSec = elapsedTime * remainBytes / currentBytes / 1000;
                    if (remainSec > 60) {
                        $('#limit_time').text(Math.ceil(remainSec / 60));
                        $('#remaining_time_unit').text($.i18n.t('app.words.minutes'));
                    }
                    else {
                        $('#limit_time').text(Math.ceil(remainSec));
                        $('#remaining_time_unit').text($.i18n.t('app.words.seconds'));
                    }
                };
                SoftwareUpdateProgressView.prototype.requestProgressRepeatedly = function () {
                    this.softwareUpdateProgressDialog.getProgress();
                    var _this = this;
                    setTimeout(function () {
                        if (_this.isProgressing) {
                            _this.requestProgressRepeatedly();
                        }
                    }, UPDATE_PROGRESS_INTERVAL);
                };
                SoftwareUpdateProgressView.prototype.keyHandler = function (e) {
                    var code = e.keyCode || e.which;
                    if (code == 27) {
                        this.cancel();
                    }
                };
                return SoftwareUpdateProgressView;
            }(Backbone.View));
            SoftwareUpdate.SoftwareUpdateProgressView = SoftwareUpdateProgressView;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateProgressView.js.map