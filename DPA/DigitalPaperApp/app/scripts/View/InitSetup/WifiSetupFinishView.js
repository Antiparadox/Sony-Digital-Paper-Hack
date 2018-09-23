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
            var FETCH_INTERVAL = 1000;
            var WifiSetupFinishView = (function (_super) {
                __extends(WifiSetupFinishView, _super);
                function WifiSetupFinishView(dialog, options) {
                    _super.call(this, dialog, options);
                    this._$wifiApInfo = null;
                    this._template = null;
                    this.wifiMode = this.attributes.wifiMode;
                    this._ssid = this.attributes.ssid;
                    this._security = this.attributes.security;
                    this.$('#status-ssid').text('');
                    this.$('#status-conn-success').hide();
                    this.$('#status-conn-wait').hide();
                    this.$('#status-conn-failure').show();
                    this.$('#status-conn-label').text($.i18n.t('page.wifiDetail.dpStatus.status.disconnect'));
                    var device = DPMW.appCtrl.currentDevice;
                    this._model = new DPMW.Model.WiFiAPConfigModel(null, { deviceModel: device });
                    this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID] = this._ssid;
                    this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY] = this._security;
                    var securityName;
                    if (this._security === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_NONSEC) {
                        securityName = $.i18n.t('page.wifiDetail.manual.secMethod.open');
                    }
                    else if (this._security === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_PSK) {
                        securityName = $.i18n.t('page.wifiDetail.manual.secMethod.wpa2Psk');
                    }
                    else {
                        securityName = $.i18n.t('page.wifiDetail.manual.secMethod.8021xEap');
                    }
                    this._model.attributes['security_name'] = securityName;
                    this._$wifiApInfo = this.$el.find('#saved-wifi-setting');
                    var templateStr = $('#saved-wifi-setting-template').html();
                    this._template = Hogan.compile(templateStr);
                    var wifiAPCurrentStatusModel = device.wifiSettingModel.wifiAPCurrentStatusModel;
                    this.listenTo(wifiAPCurrentStatusModel, 'sync', this.setWifiStatus);
                    this.listenTo(this._model, 'sync', this.render);
                    var me = this;
                    this._model.fetch({
                        success: function () {
                            wifiAPCurrentStatusModel.fetch({
                                error: me.onFetchError,
                            });
                        }
                    });
                }
                WifiSetupFinishView.prototype.events = function () {
                    return {
                        'click #next': 'goNext',
                        'click #cancel': 'cancel',
                        'click #back': 'goBack',
                        'click #close': 'close'
                    };
                };
                WifiSetupFinishView.prototype.render = function () {
                    var json = this._model.toJSON();
                    var networkMask = this._model.get('network_mask');
                    if (!_.isEmpty(networkMask)) {
                        var networkMaskName = $.i18n.t('wifi.netmask.list.mask' + networkMask);
                        json['network_mask_name'] = networkMaskName;
                    }
                    else {
                        json['network_mask_name'] = '';
                    }
                    this._$wifiApInfo.html(this._template.render(json));
                    if (this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DHCP] === 'true') {
                        $('#wifiFinishInfo .iparea').hide();
                    }
                    else {
                        $('#wifiFinishInfo .iparea').show();
                    }
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP])) {
                        $('#wifiFinishInfo .eap').hide();
                    }
                    else {
                        $('#wifiFinishInfo .eap').show();
                    }
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_PHASE2])) {
                        $('#wifiFinishInfo .eap_phase2').hide();
                    }
                    else {
                        $('#wifiFinishInfo .eap_phase2').show();
                    }
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CACERT])) {
                        $('#wifiFinishInfo .eap_cacert').hide();
                    }
                    else {
                        $('#wifiFinishInfo .eap_cacert').show();
                    }
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CERT])) {
                        $('#wifiFinishInfo .eap_cert').hide();
                    }
                    else {
                        $('#wifiFinishInfo .eap_cert').show();
                    }
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ID])) {
                        $('#wifiFinishInfo .eap_id').hide();
                    }
                    else {
                        $('#wifiFinishInfo .eap_id').show();
                    }
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ANID])) {
                        $('#wifiFinishInfo .eap_anid').hide();
                    }
                    else {
                        $('#wifiFinishInfo .eap_anid').show();
                    }
                    this._$wifiApInfo.removeClass('invisible');
                    this.dialog_.firstItem = $("#back", "#page-pc-wifi-setup-finish-view");
                    this.dialog_.lastItem = $("#close", "#page-pc-wifi-setup-finish-view");
                    return this;
                };
                WifiSetupFinishView.prototype.getNextView = function () {
                    if (0 === this.wifiMode) {
                        return new InitSetup.InitSetupFinishView(this.dialog_, {
                            el: "#page-pc-setup-finish-view", id: "page-pc-setup-finish-view",
                            attributes: { menuId: 'menu-finish' }
                        });
                    }
                };
                WifiSetupFinishView.prototype.close = function () {
                    if (process.platform === 'darwin') {
                        this.dialog_.checkCloseDialog(this.dialog_);
                        return;
                    }
                    close();
                };
                WifiSetupFinishView.prototype.setWifiStatus = function (statusModel, response, options) {
                    var _this = this;
                    var stat = statusModel.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_STATE);
                    var ssid = statusModel.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_SSID);
                    var CONNECTED = $.i18n.t('page.wifiDetail.dpStatus.status.connect');
                    var CONNECTING = $.i18n.t('page.wifiDetail.dpStatus.status.connecting');
                    var DISCONNECT = $.i18n.t('page.wifiDetail.dpStatus.status.disconnect');
                    var fetchInterval;
                    if (stat !== this.wifiStatus || ssid !== this.connSsid) {
                        this.wifiStatus = stat;
                        this.connSsid = ssid;
                        switch (stat) {
                            case DPMW.Model.WiFiAPStatusDefs.VALUE_STATE_CONNECTED:
                                this.$('#status-ssid').text(ssid);
                                this.$('#status-conn-wait').hide();
                                this.$('#status-conn-success').show();
                                this.$('#status-conn-failure').hide();
                                this.$('#status-conn-label').text(CONNECTED);
                                var security = statusModel.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_SECURITY);
                                if (ssid === this._model.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_SSID) &&
                                    security === this._model.get(DPMW.Model.WiFiAPStatusDefs.ATTR_NAME_SECURITY)) {
                                    this.$el.find('#back').addClass('ui-state-disabled');
                                }
                                break;
                            case DPMW.Model.WiFiAPStatusDefs.VALUE_STATE_CONNECTING:
                                this.$('#status-ssid').text(ssid);
                                this.$('#status-conn-success').hide();
                                this.$('#status-conn-failure').hide();
                                this.$('#status-conn-wait').show();
                                this.$('#status-conn-label').text(CONNECTING);
                                break;
                            case DPMW.Model.WiFiAPStatusDefs.VALUE_STATE_DISAVLED:
                            case DPMW.Model.WiFiAPStatusDefs.VALUE_STATE_SAVED:
                            case DPMW.Model.WiFiAPStatusDefs.VALUE_STATE_NONE:
                                this.$('#status-ssid').text('');
                                this.$('#status-conn-success').hide();
                                this.$('#status-conn-wait').hide();
                                this.$('#status-conn-failure').show();
                                this.$('#status-conn-label').text(DISCONNECT);
                                break;
                            default:
                                throw new Error('unknown wifi STATE: ${stat}.');
                                ;
                        }
                    }
                    if (stat === DPMW.Model.WiFiAPStatusDefs.VALUE_STATE_CONNECTED) {
                        fetchInterval = FETCH_INTERVAL * 6;
                    }
                    else {
                        fetchInterval = FETCH_INTERVAL;
                    }
                    setTimeout(function () {
                        statusModel.fetch({
                            error: _this.onFetchError,
                        });
                    }, fetchInterval);
                };
                WifiSetupFinishView.prototype.onFetchError = function (ModelOrCollection, response, options) {
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
                return WifiSetupFinishView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.WifiSetupFinishView = WifiSetupFinishView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiSetupFinishView.js.map