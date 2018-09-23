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
            var InitSetupCertificateInstallView = (function (_super) {
                __extends(InitSetupCertificateInstallView, _super);
                function InitSetupCertificateInstallView() {
                    _super.apply(this, arguments);
                }
                InitSetupCertificateInstallView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                    this.installed = false;
                    this.$el.find('#thumbprint').hide();
                    this.$el.find('#back').addClass('ui-state-disabled');
                    InitSetupCertificateInstallView.me = this;
                };
                InitSetupCertificateInstallView.prototype.events = function () {
                    return {
                        'click #next': 'goNextBtn',
                        'click #cancel': 'cancel',
                        'click #back': 'goBack',
                    };
                };
                InitSetupCertificateInstallView.prototype.goNextBtn = function (ev) {
                    this.beforeStoreCertCallbackFunc(null, true);
                };
                InitSetupCertificateInstallView.prototype.initFlagSave = function () {
                    var me = this;
                    var initFlg = DPMW.appCtrl.currentDevice.deviceSettingModel.initializedFlagModel.get(DPMW.Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG);
                    if (initFlg === DPMW.Model.DeviceSetting.InitializedFlagDefs.VALUE_INITIALIZED) {
                        DPMW.View.InitSetup.InitSetupMainView.isInited = true;
                        me.goNext(null);
                    }
                    else {
                        DPMW.View.InitSetup.InitSetupMainView.isInited = false;
                        var data = {};
                        data[DPMW.Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG] = DPMW.Model.DeviceSetting.InitializedFlagDefs.VALUE_INITIALIZED;
                        DPMW.appCtrl.currentDevice.deviceSettingModel.initializedFlagModel.save(data, {
                            success: function (modelOrCollection, response, options) {
                                me.goNext(null);
                            },
                            error: function (modelOrCollection, response, options) {
                                if (options.mwError) {
                                    var errCode = DPMW.mwe.genUserErrorCode(options.mwError);
                                    if (options.mwError.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.3', { errorCode: errCode })
                                        }, function (response) {
                                            InitSetupCertificateInstallView.me.trigger(InitSetup.eventDefs.SHOW_TOP);
                                        });
                                    }
                                    else {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.65', { errorCode: errCode })
                                        }, function (response) {
                                            InitSetupCertificateInstallView.me.trigger(InitSetup.eventDefs.SHOW_TOP);
                                        });
                                    }
                                }
                                else {
                                    var error = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'initialized Flag save error', null, null, null, null);
                                    var errCode_1 = DPMW.mwe.genUserErrorCode(error);
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t('dialog.error.message.65', { errorCode: errCode_1 })
                                    }, function (response) {
                                        InitSetupCertificateInstallView.me.trigger(InitSetup.eventDefs.SHOW_TOP);
                                    });
                                }
                            }
                        });
                    }
                };
                InitSetupCertificateInstallView.prototype.afterInstall = function () {
                    var me = this;
                    if (DPMW.appCtrl.currentDevice === null) {
                        DPMW.appCtrl.registerCurrentDevice({
                            success: function () {
                                var data = {};
                                me.trigger('registerCurrentDevice');
                                setTimeout(function () {
                                    me.listenToOnce(DPMW.appCtrl.currentDevice.deviceSettingModel.initializedFlagModel, 'sync', me.initFlagSave);
                                    DPMW.appCtrl.currentDevice.deviceSettingModel.initializedFlagModel.fetch();
                                }, 0);
                            },
                            error: function () {
                                var error = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'registerCurrentDevice error', null, null, null, null);
                                var code = DPMW.mwe.genUserErrorCode(error);
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: code })
                                }, function (response) {
                                    InitSetupCertificateInstallView.me.trigger(InitSetup.eventDefs.SHOW_TOP);
                                });
                            }
                        });
                    }
                    else {
                        me.listenToOnce(DPMW.appCtrl.currentDevice.deviceSettingModel.initializedFlagModel, 'sync', me.initFlagSave);
                        DPMW.appCtrl.currentDevice.deviceSettingModel.initializedFlagModel.fetch();
                    }
                };
                InitSetupCertificateInstallView.prototype.getNextView = function () {
                    var retNextView = null;
                    if (DPMW.Model.Device.VALUE_PHY_TYPE_USB === DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE) &&
                        DPMW.View.InitSetup.SKIP_WIFI_SETUP === false) {
                        retNextView = new InitSetup.WifiSetupView(this.dialog_, { el: "#page-pc-wifi-setup-view", id: "page-pc-wifi-setup-view",
                            attributes: { menuId: 'menu-wifi', wifiMode: 0 } });
                    }
                    else {
                        retNextView = new InitSetup.InitSetupFinishView(this.dialog_, { el: "#page-pc-setup-finish-view", id: "page-pc-setup-finish-view",
                            attributes: { menuId: 'menu-finish' } });
                    }
                    this.dialog_.firstItem = $("#close", "#page-pc-setup-finish-view");
                    return retNextView;
                };
                InitSetupCertificateInstallView.prototype.closeIpcCallback = function (callback) {
                    var _this = this;
                    var title = $.i18n.t('dialog.confirm.pairingCancel.title');
                    var msg = $.i18n.t('dialog.confirm.pairingCancel.message');
                    var btn_index;
                    var dialogOptions = {
                        title: title,
                        message: msg
                    };
                    DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                        var err = { cancel: true };
                        if (response === 0) {
                            _this.beforeStoreCertCallbackFunc(null, false);
                        }
                        callback(response);
                    });
                };
                return InitSetupCertificateInstallView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.InitSetupCertificateInstallView = InitSetupCertificateInstallView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupCertificateInstallView.js.map