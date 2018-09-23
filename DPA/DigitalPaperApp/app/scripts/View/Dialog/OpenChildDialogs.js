var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var ENABLE_MODAL = (process.platform !== 'darwin');
            var ENABLE_PSEUDO_MODAL = (process.platform === 'darwin');
            var pseudoModalCount = 0;
            function startPseudoModal() {
                if (ENABLE_PSEUDO_MODAL) {
                    pseudoModalCount++;
                    console.log('startPseudoModal() : ENABLE_PSEUDO_MODAL');
                    var elm = document.getElementById('modal-lock-panel');
                    if (elm) {
                        elm.style.removeProperty('visibility');
                    }
                }
            }
            Dialog.startPseudoModal = startPseudoModal;
            function endPseudoModal() {
                if (ENABLE_PSEUDO_MODAL) {
                    pseudoModalCount--;
                    if (pseudoModalCount > 0) {
                        return;
                    }
                    if (pseudoModalCount < 0) {
                        console.error('can not be happend');
                        pseudoModalCount = 0;
                    }
                    console.log('endPseudoModal() : ENABLE_PSEUDO_MODAL');
                    var elm = document.getElementById('modal-lock-panel');
                    if (elm) {
                        elm.style.setProperty('visibility', 'hidden');
                    }
                }
            }
            Dialog.endPseudoModal = endPseudoModal;
            function createWiFiWPSButtonDialog(initData, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_wps_countdown.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_WPS_COUNTDOWN;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.CANCEL) {
                        if (typeof handler.canceled === 'function') {
                            handler.canceled(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var options = {
                    width: 430,
                    height: 180,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: initData.title,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.createWiFiWPSButtonDialog = createWiFiWPSButtonDialog;
            function createWiFiWPSPinDialog(initData, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_wps_countdown.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_WPS_COUNTDOWN;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.CANCEL) {
                        if (typeof handler.canceled === 'function') {
                            handler.canceled(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var options = {
                    width: 450,
                    height: 230,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: initData.title,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.createWiFiWPSPinDialog = createWiFiWPSPinDialog;
            function createDialogLoading(initData, handler, pseudoModal) {
                if ((typeof pseudoModal !== 'boolean') || pseudoModal) {
                    startPseudoModal();
                }
                var dialogURL = CDP.Framework.toUrl("/index_dialog_loading.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_LOADING;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_SHOWED) {
                        if (typeof handler.dialogShowed === 'function') {
                            handler.dialogShowed(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.CANCEL) {
                        if (typeof handler.canceled === 'function') {
                            handler.canceled(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        if ((typeof pseudoModal !== 'boolean') || pseudoModal) {
                            endPseudoModal();
                        }
                    }
                });
                var options = {
                    width: 450,
                    height: initData.cancelable ? 180 : 180 - 48,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: initData.title,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.createDialogLoading = createDialogLoading;
            function createDialogEdit(initData, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_edit.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_EDIT;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.CANCEL) {
                        if (typeof handler.canceled === 'function') {
                            handler.canceled(dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var options = {
                    width: 500,
                    height: 220,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: initData.title,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.createDialogEdit = createDialogEdit;
            var DialogController = (function () {
                function DialogController(name, channel) {
                    this.ipc = require('electron').ipcRenderer;
                    this.dialogName = name;
                    this.channel4Parent = channel;
                    var me = this;
                    this.ipc.on(channel, function (e, message, detail) {
                        if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                            me.childWin = require('electron').remote.BrowserWindow.fromId(detail.childWinId);
                        }
                    });
                }
                DialogController.prototype.focus = function () {
                    this.childWin.focus();
                };
                DialogController.prototype.getDialogName = function () {
                    return this.dialogName;
                };
                DialogController.prototype.close = function () {
                    this.ipc.send(this.channel4Parent, Dialog.IpcMessage.PARENT_TO_MAIN.CLOSE_DIALOG, null);
                };
                DialogController.prototype.success = function () {
                    this.ipc.send(this.channel4Parent, Dialog.IpcMessage.PARENT_TO_MAIN.SUBMIT_SUCCEED, null);
                };
                DialogController.prototype.error = function (err) {
                    this.ipc.send(this.channel4Parent, Dialog.IpcMessage.PARENT_TO_MAIN.SUBMIT_FAILED, err);
                };
                DialogController.prototype.sendProgress = function (progress) {
                    this.ipc.send(this.channel4Parent, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_PROGRESS, progress);
                };
                DialogController.prototype.openDialogConnecting = function () {
                    var _this = this;
                    if (this.childWin) {
                        this.ipc.send(this.channel4Parent, Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG_CONNECTING);
                    }
                    else {
                        setTimeout(function () {
                            console.info('waiting childeWin open for openDialogConnecting.');
                            _this.openDialogConnecting();
                        }, 100);
                    }
                };
                DialogController.prototype.closeDialogConnecting = function () {
                    this.ipc.send(this.channel4Parent, Dialog.IpcMessage.PARENT_TO_MAIN.CLOSE_DIALOG_CONNECTING);
                };
                return DialogController;
            }());
            Dialog.DialogController = DialogController;
            function closeChildDialogs() {
                return null;
            }
            Dialog.closeChildDialogs = closeChildDialogs;
            function createDialogAddNoteTemplate(initData, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_add_note_template.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_ADD_NOTE_TEMPLATE;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.LOADING_CANCEL) {
                        if (typeof handler.loadingCancel === 'function') {
                            handler.loadingCancel(dialogController);
                        }
                    }
                });
                var options = {
                    width: 500,
                    height: 275,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('config.addTemplate.title'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.createDialogAddNoteTemplate = createDialogAddNoteTemplate;
            function createWindowWiFiSetting(initData, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_wifi_setting.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.WINDOW_WIFI_SETTING;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, initData);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var options = {
                    width: 756,
                    height: 720,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    title: $.i18n.t('config.wifi.title'),
                    resizable: false,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.createWindowWiFiSetting = createWindowWiFiSetting;
            function openDialogGeneralSetting(settings, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_general_setting.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_GENERAL_SETTING;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, settings);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var options = {
                    width: 660,
                    height: 420,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('config.generalSettings.title'),
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openDialogGeneralSetting = openDialogGeneralSetting;
            function openYesNoDialog(options, callback) {
                var remote = require('electron').remote;
                var parentWin = options.parentWindow ? options.parentWindow : remote.getCurrentWindow();
                var dialogOptions = {
                    type: options.type ? options.type : 'none',
                    title: options.title,
                    message: options.message,
                    buttons: [$.i18n.t('app.words.yes'), $.i18n.t('app.words.no')],
                    noLink: options.noLink ? options.noLink : true,
                    defaultId: options.defaultId ? options.defaultId : 9,
                    cancelId: options.cancelId ? options.cancelId : 1,
                };
                remote.dialog.showMessageBox(parentWin, dialogOptions, callback);
            }
            Dialog.openYesNoDialog = openYesNoDialog;
            function openOkCancelDialog(options, callback) {
                var remote = require('electron').remote;
                var parentWin = options.parentWindow ? options.parentWindow : remote.getCurrentWindow();
                var dialogOptions = {
                    type: options.type ? options.type : 'none',
                    title: options.title,
                    message: options.message,
                    buttons: [$.i18n.t('app.words.ok'), $.i18n.t('app.words.cancel')],
                    noLink: options.noLink ? options.noLink : true,
                    defaultId: options.defaultId ? options.defaultId : 9,
                    cancelId: options.cancelId ? options.cancelId : 1,
                };
                remote.dialog.showMessageBox(parentWin, dialogOptions, callback);
            }
            Dialog.openOkCancelDialog = openOkCancelDialog;
            function openErrorDialog(options, callback) {
                var remote = require('electron').remote;
                var parentWin = options.parentWindow ? options.parentWindow : remote.getCurrentWindow();
                var dialogOptions = {
                    type: options.type ? options.type : 'none',
                    title: options.title ? options.title : $.i18n.t('dialog.title.error'),
                    message: options.message,
                    buttons: [$.i18n.t('app.words.ok')],
                    noLink: options.noLink ? options.noLink : true,
                    defaultId: options.defaultId ? options.defaultId : 9,
                    cancelId: options.cancelId ? options.cancelId : 0,
                };
                remote.dialog.showMessageBox(parentWin, dialogOptions, callback);
            }
            Dialog.openErrorDialog = openErrorDialog;
            function openOkDialog(options, callback) {
                var remote = require('electron').remote;
                var parentWin = options.parentWindow ? options.parentWindow : remote.getCurrentWindow();
                var dialogOptions = {
                    type: options.type ? options.type : 'none',
                    title: options.title,
                    message: options.message,
                    buttons: [$.i18n.t('app.words.ok')],
                    noLink: options.noLink ? options.noLink : true,
                    defaultId: options.defaultId ? options.defaultId : 9,
                    cancelId: options.cancelId ? options.cancelId : 0,
                };
                remote.dialog.showMessageBox(parentWin, dialogOptions, callback);
            }
            Dialog.openOkDialog = openOkDialog;
            function openChoiceDialog(options, callback) {
                var remote = require('electron').remote;
                var parentWin = options.parentWindow ? options.parentWindow : remote.getCurrentWindow();
                var dialogOptions = {
                    type: options.type ? options.type : 'none',
                    title: options.title,
                    message: options.message,
                    buttons: options.buttons,
                    noLink: options.noLink ? options.noLink : true,
                    defaultId: options.defaultId ? options.defaultId : 99,
                    cancelId: options.cancelId ? options.cancelId : 98,
                };
                remote.dialog.showMessageBox(parentWin, dialogOptions, callback);
            }
            Dialog.openChoiceDialog = openChoiceDialog;
            function openDialogSyncResult(settings, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_sync_result.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_SYNC_RESULT;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, settings);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var width;
                if (process.platform === 'darwin') {
                    width = 867;
                }
                else {
                    width = 882;
                }
                var options = {
                    width: width,
                    height: 632,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    resizable: false,
                    title: $.i18n.t('sync.ngResult.title')
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openDialogSyncResult = openDialogSyncResult;
            function openDialogSyncIntroduction(settings, handler) {
                startPseudoModal();
                var dialogURL = CDP.Framework.toUrl("/index_dialog_sync_introduction.html");
                var parentWindow = require('electron').remote.getCurrentWindow();
                var dialogName = DPMW.View.Dialog.DialogName.DIALOG_SYNC_INTRODUCTION;
                var ipc = require('electron').ipcRenderer;
                var channel = 'channel4Parent-' + dialogName + '-' + new Date().toISOString();
                var dialogController;
                dialogController = new DialogController(dialogName, channel);
                ipc.on(channel, function (e, message, detail) {
                    console.log(message);
                    console.log(detail);
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.FINISH_CONNECT) {
                        ipc.send(channel, Dialog.IpcMessage.PARENT_TO_MAIN.SEND_INIT_INFO, settings);
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.SUBMIT) {
                        if (typeof handler.submit === 'function') {
                            handler.submit(detail, dialogController);
                        }
                    }
                    if (message === Dialog.IpcMessage.MAIN_TO_PARENT.DIALOG_CLOSED) {
                        if (typeof handler.closed === 'function') {
                            handler.closed();
                        }
                        ipc.removeAllListeners(channel);
                        endPseudoModal();
                    }
                });
                var dWidth;
                var dHeight;
                if (ENABLE_MODAL) {
                    dWidth = 751;
                    dHeight = 526;
                }
                else {
                    dWidth = 735;
                    dHeight = 493;
                }
                var options = {
                    width: dWidth,
                    height: dHeight,
                    minimizable: false,
                    maximizable: false,
                    show: false,
                    allowRunningInsecureContent: true,
                    title: $.i18n.t('sync.introduce.title'),
                    resizable: false,
                };
                if (ENABLE_MODAL) {
                    options['modal'] = true;
                }
                console.log(dialogName);
                console.log(dialogURL);
                console.log(parentWindow.id);
                console.log(channel);
                ipc.send(Dialog.IpcMessage.PARENT_TO_MAIN.OPEN_DIALOG, dialogName, dialogURL, options, parentWindow.id, channel);
                return dialogController;
            }
            Dialog.openDialogSyncIntroduction = openDialogSyncIntroduction;
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=OpenChildDialogs.js.map