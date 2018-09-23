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
            var WifiSetupView = (function (_super) {
                __extends(WifiSetupView, _super);
                function WifiSetupView(dialog, options) {
                    _super.call(this, dialog, options);
                    this.SPECIFICATION_CODE_JP = 'J';
                    this.SPECIFICATION_CODE_CN = 'C';
                    this.BLUETOOHT_URL_DISPLAY = false;
                    this._wifiMode = this.attributes.wifiMode;
                    this._$listview = this.$el.find("#wifiSsidList");
                    this._$listview.hide();
                    var templateStr = $("#page-pc-wifi-setup-template").text();
                    this._template = Hogan.compile(templateStr);
                    this._$nextBtn = this.$el.find('#next');
                    this.nextBtnTabIndex = +$(this._$nextBtn).attr('tabindex');
                    this._$nextBtn.addClass('ui-state-disabled');
                    this._$nextBtn.attr('tabindex', -1);
                    this.listenToOnce(DPMW.appCtrl.currentDevice.wifiSettingModel, "sync", this.checkWifiState);
                    DPMW.appCtrl.currentDevice.wifiSettingModel.fetch();
                    this.listenTo(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPScannedCollection, "sync", this.render);
                    this.listenTo(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPScannedCollection, "error", this.onSsidListError);
                    this.$el.find('#back').addClass('ui-state-disabled');
                    if (0 === this._wifiMode) {
                        DPMW.Utils.WindowUtils.setWinClosable(false);
                    }
                    else if (1 === this._wifiMode) {
                        DPMW.Utils.WindowUtils.setWinClosable(true);
                    }
                    var skuCode = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE);
                    if (this.BLUETOOHT_URL_DISPLAY) {
                        if (skuCode === this.SPECIFICATION_CODE_JP) {
                            this.bluetoothUrl = $.i18n.t('page.wifiConf.bt.url.jp');
                        }
                        if (skuCode === this.SPECIFICATION_CODE_CN) {
                            this.bluetoothUrl = $.i18n.t('page.wifiConf.bt.url.cn');
                        }
                        else {
                            this.bluetoothUrl = $.i18n.t('page.wifiConf.bt.url.us');
                        }
                        var bluetoothUrl = this.$('#bluetoothUrl');
                        bluetoothUrl.html(this.bluetoothUrl);
                    }
                    else {
                        var bluetoothDiv = $('#bluetooth');
                        bluetoothDiv.hide();
                    }
                }
                WifiSetupView.prototype.onSsidListError = function (collection, response, options) {
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
                            else if (408 === statusCode) {
                                if ('40800' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.72';
                                    errorInfo.type = 'none';
                                }
                                else {
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                }
                            }
                            else if (503 === statusCode) {
                                if ('50301' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.91';
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
                    }, function (response) {
                    });
                };
                WifiSetupView.prototype.checkWifiState = function () {
                    var _this = this;
                    if (DPMW.appCtrl.currentDevice.wifiSettingModel.get(DPMW.Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG) === DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_OFF) {
                        var data = {};
                        data[DPMW.Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG] = DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_ON;
                        DPMW.appCtrl.currentDevice.wifiSettingModel.save(data, {
                            success: function (collection, response, options) {
                                _this.wifiSsidUpdate();
                            },
                            error: function (collection, response, options) {
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
                                        if (400 === statusCode) {
                                            if ('40000' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.93';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40001' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.93';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40005' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.93';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.93';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if (403 === statusCode) {
                                            if ('40302' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.43';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40307' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.92';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.93';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if (408 === statusCode) {
                                            if ('40800' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.45';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.93';
                                                errorInfo.type = 'none';
                                            }
                                        }
                                        else if (503 === statusCode) {
                                            if ('50301' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.44';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                            }
                                        }
                                        else if (400 <= statusCode && statusCode < 500) {
                                            errorInfo.msgId = 'dialog.error.message.93';
                                            errorInfo.type = 'none';
                                        }
                                        else {
                                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                        }
                                        break;
                                    default:
                                        errorInfo.msgId = 'dialog.error.message.93';
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
                        this.wifiSsidUpdate();
                    }
                };
                WifiSetupView.prototype.events = function () {
                    return {
                        "click #next": "goNext",
                        "click #cancel": "cancel",
                        "click #back": "goBack",
                        "click #skip": "skip",
                        "click #wifiSsidList li": "clickSsid",
                        "click #wifiSsidUpdate": "wifiSsidUpdate",
                        "click #bluetoothUrl": "clickBluetoothUrl",
                        "change [name=wifiSetup]": "changeWifiSetup",
                        "click #wifiSsidList": "clickWifiSsidList"
                    };
                };
                WifiSetupView.prototype.clickWifiSsidList = function (e) {
                    var selected = this.$el.find("[name=wifiSetup]:checked").val();
                    var len = this.$el.find('#wifiSsidList li[class="selected"]').length;
                    if ('ssid' === selected && this._$nextBtn.hasClass('ui-state-disabled') && len > 0) {
                        this._$nextBtn.removeClass('ui-state-disabled');
                        this._$nextBtn.attr('tabindex', this.nextBtnTabIndex);
                    }
                };
                WifiSetupView.prototype.changeWifiSetup = function (e) {
                    var selected = this.$el.find("[name=wifiSetup]:checked").val();
                    if ('ssid' === selected) {
                        var len = this.$el.find('#wifiSsidList li[class="selected"]').length;
                        if (len <= 0 && !this._$nextBtn.hasClass('ui-state-disabled')) {
                            this._$nextBtn.addClass('ui-state-disabled');
                            this._$nextBtn.attr('tabindex', -1);
                        }
                    }
                    else {
                        if (this._$nextBtn.hasClass('ui-state-disabled')) {
                            this._$nextBtn.removeClass('ui-state-disabled');
                            this._$nextBtn.attr('tabindex', this.nextBtnTabIndex);
                        }
                    }
                };
                WifiSetupView.prototype.clickBluetoothUrl = function () {
                    require('electron').shell.openExternal(this.bluetoothUrl);
                };
                WifiSetupView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                    $('input[type=radio] + label,input[type=checkbox] + label').mouseover(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('hover-outline-appear').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('hover');
                        }
                    });
                    $('input[type=radio] + label,input[type=checkbox] + label').mouseout(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('radio-border-clear');
                        }
                    });
                    $('input[type=radio] + label,input[type=checkbox] + label').mousedown(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('pressed').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('pressed');
                        }
                    });
                    $('input[type=radio] + label,input[type=checkbox] + label').mouseup(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('radio-border-clear');
                        }
                    });
                    $('input[type=radio] + label,input[type=checkbox] + label').focusout(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('rest');
                    });
                };
                WifiSetupView.prototype.toggleTabIndex = function () {
                    this.dialog_.firstItem = $('#wifisetup-ssidlist-lbl');
                    this.dialog_.lastItem = $("#cancel", "#page-pc-wifi-setup-view");
                };
                WifiSetupView.prototype.render = function () {
                    this.$el.find("#search-bar-waitting-icon").hide();
                    this._$listview.show();
                    var device = DPMW.appCtrl.currentDevice;
                    var currentSsid = device.wifiSettingModel.wifiAPCurrentStatusModel.get(DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID);
                    var currentsecurity = device.wifiSettingModel.wifiAPCurrentStatusModel.get(DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY);
                    var dataList = new Array();
                    var i = 0;
                    device.wifiSettingModel.wifiAPScannedCollection.each(function (wifiAp) {
                        var data = {};
                        data['ssid'] = wifiAp.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID];
                        var security = wifiAp.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY];
                        var securityName;
                        if (security === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_NONSEC) {
                            securityName = $.i18n.t('page.wifiDetail.manual.secMethod.open');
                        }
                        else if (security === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_PSK) {
                            securityName = $.i18n.t('page.wifiDetail.manual.secMethod.wpa2Psk');
                        }
                        else {
                            securityName = $.i18n.t('page.wifiDetail.manual.secMethod.8021xEap');
                        }
                        data['security'] = security;
                        data['security_name'] = securityName;
                        dataList[i] = data;
                        i++;
                    });
                    this._$listview.html('');
                    this._$listview.html(this._template.render({
                        aplist: JSON.parse(JSON.stringify(dataList))
                    }));
                    return this;
                };
                WifiSetupView.prototype.skip = function (ev) {
                    var initSetupFinishView = new InitSetup.InitSetupFinishView(this.dialog_, { el: "#page-pc-setup-finish-view", id: "page-pc-setup-finish-view", attributes: { menuId: 'menu-finish' } });
                    this.$el.hide();
                    this.trigger("next", initSetupFinishView);
                };
                WifiSetupView.prototype.getNextView = function () {
                    var selected = $("[name=wifiSetup]:checked").val();
                    var ret = null;
                    if ('protected' === selected) {
                        ret = new InitSetup.WifiSetupProtectedView(this.dialog_, {
                            el: "#page-pc-wifi-setup-protected-view", id: "page-pc-wifi-setup-protected-view",
                            attributes: { menuId: 'menu-wifi', wifiMode: this._wifiMode }
                        });
                    }
                    else if ('manual' === selected) {
                        ret = new InitSetup.WifiSetupManualView(this.dialog_, {
                            el: "#page-pc-wifi-setup-manual-view", id: "page-pc-wifi-setup-manual-view",
                            attributes: { menuId: 'menu-wifi', wifiMode: this._wifiMode, editMode: 0 }
                        });
                    }
                    else if ('ssid' === selected) {
                        var ssid_1;
                        var security_1;
                        _.each($('#wifiSsidList li'), function (e) {
                            if (e.getAttribute('class') === 'selected') {
                                ssid_1 = e.getAttribute('ssid');
                                security_1 = e.getAttribute('security');
                            }
                        });
                        if (DPMW.Utils.StringUtils.isEmpty(ssid_1) ||
                            DPMW.Utils.StringUtils.isEmpty(security_1)) {
                            return null;
                        }
                        ret = new InitSetup.WifiSetupManualView(this.dialog_, {
                            el: "#page-pc-wifi-setup-manual-view", id: "page-pc-wifi-setup-manual-view",
                            attributes: { menuId: 'menu-wifi', wifiMode: this._wifiMode, editMode: 1, ssid: ssid_1, security: security_1 }
                        });
                    }
                    return ret;
                };
                WifiSetupView.prototype.clickSsid = function (ev) {
                    $('#wifiSsidList li').removeClass('selected');
                    if (ev.target.tagName !== 'LI') {
                        ev.target.parentElement.setAttribute('class', 'selected');
                    }
                    else {
                        ev.target.setAttribute('class', 'selected');
                    }
                };
                WifiSetupView.prototype.wifiSsidUpdate = function () {
                    this.$el.find("#search-bar-waitting-icon").show();
                    this._$listview.hide();
                    this._$listview.html('');
                    DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPScannedCollection.fetch({ remove: true });
                    var selected = $("[name=wifiSetup]:checked").val();
                    if ('ssid' === selected && !this._$nextBtn.hasClass('ui-state-disabled')) {
                        this._$nextBtn.addClass('ui-state-disabled');
                        this._$nextBtn.attr('tabindex', -1);
                    }
                };
                return WifiSetupView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.WifiSetupView = WifiSetupView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiSetupView.js.map