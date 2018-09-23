var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var ExternalOutputDialog = (function (_super) {
                __extends(ExternalOutputDialog, _super);
                function ExternalOutputDialog(externalOutputView) {
                    _super.call(this, View.Dialog.DialogName.WINDOW_EXTERNAL_OUTPUT, externalOutputView);
                    this.elArticle = $('#external-output-view');
                    this.elScreenHeader = $('#screen-header');
                    this.elScreen = $('#screen');
                    this.elScreenshotButton = $('#screenshot-button');
                    this.screenshotButtonTabIndex = this.elScreenshotButton.attr('tabIndex');
                    this.elFullScreenButton = $('#fullscreen-button');
                    this.fullScreenButtonTabIndex = this.elFullScreenButton.attr('tabIndex');
                    this.isImageShown = false;
                    this.isScreenshotTaking = false;
                    this.isFullScreenMode = false;
                    this.shortcutKeyEnabled = true;
                    this.lastRenderingTime = -1;
                    this.screen = new ExternalOutput.Screen($('#screen'));
                    this.toast = new ExternalOutput.Toast($('#toast'));
                    this.debugBoard = new ExternalOutput.DebugBoard($('#debug-board'));
                    this.errorBoard = new ExternalOutput.ErrorBoard($('#error-board'));
                    var me = this;
                    this.imageCaptor = new ExternalOutput.ImageCaptor(this.channel, function (result) {
                        me.imageCaptorDone(result);
                    });
                    this.setBeforeCloseFunction(this.closing);
                    this.enableScreenshotButton();
                }
                ExternalOutputDialog.prototype.setInitValue = function (info) {
                    this.initInfo = info;
                    this.toast.show('func.dp.toast.howToEnterFullScreenMode', 'long');
                    this.imageCaptor.capture();
                };
                ExternalOutputDialog.prototype.closing = function () {
                    if (this.isFullScreenMode) {
                        this.requestLeaveFullScreen();
                        return false;
                    }
                    else {
                        this.imageCaptor.dispose();
                        return true;
                    }
                };
                ExternalOutputDialog.prototype.hookKeyDownHandler = function (me, e) {
                    var activeElementTabindex = me.getActiveElementTabIndex();
                    if (e.which === 9) {
                        e.preventDefault();
                        if (me.elScreenshotButton.attr('tabIndex') !== me.screenshotButtonTabIndex) {
                            me.elFullScreenButton.focus();
                        }
                        else if (activeElementTabindex === me.screenshotButtonTabIndex) {
                            me.elFullScreenButton.focus();
                        }
                        else {
                            me.elScreenshotButton.focus();
                        }
                        return true;
                    }
                    else if ((e.which === 13) || (e.which === 32)) {
                        e.preventDefault();
                        if (activeElementTabindex === me.screenshotButtonTabIndex) {
                            me.takeScreenshot();
                        }
                        else if (activeElementTabindex === me.fullScreenButtonTabIndex) {
                            me.requestEnterFullScreen();
                        }
                        return true;
                    }
                    else if ((e.which === 27) && (me.shortcutKeyEnabled)) {
                        e.preventDefault();
                        if (me.isFullScreenMode) {
                            me.requestLeaveFullScreen();
                        }
                        else {
                            me.closeDialog(me);
                        }
                        if (process.platform !== 'darwin') {
                            me.shortcutKeyEnabled = false;
                        }
                        return true;
                    }
                    else if ((e.which === 70) && (me.shortcutKeyEnabled)) {
                        e.preventDefault();
                        if (me.isFullScreenMode) {
                            me.requestLeaveFullScreen();
                        }
                        else {
                            me.requestEnterFullScreen();
                        }
                        if (process.platform !== 'darwin') {
                            me.shortcutKeyEnabled = false;
                        }
                        return true;
                    }
                    return false;
                };
                ExternalOutputDialog.prototype.hookKeyUpHandler = function (me, e) {
                    if (process.platform !== 'darwin' && (e.which === 27) || (e.which === 70)) {
                        me.shortcutKeyEnabled = true;
                        return true;
                    }
                    return false;
                };
                ExternalOutputDialog.prototype.requestEnterFullScreen = function () {
                    this.ipc.send(this.channel, View.Dialog.IpcMessage.CHILD_TO_MAIN.REQUEST_ENTER_FULL_SCREEN);
                };
                ExternalOutputDialog.prototype.requestLeaveFullScreen = function () {
                    this.ipc.send(this.channel, View.Dialog.IpcMessage.CHILD_TO_MAIN.REQUEST_LEAVE_FULL_SCREEN);
                };
                ExternalOutputDialog.prototype.setDefaultFocus = function () {
                    this.elScreenshotButton.focus();
                    this.elScreenshotButton.addClass('outline-clear');
                };
                ExternalOutputDialog.prototype.enteredFullScreen = function () {
                    this.elArticle.css('background-color', '#000000');
                    this.elScreenHeader.hide();
                    this.toast.show('func.dp.toast.howToLeaveFullScreenMode', 'long');
                    this.isFullScreenMode = true;
                };
                ExternalOutputDialog.prototype.leftFullScreen = function () {
                    this.elArticle.css('background-color', '#202020');
                    this.elScreenHeader.show();
                    this.toast.show('func.dp.toast.howToEnterFullScreenMode', 'long');
                    this.isFullScreenMode = false;
                };
                ExternalOutputDialog.prototype.resultOfTryToAuth = function (detail) {
                    this.imageCaptor.capture();
                };
                ExternalOutputDialog.prototype.imageCaptorDone = function (result) {
                    var me = this;
                    var renderingTime = -1;
                    if (result) {
                        if (!result.errorCode) {
                            me.imageCaptor.capture();
                            if (result.xhrReq && result.xhrReq.response) {
                                me.errorBoard.hide();
                                me.screen.setSource(result.xhrReq.response);
                                me.isImageShown = true;
                                me.enableScreenshotButton();
                                renderingTime = new Date().getTime();
                            }
                        }
                        else {
                            if ((result.xhrReq) && (result.xhrReq.status === 401)) {
                                me.ipc.send(this.channel, View.Dialog.IpcMessage.CHILD_TO_MAIN.TRY_TO_AUTH);
                            }
                            else {
                                setTimeout(function () {
                                    me.imageCaptor.capture();
                                }, 1000 * 5);
                            }
                            if (!me.errorBoard.isShown()) {
                                me.screen.clearSource();
                                me.errorBoard.show(result.errorCode, result.messageId);
                                me.isImageShown = false;
                                me.enableScreenshotButton();
                            }
                        }
                    }
                    if (renderingTime >= 0) {
                        if (me.lastRenderingTime >= 0) {
                            var elapsedTime = renderingTime - me.lastRenderingTime;
                        }
                        me.lastRenderingTime = renderingTime;
                    }
                    else {
                        me.lastRenderingTime = -1;
                        me.debugBoard.hide();
                    }
                };
                ExternalOutputDialog.prototype.takeScreenshot = function () {
                    var me = this;
                    me.isScreenshotTaking = true;
                    me.enableScreenshotButton();
                    var screenshotTaker = new ExternalOutput.ScreenshotTaker(this.channel);
                    screenshotTaker.take(function () {
                        me.isScreenshotTaking = false;
                        me.enableScreenshotButton();
                    });
                };
                ExternalOutputDialog.prototype.enableScreenshotButton = function () {
                    var enabled = this.isImageShown && !this.isScreenshotTaking;
                    if (enabled) {
                        this.elScreenshotButton.removeClass('btn-disabled');
                        this.elScreenshotButton.attr('tabindex', 1);
                    }
                    else {
                        if (this.getActiveElementTabIndex() === this.screenshotButtonTabIndex) {
                            this.elArticle.focus();
                        }
                        this.elScreenshotButton.addClass('btn-disabled');
                        this.elScreenshotButton.attr('tabindex', -1);
                    }
                };
                ExternalOutputDialog.prototype.getActiveElementTabIndex = function () {
                    var activeElement = document.activeElement;
                    if (activeElement) {
                        var activeElementTabindex = activeElement.getAttribute('tabIndex');
                        if (typeof activeElementTabindex === 'string') {
                            var n = Number(activeElementTabindex);
                            if ((n >= 1) && (n <= 99)) {
                                return activeElementTabindex;
                            }
                        }
                    }
                    return '-1';
                };
                return ExternalOutputDialog;
            }(View.Dialog.DialogBase));
            ExternalOutput.ExternalOutputDialog = ExternalOutputDialog;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExternalOutputDialog.js.map