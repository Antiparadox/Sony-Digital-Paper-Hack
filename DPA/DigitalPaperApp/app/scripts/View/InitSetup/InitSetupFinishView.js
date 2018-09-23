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
            var SPECIFICATION_CODE;
            (function (SPECIFICATION_CODE) {
                SPECIFICATION_CODE.JP = 'J';
                SPECIFICATION_CODE.US = 'U';
                SPECIFICATION_CODE.CN = 'C';
            })(SPECIFICATION_CODE = InitSetup.SPECIFICATION_CODE || (InitSetup.SPECIFICATION_CODE = {}));
            var InitSetupFinishView = (function (_super) {
                __extends(InitSetupFinishView, _super);
                function InitSetupFinishView() {
                    _super.apply(this, arguments);
                }
                InitSetupFinishView.prototype.events = function () {
                    return {
                        "click #next": "goNext",
                        "click #cancel": "cancel",
                        "click #back": "goBack",
                        "click #close": "close"
                    };
                };
                InitSetupFinishView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                    DPMW.Utils.WindowUtils.setWinClosable(true);
                    DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPRegisteredCollection.fetch();
                    this.listenTo(DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPRegisteredCollection, 'sync', this.onApRegisteredCollectionFetch);
                    this.dispMessage();
                };
                InitSetupFinishView.prototype.onApRegisteredCollectionFetch = function () {
                    if (DPMW.appCtrl.currentDevice.wifiSettingModel.wifiAPRegisteredCollection.length <= 0) {
                        var data = {};
                        data[DPMW.Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG] = DPMW.Model.WiFiSettingDefs.VALUE_WIFI_CONFIG_OFF;
                        DPMW.appCtrl.currentDevice.wifiSettingModel.save(data, {
                            error: function (collection, response, options) {
                                var err = null;
                                var msgId = null;
                                if (typeof options.mwError === 'undefined') {
                                    msgId = 'dialog.error.message.75';
                                    err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                }
                                else {
                                    err = options.mwError;
                                    var mwCode = options.mwError.mwCode;
                                    if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                        if (response.status === 403 &&
                                            typeof response.responseJSON !== 'undefined' &&
                                            typeof response.responseJSON.error_code === 'string' &&
                                            response.responseJSON.error_code === '40302') {
                                            msgId = 'dialog.error.message.43';
                                        }
                                        else if (response.status === 503 &&
                                            typeof response.responseJSON !== 'undefined' &&
                                            typeof response.responseJSON.error_code === 'string' &&
                                            response.responseJSON.error_code === '50301') {
                                            msgId = 'dialog.error.message.44';
                                        }
                                        else if (response.status === 408 &&
                                            typeof response.responseJSON !== 'undefined' &&
                                            typeof response.responseJSON.error_code === 'string' &&
                                            response.responseJSON.error_code === '40801') {
                                            msgId = 'dialog.error.message.45';
                                        }
                                        else if (response.status >= 400 && response.status < 500) {
                                            msgId = 'dialog.error.message.65';
                                        }
                                        else if (response.status >= 500 && response.status < 600) {
                                            msgId = 'dialog.error.message.3';
                                        }
                                        else {
                                            msgId = 'dialog.error.message.65';
                                        }
                                    }
                                    else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                        msgId = 'dialog.error.message.65';
                                    }
                                    else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                        msgId = 'dialog.error.message.65';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.75';
                                    }
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) {
                                });
                            }
                        });
                    }
                };
                InitSetupFinishView.prototype.dispMessage = function () {
                    var skuCode = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE);
                    if (skuCode === DPMW.View.InitSetup.SPECIFICATION_CODE.JP) {
                        if (InitSetup.InitSetupMainView.isInited) {
                            this.$('#finish-jp').show();
                        }
                        else {
                            this.$('#finish-jp-init').show();
                        }
                    }
                    else {
                        this.$('#finish-other').show();
                    }
                };
                InitSetupFinishView.prototype.close = function () {
                    if (process.platform === 'darwin') {
                        this.dialog_.checkCloseDialog(this.dialog_);
                        return;
                    }
                    close();
                };
                InitSetupFinishView.prototype.closeIpcCallback = function (callback) {
                    var url = "";
                    var skuCode = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE);
                    if (skuCode === DPMW.View.InitSetup.SPECIFICATION_CODE.JP && !InitSetup.InitSetupMainView.isInited) {
                        url = $.i18n.t('page.setupComplete.url.regjp');
                    }
                    else if (skuCode === DPMW.View.InitSetup.SPECIFICATION_CODE.CN && !InitSetup.InitSetupMainView.isInited) {
                        url = $.i18n.t('page.setupComplete.url.regcn');
                    }
                    else {
                        if (skuCode === DPMW.View.InitSetup.SPECIFICATION_CODE.JP) {
                            url = $.i18n.t('page.setupComplete.url.jp');
                        }
                        else if (skuCode === DPMW.View.InitSetup.SPECIFICATION_CODE.CN) {
                            url = $.i18n.t('page.setupComplete.url.cn');
                        }
                        else {
                            url = $.i18n.t('page.setupComplete.url.us');
                        }
                    }
                    DPMW.appCtrl.terminate();
                    if (typeof url === 'string') {
                        if (url.trim().toLowerCase().indexOf('http') === 0) {
                            require('electron').shell.openExternal(url);
                        }
                    }
                    callback(0);
                };
                return InitSetupFinishView;
            }(InitSetup.InitSetupBaseView));
            InitSetup.InitSetupFinishView = InitSetupFinishView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupFinishView.js.map