var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Setting;
        (function (Setting) {
            var InitSetup = DPMW.View.InitSetup;
            var WifiSettingView = (function (_super) {
                __extends(WifiSettingView, _super);
                function WifiSettingView(options) {
                    _super.call(this, options);
                    this.backTranslation = new Array(5);
                }
                WifiSettingView.prototype.initialize = function (options) {
                    var _this = this;
                    var me = this;
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    this.on('initValue', function (detail) {
                        if (!detail || typeof detail.deviceId !== 'string') {
                            console.log('deviceId is not specified');
                            var err = void 0;
                            if (!err) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'deviceId is not specified');
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
                                currentWindow.close();
                            });
                            return;
                        }
                        DPMW.appCtrl.initializeNew(detail.deviceId, {
                            success: function () {
                                DPMW.appCtrl.connectDevice({ success: function () {
                                        me.device = DPMW.appCtrl.currentDevice;
                                        var CONNECTION_STATE = DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE;
                                        me.listenTo(me.device, 'change:' + CONNECTION_STATE, me.deviceStateChange);
                                        if (detail.ssid || detail.security) {
                                            me._view = new InitSetup.WifiSetupManualView(_this.dialogWifiSetting, {
                                                el: "#page-pc-wifi-setup-manual-view", id: "page-pc-wifi-setup-manual-view",
                                                attributes: { menuId: 'menu-wifi', wifiMode: 2, editMode: 1, ssid: detail.ssid, security: detail.security }
                                            });
                                        }
                                        else {
                                            me._view = new InitSetup.WifiSetupView(_this.dialogWifiSetting, {
                                                el: "#page-pc-wifi-setup-view",
                                                id: "page-pc-wifi-setup-view",
                                                attributes: { menuId: 'menu-wifi', wifiMode: 1 }
                                            });
                                        }
                                        me._view.$el.show();
                                        me.listenTo(me._view, "next", me.goNext);
                                    }, error: function (err) {
                                        if (!err) {
                                            err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'deviceId is not specified');
                                        }
                                        var errCode = DPMW.mwe.genUserErrorCode(err);
                                        var errorInfo = { msgId: null, type: null };
                                        switch (err.mwCode) {
                                            case DPMW.mwe.E_MW_ALREADY_RUNNING:
                                                return;
                                            case DPMW.mwe.E_MW_DEVICE_CONN_FAILED:
                                                errorInfo.msgId = 'dialog.error.message.65';
                                                errorInfo.type = 'none';
                                                break;
                                            case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                                errorInfo.msgId = 'dialog.error.message.65';
                                                errorInfo.type = 'none';
                                                break;
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
                                        View.Dialog.openErrorDialog({
                                            message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                            type: errorInfo.type,
                                        }, function (response) {
                                            currentWindow.close();
                                        });
                                        return;
                                    } });
                            },
                            error: function (err) {
                                console.log('apCtrl.initialize error');
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
                                    currentWindow.close();
                                });
                                return;
                            }
                        });
                    });
                    $('body').on('keyup', function (e) {
                        me.keyDownHandler(e);
                    });
                    this.dialogWifiSetting = new Setting.DialogWifiSetting(this);
                };
                WifiSettingView.prototype.keyDownHandler = function (e) {
                    var me = this;
                    var activeElement = document.activeElement;
                    var activeElementId = activeElement.id;
                    var activeElementLabel = $(activeElement).attr('for');
                    var activeRadioId = '#' + activeElementLabel;
                    var checked = $(activeRadioId).prop('checked');
                    var code = e.which;
                    switch (code) {
                        case 27:
                            this._view.cancel(e);
                            break;
                        case 32:
                        case 13:
                            if (me._view instanceof InitSetup.WifiSetupView) {
                                switch (activeElementId) {
                                    case 'wifisetup-ssidlist-lbl':
                                    case 'wifiSetup-pin-lbl':
                                    case 'wifiSetup-ssid-lbl':
                                        if (!checked) {
                                            $(activeRadioId).prop('checked', !checked);
                                        }
                                        me._view.changeWifiSetup(e);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (me._view instanceof InitSetup.WifiSetupProtectedView) {
                                switch (activeElementId) {
                                    case 'wifiProtectedSetup-push-lbl':
                                    case 'wifiProtectedSetup-pin-lbl':
                                        if (!checked) {
                                            $(activeRadioId).prop('checked', !checked);
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if (me._view instanceof InitSetup.WifiSetupManualView) {
                                switch (activeElementId) {
                                    case 'securityDisplay-lbl':
                                        $(activeRadioId).prop('checked', !checked);
                                        me._view.clickSecurityDisplay(e);
                                        break;
                                    case 'dhcpCheck-lbl':
                                        $(activeRadioId).prop('checked', !checked);
                                        me._view.clikcDhcpCheck();
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                };
                WifiSettingView.prototype.goNext = function (nextView) {
                    var oldView = this._view;
                    this._view = nextView;
                    this._view.$el.show();
                    this._view.trigger('setDefaultFocus');
                    this.listenTo(this._view, "next", this.goNext);
                    this.listenTo(this._view, "back", this.goBack);
                    this.stopListening(oldView, "next");
                    this.stopListening(oldView, "back");
                    this.backTranslation.push(oldView);
                    oldView = null;
                    if (nextView instanceof InitSetup.WifiSetupProtectedView) {
                        nextView.toggleTabIndex();
                    }
                };
                WifiSettingView.prototype.goBack = function () {
                    var oldView = this._view;
                    this._view = this.backTranslation.pop();
                    this._view.$el.show();
                    this.listenTo(this._view, "next", this.goNext);
                    this.listenTo(this._view, "back", this.goBack);
                    this.stopListening(oldView, "next");
                    this.stopListening(oldView, "back");
                    oldView.undelegateEvents();
                    oldView = null;
                    if (this._view instanceof InitSetup.WifiSetupView) {
                        this._view.toggleTabIndex();
                    }
                    else if (this._view instanceof InitSetup.WifiSetupManualView) {
                        this._view.toggleTabIndex();
                    }
                };
                WifiSettingView.prototype.deviceStateChange = function () {
                    var DISCONNECTED = DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED;
                    var CONNECTION_STATE = DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE;
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    if (this.device.get(CONNECTION_STATE) === DISCONNECTED) {
                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'Device is diconnected ');
                        var options = {
                            message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(error) }),
                            type: 'none',
                        };
                        var callback = function (res) {
                            if (res === 0 || res === 1) {
                                currentWindow.close();
                            }
                        };
                        View.Dialog.openErrorDialog(options, callback);
                    }
                };
                return WifiSettingView;
            }(Backbone.View));
            Setting.WifiSettingView = WifiSettingView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiSettingView.js.map