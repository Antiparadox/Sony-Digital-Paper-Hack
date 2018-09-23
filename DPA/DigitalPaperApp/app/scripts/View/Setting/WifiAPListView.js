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
            var CONNECTED = DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED;
            var CONNECTION_STATE = DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE;
            var WifiAPListView = (function (_super) {
                __extends(WifiAPListView, _super);
                function WifiAPListView(options) {
                    _super.call(this, options);
                }
                WifiAPListView.prototype.events = function () {
                    return {
                        "click #addWifiSetting-button": this.addWifiSetting,
                        "click #deleteWifiSetting-button": this.deleteWifiSetting,
                        "click #editWifiSetting-button": this.editWifiSetting,
                        "click #wifi-on": this.setWifiOn,
                        "click #wifi-off": this.setWifiOff,
                    };
                };
                WifiAPListView.prototype.initialize = function () {
                    var _this = this;
                    this.wifiAPViewList = new Array();
                    this.dialogControllers = new Array();
                    var device = DPMW.appCtrl.currentDevice;
                    var templateStr = $('#template_wifi_setting_section').text();
                    this.template_ = Hogan.compile(templateStr);
                    this.$el.html(this.template_.render({}));
                    this.ul = this.$('#wifi-list');
                    this.wifiOn = this.$('#wifi-on');
                    this.wifiOff = this.$('#wifi-off');
                    this.deleteWifiSettingButton = this.$('#deleteWifiSetting-button');
                    this.editWifiSettingButton = this.$('#editWifiSetting-button');
                    this.addWifiSettingButton = this.$('#addWifiSetting-button');
                    this.wifiOnLabelTabindex = +this.$('#wifi-on-label').attr('tabindex');
                    this.wifiOffLabelTabindex = +this.$('#wifi-off-label').attr('tabindex');
                    this.$('label[for][isRadioLabel]').on('keydown', function (ev) {
                        if (ev.which === 32) {
                            ev.preventDefault();
                            ev.stopImmediatePropagation();
                        }
                    });
                    this.$('label[for][isRadioLabel]').on('keyup', function (ev) {
                        _this.onRadioKeyup(ev);
                    });
                    this.$('input[type=radio] + label,input[type=checkbox] + label').mouseover(function (event) {
                        if ($(this).hasClass('disable'))
                            return;
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('hover-outline-appear').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('hover');
                        }
                    });
                    this.$('input[type=radio] + label,input[type=checkbox] + label').mouseout(function (event) {
                        if ($(this).hasClass('disable'))
                            return;
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('radio-border-clear');
                        }
                    });
                    this.$('input[type=radio] + label,input[type=checkbox] + label').mousedown(function (event) {
                        if ($(this).hasClass('disable'))
                            return;
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('pressed').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('pressed');
                        }
                    });
                    this.$('input[type=radio] + label,input[type=checkbox] + label').mouseup(function (event) {
                        if ($(this).hasClass('disable'))
                            return;
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('radio-border-clear');
                        }
                    });
                    this.$('input[type=radio] + label,input[type=checkbox] + label').focusout(function (event) {
                        if ($(this).hasClass('disable'))
                            return;
                        $(this).removeClass();
                        $(this).toggleClass('rest');
                    });
                    if (device.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE) === DPMW.Model.Device.VALUE_PHY_TYPE_OTHER) {
                        this.connectedByWireless = true;
                        this.disableWifiSetting(true);
                    }
                    this.listenTo(device, 'change:' + DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE, function (device, physicalType) {
                        if (physicalType === DPMW.Model.Device.VALUE_PHY_TYPE_USB) {
                            _this.connectedByWireless = false;
                            _this.disableWifiSetting(false);
                        }
                        else {
                            _this.connectedByWireless = true;
                            _this.disableWifiSetting(true);
                        }
                    });
                    this.listenTo(device.wifiSettingModel, 'sync', this.updateWifiStatus);
                    this.wifiAPCollection = device.wifiSettingModel.wifiAPRegisteredCollection;
                    this.listenTo(this.wifiAPCollection, 'sync', this.reloadList);
                    device.wifiSettingModel.fetch({
                        success: function () {
                            _this.updateWifiStatus();
                        },
                        error: this.onFetchError
                    });
                };
                WifiAPListView.prototype.render = function () {
                    return this;
                };
                WifiAPListView.prototype.reloadList = function (e) {
                    var me = this;
                    if (this.connectedByWireless) {
                        this.ul.addClass('disabled');
                    }
                    else {
                        this.ul.removeClass('disabled');
                    }
                    while (this.wifiAPViewList.length > 0) {
                        this.wifiAPViewList.pop().remove();
                    }
                    this.wifiAPCollection.each(function (wifiAP) {
                        var wifiAPView = me.addOne(wifiAP);
                        if (me.selectedWifiAPView && me.selectedWifiAPView.model.id === wifiAPView.model.id) {
                            wifiAPView.$el.addClass('selected');
                        }
                    });
                };
                WifiAPListView.prototype.beforeRemove = function () {
                    if (this.dialogControllers || this.dialogControllers.length > 0) {
                        this.dialogControllers.forEach(function (dialogController, index, array) {
                            dialogController.close();
                        });
                    }
                };
                WifiAPListView.prototype.setWifiOn = function () {
                    var device = DPMW.appCtrl.currentDevice;
                    if (this.wifiStatus === DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_ON) {
                        return;
                    }
                    var data = {};
                    data[DPMW.Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG] = DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_ON;
                    this.wifiStatus = DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_ON;
                    this.wifiOn.prop('disabled', true);
                    this.wifiOff.prop('disabled', true);
                    var me = this;
                    device.wifiSettingModel.save(data, {
                        success: function (modelOrCollection, res, options) {
                            device.wifiSettingModel.fetch({ error: me.onFetchError });
                            me.wifiOn.prop('disabled', false);
                            me.wifiOff.prop('disabled', false);
                        },
                        error: me.onWifiOnError,
                    });
                };
                WifiAPListView.prototype.setWifiOff = function () {
                    var device = DPMW.appCtrl.currentDevice;
                    if (this.wifiStatus === DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_OFF) {
                        return;
                    }
                    var data = {};
                    data[DPMW.Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG] = DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_OFF;
                    this.wifiStatus = DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_OFF;
                    this.wifiOn.prop('disabled', true);
                    this.wifiOff.prop('disabled', true);
                    this.deleteWifiSettingButton.prop('disabled', true);
                    this.editWifiSettingButton.prop('disabled', true);
                    this.addWifiSettingButton.prop('disabled', true);
                    this.$('#wifi-list-title').addClass('disable');
                    this.ul.addClass('disabled');
                    while (this.wifiAPViewList.length > 0) {
                        this.wifiAPViewList.pop().remove();
                    }
                    var me = this;
                    device.wifiSettingModel.save(data, {
                        success: function () {
                            device.wifiSettingModel.fetch({ error: me.onFetchError });
                            me.wifiOn.prop('disabled', false);
                            me.wifiOff.prop('disabled', false);
                        },
                        error: me.onWifiOffError,
                    });
                };
                WifiAPListView.prototype.keyHandler = function (e) {
                    var me = this;
                    var activeElement = document.activeElement;
                    var activeElementId = activeElement.id;
                    var activeElementLabel = $(activeElement).attr('for');
                    var code = e.keyCode || e.which;
                    switch (code) {
                        case 32:
                        case 13:
                            me.onWifiRadioButton(code, activeElementLabel, e);
                            break;
                        default:
                            break;
                    }
                };
                WifiAPListView.prototype.onRadioKeyup = function (ev) {
                    var me = this;
                    if (ev.which === 13 || ev.which === 32) {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        var radioId = ev.target.getAttribute('for');
                        var radio = this.$('#' + radioId);
                        if (radio.prop('checked')) {
                            return;
                        }
                        radio.prop('checked', true);
                        switch (radioId) {
                            case 'wifi-on':
                                me.setWifiOn();
                                break;
                            case 'wifi-off':
                                me.setWifiOff();
                                break;
                            default:
                                break;
                        }
                    }
                };
                WifiAPListView.prototype.onWifiRadioButton = function (keyCode, activeElementLabel, event) {
                    var me = this;
                    var activeRadioId = '#' + activeElementLabel;
                    var checked = $(activeRadioId).prop('checked');
                    if (keyCode === 32) {
                        if (activeElementLabel === 'wifi-on' || activeElementLabel === 'wifi-off') {
                            event.preventDefault();
                        }
                    }
                    if (!checked) {
                        $(activeRadioId).prop('checked', !checked);
                    }
                    switch (activeElementLabel) {
                        case 'wifi-on':
                            me.setWifiOn();
                            break;
                        case 'wifi-off':
                            me.setWifiOff();
                            break;
                        default:
                            break;
                    }
                };
                WifiAPListView.prototype.updateWifiStatus = function () {
                    var device = DPMW.appCtrl.currentDevice;
                    this.wifiStatus = device.wifiSettingModel.get(DPMW.Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG);
                    if (this.wifiStatus === DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_ON) {
                        this.wifiOn.prop('checked', true);
                        if (this.connectedByWireless) {
                            this.$('#wifi-list-title').addClass('disable');
                        }
                        else {
                            this.$('#wifi-list-title').removeClass('disable');
                        }
                        if (!this.connectedByWireless) {
                            this.addWifiSettingButton.prop('disabled', false);
                        }
                        this.wifiAPCollection.fetch({ reset: true, error: this.onFetchError });
                    }
                    else {
                        this.wifiOff.prop('checked', true);
                        this.$('#wifi-list-title').addClass('disable');
                        this.deleteWifiSettingButton.prop('disabled', true);
                        this.editWifiSettingButton.prop('disabled', true);
                        this.addWifiSettingButton.prop('disabled', true);
                        while (this.wifiAPViewList.length > 0) {
                            this.wifiAPViewList.pop().remove();
                        }
                        this.selectedWifiAPView = null;
                    }
                    if (!this.connectedByWireless) {
                        this.wifiOn.prop('disabled', false);
                        this.wifiOff.prop('disabled', false);
                    }
                };
                WifiAPListView.prototype.addOne = function (wifiAP) {
                    var view = new Setting.WifiAPView({ model: wifiAP, tagName: 'li' });
                    this.wifiAPViewList.push(view);
                    this.$("#wifi-list").append(view.render().el);
                    this.listenTo(view, 'clickWifiAP', this.selectWifiAP);
                    return view;
                };
                WifiAPListView.prototype.selectWifiAP = function (wifiAPView) {
                    if (this.connectedByWireless) {
                        return;
                    }
                    if (this.selectedWifiAPView && this.selectedWifiAPView.model.id === wifiAPView.model.id) {
                        wifiAPView.$el.removeClass('selected');
                        this.selectedWifiAPView = null;
                    }
                    else {
                        this.$('ul').children().removeClass('selected');
                        wifiAPView.$el.addClass('selected');
                        this.selectedWifiAPView = wifiAPView;
                    }
                    this.deleteWifiSettingButton.prop('disabled', this.selectedWifiAPView === null);
                    this.editWifiSettingButton.prop('disabled', this.selectedWifiAPView === null);
                };
                WifiAPListView.prototype.addWifiSetting = function () {
                    var _this = this;
                    var dialogController = null;
                    var handler = {
                        closed: function () {
                            _this.deleteDialogController(dialogController);
                            if (DPMW.appCtrl.currentDevice.get(CONNECTION_STATE) === CONNECTED) {
                                _this.wifiAPCollection.fetch({ error: _this.onFetchError });
                            }
                        }
                    };
                    var dialogInfo = new View.Dialog.DialogInfo.WindowWifiSettingInfo();
                    dialogInfo.deviceId = DPMW.appCtrl.currentDeviceId;
                    dialogController = View.Dialog.createWindowWiFiSetting(dialogInfo, handler);
                    this.dialogControllers.push(dialogController);
                };
                WifiAPListView.prototype.deleteWifiSetting = function () {
                    var _this = this;
                    View.Dialog.openYesNoDialog({
                        title: $.i18n.t('dialog.confirm.deleteWifi.title'),
                        message: $.i18n.t('dialog.confirm.deleteWifi.message', { ssid: this.selectedWifiAPView.model.get(DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID) }),
                    }, function (res) {
                        if (res === 0) {
                            _this.selectedWifiAPView.model.destroy({
                                success: function (modelOrCollection, res, options) {
                                    _this.wifiAPCollection.fetch({ error: _this.onFetchError });
                                    _this.selectedWifiAPView = null;
                                    _this.deleteWifiSettingButton.prop('disabled', true);
                                    _this.editWifiSettingButton.prop('disabled', true);
                                },
                                error: function (modelOrCollection, res, options) {
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
                                            if (res) {
                                                statusCode = res.status;
                                                if (res.responseJSON && typeof res.responseJSON.error_code === 'string') {
                                                    webApiResCode = res.responseJSON.error_code;
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
                                            else if (404 === statusCode) {
                                                if ('40401' === webApiResCode) {
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
                    });
                };
                WifiAPListView.prototype.editWifiSetting = function () {
                    var _this = this;
                    var dialogController = null;
                    var handler = {
                        closed: function () {
                            _this.deleteDialogController(dialogController);
                            if (DPMW.appCtrl.currentDevice.get(CONNECTION_STATE) === CONNECTED) {
                                _this.wifiAPCollection.fetch({ error: _this.onFetchError });
                            }
                        }
                    };
                    var wifiSettingInfo = new DPMW.View.Dialog.DialogInfo.WindowWifiSettingInfo;
                    wifiSettingInfo.deviceId = DPMW.appCtrl.currentDeviceId;
                    wifiSettingInfo.ssid = this.selectedWifiAPView.model.get(DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID);
                    wifiSettingInfo.security = this.selectedWifiAPView.model.get(DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY);
                    dialogController = View.Dialog.createWindowWiFiSetting(wifiSettingInfo, handler);
                    this.dialogControllers.push(dialogController);
                };
                WifiAPListView.prototype.onWifiOnError = function (modelOrCollection, res, options) {
                    var _this = this;
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
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                            break;
                        case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                            var statusCode = void 0;
                            var webApiResCode = void 0;
                            if (res) {
                                statusCode = res.status;
                                if (res.responseJSON && typeof res.responseJSON.error_code === 'string') {
                                    webApiResCode = res.responseJSON.error_code;
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
                        var device = DPMW.appCtrl.currentDevice;
                        device.wifiSettingModel.fetch({ error: _this.onFetchError });
                    });
                };
                WifiAPListView.prototype.onWifiOffError = function (modelOrCollection, res, options) {
                    var _this = this;
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
                            if (res) {
                                statusCode = res.status;
                                if (res.responseJSON && typeof res.responseJSON.error_code === 'string') {
                                    webApiResCode = res.responseJSON.error_code;
                                }
                            }
                            if (400 === statusCode) {
                                if ('40000' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                else if ('40001' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                else if ('40005' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                else {
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                }
                            }
                            else if (403 === statusCode) {
                                if ('40302' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                else if ('40307' === webApiResCode) {
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
                        var device = DPMW.appCtrl.currentDevice;
                        device.wifiSettingModel.fetch({ error: _this.onFetchError });
                    });
                };
                WifiAPListView.prototype.onFetchError = function (odelOrCollection, response, options) {
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
                };
                WifiAPListView.prototype.disableWifiSetting = function (disable) {
                    var _this = this;
                    if (disable === true) {
                        this.wifiOn.prop('disabled', true);
                        this.wifiOff.prop('disabled', true);
                        this.$('#wifi-on-label').addClass('disable');
                        this.$('#wifi-off-label').addClass('disable');
                        if (document.activeElement.id === 'wifi-on-label' || document.activeElement.id === 'wifi-off-label') {
                            $('#page-setting-view').focus();
                        }
                        this.$('#wifi-on-label').attr('tabindex', -1);
                        this.$('#wifi-off-label').attr('tabindex', -1);
                        this.addWifiSettingButton.prop('disabled', true);
                        this.deleteWifiSettingButton.prop('disabled', true);
                        this.editWifiSettingButton.prop('disabled', true);
                        if (this.selectedWifiAPView) {
                            this.selectedWifiAPView.$el.removeClass('selected');
                            this.selectedWifiAPView = null;
                        }
                        this.ul.addClass('disabled');
                        this.$('#wifi-setting-title').addClass('disable');
                        this.$('#wifi-list-title').addClass('disable');
                    }
                    else {
                        this.wifiOn.prop('disabled', false);
                        this.wifiOff.prop('disabled', false);
                        this.$('#wifi-on-label').removeClass('disable');
                        this.$('#wifi-off-label').removeClass('disable');
                        this.$('#wifi-on-label').attr('tabindex', this.wifiOnLabelTabindex);
                        this.$('#wifi-off-label').attr('tabindex', this.wifiOffLabelTabindex);
                        this.$('#wifi-setting-title').removeClass('disable');
                        DPMW.appCtrl.currentDevice.wifiSettingModel.fetch({
                            success: function () {
                                _this.updateWifiStatus();
                            },
                            error: this.onFetchError
                        });
                        this.ul.removeClass('disabled');
                    }
                };
                WifiAPListView.prototype.deleteDialogController = function (dialogController) {
                    for (var i = 0; i < this.dialogControllers.length; i++) {
                        if (this.dialogControllers[i] === dialogController) {
                            this.dialogControllers.splice(i, 1);
                        }
                    }
                };
                return WifiAPListView;
            }(Backbone.View));
            Setting.WifiAPListView = WifiAPListView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiAPListView.js.map