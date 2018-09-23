var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var DialogBase = (function () {
                function DialogBase(dialogName, receiverView) {
                    this.loadingDialogController = null;
                    this.connectingDialogController = null;
                    this.beforeCloseFunction = function () { return true; };
                    this.dialogName = dialogName;
                    this.ipc = require('electron').ipcRenderer;
                    this.curWin = require('electron').remote.getCurrentWindow();
                    this.firstItem = $('[tabindex=1]');
                    this.lastItem = $('[tabindex=99]');
                    this.submitButton = $('#submit-button');
                    this.cancelButton = $('#cancel-button');
                    this.receiverView = receiverView;
                    this.eventPreventation();
                    this.eventRegistration();
                }
                DialogBase.prototype.eventRegistration = function () {
                    var _this = this;
                    var me = this;
                    this.channel = 'channel4Child-' + this.dialogName + '-' + new Date().toISOString();
                    this.submitButton.on('click', function (ev) {
                        _this.submit(me);
                    });
                    this.cancelButton.on('click', function () {
                        me.ipc.send(me.channel, Dialog.IpcMessage.CHILD_TO_MAIN.CANCEL, null);
                        me.closeDialog(me);
                    });
                    this.ipc.on(this.channel, function (e, message, detail) {
                        console.log(message);
                        console.log(detail);
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.INIT_INFO) {
                            me.setInitValue(detail);
                            $('body').show();
                            me.setDefaultFocus();
                            me.ipc.send(me.channel, Dialog.IpcMessage.CHILD_TO_MAIN.FINISH_INIT);
                            if (me.receiverView) {
                                me.receiverView.trigger('initValue', detail);
                            }
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.DIALOG_ON_CLOSE) {
                            if (me.beforeCloseFunction()) {
                                me.closeDialog(me);
                            }
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.SUBMIT_SUCCEED) {
                            me.submitSuccess(e, detail, me);
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.SUBMIT_FAILED) {
                            me.submitFailure(e, detail, me);
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.PROGRESS) {
                            me.receiveProgress(detail);
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.OPEN_DIALOG_CONNECTING) {
                            me.openDialogConnecting();
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.CLOSE_DIALOG_CONNECTING) {
                            me.closeDialogConnecting();
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.ENTERED_FULL_SCREEN) {
                            me.enteredFullScreen();
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.LEFT_FULL_SCREEN) {
                            me.leftFullScreen();
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.RESULT_OF_TRY_TO_AUTH) {
                            me.resultOfTryToAuth(detail);
                        }
                        if (message === Dialog.IpcMessage.MAIN_TO_CHILD.IMAGE_CAPTURED) {
                            me.imageCaptured(detail);
                        }
                    });
                    this.keyDownHandler();
                    this.keyUpHandler();
                    this.mouseDownHandler();
                    var dialogChannelEntry = this.dialogName + '-channelEntry';
                    $('article').localize();
                    this.ipc.send(dialogChannelEntry, this.channel);
                };
                DialogBase.prototype.keyDownHandler = function () {
                    var me = this;
                    $('body').on('keydown', function (e) {
                        if (process.platform === 'darwin' && me.curWin.getChildWindows().length > 0) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        var handled = me.hookKeyDownHandler(me, e);
                        if (!handled) {
                            var activeElement = document.activeElement;
                            var activeElementId = activeElement.id;
                            var activeElementTabindex = activeElement.getAttribute('tabIndex');
                            var tagName = activeElement.tagName;
                            var tagType = activeElement.getAttribute('type');
                            var activeElementType;
                            if (tagName === 'BUTTON' || (tagName === 'INPUT' && tagType === 'button')) {
                                activeElementType = 'btn';
                            }
                            else if (tagName === 'INPUT' && tagType === 'text') {
                                activeElementType = 'edit';
                            }
                            else if (tagName === 'LABEL' && activeElement.hasAttribute('isRadioLabel')) {
                                activeElementType === 'radioLabel';
                            }
                            switch (e.which) {
                                case 27:
                                    me.onEsc(me);
                                    break;
                                case 32:
                                    if (activeElementType === 'btn') {
                                        e.preventDefault();
                                    }
                                    break;
                                case 13:
                                    if (activeElementType === 'btn') {
                                        e.preventDefault();
                                    }
                                    else if (activeElementType === 'edit') {
                                        e.preventDefault();
                                    }
                                    break;
                                case 9:
                                    if (e.shiftKey) {
                                        if (activeElementTabindex === "" || activeElementTabindex === '0' || activeElementTabindex === '1' || activeElementTabindex === '-1' || activeElementTabindex === undefined || activeElementId === me.firstItem.attr('id')) {
                                            e.preventDefault();
                                            me.lastItem.focus();
                                        }
                                    }
                                    else {
                                        if (activeElementTabindex === "" || activeElementTabindex === '0' || activeElementTabindex === '99' || activeElementTabindex === '-1' || activeElementTabindex === undefined) {
                                            e.preventDefault();
                                            me.firstItem.focus();
                                        }
                                    }
                                    $(activeElement).removeClass('tag-radio-outline-appear');
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                };
                DialogBase.prototype.hookKeyDownHandler = function (me, e) {
                    return false;
                };
                DialogBase.prototype.keyUpHandler = function () {
                    var me = this;
                    $('body').on('keyup', function (e) {
                        if (process.platform === 'darwin' && me.curWin.getChildWindows().length > 0) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        var handled = me.hookKeyUpHandler(me, e);
                        if (!handled) {
                            var activeElement = document.activeElement;
                            var activeElementId = activeElement.id;
                            var activeElementTabindex = activeElement.getAttribute('tabIndex');
                            var tagName = activeElement.tagName;
                            var tagType = activeElement.getAttribute('type');
                            var activeElementType;
                            if (tagName === 'BUTTON' || (tagName === 'INPUT' && tagType === 'button')) {
                                activeElementType = 'btn';
                            }
                            else if (tagName === 'INPUT' && tagType === 'text') {
                                activeElementType = 'edit';
                            }
                            else if (tagName === 'LABEL' && activeElement.hasAttribute('isRadioLabel')) {
                                activeElementType === 'radioLabel';
                            }
                            switch (e.which) {
                                case 13:
                                    if (activeElementType === 'btn') {
                                        if (e.which === 13 || e.which === 32) {
                                            $(e.target).trigger('click');
                                        }
                                    }
                                    else if (activeElementType === 'edit') {
                                        e.preventDefault();
                                        var isDisabled = me.submitButton.prop('disabled');
                                        if (me.submitButton.length > 0 && me.submitButton.prop("disabled") === false &&
                                            me.submitButton.is(':visible') && me.submitButton.css('visibility') === "visible") {
                                            me.submitButton.click();
                                        }
                                    }
                                    break;
                                case 32:
                                    if (activeElementType === 'btn') {
                                        if (e.which === 13 || e.which === 32) {
                                            $(e.target).trigger('click');
                                        }
                                    }
                                    break;
                                case 9:
                                    $(activeElement).removeClass('outline-clear');
                                    $(activeElement).removeClass('radio-border-clear').addClass('tag-radio-outline-appear rest');
                                    if (activeElementTabindex === "" || activeElementTabindex === '0' || activeElementTabindex === undefined) {
                                        e.preventDefault();
                                        me.firstItem.focus();
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                };
                DialogBase.prototype.hookKeyUpHandler = function (me, e) {
                    return false;
                };
                DialogBase.prototype.mouseDownHandler = function () {
                    $("body").on("mousedown", "*", function (e) {
                        if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
                            $(this).css("outline", "none").on("blur", function () {
                                $(this).off("blur").css("outline", "");
                                $(this).addClass('outline-clear');
                            });
                        }
                    });
                };
                ;
                DialogBase.prototype.eventPreventation = function () {
                    var body = $('body');
                    body.on('dragover', this.onDragOverPrevent.bind(this));
                    body.on('drop', this.onDropPrevent.bind(this));
                };
                DialogBase.prototype.onDragOverPrevent = function (ev) {
                    ev.originalEvent.dataTransfer.dropEffect = 'none';
                    ev.preventDefault();
                };
                DialogBase.prototype.onDropPrevent = function (ev) {
                    ev.preventDefault();
                };
                DialogBase.prototype.onEsc = function (me) {
                    me.cancelButton.click();
                };
                DialogBase.prototype.dialogRelay = function (dialogRelayInfo) {
                    this.ipc.send(this.channel, Dialog.IpcMessage.CHILD_TO_MAIN.DIALOG_RELAY, dialogRelayInfo);
                };
                DialogBase.prototype.receiveProgress = function (info) {
                    this.receiverView.trigger('receiveProgress', info);
                };
                DialogBase.prototype.getProgress = function () {
                    this.ipc.send(this.channel, Dialog.IpcMessage.CHILD_TO_MAIN.GET_PROGRESS);
                };
                DialogBase.prototype.setInitValue = function (info) {
                };
                DialogBase.prototype.setDefaultFocus = function () {
                };
                DialogBase.prototype.getUserInput = function () {
                    var userInput = {};
                    return userInput;
                };
                DialogBase.prototype.setBeforeCloseFunction = function (beforeCloseFunction) {
                    this.beforeCloseFunction = beforeCloseFunction;
                };
                DialogBase.prototype.submit = function (me, data) {
                    var submitData;
                    if (data) {
                        submitData = data;
                    }
                    else {
                        submitData = me.getUserInput();
                    }
                    var submitFunction = function (message) {
                        console.log(message);
                        console.log('SUBMIT : ' + JSON.stringify(submitData));
                        me.ipc.send(me.channel, Dialog.IpcMessage.CHILD_TO_MAIN.SUBMIT, submitData);
                    };
                    me.BeforeSubmit(submitFunction);
                };
                DialogBase.prototype.BeforeSubmit = function (submitFunction) {
                    console.log('BeforeSubmit nothing');
                    submitFunction();
                };
                DialogBase.prototype.submitSuccess = function (e, detail, me) {
                    console.log('submitSuccess');
                    if (me.loadingDialogController) {
                        console.log('close loading dialog');
                        me.loadingDialogController.close();
                        me.loadingDialogController = null;
                    }
                    me.closeDialog(me);
                };
                DialogBase.prototype.submitFailure = function (e, detail, me) {
                    var isPanAbnormalErr = detail && detail.message === $.i18n.t('dialog.notice.btUnrecoverableError.message');
                    if (isPanAbnormalErr) {
                        if (me.panAbnormalDisplayed) {
                            return;
                        }
                        else {
                            me.panAbnormalDisplayed = true;
                        }
                    }
                    else {
                        if (me.loadingDialogController) {
                            console.log('error dialog closed');
                            console.log('close loading dialog');
                            me.loadingDialogController.close();
                            me.loadingDialogController = null;
                        }
                    }
                    View.Dialog.openErrorDialog({
                        title: detail && typeof detail.title === 'string' ? detail.title : $.i18n.t('dialog.title.error'),
                        message: detail && typeof detail.message === 'string' ? detail.message : '',
                        type: detail && typeof detail.type === 'string' ? detail.type : 'none',
                    }, function (response) {
                        if (isPanAbnormalErr) {
                            me.panAbnormalDisplayed = false;
                        }
                    });
                };
                DialogBase.prototype.loadingCancel = function (me) {
                    me.noticeCancelled(me);
                };
                DialogBase.prototype.cancel = function () {
                    this.ipc.send(this.channel, Dialog.IpcMessage.CHILD_TO_MAIN.CANCEL, null);
                };
                DialogBase.prototype.checkCloseDialog = function (me) {
                    if (me.beforeCloseFunction()) {
                        me.closeDialog(me);
                    }
                };
                DialogBase.prototype.closeDialog = function (me) {
                    me.ipc.send(me.channel, Dialog.IpcMessage.CHILD_TO_MAIN.CLOSE_DIALOG);
                };
                DialogBase.prototype.noticeCancelled = function (me) {
                    me.ipc.send(me.channel, Dialog.IpcMessage.CHILD_TO_MAIN.LOADING_CANCEL, null);
                };
                DialogBase.prototype.openDialogConnecting = function () {
                    var _this = this;
                    if (this.connectingDialogController) {
                        return;
                    }
                    var handler = {
                        closed: function () {
                            _this.connectingDialogController = null;
                        }
                    };
                    var initData = new Dialog.DialogInfo.DialogLoadingInfo();
                    initData.cancelable = false;
                    initData.message = $.i18n.t('dialog.nobtn.wait.message');
                    initData.title = $.i18n.t('dialog.nobtn.wait.title');
                    this.connectingDialogController = Dialog.createDialogLoading(initData, handler);
                };
                DialogBase.prototype.closeDialogConnecting = function () {
                    if (this.connectingDialogController) {
                        this.connectingDialogController.close();
                    }
                };
                DialogBase.prototype.enteredFullScreen = function () {
                };
                DialogBase.prototype.leftFullScreen = function () {
                };
                DialogBase.prototype.resultOfTryToAuth = function (detail) {
                };
                DialogBase.prototype.imageCaptured = function (detail) {
                };
                return DialogBase;
            }());
            Dialog.DialogBase = DialogBase;
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogBase.js.map