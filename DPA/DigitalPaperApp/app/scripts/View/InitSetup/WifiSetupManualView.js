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
            var WifiSetupManualView = (function (_super) {
                __extends(WifiSetupManualView, _super);
                function WifiSetupManualView(dialog, options) {
                    var _this = this;
                    _super.call(this, dialog, options);
                    this._$listview = null;
                    this._$caCertificateList = null;
                    this._$clientCertificateList = null;
                    this._template = null;
                    this._certificateTemplate = null;
                    this.allDisplay = ['tr_eapMethod', 'tr_phase2Auth', 'tr_caCertificate', 'tr_identity', 'tr_anonymousIdentity', 'tr_clientCertificate', 'tr_passowrd'];
                    this.openDisplay = [];
                    this.pskDisplay = ['tr_passowrd'];
                    this.eapPeapDisplay = ['tr_eapMethod', 'tr_phase2Auth', 'tr_caCertificate', 'tr_identity', 'tr_anonymousIdentity', 'tr_clientCertificate', 'tr_passowrd'];
                    this.eapTlsDisplay = ['tr_eapMethod', 'tr_phase2Auth', 'tr_caCertificate', 'tr_identity', 'tr_clientCertificate'];
                    var device = DPMW.appCtrl.currentDevice;
                    this._$listview = this.$el.find('#ssidlistarea');
                    this._$caCertificateList = this.$el.find('#eap_cacert');
                    this._$clientCertificateList = this.$el.find('#eap_cert');
                    this._wifiMode = this.attributes.wifiMode;
                    this._editMode = _.isUndefined(this.attributes.editMode) ? 0 : this.attributes.editMode;
                    this._ssid = this.attributes.ssid;
                    this._security = this.attributes.security;
                    this._certificateTemplate = Hogan.compile($('#wifi-manual-certificate').text());
                    this._caCertficateList = device.wifiSettingModel.wifiCertCACollection;
                    this.listenTo(this._caCertficateList, 'sync', this.fetchCaCertificateList);
                    this.listenTo(this._caCertficateList, 'error', this.onFetchError);
                    this._caCertficateList.fetch();
                    this._clientCertficateList = device.wifiSettingModel.wifiCertClientCollection;
                    this.listenTo(this._clientCertficateList, 'sync', this.fetchClientCertificateList);
                    this.listenTo(this._clientCertficateList, 'error', this.onFetchError);
                    this._clientCertficateList.fetch();
                    if (1 === this._editMode) {
                        device.wifiSettingModel.wifiAPRegisteredCollection.fetch();
                        var templateStr = $('#wifi-edit-edit').text();
                        this._template = Hogan.compile(templateStr);
                        this.listenTo(device.wifiSettingModel.wifiAPRegisteredCollection, 'sync', this.renderEditMode);
                        this.listenTo(device.wifiSettingModel.wifiAPRegisteredCollection, 'error', this.onFetchError);
                    }
                    else {
                        var templateStr = $('#wifi-manual-edit').text();
                        this._template = Hogan.compile(templateStr);
                        this.renderManualMode();
                    }
                    if (2 === this._wifiMode) {
                        this.$el.find('#back').addClass('ui-state-disabled');
                        this.$el.find('#back').attr('tabindex', -1);
                    }
                    this.listenTo(device.deviceMacAddressModel, 'sync', this.renderMacAddress);
                    this.listenTo(device.deviceMacAddressModel, 'error', this.onFetchError);
                    DPMW.appCtrl.currentDevice.deviceMacAddressModel.fetch();
                    if (0 === this._wifiMode) {
                        DPMW.Utils.WindowUtils.setWinClosable(false);
                    }
                    else if (1 === this._wifiMode || 1 === this._editMode) {
                        DPMW.Utils.WindowUtils.setWinClosable(true);
                    }
                    this.listenTo(this, 'setDefaultFocus', function () {
                        _this.$('#ssid').focus();
                        _this.$('#ssid').addClass('outline-clear');
                    });
                }
                WifiSetupManualView.prototype.onFetchError = function (odelOrCollection, response, options) {
                    var self = this;
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
                        self.goBack(null);
                    });
                };
                WifiSetupManualView.prototype.events = function () {
                    return {
                        'click #next': 'goNextBtn',
                        'click #cancel': 'cancel',
                        'click #back': 'goBack',
                        'change #securityType': 'changeSecurityType',
                        'change #wifilist': 'changeWifiList',
                        'click #dhcpCheck': 'clikcDhcpCheck',
                        'click #securityDisplay': 'clickSecurityDisplay',
                        'change #eap': 'changeEapMethod',
                        'change #caCertificateFile': 'inputCaCertificateFile',
                        'change #clientCertificateFile': 'inputclientCertificateFile',
                        'click #uploadCaCert': 'uploadCaCert',
                        'click #uploadClientCert': 'uploadClientCert'
                    };
                };
                WifiSetupManualView.prototype.renderMacAddress = function () {
                    this.$('#macAddress').text(DPMW.appCtrl.currentDevice.deviceMacAddressModel.get(DPMW.Model.Device.ATTR_NAME_MAC_ADDRESS));
                };
                WifiSetupManualView.prototype.uploadCaCert = function () {
                    var _this = this;
                    var dialog = require('electron').remote.dialog;
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    var options = {
                        properties: ['openFile']
                    };
                    dialog.showOpenDialog(currentWindow, options, function (files) {
                        if (files) {
                            _this.inputCaCertificateFile(files[0]);
                        }
                    });
                };
                WifiSetupManualView.prototype.uploadClientCert = function () {
                    var _this = this;
                    var dialog = require('electron').remote.dialog;
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    var options = {
                        properties: ['openFile']
                    };
                    dialog.showOpenDialog(currentWindow, options, function (files) {
                        if (files) {
                            _this.inputclientCertificateFile(files[0]);
                        }
                    });
                };
                WifiSetupManualView.prototype.inputCaCertificateFile = function (path) {
                    var fileName = this.getFileName(path);
                    var dialogController = null;
                    var handler = {
                        submit: function (detail, dialogController) {
                            var device = DPMW.appCtrl.currentDevice;
                            var creteName = detail.editbox;
                            dialogController.close();
                            if (DPMW.Utils.StringUtils.isEmpty(creteName)) {
                                return;
                            }
                            device.wifiSettingModel.wifiCertCACollection.upload(path, fileName, creteName, {
                                success: function (modelOrCollection, response, options) {
                                    device.wifiSettingModel.wifiCertCACollection.fetch();
                                }, error: function (modelOrCollection, response, options) {
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
                                        case DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED:
                                            if (err.cause && err.cause.path) {
                                                errorInfo.msgId = 'dialog.error.message.76';
                                                errorInfo.type = 'none';
                                                View.Dialog.openErrorDialog({
                                                    message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                    type: errorInfo.type,
                                                }, function (response) {
                                                });
                                                return;
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.48';
                                                errorInfo.type = 'none';
                                            }
                                            break;
                                        case DPMW.mwe.E_MW_FILE_SIZE_EXCEED_LIMIT:
                                            errorInfo.msgId = 'dialog.error.message.46';
                                            errorInfo.type = 'none';
                                            break;
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
                                                    errorInfo.msgId = 'dialog.error.message.48';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40001' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.48';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40003' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.48';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40006' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.47';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40013' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.46';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40014' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.48';
                                                    errorInfo.type = 'none';
                                                }
                                                else {
                                                    errorInfo.msgId = 'dialog.error.message.48';
                                                    errorInfo.type = 'none';
                                                }
                                            }
                                            else if (500 <= statusCode && statusCode < 600) {
                                                errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.48';
                                                errorInfo.type = 'none';
                                            }
                                            break;
                                        default:
                                            errorInfo.msgId = 'dialog.error.message.48';
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
                        },
                        colsed: function () {
                        }
                    };
                    var initData = new View.Dialog.DialogInfo.DialogEditInfo();
                    initData.title = $.i18n.t('dialog.edit.installCertName.title');
                    initData.message = $.i18n.t('dialog.edit.installCertName.message');
                    initData.masking = false;
                    dialogController = View.Dialog.createDialogEdit(initData, handler);
                };
                WifiSetupManualView.prototype.inputclientCertificateFile = function (path) {
                    var creteName;
                    var password;
                    var fileName = this.getFileName(path);
                    var dialogController = null;
                    var handler = {
                        submit: function (detail, dialogController) {
                            dialogController.close();
                            creteName = detail.editbox;
                            if (DPMW.Utils.StringUtils.isEmpty(creteName)) {
                                return;
                            }
                            var dialogControllerPass = null;
                            var handlerPass = {
                                submit: function (detailPass, dialogControllerPssss) {
                                    dialogControllerPssss.close();
                                    password = detailPass.editbox;
                                    if (DPMW.Utils.StringUtils.isEmpty(password)) {
                                        return;
                                    }
                                    var device = DPMW.appCtrl.currentDevice;
                                    device.wifiSettingModel.wifiCertClientCollection.upload(path, fileName, creteName, password, {
                                        success: function (modelOrCollection, response, options) {
                                            device.wifiSettingModel.wifiCertClientCollection.fetch();
                                        }, error: function (modelOrCollection, response, options) {
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
                                                case DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED:
                                                    if (err.cause && err.cause.path) {
                                                        errorInfo.msgId = 'dialog.error.message.76';
                                                        errorInfo.type = 'none';
                                                        View.Dialog.openErrorDialog({
                                                            message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                                            type: errorInfo.type,
                                                        }, function (response) {
                                                        });
                                                        return;
                                                    }
                                                    else {
                                                        errorInfo.msgId = 'dialog.error.message.48';
                                                        errorInfo.type = 'none';
                                                    }
                                                    break;
                                                case DPMW.mwe.E_MW_FILE_SIZE_EXCEED_LIMIT:
                                                    errorInfo.msgId = 'dialog.error.message.46';
                                                    errorInfo.type = 'none';
                                                    break;
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
                                                            errorInfo.msgId = 'dialog.error.message.48';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else if ('40001' === webApiResCode) {
                                                            errorInfo.msgId = 'dialog.error.message.48';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else if ('40003' === webApiResCode) {
                                                            errorInfo.msgId = 'dialog.error.message.48';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else if ('40006' === webApiResCode) {
                                                            errorInfo.msgId = 'dialog.error.message.47';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else if ('40013' === webApiResCode) {
                                                            errorInfo.msgId = 'dialog.error.message.46';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else if ('40014' === webApiResCode) {
                                                            errorInfo.msgId = 'dialog.error.message.48';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else {
                                                            errorInfo.msgId = 'dialog.error.message.48';
                                                            errorInfo.type = 'none';
                                                        }
                                                    }
                                                    else if (403 === statusCode) {
                                                        if ('40301' === webApiResCode) {
                                                            errorInfo.msgId = 'dialog.error.message.49';
                                                            errorInfo.type = 'none';
                                                        }
                                                        else {
                                                            errorInfo.msgId = 'dialog.error.message.48';
                                                            errorInfo.type = 'none';
                                                        }
                                                    }
                                                    else if (500 <= statusCode && statusCode < 600) {
                                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, webApiResCode);
                                                    }
                                                    else {
                                                        errorInfo.msgId = 'dialog.error.message.48';
                                                        errorInfo.type = 'none';
                                                    }
                                                    break;
                                                default:
                                                    errorInfo.msgId = 'dialog.error.message.48';
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
                                }, colsed: function () {
                                }
                            };
                            var initDataPass = new View.Dialog.DialogInfo.DialogEditInfo();
                            initDataPass.title = $.i18n.t('dialog.edit.installCertPass.title');
                            initDataPass.message = $.i18n.t('dialog.edit.installCertPass.message');
                            initDataPass.masking = true;
                            dialogController = View.Dialog.createDialogEdit(initDataPass, handlerPass);
                        },
                        colsed: function () {
                        }
                    };
                    var initData = new View.Dialog.DialogInfo.DialogEditInfo();
                    initData.title = $.i18n.t('dialog.edit.installCertName.title');
                    initData.message = $.i18n.t('dialog.edit.installCertName.message');
                    initData.masking = false;
                    dialogController = View.Dialog.createDialogEdit(initData, handler);
                };
                WifiSetupManualView.prototype.getFileName = function (file_path) {
                    var file_name = file_path.substring(file_path.lastIndexOf('\\') + 1, file_path.length);
                    return file_name;
                };
                WifiSetupManualView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                };
                WifiSetupManualView.prototype.toggleTabIndex = function () {
                    if ($("#ssid", "#page-pc-wifi-setup-manual-view").attr('type') === "hidden") {
                        if ($("#securityType").val() === "psk") {
                            this.dialog_.firstItem = $("#passwd", "#page-pc-wifi-setup-manual-view");
                        }
                        else if ($("#securityType").val() === "eap") {
                            this.dialog_.firstItem = $("#eap", "#page-pc-wifi-setup-manual-view");
                        }
                        else {
                            this.dialog_.firstItem = $("#ssid", "#page-pc-wifi-setup-manual-view");
                        }
                    }
                    else {
                        this.dialog_.firstItem = $("#ssid", "#page-pc-wifi-setup-manual-view");
                    }
                    this.dialog_.lastItem = $("#cancel", "#page-pc-wifi-setup-manual-view");
                };
                WifiSetupManualView.prototype.fetchCaCertificateList = function () {
                    this._$caCertificateList.html(this._certificateTemplate.render({
                        cert: this._caCertficateList.toJSON()
                    }));
                };
                WifiSetupManualView.prototype.fetchClientCertificateList = function () {
                    this._$clientCertificateList.html(this._certificateTemplate.render({
                        cert: this._clientCertficateList.toJSON()
                    }));
                };
                WifiSetupManualView.prototype.render = function () {
                    return this;
                };
                WifiSetupManualView.prototype.renderManualMode = function () {
                    this._$listview.html(this._template.render());
                    $('#securityType').removeAttr('disabled');
                    $('#securityType').val('nonsec');
                    $('#eap').val('peap');
                    $('#eap_phase2').val('none');
                    this.changeSecurityType();
                    this.changeEapMethod();
                    this.dialog_.firstItem = $("#ssid", "#page-pc-wifi-setup-manual-view");
                    this.dialog_.lastItem = $("#cancel", "#page-pc-wifi-setup-manual-view");
                };
                WifiSetupManualView.prototype.renderEditMode = function () {
                    this._$listview.html(this._template.render({
                        ssid: this._ssid
                    }));
                    $('#securityType').val(this._security);
                    $('#securityType').prop('disabled', 'true');
                    var device = DPMW.appCtrl.currentDevice;
                    this._model = device.wifiSettingModel.wifiAPRegisteredCollection.where({
                        'ssid': this._ssid,
                        'security': this._security
                    })[0];
                    if (this._model == null) {
                        this._model = new DPMW.Model.WiFiAPConfigModel(null, { deviceModel: device });
                        this._editMode = 0;
                    }
                    else {
                        this._editMode = 1;
                    }
                    $('#eap').val(this._model.attributes.eap);
                    if (DPMW.Utils.StringUtils.isEmpty($('#eap').val())) {
                        $('#eap').val('peap');
                    }
                    $('#eap_phase2').val(this._model.attributes.eap_phase2);
                    if (DPMW.Utils.StringUtils.isEmpty($('#eap_phase2').val())) {
                        $('#eap_phase2').val('none');
                    }
                    $('#eap_id').val(this._model.attributes.eap_id);
                    $('#eap_anid').val(this._model.attributes.eap_anid);
                    $('#eap_cacert').val(this._model.attributes.eap_cacert);
                    $('#eap_cert').val(this._model.attributes.eap_cert);
                    $('#static_address').val(this._model.attributes.static_address);
                    if (!DPMW.Utils.StringUtils.isEmpty(this._model.attributes.network_mask)) {
                        $('#network_mask').val(this._model.attributes.network_mask);
                    }
                    $('#gateway').val(this._model.attributes.gateway);
                    $('#dns1').val(this._model.attributes.dns1);
                    $('#dns2').val(this._model.attributes.dns2);
                    if (DPMW.Utils.StringUtils.isEmpty(this._model.attributes.dhcp)) {
                        $('#dhcpCheck').prop('checked', false);
                    }
                    else {
                        if (this._model.attributes.dhcp === 'true') {
                            $('#dhcpCheck').prop('checked', false);
                        }
                        else {
                            $('#dhcpCheck').prop('checked', true);
                        }
                    }
                    this.stopListening(device.wifiSettingModel.wifiAPRegisteredCollection, 'error', this.onFetchError);
                    this.changeSecurityType();
                    this.changeEapMethod();
                    if ($("#securityType").val() === "psk") {
                        this.dialog_.firstItem = $("#passwd", "#page-pc-wifi-setup-manual-view");
                    }
                    else if ($("#securityType").val() === "eap") {
                        this.dialog_.firstItem = $("#eap", "#page-pc-wifi-setup-manual-view");
                    }
                    else {
                        this.dialog_.firstItem = $("#ssid", "#page-pc-wifi-setup-manual-view");
                    }
                    this.dialog_.lastItem = $("#cancel", "#page-pc-wifi-setup-manual-view");
                };
                WifiSetupManualView.prototype.changeSecurityType = function () {
                    var secrityType = this.$el.find('#securityType').val();
                    _.each(this.allDisplay, function (tr) {
                        $('#wifiManualSetup .' + tr).hide();
                    });
                    var list;
                    if (secrityType === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_EAP) {
                        list = this.eapPeapDisplay;
                    }
                    else if (secrityType === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_PSK) {
                        list = this.pskDisplay;
                    }
                    else {
                        list = this.openDisplay;
                    }
                    _.each($('#wifiManualSetup tr'), function (tr) {
                        if (_.contains(list, tr.className)) {
                            $('#wifiManualSetup .' + tr.className).show();
                        }
                    });
                    this.clikcDhcpCheck();
                };
                WifiSetupManualView.prototype.goNextBtn = function (ev) {
                    var _this = this;
                    var me = this;
                    var dialogController = null;
                    var handler = {
                        dialogShowed: function () {
                            _this.saveModel(dialogController);
                        }
                    };
                    var initData = new View.Dialog.DialogInfo.DialogLoadingInfo();
                    initData.title = $.i18n.t('dialog.wait.title');
                    initData.message = $.i18n.t('dialog.wait.connectingWifi.message');
                    initData.cancelable = false;
                    dialogController = View.Dialog.createDialogLoading(initData, handler);
                };
                WifiSetupManualView.prototype.saveModel = function (dc) {
                    var _this = this;
                    var device = DPMW.appCtrl.currentDevice;
                    var data = {};
                    data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID).val();
                    data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY] = this.$('#securityType').val();
                    data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_PROXY] = 'false';
                    this._ssid = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_SSID).val();
                    ;
                    this._security = this.$('#securityType').val();
                    if ($('#dhcpCheck').is(':checked')) {
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DHCP] = 'false';
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_STATIC_ADDRESS] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_STATIC_ADDRESS).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_GATEWAY] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_GATEWAY).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_NETWORK_MASK] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_NETWORK_MASK).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DNS_1] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DNS_1).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DNS_2] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DNS_2).val();
                    }
                    else {
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_DHCP] = 'true';
                    }
                    if (this.$('#securityType').val() === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_EAP) {
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_PHASE2] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_PHASE2).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ID] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ID).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ANID] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ANID).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CACERT] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CACERT).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CERT] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CERT).val();
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_PASSWD] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_PASSWD).val();
                    }
                    else if (this.$('#securityType').val() === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_PSK) {
                        data[DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_PASSWD] = this.$('#' + DPMW.Model.WiFiAPConfigDefs.ATTR_NAME_PASSWD).val();
                    }
                    else if (this.$('#securityType').val() === DPMW.Model.WiFiAPConfigDefs.VALUE_SECURITY_NONSEC) {
                    }
                    if (this._editMode === 0) {
                        device.wifiSettingModel.wifiAPRegisteredCollection.create(data, {
                            success: function (odelOrCollection, response, options) {
                                _this._success = true;
                                dc.close();
                                _this.goNext(null);
                            }, error: function (modelOrCollection, response, options) {
                                _this._success = false;
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
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40001' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40002' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40003' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40005' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40006' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40008' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.11';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
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
                                    dc.close();
                                });
                            }
                        });
                    }
                    else {
                        this._model.save(data, {
                            success: function (odelOrCollection, response, options) {
                                _this._success = true;
                                dc.close();
                                _this.goNext(null);
                            }, error: function (modelOrCollection, response, options) {
                                _this._success = false;
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
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40001' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40002' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40003' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40005' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40006' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.12';
                                                errorInfo.type = 'none';
                                            }
                                            else if ('40008' === webApiResCode) {
                                                errorInfo.msgId = 'dialog.error.message.11';
                                                errorInfo.type = 'none';
                                            }
                                            else {
                                                errorInfo.msgId = 'dialog.error.message.37';
                                                errorInfo.type = 'none';
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
                                    dc.close();
                                });
                            }
                        });
                    }
                };
                WifiSetupManualView.prototype.getNextView = function () {
                    return new InitSetup.WifiSetupFinishView(this.dialog_, {
                        el: '#page-pc-wifi-setup-finish-view', id: 'page-pc-wifi-setup-finish-view',
                        attributes: { menuId: 'menu-wifi', wifiMode: this._wifiMode, success: this._success, ssid: this._ssid, security: this._security }
                    });
                };
                WifiSetupManualView.prototype.clikcDhcpCheck = function () {
                    if ($('#dhcpCheck').is(':checked')) {
                        $('.iparea').show();
                    }
                    else {
                        $('.iparea').hide();
                    }
                };
                WifiSetupManualView.prototype.clickSecurityDisplay = function (ev) {
                    if ($('#securityDisplay').prop('checked')) {
                        $('#passwd').attr('type', 'text');
                    }
                    else {
                        $('#passwd').attr('type', 'password');
                    }
                };
                WifiSetupManualView.prototype.changeEapMethod = function () {
                    var eapMethod = $('#eap').val();
                    var list;
                    var secrityType = this.$el.find('#securityType').val();
                    if ('nonsec' === secrityType || 'psk' === secrityType) {
                        return;
                    }
                    _.each(this.allDisplay, function (tr) {
                        $('#wifiManualSetup .' + tr).hide();
                    });
                    if ('peap' === eapMethod) {
                        list = this.eapPeapDisplay;
                    }
                    else if ('tls' === eapMethod) {
                        list = this.eapTlsDisplay;
                    }
                    else {
                        return;
                    }
                    _.each($('#wifiManualSetup tr'), function (tr) {
                        if (_.contains(list, tr.className)) {
                            $('#wifiManualSetup .' + tr.className).show();
                        }
                    });
                };
                return WifiSetupManualView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.WifiSetupManualView = WifiSetupManualView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiSetupManualView.js.map