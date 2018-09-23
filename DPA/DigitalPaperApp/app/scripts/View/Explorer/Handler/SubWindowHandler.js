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
                var SKU_CODE_VALUE;
                (function (SKU_CODE_VALUE) {
                    SKU_CODE_VALUE.JP = 'J';
                    SKU_CODE_VALUE.US = 'U';
                    SKU_CODE_VALUE.CN = 'C';
                })(SKU_CODE_VALUE || (SKU_CODE_VALUE = {}));
                var SubWindowHandler = (function (_super) {
                    __extends(SubWindowHandler, _super);
                    function SubWindowHandler() {
                        _super.call(this);
                        this.dialogSettingController = null;
                        this.dialogDeviceSearchController = null;
                        this.dialogInitSetUpController = null;
                        this.dialogAboutController = null;
                        this.dialogSoftwareUpdateCheckController = null;
                        this.dialogSoftwareUpdateFoundController = null;
                        this.dialogSoftwareUpdateDownloadProgressController = null;
                        this.dialogSoftwareUpdateTransferProgressController = null;
                        this.dialogExternalOutputController = null;
                        this.electron = require('electron');
                    }
                    SubWindowHandler.prototype.openWindowSetting = function () {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            return activeSubWindow;
                        }
                        var settingHandler = {
                            dialogRelay: function (dialogRelayInfo) {
                                if (dialogRelayInfo.dialogName === View.Dialog.DialogName.WINDOW_DEVICE_SEARCH) {
                                    _this.relayToDeviceSearch(_this.dialogSettingController);
                                }
                            },
                            closed: function () {
                                _this.dialogSettingController = null;
                                _this.trigger('WindowSettingClosed');
                            },
                            submit: function (data, options) {
                                var template_file = data.template_file;
                                var template_name = data.template_name;
                                if (DPMW.appCtrl.currentDevice.deviceFirmwareModel.isUploading()) {
                                    var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'firmware uploading.');
                                    _this.dialogSettingController.error(mwerr);
                                    return;
                                }
                                var transfer = DPMW.appCtrl.currentDevice.getNoteTemplateTransfer();
                                transfer.uploadNoteTemplate(template_file, template_name, function (mwerr) {
                                    if (mwerr) {
                                        _this.dialogSettingController.error({ uploadNoteTemplate: true, mwerr: mwerr });
                                        return;
                                    }
                                    _this.dialogSettingController.success();
                                });
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowSettingInfo();
                        if (DPMW.appCtrl.currentDeviceId) {
                            initData.deviceId = DPMW.appCtrl.currentDeviceId;
                        }
                        this.dialogSettingController = View.Dialog.openSetting(initData, settingHandler);
                        return null;
                    };
                    SubWindowHandler.prototype.openExternalOutput = function () {
                        var me = this;
                        var activeSubWindow = me.getActiveSubWindow();
                        if (activeSubWindow) {
                            return activeSubWindow;
                        }
                        var handler = {
                            dialogShowed: function () {
                            },
                            closed: function () {
                                me.dialogExternalOutputController = null;
                            },
                        };
                        var initData = new View.Dialog.DialogInfo.WindowExternalOutputInfo();
                        if (DPMW.appCtrl.currentDeviceId) {
                            initData.deviceId = DPMW.appCtrl.currentDeviceId;
                        }
                        me.dialogExternalOutputController = View.Dialog.openExternalOutput(initData, handler);
                        return null;
                    };
                    SubWindowHandler.prototype.openWindowDeviceSearch = function () {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            return activeSubWindow;
                        }
                        var deviceSearchHandler = {
                            dialogRelay: function (dialogRelayInfo) {
                                if (dialogRelayInfo.dialogName === View.Dialog.DialogName.WINDOW_INIT_SETUP) {
                                    _this.relayToInitSetUp(dialogRelayInfo.dialogInfo, _this.dialogDeviceSearchController);
                                }
                            },
                            closed: function () {
                                _this.dialogDeviceSearchController = null;
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowDeviceSearchInfo();
                        if (DPMW.appCtrl.currentDeviceId) {
                            initData.deviceId = DPMW.appCtrl.currentDeviceId;
                        }
                        this.dialogDeviceSearchController = View.Dialog.openDeviceSearch(initData, deviceSearchHandler);
                        return null;
                    };
                    SubWindowHandler.prototype.openWindowInitSetUp = function (deviceId) {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            return activeSubWindow;
                        }
                        var initSetUpHandler = {
                            submit: function (data, dialogController) {
                                var deviceId;
                                console.log(data);
                                if (data && typeof data.deviceId === 'string') {
                                    deviceId = data.deviceId;
                                }
                                dialogController.close();
                                _this.dialogDeviceSearchController = null;
                                _this.trigger('changeDeviceRequest', deviceId);
                            },
                            closed: function () {
                                _this.dialogInitSetUpController = null;
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowInitSetupInfo();
                        initData.deviceId = deviceId;
                        this.dialogInitSetUpController = View.Dialog.openInitSetup(initData, initSetUpHandler);
                        this.trigger('openInitSetup');
                        return null;
                    };
                    SubWindowHandler.prototype.openWindowAbout = function () {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            return activeSubWindow;
                        }
                        var handler = {
                            closed: function () {
                                _this.dialogAboutController = null;
                            }
                        };
                        this.dialogAboutController = View.Dialog.openAbout({ version: process.env.MW_APP_VERSION }, handler);
                        return null;
                    };
                    SubWindowHandler.prototype.startSoftwareUpdate = function () {
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            console.warn('[ERROR] startSoftwareUpdate()');
                            return false;
                        }
                        View.Dialog.startPseudoModal();
                        return true;
                    };
                    SubWindowHandler.prototype.endSoftwareUpdate = function () {
                        View.Dialog.endPseudoModal();
                    };
                    SubWindowHandler.prototype.openWindowSoftwareUpdateCheck = function (eventListener) {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            console.error('[ERROR] openWindowSoftwareUpdateCheck()');
                            return false;
                        }
                        var handler = {
                            dialogShowed: function () {
                                eventListener.onDialogShown();
                            },
                            closed: function () {
                                _this.dialogSoftwareUpdateCheckController = null;
                                eventListener.onCancelled();
                            },
                        };
                        var initData = new View.Dialog.DialogInfo.DialogLoadingInfo();
                        initData.title = $.i18n.t('dialog.wait.title');
                        initData.message = $.i18n.t('dialog.wait.message');
                        this.dialogSoftwareUpdateCheckController = View.Dialog.createDialogLoading(initData, handler, false);
                        return true;
                    };
                    SubWindowHandler.prototype.closeWindowSoftwareUpdateCheck = function () {
                        if (this.dialogSoftwareUpdateCheckController) {
                            this.dialogSoftwareUpdateCheckController.close();
                            this.dialogSoftwareUpdateCheckController = null;
                        }
                    };
                    SubWindowHandler.prototype.openWindowSoftwareUpdateFound = function (updateInfo, eventListener) {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            console.error('[ERROR] openWindowSoftwareUpdate()');
                            return false;
                        }
                        var downloadClicked = false;
                        var handler = {
                            submit: function (data, options) {
                                downloadClicked = true;
                                eventListener.onDownloadClicked();
                                _this.dialogSoftwareUpdateFoundController.close();
                                _this.dialogSoftwareUpdateFoundController = null;
                            },
                            closed: function () {
                                if (!downloadClicked) {
                                    eventListener.onCancelled();
                                }
                                _this.dialogSoftwareUpdateFoundController = null;
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowSoftwareUpdateFoundInfo();
                        initData.updateType = updateInfo.updateType;
                        initData.newVersion = updateInfo.newVersion;
                        initData.oldVersion = updateInfo.currentVersion;
                        initData.description = updateInfo.description;
                        initData.disclaimer = updateInfo.disclaimer;
                        initData.eula = updateInfo.eula;
                        this.dialogSoftwareUpdateFoundController = View.Dialog.openSoftwareUpdateFound(initData, handler);
                        return true;
                    };
                    SubWindowHandler.prototype.closeWindowSoftwareUpdateFound = function () {
                        if (this.dialogSoftwareUpdateFoundController) {
                            this.dialogSoftwareUpdateFoundController.close();
                            this.dialogSoftwareUpdateFoundController = null;
                        }
                    };
                    SubWindowHandler.prototype.openWindowSoftwareUpdateDownloadProgress = function (updateType, eventListener) {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            console.error('[ERROR] openWindowSoftwareUpdateProgress()');
                            return false;
                        }
                        var handler = {
                            dialogShowed: function () {
                                eventListener.onDialogShown();
                            },
                            closed: function () {
                                eventListener.onCancelled();
                                _this.dialogSoftwareUpdateDownloadProgressController = null;
                            },
                            getProgress: function (dialogController) {
                                dialogController.sendProgress(Handler.softwareUpdateUtils.getDownloadProgress());
                                return 0;
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowSoftwareUpdateProgressInfo();
                        initData.updateType = updateType;
                        initData.progressType = View.SoftwareUpdate.PROGRESS_TYPE.DOWNLOAD;
                        this.dialogSoftwareUpdateDownloadProgressController = View.Dialog.openSoftwareUpdateProgress(initData, handler);
                        return true;
                    };
                    SubWindowHandler.prototype.closeWindowSoftwareUpdateDownloadProgress = function () {
                        if (this.dialogSoftwareUpdateDownloadProgressController) {
                            this.dialogSoftwareUpdateDownloadProgressController.close();
                            this.dialogSoftwareUpdateDownloadProgressController = null;
                        }
                    };
                    SubWindowHandler.prototype.openWindowSoftwareUpdateTransferProgress = function (updateType, eventListener) {
                        var _this = this;
                        var activeSubWindow = this.getActiveSubWindow();
                        if (activeSubWindow) {
                            console.error('[ERROR] openWindowSoftwareUpdateProgress()');
                            return false;
                        }
                        var handler = {
                            dialogShowed: function () {
                                eventListener.onDialogShown();
                            },
                            closed: function () {
                                eventListener.onCancelled();
                                _this.dialogSoftwareUpdateTransferProgressController = null;
                            },
                            getProgress: function (dialogController) {
                                dialogController.sendProgress(Handler.softwareUpdateUtils.getTransferProgress());
                                return 0;
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowSoftwareUpdateProgressInfo();
                        initData.updateType = updateType;
                        initData.progressType = View.SoftwareUpdate.PROGRESS_TYPE.TRANSFER;
                        this.dialogSoftwareUpdateTransferProgressController = View.Dialog.openSoftwareUpdateProgress(initData, handler);
                        return true;
                    };
                    SubWindowHandler.prototype.closeWindowSoftwareUpdateTransferProgress = function () {
                        if (this.dialogSoftwareUpdateTransferProgressController) {
                            this.dialogSoftwareUpdateTransferProgressController.close();
                            this.dialogSoftwareUpdateTransferProgressController = null;
                        }
                    };
                    SubWindowHandler.prototype.getActiveSubWindow = function () {
                        if (this.dialogSettingController) {
                            console.log('[getActiveSubWindow] Setting Dialog is active');
                            return this.dialogSettingController;
                        }
                        if (this.dialogDeviceSearchController) {
                            console.log('[getActiveSubWindow] Device Search Dialog is active');
                            return this.dialogDeviceSearchController;
                        }
                        if (this.dialogExternalOutputController) {
                            console.log('[getActiveSubWindow] External Output Dialog is active');
                            return this.dialogExternalOutputController;
                        }
                        if (this.dialogInitSetUpController) {
                            console.log('[getActiveSubWindow] Init Setup Dialog is active');
                            return this.dialogInitSetUpController;
                        }
                        if (this.dialogAboutController) {
                            console.log('[getActiveSubWindow] About Dialog is active');
                            return this.dialogAboutController;
                        }
                        if (this.dialogSoftwareUpdateCheckController) {
                            console.log('[getActiveSubWindow] Software Update Check Dialog is active');
                            return this.dialogSoftwareUpdateCheckController;
                        }
                        if (this.dialogSoftwareUpdateFoundController) {
                            console.log('[getActiveSubWindow] Software Update Found Dialog is active');
                            return this.dialogSoftwareUpdateFoundController;
                        }
                        if (this.dialogSoftwareUpdateDownloadProgressController) {
                            console.log('[getActiveSubWindow] Software Update Download Progress Dialog is active');
                            return this.dialogSoftwareUpdateDownloadProgressController;
                        }
                        if (this.dialogSoftwareUpdateTransferProgressController) {
                            console.log('[getActiveSubWindow] Software Update Transfer Progress Dialog is active');
                            return this.dialogSoftwareUpdateTransferProgressController;
                        }
                        return null;
                    };
                    SubWindowHandler.prototype.openHelpGuide = function () {
                        var url;
                        url = $.i18n.t('help.onlineHelp.url');
                        this.electron.shell.openExternal(url);
                    };
                    SubWindowHandler.prototype.openHelpSupport = function () {
                        var url;
                        if (DPMW.Utils.StringUtils.isEmpty(DPMW.appCtrl.currentDeviceId)) {
                            var navigatorLanguage = navigator.language ? navigator.language.toLowerCase() : '';
                            if (navigatorLanguage === 'ja') {
                                url = $.i18n.t('help.launchSupportSite.url.jp');
                            }
                            else if ((navigatorLanguage === 'zh') || (navigatorLanguage.indexOf('zh-cn') === 0)) {
                                url = $.i18n.t('help.launchSupportSite.url.cn');
                            }
                            else {
                                url = $.i18n.t('help.launchSupportSite.url.us');
                            }
                        }
                        else {
                            var skuCode = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE);
                            if (skuCode === SKU_CODE_VALUE.JP) {
                                url = $.i18n.t('help.launchSupportSite.url.jp');
                            }
                            else if (skuCode === SKU_CODE_VALUE.CN) {
                                url = $.i18n.t('help.launchSupportSite.url.cn');
                            }
                            else {
                                url = $.i18n.t('help.launchSupportSite.url.us');
                            }
                        }
                        this.electron.shell.openExternal(url);
                    };
                    SubWindowHandler.prototype.relayToDeviceSearch = function (relayerDialogController) {
                        var _this = this;
                        var deviceSearchHandler = {
                            dialogShowed: function (dialogController) {
                                if (relayerDialogController) {
                                    relayerDialogController.close();
                                    _this.dialogSettingController = null;
                                    _this.dialogDeviceSearchController.focus();
                                }
                            },
                            dialogRelay: function (dialogRelayInfo) {
                                if (dialogRelayInfo.dialogName === View.Dialog.DialogName.WINDOW_INIT_SETUP) {
                                    if (Handler.transferProgressHandler.isUploadRunning() ||
                                        Handler.transferProgressHandler.isDownloadRunning() ||
                                        Handler.fileManageHandler.isRunning() ||
                                        Handler.syncHandler.isSyncRunning()) {
                                        var promises = [];
                                        promises.push(new Promise(function (resolve, reject) {
                                            Handler.transferProgressHandler.cancelAllDownloadTasks(function () {
                                                resolve();
                                            });
                                        }));
                                        promises.push(new Promise(function (resolve, reject) {
                                            Handler.transferProgressHandler.cancelAllUploadTasks(function () {
                                                resolve();
                                            });
                                        }));
                                        promises.push(new Promise(function (resolve, reject) {
                                            Handler.syncHandler.cancelSync({
                                                success: function () {
                                                    resolve();
                                                },
                                                error: function (err) {
                                                    return;
                                                }
                                            });
                                        }));
                                        Promise.all(promises).then(function () {
                                            _this.relayToInitSetUp(dialogRelayInfo.dialogInfo, _this.dialogDeviceSearchController);
                                        });
                                    }
                                    else {
                                        _this.relayToInitSetUp(dialogRelayInfo.dialogInfo, _this.dialogDeviceSearchController);
                                    }
                                }
                            },
                            closed: function () {
                                _this.dialogDeviceSearchController = null;
                            }
                        };
                        var initData = new View.Dialog.DialogInfo.WindowDeviceSearchInfo();
                        if (DPMW.appCtrl.currentDeviceId) {
                            initData.deviceId = DPMW.appCtrl.currentDeviceId;
                        }
                        this.dialogDeviceSearchController = View.Dialog.openDeviceSearch(initData, deviceSearchHandler);
                    };
                    SubWindowHandler.prototype.relayToInitSetUp = function (dialogInfo, relayerDialogController) {
                        var _this = this;
                        var initSetUpHandler = {
                            dialogShowed: function (dialogController) {
                                if (relayerDialogController) {
                                    relayerDialogController.close();
                                    _this.dialogDeviceSearchController = null;
                                    _this.dialogInitSetUpController.focus();
                                }
                            },
                            submit: function (data, dialogController) {
                                var deviceId;
                                console.log(data);
                                if (data && typeof data.deviceId === 'string') {
                                    deviceId = data.deviceId;
                                }
                                dialogController.close();
                                _this.dialogDeviceSearchController = null;
                                _this.trigger('changeDeviceRequest', deviceId);
                            },
                            closed: function () {
                                _this.dialogInitSetUpController = null;
                            }
                        };
                        this.dialogInitSetUpController = View.Dialog.openInitSetup(dialogInfo, initSetUpHandler);
                        this.trigger('openInitSetup');
                    };
                    return SubWindowHandler;
                }(Backbone.EventsAdopter));
                Handler.SubWindowHandler = SubWindowHandler;
                Handler.subWindowHandler = new SubWindowHandler();
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SubWindowHandler.js.map