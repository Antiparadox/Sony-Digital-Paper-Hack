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
            var InitSetupRegisterView = (function (_super) {
                __extends(InitSetupRegisterView, _super);
                function InitSetupRegisterView(dialog, options) {
                    _super.call(this, dialog, options);
                    this.initializeInternal();
                    this.listenTo(this, 'setDefaultFocus', function () {
                        $('#authCode').focus();
                        $('#authCode').addClass('outline-clear');
                    });
                }
                InitSetupRegisterView.prototype.events = function () {
                    return {
                        'click #next': 'goNextBtn',
                        'click #cancel': 'cancel',
                        'click #back': 'goBackBtn',
                        'input #authCode': 'authCodeKeyChange',
                    };
                };
                InitSetupRegisterView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                };
                InitSetupRegisterView.prototype.initializeInternal = function () {
                    var _this = this;
                    InitSetupRegisterView.me = this;
                    this.nextBt = this.$el.find('#next');
                    this.nextBtTabIndex = 98;
                    this.nextView = new InitSetup.InitSetupCertificateInstallView(this.dialog_, {
                        el: "#page-pc-certificate-install-view",
                        id: "page-pc-certificate-install-view", attributes: { index: 2, menuId: 'menu-welcome' }
                    });
                    $('#authCode').val('');
                    this.$el.find('#next').addClass('ui-state-disabled');
                    this.$el.find('#next').attr('tabindex', -1);
                    var electron = require('electron');
                    var regctrl = electron.remote.require('mw-reg-ctrl');
                    regctrl.setOnPinRequest(function (timeout, callback) {
                        _this.pinRequestCallbackFunc = callback;
                    });
                    regctrl.setOnBeforeStoreCert(function (timeout, callback) {
                        _this.nextView.beforeStoreCertCallbackFunc = callback;
                        _this.goNext(null);
                    });
                    var deviceId = DPMW.appCtrl.currentDeviceId;
                    regctrl.registerDevice(deviceId, function (err) {
                        _this.checkCallback(err, deviceId);
                    });
                    this.dialog_.firstItem = $("#authCode", "#page-pc-register-view");
                    this.dialog_.lastItem = $("#cancel", "#page-pc-register-view");
                };
                InitSetupRegisterView.prototype.checkCallback = function (err, deviceId) {
                    if (err === null) {
                        {
                            var process_1 = require('electron').remote.process;
                            if (process_1 && process_1.env.MW_USER_DATA_DIR_PATH) {
                                try {
                                    var path = require('path');
                                    var workspaceFilePath = path.join(process_1.env.MW_USER_DATA_DIR_PATH, 'workspace.dat');
                                    var fs = require('fs');
                                    fs.writeFileSync(workspaceFilePath, deviceId);
                                }
                                catch (err) {
                                }
                            }
                        }
                        InitSetupRegisterView.me.nextView.afterInstall();
                        return;
                    }
                    if (err.cancel) {
                        return;
                    }
                    var msgId;
                    var code = DPMW.mwe.genUserErrorCode(err);
                    if (err.mwCode === DPMW.mwe.E_MW_REG_PIN_MAY_BE_WRONG) {
                        msgId = 'dialog.error.message.9';
                    }
                    else if (err.mwCode === DPMW.mwe.E_MW_STORE_SET_CERT_FAILED) {
                        msgId = 'dialog.error.message.10';
                    }
                    else if (err.mwCode === DPMW.mwe.E_MW_AUTH_FAILED) {
                        msgId = 'dialog.error.message.8';
                    }
                    else if (err.mwCode === DPMW.mwe.E_MW_STORE_GET_PUBKEY_FAILED) {
                        msgId = 'dialog.error.message.7';
                    }
                    else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                        if (!_.isUndefined(err.mwWebApiResCode)) {
                            if (err.mwWebApiResCode >= 400 && err.mwWebApiResCode <= 599) {
                                if (err.mwWebApiResCode === 403 &&
                                    !_.isUndefined(err.cause) &&
                                    !_.isUndefined(err.cause.error_code) &&
                                    err.cause.error_code === '40305') {
                                    msgId = 'dialog.error.message.26';
                                }
                                else {
                                    msgId = 'dialog.error.message.3';
                                }
                            }
                            else {
                                msgId = 'dialog.error.message.8';
                            }
                        }
                        else {
                            msgId = 'dialog.error.message.8';
                        }
                    }
                    else {
                        msgId = 'dialog.error.message.75';
                    }
                    View.Dialog.openErrorDialog({
                        title: $.i18n.t('dialog.title.error'),
                        message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                    }, function (response) {
                        if (InitSetupRegisterView.me.$el.is(':visible')) {
                            InitSetupRegisterView.me.trigger(InitSetup.eventDefs.SHOW_TOP);
                            InitSetupRegisterView.me.nextView.undelegateEvents();
                        }
                        else {
                            InitSetupRegisterView.me.nextView.trigger(InitSetup.eventDefs.SHOW_TOP);
                        }
                    });
                };
                InitSetupRegisterView.prototype.authCodeKeyChange = function (ev) {
                    if (_.isEmpty(this.$el.find('#authCode').val())) {
                        this.$el.find('#next').addClass('ui-state-disabled');
                        this.$el.find('#next').attr('tabindex', -1);
                    }
                    else {
                        this.$el.find('#next').removeClass('ui-state-disabled');
                        this.$el.find('#next').attr('tabindex', this.nextBtTabIndex);
                    }
                };
                InitSetupRegisterView.prototype.goNextBtn = function (ev) {
                    var authCode = this.$('#authCode').val();
                    this.pinRequestCallbackFunc(null, authCode);
                    this.dialog_.firstItem = $("#next", "#page-pc-certificate-install-view");
                    this.dialog_.lastItem = $("#cancel", "#page-pc-certificate-install-view");
                };
                InitSetupRegisterView.prototype.goBackBtn = function (ev) {
                    var err = { cancel: true };
                    this.pinRequestCallbackFunc(err, '');
                    this.nextView.undelegateEvents();
                    _super.prototype.goBack.call(this, ev);
                    this.dialog_.firstItem = $("#next", "#page-pc-welcome-view");
                    this.dialog_.lastItem = $("#cancel", "#page-pc-welcome-view");
                };
                InitSetupRegisterView.prototype.getNextView = function () {
                    return this.nextView;
                };
                InitSetupRegisterView.prototype.closeIpcCallback = function (callback) {
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
                            _this.pinRequestCallbackFunc(err, '');
                        }
                        callback(response);
                    });
                };
                return InitSetupRegisterView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.InitSetupRegisterView = InitSetupRegisterView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupRegisterView.js.map