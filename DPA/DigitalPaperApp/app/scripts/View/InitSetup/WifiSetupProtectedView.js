var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var InitSetup;
        (function (InitSetup) {
            var WifiSetupProtectedView = (function (_super) {
                __extends(WifiSetupProtectedView, _super);
                function WifiSetupProtectedView() {
                    _super.apply(this, arguments);
                    this.dialogController = null;
                    this.isStarted = false;
                }
                WifiSetupProtectedView.prototype.events = function () {
                    return {
                        "click #next": "goNext",
                        "click #cancel": "cancel",
                        "click #back": "goBack",
                    };
                };
                WifiSetupProtectedView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                    $('#pintext').hide();
                };
                WifiSetupProtectedView.prototype.toggleTabIndex = function () {
                    this.dialog_.firstItem = $('#wifiProtectedSetup-push-lbl');
                    this.dialog_.lastItem = $("#cancel", "#page-pc-wifi-setup-protected-view");
                };
                WifiSetupProtectedView.prototype.goNext = function (ev) {
                    var _this = this;
                    if (this.isStarted) {
                        return;
                    }
                    this.isStarted = true;
                    var device = DPMW.appCtrl.currentDevice;
                    var selected = $("[name=wifiProtectedSetup]:checked").val();
                    if (selected === 'push') {
                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.startButton({
                            success: function (odelOrCollection, response, options) {
                                var me = _this;
                                var handler = {
                                    canceled: function (dialogController) {
                                        me.isStarted = false;
                                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancel();
                                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancelFetchPolling();
                                        me.stopListening(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', me.wifiApWpsStatePolling);
                                    },
                                    closed: function () {
                                        if (me.isStarted) {
                                            me.isStarted = false;
                                            DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancel();
                                            DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancelFetchPolling();
                                            me.stopListening(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', me.wifiApWpsStatePolling);
                                        }
                                    }
                                };
                                var initData = new View.Dialog.DialogInfo.DialogWpsCountdownInfo();
                                initData.title = $.i18n.t('page.wifiDetail.label.wpsPush');
                                initData.message = $.i18n.t('page.wifiDetail.wpsPush.countDown');
                                _this.dialogController = View.Dialog.createWiFiWPSButtonDialog(initData, handler);
                                _this.listenTo(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', _this.wifiApWpsStatePolling);
                                DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.startFetchPolling();
                            },
                            error: function (odelOrCollection, response, options) {
                                _this.isStarted = false;
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
                                    case DPMW.mwe.E_MW_AUTH_FAILED:
                                    case DPMW.mwe.E_MW_DEVICE_CONN_FAILED:
                                    case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                    case DPMW.mwe.E_MW_WEBAPI_ERROR:
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                        break;
                                    case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                        var statusCode = void 0;
                                        var webApiResCode = void 0;
                                        if (response) {
                                            statusCode = response.status;
                                            if (response.responseJSON && typeof response.responseJSON.error_code === 'string') {
                                                webApiResCode = response.responseJSON.error_code;
                                            }
                                        }
                                        if (403 === statusCode) {
                                            if ('40304' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if (503 === statusCode) {
                                            if ('50301' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.41';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                            }
                                        }
                                        else if (500 <= statusCode && statusCode < 600) {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                        }
                                        else {
                                            errorInfo.msgId = 'dialog.error.message.37';
                                            errorInfo.type = 'none';
                                        }
                                        break;
                                    default:
                                        errorInfo.msgId = 'dialog.error.message.37';
                                        errorInfo.type = 'none';
                                        break;
                                }
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                    type: errorInfo.type,
                                }, function (response) {
                                });
                            }
                        });
                    }
                    else {
                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.startPin({
                            success: function (odelOrCollection, response, options) {
                                var me = _this;
                                var handler = {
                                    canceled: function (dialogController) {
                                        me.isStarted = false;
                                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancel();
                                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancelFetchPolling();
                                        me.stopListening(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', me.wifiApWpsStatePolling);
                                    },
                                    closed: function () {
                                        if (me.isStarted) {
                                            me.isStarted = false;
                                            DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancel();
                                            DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancelFetchPolling();
                                            me.stopListening(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', me.wifiApWpsStatePolling);
                                        }
                                    }
                                };
                                var initData = new View.Dialog.DialogInfo.DialogWpsCountdownInfo();
                                initData.title = $.i18n.t('page.wifiDetail.label.wpsPin');
                                initData.message = $.i18n.t('page.wifiDetail.wpsPin.countDown');
                                initData.pin = response.responseJSON.value;
                                _this.dialogController = View.Dialog.createWiFiWPSPinDialog(initData, handler);
                                _this.listenTo(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', _this.wifiApWpsStatePolling);
                                DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.startFetchPolling();
                            },
                            error: function (odelOrCollection, response, options) {
                                _this.isStarted = false;
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
                                    case DPMW.mwe.E_MW_AUTH_FAILED:
                                    case DPMW.mwe.E_MW_DEVICE_CONN_FAILED:
                                    case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                    case DPMW.mwe.E_MW_WEBAPI_ERROR:
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                        break;
                                    case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                        var statusCode = void 0;
                                        var webApiResCode = void 0;
                                        if (response) {
                                            statusCode = response.status;
                                            if (response.responseJSON && typeof response.responseJSON.error_code === 'string') {
                                                webApiResCode = response.responseJSON.error_code;
                                            }
                                        }
                                        if (403 === statusCode) {
                                            if ('40304' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if (408 === statusCode) {
                                            if ('50301' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.38';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if (503 === statusCode) {
                                            if ('50301' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.41';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                            }
                                        }
                                        else if (500 <= statusCode && statusCode < 600) {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                        }
                                        else {
                                            errorInfo.msgId = 'dialog.error.message.37';
                                            errorInfo.type = 'none';
                                        }
                                        break;
                                    default:
                                        errorInfo.msgId = 'dialog.error.message.37';
                                        errorInfo.type = 'none';
                                        break;
                                }
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                    type: errorInfo.type,
                                }, function (response) {
                                });
                            }
                        });
                    }
                };
                WifiSetupProtectedView.prototype.wifiApWpsStatePolling = function () {
                    var _this = this;
                    this.isStarted = false;
                    var wifiWpsState = DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel;
                    this.wifiResult = wifiWpsState.get(DPMW.Model.WiFiAPWpsDefs.ATTR_NAME_STATE);
                    if (this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_IN_PROGRESS ||
                        this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_NONE) {
                        return;
                    }
                    wifiWpsState.cancelFetchPolling();
                    this.dialogController.close();
                    DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel.cancel();
                    this.stopListening(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPWpsModel, 'sync', this.wifiApWpsStatePolling);
                    if (this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_SUCCESS) {
                        DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPCurrentStatusModel.fetch({
                            success: function (odelOrCollection, response, options) {
                                _this.gotFinish();
                            }, error: function (odelOrCollection, response, options) {
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
                                        if (403 === statusCode) {
                                            if ('40304' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.75';
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
                    }
                    else if (this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_TIMED_OUT) {
                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE, 'STATE_VALUE_TIMED_OUT. ');
                        var errCode = DPMW.mwe.genUserErrorCode(error);
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t('dialog.error.message.38', { errorCode: errCode }),
                            type: 'none',
                        }, function (response) { });
                    }
                    else if (this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_OVERLAP_ERROR) {
                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE, 'STATE_VALUE_OVERLAP_ERROR');
                        var errCode = DPMW.mwe.genUserErrorCode(error);
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t('dialog.error.message.40', { errorCode: errCode }),
                            type: 'none',
                        }, function (response) { });
                    }
                    else if (this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_WEP_PROHIBITED) {
                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE, 'STATE_VALUE_WEP_PROHIBITED ');
                        var errCode = DPMW.mwe.genUserErrorCode(error);
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t('dialog.error.message.39', { errorCode: errCode }),
                            type: 'none',
                        }, function (response) { });
                    }
                    else if (this.wifiResult === DPMW.Model.WiFiAPWpsDefs.STATE_VALUE_TKIP_ONLY_PROHIBITED) {
                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE, 'STATE_VALUE_TKIP_ONLY_PROHIBITED ');
                        var errCode = DPMW.mwe.genUserErrorCode(error);
                        View.Dialog.openErrorDialog({
                            message: $.i18n.t('dialog.error.message.39', { errorCode: errCode }),
                            type: 'none',
                        }, function (response) { });
                    }
                    else {
                        return;
                    }
                };
                WifiSetupProtectedView.prototype.gotFinish = function () {
                    _super.prototype.goNext.call(this, null);
                };
                WifiSetupProtectedView.prototype.getNextView = function () {
                    var ssid = DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPCurrentStatusModel.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_SSID);
                    var security = DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPCurrentStatusModel.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_SECURITY);
                    return new InitSetup.WifiSetupFinishView(this.dialog_, {
                        el: "#page-pc-wifi-setup-finish-view", id: "page-pc-wifi-setup-finish-view",
                        attributes: { menuId: 'menu-wifi', wifiMode: 0, success: true, ssid: ssid, security: security }
                    });
                };
                return WifiSetupProtectedView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.WifiSetupProtectedView = WifiSetupProtectedView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiSetupProtectedView.js.map