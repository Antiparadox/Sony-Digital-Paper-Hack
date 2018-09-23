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
            Explorer.WAIT_TIME_LONG = 30000;
            Explorer.WAIT_TIME_SHORT = 10000;
            Explorer.INTERVAL_AUTO_SYNC_CHECK = 30000;
            Explorer.MAX_NUMBER_OF_PRINTING_PREBUFFERED_DOCUMENTS_TO_DP = 5;
            var CONNECTION_RECOVERY_INTERVAL = (function () {
                var n = require('electron').remote.process.env.MW_CONNECTION_RECOVERY_INTERVAL;
                var m = parseInt(n);
                if (!isNaN(m) && (m > 0)) {
                    return m;
                }
                else {
                    return 60;
                }
            })();
            var ExplorerBaseView = (function (_super) {
                __extends(ExplorerBaseView, _super);
                function ExplorerBaseView(options) {
                    _super.call(this, options);
                }
                ExplorerBaseView.prototype.initialize = function () {
                    var _this = this;
                    this.appCtrlInitialized = false;
                    this.menu_ = new Explorer.ExplorerMenu();
                    this.toolbarView_ = null;
                    this.searchStatusView_ = null;
                    this.operationView_ = null;
                    this.breadcrumbView_ = null;
                    this.listView_ = null;
                    this.footerView_ = null;
                    this.unconnectedView_ = null;
                    this.discovery = require('electron').remote.require('mw-discovery-ctrl');
                    this.connectionRecoveryIntervalId = undefined;
                    this.connectingDialogController = null;
                    this.closeConnectingDialogTimer = 0;
                    this.electron = require('electron');
                    this.ipcRenderer = require('electron').ipcRenderer;
                    this.win = $(window);
                    var browserWindow = this.electron.remote.getCurrentWindow();
                    var self = this;
                    this.nowClosing = false;
                    if (process.platform === 'win32') {
                        var mwAutoBtPanConnector = require('electron').remote.require('mw-auto-bt-pan-connector');
                        self.remoteAutoBtPanConnector = mwAutoBtPanConnector.getInstance();
                        self.remoteAutoBtPanConnector.on('abnormalConditionOfPan', function () {
                            console.warn('abnormalConditionOfPan');
                            if (self.panAbnormalDisplayed) {
                                return;
                            }
                            if (!self.appCtrlInitialized || (DPMW.appCtrl.currentDeviceId && !DPMW.appCtrl.currentDevice)) {
                                return;
                            }
                            var connState = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE);
                            if (DPMW.appCtrl.currentDevice && DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED === connState) {
                                return;
                            }
                            var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_AUTO_BT_PAN_CONNECTION_FAILED, 'abnormalConditionOfPan');
                            var errOptions = {
                                title: $.i18n.t('dialog.notice.btUnrecoverableError.title'),
                                message: $.i18n.t('dialog.notice.btUnrecoverableError.message'),
                                type: 'none',
                            };
                            var activeSubWin = Explorer.Handler.subWindowHandler.getActiveSubWindow();
                            if (activeSubWin) {
                                activeSubWin.error(errOptions);
                            }
                            else {
                                self.panAbnormalDisplayed = true;
                                View.Dialog.openErrorDialog(errOptions, function (res) {
                                    self.panAbnormalDisplayed = false;
                                });
                            }
                        });
                        mwAutoBtPanConnector = null;
                    }
                    this.OffDragAndDrop();
                    this.win.on("resize", function () {
                        _this.resize();
                    });
                    this.win.on("keydown", function (e) {
                        if (process.platform === 'darwin' && browserWindow.getChildWindows().length > 0) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        _this.onKeydown(e);
                    });
                    this.win.on("keyup", function (e) {
                        if (process.platform === 'darwin' && browserWindow.getChildWindows().length > 0) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        _this.onKeyup(e);
                    });
                    this.win.on("mousedown", function (e) {
                        _this.onMousedown(e);
                    });
                    this.win.on("mouseup", function (e) {
                        _this.onMouseup(e);
                    });
                    this.win.on("mousemove", function (e) {
                        _this.onMousemove(e);
                    });
                    browserWindow.on('close', function (ev) {
                        self.onClose(browserWindow);
                    });
                    this.ipcRenderer.on('closeApp', function (event) {
                        self.onClose(browserWindow);
                    });
                    this.ipcRenderer.on('forceCloseApp', function (event) {
                        self.onForceClose(browserWindow);
                    });
                    this.listenTo(Explorer.Handler.softwareUpdateHandler, 'forceCloseAppRequired', function () {
                        self.onForceClose(browserWindow);
                    });
                    Explorer.Handler.softwareUpdateHandler.startAppAndDeviceUpdateInBackground();
                    this.readyToPrint_ = false;
                    this.printFilePathArray_ = [];
                    this.countOfPrintingPrebufferedDocumentsToDP = 0;
                    var delay = parseInt(process.env.MW_APP_WAIT_BEFORE_ACTION);
                    var printPrebufferedDocumentsToDP = function () {
                        for (var i = 0; i < self.printFilePathArray_.length; i++) {
                            self.printToDP(self.printFilePathArray_[i]);
                        }
                        self.printFilePathArray_ = [];
                        self.readyToPrint_ = true;
                    };
                    var printPrebufferedDocumentsToDPIfPossible = function () {
                        if ((!DPMW.appCtrl.currentDevice) || (!DPMW.appCtrl.currentDevice.isConnected())) {
                            if (++self.countOfPrintingPrebufferedDocumentsToDP <= Explorer.MAX_NUMBER_OF_PRINTING_PREBUFFERED_DOCUMENTS_TO_DP) {
                                setTimeout(printPrebufferedDocumentsToDPIfPossible, delay);
                                console.log('Delayed printing prebuffered documents to DP. (' + self.countOfPrintingPrebufferedDocumentsToDP.toString() + ')');
                            }
                            else {
                                printPrebufferedDocumentsToDP();
                                console.log('Printed prebuffered documents to DP.');
                            }
                        }
                        else {
                            printPrebufferedDocumentsToDP();
                            console.log('Printed prebuffered documents to DP.');
                        }
                    };
                    setTimeout(printPrebufferedDocumentsToDPIfPossible, delay);
                    this.ipcRenderer.on('printToDevice', function (event, filePath) {
                        if (self.readyToPrint_) {
                            self.printToDP(filePath);
                        }
                        else {
                            self.printFilePathArray_.push(filePath);
                        }
                    });
                    self.ipcRenderer.on('ExplorerSubWindowCalled', function (event, dialogName) {
                        console.log(dialogName + " is open");
                        self.menu_.trigger('SubWindowOpenCalled', dialogName);
                    });
                    self.ipcRenderer.on('ExplorerSubWindowClosed', function (event, dialogName) {
                        console.log(dialogName + " is closed");
                        self.menu_.trigger('SubWindowClosed', dialogName);
                    });
                    var me = self;
                    DPMW.appCtrl.initializeMaster({
                        success: function () {
                            me.appCtrlInitialized = true;
                            Promise.resolve()
                                .then(function onFulfilled() {
                                return new Promise(function (resolve, reject) {
                                    if (DPMW.appCtrl.currentDeviceId) {
                                        var path = require('path');
                                        var fs_1 = require('fs');
                                        var workspaceDataFilePath_1 = path.join(process.env.MW_USER_DATA_DIR_PATH, 'workspace.dat');
                                        fs_1.stat(workspaceDataFilePath_1, function (err, stat) {
                                            if ((err) && (err.code === 'ENOENT')) {
                                                fs_1.writeFile(workspaceDataFilePath_1, DPMW.appCtrl.currentDeviceId, function (err) {
                                                    resolve();
                                                });
                                            }
                                            else {
                                                resolve();
                                            }
                                        });
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            })
                                .then(function onFulfilled() {
                                return new Promise(function (resolve, reject) {
                                    if (DPMW.appCtrl.currentDeviceId) {
                                        me.openDialogConnectingFromExplorer({
                                            success: function () {
                                                me.closeConnectingDialogTimer = setTimeout(function () {
                                                    me.closeDialogConnecting();
                                                }, Explorer.WAIT_TIME_SHORT);
                                                resolve();
                                            }
                                        });
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            })
                                .then(function onFulfilled() {
                                me.ipcRenderer.on('usbSerialConnected', function (event, device) {
                                    if (DPMW.appCtrl.currentDevice
                                        && DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED
                                            === DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE)) {
                                        return;
                                    }
                                    var activeSubWin = Explorer.Handler.subWindowHandler.getActiveSubWindow();
                                    if (activeSubWin && View.Dialog.DialogName.WINDOW_INIT_SETUP
                                        === activeSubWin.getDialogName()) {
                                        return;
                                    }
                                    var connectedDeviceId = me.getDviceIdFromUsbSerial(device);
                                    var limitTime = me.getConnectingDialogDisplayLimitTime(connectedDeviceId);
                                    me.openDialogConnecting(limitTime);
                                });
                                me.ipcRenderer.on('systemIsSuspending', function () {
                                    me.stopAutoSyncPolling();
                                });
                                me.ipcRenderer.on('systemIsResuming', function () {
                                    setTimeout(function () {
                                        me.startAutoSyncPolling();
                                    }, 60000);
                                });
                                me.listenTo(Explorer.Handler.subWindowHandler, 'openInitSetup', function () {
                                    me.closeDialogConnecting();
                                });
                                me.listenTo(Explorer.Handler.subWindowHandler, 'changeDeviceRequest', function (deviceId) {
                                    me.changeDevice(deviceId);
                                });
                                if (process.platform === 'win32') {
                                    me.remoteAutoBtPanConnector.on('connectStart', function () {
                                        console.log('pan conn start');
                                        if (DPMW.appCtrl.currentDevice
                                            && DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED
                                                === DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE)) {
                                            me.openDialogConnecting(Explorer.WAIT_TIME_LONG);
                                        }
                                    });
                                    me.remoteAutoBtPanConnector.on('connectableDenebCountChanged', function (connectableDenebCount) {
                                    });
                                    if (DPMW.Utils.LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_ON
                                        === DPMW.Utils.getBluetoothAutoConnectSetting()) {
                                        me.remoteAutoBtPanConnector.enableAutoConnect();
                                    }
                                }
                                if (DPMW.appCtrl.currentDeviceId) {
                                    DPMW.appCtrl.connectDevice({
                                        success: function () {
                                            Explorer.Handler.dragAndDropHandler.initialize({
                                                success: function () {
                                                }, error: function (err) {
                                                }
                                            });
                                            if (process.platform === 'win32') {
                                                me.remoteAutoBtPanConnector.stopScanDevice(function (error) {
                                                    if (!error) {
                                                        console.log('ScanDevice stopped');
                                                    }
                                                    else {
                                                        console.log(error.message);
                                                    }
                                                });
                                            }
                                            me.menu_.initMenuForCurrentDevice();
                                            me.displayDevice();
                                            me.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, me.connectionStateChanged);
                                            me.ipcRenderer.send('explorerReady');
                                            me.listenTo(DPMW.appCtrl.currentDevice, 'connectFailed', me.connectFailed);
                                            setTimeout(function () {
                                                me.autoSync();
                                            }, 1000);
                                            me.startAutoSyncPolling();
                                        },
                                        error: function (err) {
                                            me.menu_.initMenuForCurrentDevice();
                                            console.log('appCtrl.connectDevice error.');
                                            me.listenTo(DPMW.appCtrl.currentDevice, 'connectFailed', me.connectFailed);
                                            me.displayUnconnected();
                                            me.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, me.connectionStateChanged);
                                            me.ipcRenderer.send('explorerReady');
                                        }
                                    });
                                }
                                else {
                                    me.displayNotRegDevice();
                                    me.ipcRenderer.send('explorerReady');
                                }
                            });
                        },
                        error: function (err) {
                            console.log('apCtrl.initialize error');
                            me.closeDialogConnecting();
                            if (!err) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'apCtrl.initialize error');
                            }
                            var errCode = DPMW.mwe.genUserErrorCode(err);
                            var errorInfo = { msgId: null, type: null };
                            switch (err.mwCode) {
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            }, function (response) {
                                var currentWindow = me.electron.remote.getCurrentWindow();
                                currentWindow.close();
                            });
                            me.ipcRenderer.send('explorerReady');
                            return;
                        }
                    });
                };
                ExplorerBaseView.prototype.events = function () {
                    return {};
                };
                ExplorerBaseView.prototype.getDviceIdFromUsbSerial = function (device) {
                    var connectedDeviceId;
                    if (device && typeof device.serialNumber === 'string') {
                        connectedDeviceId = device.serialNumber.slice(-7);
                    }
                    else {
                        connectedDeviceId = null;
                    }
                    return connectedDeviceId;
                };
                ExplorerBaseView.prototype.getConnectingDialogDisplayLimitTime = function (connectedDeviceId) {
                    if (!DPMW.appCtrl.currentDeviceId || DPMW.appCtrl.currentDeviceId === connectedDeviceId) {
                        return Explorer.WAIT_TIME_LONG;
                    }
                    else {
                        return Explorer.WAIT_TIME_SHORT;
                    }
                };
                ExplorerBaseView.prototype.openDialogConnecting = function (displayLimitTime) {
                    var me = this;
                    var activeSubWinControler = Explorer.Handler.subWindowHandler.getActiveSubWindow();
                    var closeTimerId;
                    if (activeSubWinControler === null) {
                        if (!this.connectingDialogController) {
                            me.openDialogConnectingFromExplorer();
                        }
                    }
                    else {
                        activeSubWinControler.openDialogConnecting();
                    }
                    clearTimeout(me.closeConnectingDialogTimer);
                    me.closeConnectingDialogTimer = setTimeout(function () {
                        me.closeDialogConnecting();
                    }, displayLimitTime);
                };
                ExplorerBaseView.prototype.openDialogConnectingFromExplorer = function (options) {
                    var me = this;
                    var handler = {
                        closed: function () {
                            me.connectingDialogController = null;
                        },
                        dialogShowed: function () {
                            if (options && typeof options.success === 'function') {
                                options.success();
                            }
                        }
                    };
                    var initData = new View.Dialog.DialogInfo.DialogLoadingInfo();
                    initData.cancelable = false;
                    initData.message = $.i18n.t('dialog.nobtn.wait.message');
                    initData.title = $.i18n.t('dialog.nobtn.wait.title');
                    this.connectingDialogController = View.Dialog.createDialogLoading(initData, handler);
                };
                ExplorerBaseView.prototype.closeDialogConnecting = function () {
                    clearTimeout(this.closeConnectingDialogTimer);
                    if (this.connectingDialogController) {
                        this.connectingDialogController.close();
                    }
                    var activeSubWinControler = Explorer.Handler.subWindowHandler.getActiveSubWindow();
                    if (activeSubWinControler) {
                        activeSubWinControler.closeDialogConnecting();
                    }
                };
                ExplorerBaseView.prototype.onClose = function (browserWindow) {
                    var self = this;
                    if (!self.nowClosing) {
                        var profileManagerMenuSelected = (process.env.MW_PROFILE_MANAGER_MENU_SELECTED === 'SELECTED') ? 'SELECTED' : '';
                        process.env.MW_PROFILE_MANAGER_MENU_SELECTED = '';
                        var response = self.ipcRenderer.sendSync('profileManagerMenuSelected', {
                            profileManagerMenuSelected: profileManagerMenuSelected
                        });
                        if (profileManagerMenuSelected || self.isOperationRunning()) {
                            var titleKey = profileManagerMenuSelected ? 'dialog.confirm.abortExitEx.title' : 'dialog.confirm.abortExit.title';
                            var messageKey = profileManagerMenuSelected ? 'dialog.confirm.abortExitEx.message' : 'dialog.confirm.abortExit.message';
                            var dialogOptions = {
                                title: $.i18n.t(titleKey),
                                message: $.i18n.t(messageKey),
                            };
                            DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                                if (response === 0) {
                                    self.cancelRunningOperations(function (error) {
                                        self.nowClosing = true;
                                        self.closeWindow(browserWindow);
                                    });
                                }
                            });
                            return;
                        }
                    }
                    self.nowClosing = true;
                    self.closeWindow(browserWindow);
                };
                ExplorerBaseView.prototype.onForceClose = function (browserWindow) {
                    if (this.isOperationRunning()) {
                        var self_1 = this;
                        this.cancelRunningOperations(function (error) {
                            self_1.closeWindow(browserWindow);
                        });
                        return;
                    }
                    this.closeWindow(browserWindow);
                };
                ExplorerBaseView.prototype.closeWindow = function (browserWindow) {
                    browserWindow.preventClose = false;
                    DPMW.appCtrl.terminate();
                    browserWindow.close();
                };
                ExplorerBaseView.prototype.isOperationRunning = function () {
                    return Explorer.Handler.transferProgressHandler.isUploadRunning() ||
                        Explorer.Handler.transferProgressHandler.isDownloadRunning() ||
                        Explorer.Handler.fileManageHandler.isRunning() ||
                        Explorer.Handler.syncHandler.isSyncRunning();
                };
                ExplorerBaseView.prototype.cancelRunningOperations = function (callback) {
                    var promises = [];
                    var error = null;
                    promises.push(new Promise(function (resolve, reject) {
                        Explorer.Handler.transferProgressHandler.cancelAllDownloadTasks(function () {
                            resolve();
                        });
                    }));
                    promises.push(new Promise(function (resolve, reject) {
                        Explorer.Handler.transferProgressHandler.cancelAllUploadTasks(function () {
                            resolve();
                        });
                    }));
                    promises.push(new Promise(function (resolve, reject) {
                        if (!Explorer.Handler.syncHandler.isSyncRunning()) {
                            resolve();
                            return;
                        }
                        Explorer.Handler.syncHandler.cancelSync({
                            success: function () {
                                resolve();
                            },
                            error: function (err) {
                                error = err;
                                resolve();
                            }
                        });
                    }));
                    Promise.all(promises).then(function () {
                        callback(error);
                    });
                };
                ExplorerBaseView.prototype.OffDragAndDrop = function () {
                    var mainsection = document.getElementById('main-section');
                    mainsection.ondragover = function (e) {
                        e.dataTransfer.dropEffect = 'none';
                        return false;
                    };
                    mainsection.ondrop = function (e) {
                        e.preventDefault();
                        _.each(e.dataTransfer.files, function (file, index, list) {
                            console.log('dragged here files: ', file.name);
                        });
                        return false;
                    };
                    $('#content-list').on('drop dragover', function (e) {
                        e.stopPropagation();
                    });
                };
                ExplorerBaseView.prototype.onMousedown = function (e) {
                    if (this.toolbarView_) {
                        this.toolbarView_.trigger('mousedown', e);
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.trigger('mousedown', e);
                    }
                    if (this.operationView_) {
                        this.operationView_.trigger('mousedown', e);
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.trigger('mousedown', e);
                    }
                    if (this.listView_) {
                        this.listView_.trigger('mousedown', e);
                    }
                    if (this.footerView_) {
                        this.footerView_.trigger('mousedown', e);
                    }
                };
                ExplorerBaseView.prototype.onMouseup = function (e) {
                    if (this.toolbarView_) {
                        this.toolbarView_.trigger('mouseup', e);
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.trigger('mouseup', e);
                    }
                    if (this.operationView_) {
                        this.operationView_.trigger('mouseup', e);
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.trigger('mouseup', e);
                    }
                    if (this.listView_) {
                        this.listView_.trigger('mouseup', e);
                    }
                    if (this.footerView_) {
                        this.footerView_.trigger('mouseup', e);
                    }
                };
                ExplorerBaseView.prototype.onMousemove = function (e) {
                    if (this.toolbarView_) {
                        this.toolbarView_.trigger('mousemove', e);
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.trigger('mousemove', e);
                    }
                    if (this.operationView_) {
                        this.operationView_.trigger('mousemove', e);
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.trigger('mousemove', e);
                    }
                    if (this.listView_) {
                        this.listView_.trigger('mousemove', e);
                    }
                    if (this.footerView_) {
                        this.footerView_.trigger('mousemove', e);
                    }
                };
                ExplorerBaseView.prototype.onKeydown = function (e) {
                    if (this.toolbarView_) {
                        this.toolbarView_.trigger('keydown', e);
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.trigger('keydown', e);
                    }
                    if (this.operationView_) {
                        this.operationView_.trigger('keydown', e);
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.trigger('keydown', e);
                    }
                    if (this.listView_) {
                        this.listView_.trigger('keydown', e);
                    }
                    if (this.footerView_) {
                        this.footerView_.trigger('keydown', e);
                    }
                };
                ExplorerBaseView.prototype.onKeyup = function (e) {
                    if (this.toolbarView_) {
                        this.toolbarView_.trigger('keyup', e);
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.trigger('keyup', e);
                    }
                    if (this.operationView_) {
                        this.operationView_.trigger('keyup', e);
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.trigger('keyup', e);
                    }
                    if (this.listView_) {
                        this.listView_.trigger('keyup', e);
                    }
                    if (this.footerView_) {
                        this.footerView_.trigger('keyup', e);
                    }
                };
                ExplorerBaseView.prototype.resize = function () {
                    if (this.toolbarView_) {
                        this.toolbarView_.trigger('resize');
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.trigger('resize');
                    }
                    if (this.operationView_) {
                        this.operationView_.trigger('resize');
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.trigger('resize');
                    }
                    if (this.listView_) {
                        this.listView_.trigger('resize');
                    }
                    if (this.footerView_) {
                        this.footerView_.trigger('resize');
                    }
                };
                ExplorerBaseView.prototype.viewTypeChanged = function (viewType) {
                    if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS || viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        this.$('#content-list').css('top', '200px');
                    }
                    else {
                        this.$('#content-list').css('top', '168px');
                    }
                };
                ExplorerBaseView.prototype.footerSizeChanged = function () {
                    var footerSize = $('#footerspace').height();
                    this.$('#content-list').css('bottom', footerSize.toString() + 'px');
                };
                ExplorerBaseView.prototype.printToDP = function (filePath) {
                    var messageId = null;
                    var type = null;
                    var error = null;
                    if (!DPMW.appCtrl.currentDeviceId) {
                        messageId = 'dialog.error.message.66';
                        type = 'none';
                        error = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'App is not paired with any device');
                    }
                    else if (!DPMW.appCtrl.currentDevice || !DPMW.appCtrl.currentDevice.isConnected()) {
                        messageId = 'dialog.error.message.95';
                        type = 'none';
                        error = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'Device is not found');
                    }
                    if (messageId) {
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t(messageId, { errorCode: DPMW.mwe.genUserErrorCode(error) }),
                            type: type,
                        }, function (response) { });
                        return;
                    }
                    Explorer.Handler.deviceHandler.uploadAndOpenDocument(filePath, {
                        success: function () { },
                        error: function (err) {
                            console.log('Print To DP uploadAndOpenDocument error.');
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
                                        View.Dialog.openErrorDialog({
                                            message: $.i18n.t(messageId, { file: err.cause.path, errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                            type: type,
                                        }, function (response) { });
                                        return;
                                    }
                                    else {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    break;
                                case DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT:
                                    errorInfo.msgId = 'dialog.error.message.67';
                                    errorInfo.type = 'none';
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
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(messageId, { file: err.cause.path, errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                                    type: type,
                                                }, function (response) { });
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
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(messageId, { file: err.cause.path, errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                                    type: type,
                                                }, function (response) { });
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
                                        else if ('40011' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else if ('40012' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.79';
                                                errorInfo.type = 'none';
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(messageId, { file: err.cause.path, errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                                    type: type,
                                                }, function (response) { });
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
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(messageId, { file: err.cause.path, errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                                    type: type,
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
                                    else if (404 === statusCode) {
                                        if ('40401' === webApiResCode) {
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.79';
                                                errorInfo.type = 'none';
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(messageId, { file: err.cause.path, errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                                    type: type,
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
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            }, function (response) { });
                        },
                    });
                };
                ExplorerBaseView.prototype.syncPCDateTimeToDP = function () {
                    Explorer.Handler.deviceHandler.setCurrentDateTime({
                        success: function () { console.log('syncPCDateTimeToDP success.'); },
                        error: function (err) {
                            console.log('syncPCDateTimeToDP error.');
                            if (!err) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Error object does not passed');
                            }
                            var errCode = DPMW.mwe.genUserErrorCode(err);
                            var errorInfo = { msgId: null, type: null };
                            switch (err.mwCode) {
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
                                        else if ('40004' === webApiResCode) {
                                            errorInfo.msgId = 'dialog.error.message.75';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                        }
                                    }
                                    else {
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    }
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            }, function (response) { });
                        }
                    });
                };
                ExplorerBaseView.prototype.startAutoSyncPolling = function () {
                    var _this = this;
                    if (this.autoSyncPolling) {
                        clearInterval(this.autoSyncPolling);
                    }
                    this.autoSyncPolling = setInterval(function () {
                        _this.autoSync();
                    }, Explorer.INTERVAL_AUTO_SYNC_CHECK);
                };
                ExplorerBaseView.prototype.stopAutoSyncPolling = function () {
                    clearInterval(this.autoSyncPolling);
                };
                ExplorerBaseView.prototype.autoSync = function () {
                    if (Explorer.Handler.syncHandler.isSyncRunning()) {
                        return;
                    }
                    if (DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_OFF === DPMW.Utils.getAutoSyncSetting()) {
                        return;
                    }
                    if (Explorer.Handler.syncHandler.getLastSyncResult() === null) {
                        this.executeAutoSync();
                        return;
                    }
                    var lastSyncExeDate = Explorer.Handler.syncHandler.getLastSyncExecutedDate();
                    if (lastSyncExeDate === null) {
                        this.executeAutoSync();
                        return;
                    }
                    var autoSyncInterval = DPMW.Utils.getAutoSyncInterval() * 60000;
                    var elapsedTime = new Date().getTime() - lastSyncExeDate.getTime();
                    if (elapsedTime > autoSyncInterval) {
                        this.executeAutoSync();
                        return;
                    }
                };
                ExplorerBaseView.prototype.executeAutoSync = function () {
                    DPMW.Model.FolderSync.syncFolderPairStore.getFolderPairs(function (err, pairs) {
                        if (err) {
                            return;
                        }
                        if (pairs === null || pairs.length <= 0) {
                            return;
                        }
                        Explorer.Handler.syncHandler.syncAllPairs(Explorer.Handler.SyncType.Auto, {
                            success: function () { },
                            error: function (err) { }
                        });
                    });
                };
                ExplorerBaseView.prototype.displayDevice = function () {
                    this.endRecoverConnection();
                    this.discovery.stopPingAndRegister();
                    this.closeDialogConnecting();
                    this.syncPCDateTimeToDP();
                    Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                    Explorer.Status.fetchStatus.preserveFetchParams({
                        order_type: DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_ASC });
                    this.listenTo(Explorer.Status.viewStatus, 'viewTypeChanged', this.viewTypeChanged);
                    this.webApiVersionCheck();
                    Explorer.Handler.softwareUpdateHandler.startDeviceAndAppUpdateInBackground();
                    if (!this.toolbarView_) {
                        this.toolbarView_ = new Explorer.ExplorerToolbarView();
                        this.$('#tool-bar').append(this.toolbarView_.render().el);
                    }
                    if (!this.searchStatusView_) {
                        this.searchStatusView_ = new Explorer.ExplorerSearchStatusView();
                        this.$('#search-status').append(this.searchStatusView_.render().el);
                        this.$('#search-status').removeClass('hide');
                    }
                    if (!this.operationView_) {
                        this.operationView_ = new Explorer.ExplorerOperationView();
                        this.$('#operation').append(this.operationView_.render().el);
                        this.$('#operation').removeClass('hide');
                    }
                    if (!this.breadcrumbView_) {
                        this.breadcrumbView_ = new Explorer.ExplorerBreadcrumbView();
                        this.$('#breadcrumb').append(this.breadcrumbView_.render().el);
                        this.$('#breadcrumb').removeClass('hide');
                    }
                    if (!this.listView_) {
                        this.listView_ = new Explorer.ExplorerListView();
                        this.$('#content-list').append(this.listView_.render().el);
                        this.$('#content-list').removeClass('hide');
                    }
                    if (!this.footerView_) {
                        this.footerView_ = new Explorer.ExplorerFooterView();
                        this.$('#footerspace').append(this.footerView_.render().el);
                        this.$('#footerspace').removeClass('hide');
                        this.listenTo(this.footerView_, 'footerSizeChanged', this.footerSizeChanged);
                    }
                    $('#uninitsetup').addClass('hide');
                    $('#unconnected').addClass('hide');
                };
                ExplorerBaseView.prototype.displayUnconnected = function () {
                    if (this.remoteAutoBtPanConnector) {
                        this.remoteAutoBtPanConnector.setTargetedDenebDeviceId(DPMW.appCtrl.currentDeviceId);
                    }
                    if (!this.toolbarView_) {
                        this.toolbarView_ = new Explorer.ExplorerToolbarView();
                        this.$('#tool-bar').append(this.toolbarView_.render().el);
                    }
                    this.$('#search-status').addClass('hide');
                    this.$('#operation').addClass('hide');
                    this.$('#breadcrumb').addClass('hide');
                    this.$('#content-list').addClass('hide');
                    this.$('#footerspace').addClass('hide');
                    $('#uninitsetup').addClass('hide');
                    if (!this.unconnectedView_) {
                        this.unconnectedView_ = new Explorer.ExplorerUnconnectedView();
                        this.$('#unconnected').append(this.unconnectedView_.el);
                        this.$('#unconnected').removeClass('hide');
                    }
                    this.startRecoverConnection();
                    this.discovery.startPingAndRegister();
                };
                ExplorerBaseView.prototype.displayNotRegDevice = function () {
                    this.endRecoverConnection();
                    this.discovery.stopPingAndRegister();
                    if (!this.toolbarView_) {
                        this.toolbarView_ = new Explorer.ExplorerToolbarView();
                        this.$('#tool-bar').append(this.toolbarView_.render().el);
                    }
                    this.$('#search-status').addClass('hide');
                    this.$('#operation').addClass('hide');
                    this.$('#breadcrumb').addClass('hide');
                    this.$('#content-list').addClass('hide');
                    this.$('#footerspace').addClass('hide');
                    $('#unconnected').addClass('hide');
                    $.get('../templates/explorer_uninitsetupview.html', function (data) {
                        $('#uninitsetup').html(data);
                        $('#uninitsetup').localize();
                        var h = $('#uninit-msg').height() + 17 + 240;
                        $('#uninit-screen').height(h);
                    }, 'html');
                    $('#uninitsetup').removeClass('hide');
                    this.listenTo(DPMW.appCtrl.devices, 'update', this.devicesChange);
                    DPMW.appCtrl.devices.fetch({ error: function (modelOrCollection, response, options) {
                            console.log('appCtrl.devices.fetch error.');
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
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            View.Dialog.openErrorDialog({
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            }, function (response) {
                            });
                        } });
                };
                ExplorerBaseView.prototype.devicesChange = function () {
                    if (typeof DPMW.appCtrl.currentDeviceId !== 'string' && DPMW.appCtrl.devices && DPMW.appCtrl.devices.length > 0) {
                        var CONNECTION_STATE = DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE;
                        DPMW.appCtrl.devices.forEach(function (device, index, array) {
                            var deviceId = device.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID);
                            var physicalType = device.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE);
                            console.log('devicesChange   deviceId: ' + deviceId + ' PHYSICAL_TYPE: ' + physicalType);
                            if (DPMW.Model.Device.VALUE_PHY_TYPE_USB === physicalType) {
                                Explorer.Handler.subWindowHandler.openWindowInitSetUp(deviceId);
                            }
                        });
                    }
                };
                ExplorerBaseView.prototype.connectionStateChanged = function () {
                    switch (DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE)) {
                        case DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED:
                            this.removeOldViews();
                            Explorer.Handler.dragAndDropHandler.initialize({
                                success: function () {
                                }, error: function (err) {
                                }
                            });
                            if (process.platform === 'win32') {
                                this.remoteAutoBtPanConnector.stopScanDevice(function (error) {
                                    if (!error) {
                                        console.log('ScanDevice stopped');
                                    }
                                    else {
                                        console.log(error.message);
                                    }
                                });
                            }
                            this.displayDevice();
                            this.startAutoSyncPolling();
                            break;
                        case DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED:
                            this.stopAutoSyncPolling();
                            this.removeOldViews();
                            this.displayUnconnected();
                            if (process.platform === 'win32') {
                                this.remoteAutoBtPanConnector.startScanDevice(function (error) {
                                    if (!error) {
                                        console.log('ScanDevice started');
                                    }
                                    else {
                                        console.log(error.message);
                                    }
                                });
                            }
                            break;
                        default:
                            throw "Unknown CONNECTION_STATE";
                    }
                };
                ExplorerBaseView.prototype.removeOldViews = function () {
                    if (this.toolbarView_) {
                        this.toolbarView_.remove();
                        this.toolbarView_ = null;
                    }
                    if (this.searchStatusView_) {
                        this.searchStatusView_.remove();
                        this.searchStatusView_ = null;
                    }
                    if (this.operationView_) {
                        this.operationView_.remove();
                        this.operationView_ = null;
                    }
                    if (this.breadcrumbView_) {
                        this.breadcrumbView_.remove();
                        this.breadcrumbView_ = null;
                    }
                    if (this.listView_) {
                        this.listView_.remove();
                        this.listView_ = null;
                    }
                    if (this.footerView_) {
                        this.stopListening(this.footerView_);
                        this.footerView_.remove();
                        this.footerView_ = null;
                    }
                    if (this.unconnectedView_) {
                        this.unconnectedView_.remove();
                        this.unconnectedView_ = null;
                    }
                    $('#uninitsetup').empty();
                };
                ExplorerBaseView.prototype.webApiVersionCheck = function () {
                    var ATTR_NAME_API_VERSION = DPMW.Model.Device.ATTR_NAME_API_VERSION;
                    var deviceAPIVersionModel = DPMW.appCtrl.currentDevice.deviceFirmwareModel.deviceAPIVersionModel;
                    var err = null;
                    var errCode = null;
                    var msgId = null;
                    if (typeof process.env.MW_SUPPORT_DPAPI_VERSION_RANGE !== 'string') {
                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Can not acquire app webapi version');
                        errCode = DPMW.mwe.genUserErrorCode(err);
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t('dialog.error.message.1', { errorCode: errCode }),
                            type: 'warning',
                        }, function (response) { });
                        return;
                    }
                    deviceAPIVersionModel.fetch({ success: function (modelOrCollection, res, options) {
                            var dpApiVersion = deviceAPIVersionModel.get(ATTR_NAME_API_VERSION);
                            var supportDpApiVersionRange = process.env.MW_SUPPORT_DPAPI_VERSION_RANGE;
                            console.log('webApiVersionCheck  dpApiVersion: ' + dpApiVersion + ' supportDpApiVersionRange: ' + supportDpApiVersionRange);
                            dpApiVersion = dpApiVersion.replace(/(^|\.)0+(?!\.|$)/g, '$1');
                            var nums = dpApiVersion.split('.');
                            if (nums.length > 3) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Wrong');
                                errCode = DPMW.mwe.genUserErrorCode(err);
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t('dialog.error.message.1', { errorCode: errCode }),
                                    type: 'warning',
                                }, function (response) { });
                            }
                            for (var i = nums.length; i < 3; i++) {
                                dpApiVersion += '.0';
                            }
                            var semver = require('semver');
                            if (semver.satisfies(dpApiVersion, supportDpApiVersionRange)) {
                                return;
                            }
                            else if (semver.ltr(dpApiVersion, supportDpApiVersionRange)) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'WebApi version mismatch. DP < PC');
                                errCode = DPMW.mwe.genUserErrorCode(err);
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t('dialog.error.message.4', { errorCode: errCode }),
                                    type: 'warning',
                                }, function (response) { });
                                return;
                            }
                            else if (semver.gtr(dpApiVersion, supportDpApiVersionRange)) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'WebApi version mismatch. DP > PC');
                                errCode = DPMW.mwe.genUserErrorCode(err);
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t('dialog.error.message.5', { errorCode: errCode }),
                                    type: 'warning',
                                }, function (response) { });
                                return;
                            }
                            else {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Wrong');
                                errCode = DPMW.mwe.genUserErrorCode(err);
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t('dialog.error.message.1', { errorCode: errCode }),
                                    type: 'warning',
                                }, function (response) { });
                                return;
                            }
                        }
                    });
                };
                ExplorerBaseView.prototype.connectFailed = function (err) {
                    var _this = this;
                    var clearCurrentDevice = false;
                    if (!err) {
                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'deviceId is not specified');
                    }
                    var errCode = DPMW.mwe.genUserErrorCode(err);
                    var errorInfo = { msgId: null, type: null };
                    switch (err.mwCode) {
                        case DPMW.mwe.E_MW_ALREADY_RUNNING:
                            return;
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                            errorInfo.msgId = 'dialog.error.message.42';
                            errorInfo.type = 'none';
                            clearCurrentDevice = true;
                            break;
                        case DPMW.mwe.E_MW_DEVICE_CONN_FAILED:
                            errorInfo.msgId = 'dialog.error.message.65';
                            errorInfo.type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                            return;
                        case DPMW.mwe.E_MW_PORTFWDR_FAILED_TO_LISTEN_PORT:
                            errorInfo.msgId = 'dialog.error.message.75';
                            errorInfo.type = 'none';
                            break;
                        case DPMW.mwe.E_MW_PORTFWDR_PORT_UNAVAILABLE:
                            errorInfo.msgId = 'dialog.error.message.75';
                            errorInfo.type = 'none';
                            break;
                        default:
                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                            break;
                    }
                    if (clearCurrentDevice) {
                        View.Dialog.openChoiceDialog({
                            title: $.i18n.t('dialog.choice2.confirmDpPairing.title'),
                            message: $.i18n.t('dialog.choice2.confirmDpPairing.message'),
                            buttons: [$.i18n.t('dialog.choice2.confirmDpPairing.b1'), $.i18n.t('dialog.choice2.confirmDpPairing.b2')],
                        }, function (response) {
                            if (response === 0) {
                                View.Dialog.openYesNoDialog({
                                    title: $.i18n.t('dialog.confirm.resetAndExit.title'),
                                    message: $.i18n.t('dialog.confirm.resetAndExit.message'),
                                }, function (res) {
                                    if (res === 0) {
                                        DPMW.appCtrl.clearCurrentDevice();
                                        _this.electron.remote.getCurrentWindow().close();
                                    }
                                });
                            }
                        });
                    }
                    else {
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                            type: errorInfo.type,
                        }, function (response) {
                            if (clearCurrentDevice) {
                                DPMW.appCtrl.clearCurrentDevice();
                                _this.electron.remote.getCurrentWindow().close();
                            }
                        });
                    }
                };
                ExplorerBaseView.prototype.changeDevice = function (deviceId) {
                    var _this = this;
                    if (DPMW.appCtrl.currentDevice) {
                        this.stopListening(DPMW.appCtrl.currentDevice);
                    }
                    var me = this;
                    DPMW.appCtrl.changeCurrentDevice(deviceId, {
                        success: function () {
                            DPMW.Model.appDataStore.reset(function (error) {
                                if (_.isUndefined(error)) {
                                    if (DPMW.appCtrl.currentDevice && DPMW.appCtrl.devices) {
                                        me.stopListening(DPMW.appCtrl.devices);
                                    }
                                    me.removeOldViews();
                                    Explorer.Status.viewStatus.reset();
                                    Explorer.Status.fetchStatus.reset();
                                    Explorer.Status.selectionStatus.reset();
                                    Explorer.Handler.dragAndDropHandler.initialize({
                                        success: function () {
                                        }, error: function (err) {
                                        }
                                    });
                                    if (process.platform === 'win32') {
                                        _this.remoteAutoBtPanConnector.stopScanDevice(function (error) {
                                            if (!error) {
                                                console.log('ScanDevice stopped');
                                            }
                                            else {
                                                console.log(error.message);
                                            }
                                        });
                                    }
                                    me.menu_.initMenuForCurrentDevice();
                                    me.displayDevice();
                                    Explorer.Handler.syncHandler.resetState();
                                    me.startAutoSyncPolling();
                                    me.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, me.connectionStateChanged);
                                }
                                else {
                                    View.Dialog.openErrorDialog({
                                        message: $.i18n.t('dialog.error.message.1', { errorCode: DPMW.mwe.genUserErrorCode(error) }),
                                        type: 'warning',
                                    }, function (response) {
                                        var browserWindow = _this.electron.remote.getCurrentWindow();
                                        browserWindow.close();
                                    });
                                }
                            });
                        },
                        error: function (err) {
                            console.log('appCtrl.changeCurrentDevice error. deviceId:' + deviceId);
                            _this.stopAutoSyncPolling();
                            me.removeOldViews();
                            Explorer.Status.viewStatus.reset();
                            Explorer.Status.fetchStatus.reset();
                            Explorer.Status.selectionStatus.reset();
                            Explorer.Handler.syncHandler.resetState();
                            me.menu_.initMenuForCurrentDevice();
                            me.connectFailed(err);
                            me.displayUnconnected();
                            if (process.platform === 'win32') {
                                _this.remoteAutoBtPanConnector.startScanDevice(function (error) {
                                    if (!error) {
                                        console.log('ScanDevice started');
                                    }
                                    else {
                                        console.log(error.message);
                                    }
                                });
                            }
                            me.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, me.connectionStateChanged);
                        }
                    });
                };
                ExplorerBaseView.prototype.startRecoverConnection = function () {
                    var self = this;
                    var portfwdr = require('electron').remote.require('mw-port-fwdr');
                    console.log('Connection recovery - Start.');
                    console.log('Recovers connection every ' + CONNECTION_RECOVERY_INTERVAL.toString() + ' seconds.');
                    clearInterval(self.connectionRecoveryIntervalId);
                    var mdnsSendCount = 0;
                    self.connectionRecoveryIntervalId = setInterval(function () {
                        if (portfwdr.isNowUsing()) {
                            if (mdnsSendCount == 0) {
                                self.discovery.scanDevicesEx();
                                mdnsSendCount++;
                            }
                            console.log("Don't recover, so \"portfwdr\" is trying to connect now.");
                        }
                        else {
                            self.discovery.requestRecoverLostConnection();
                            console.log('Recovering connection...');
                        }
                    }, 1000 * CONNECTION_RECOVERY_INTERVAL);
                };
                ExplorerBaseView.prototype.endRecoverConnection = function () {
                    console.log('Connection recovery - End.');
                    clearInterval(this.connectionRecoveryIntervalId);
                    this.connectionRecoveryIntervalId = undefined;
                    this.discovery.cancelRecoverLostConnection();
                };
                return ExplorerBaseView;
            }(Backbone.View));
            Explorer.ExplorerBaseView = ExplorerBaseView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerBaseView.js.map