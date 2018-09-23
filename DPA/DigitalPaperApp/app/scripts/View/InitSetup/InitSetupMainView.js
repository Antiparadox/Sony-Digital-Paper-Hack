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
            var eventDefs;
            (function (eventDefs) {
                eventDefs.SHOW_TOP = 'showTop';
                eventDefs.SHOW_LAST = 'showLast';
            })(eventDefs = InitSetup.eventDefs || (InitSetup.eventDefs = {}));
            InitSetup.SKIP_WIFI_SETUP = true;
            var InitSetupMainView = (function (_super) {
                __extends(InitSetupMainView, _super);
                function InitSetupMainView(options) {
                    _super.call(this, options);
                    this.backTranslation = new Array(5);
                    this.registerSuccess = false;
                }
                InitSetupMainView.prototype.initialize = function (options) {
                    var _this = this;
                    this.dialogInitSetup_ = new InitSetup.DialogInitSetup(this);
                    if (Config.USE_STUB) {
                        this.view_ = new InitSetup.WifiSetupView(this.dialogInitSetup_, { el: '#page-pc-wifi-setup-view', id: 'page-pc-wifi-setup-view',
                            attributes: { menuId: 'menu-wifi', wifiMode: 0 } });
                    }
                    else {
                        this.view_ = new InitSetup.InitSetupWelcomeView(this.dialogInitSetup_, { el: '#page-pc-welcome-view', id: 'page-pc-welcome-view',
                            attributes: { index: 0, menuId: 'menu-welcome' } });
                    }
                    var me = this;
                    this.on('initValue', function (detail) {
                        var currentWindow = require('electron').remote.getCurrentWindow();
                        if (!detail || typeof detail.deviceId !== 'string') {
                            console.log('deviceId is not specified');
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'deviceId is not specified');
                            var errCode = DPMW.mwe.genUserErrorCode(err);
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t('dialog.error.message.75', { errorCode: errCode }),
                            }, function (response) {
                                currentWindow.close();
                            });
                            return;
                        }
                        DPMW.appCtrl.initializeNew(detail.deviceId, { success: function () {
                                _this.view_.$el.show();
                                _this.listenTo(_this.view_, 'next', _this.goNext);
                                _this.listenTo(DPMW.appCtrl.devices, 'error', _this.devicesFetchError);
                                _this.listenTo(DPMW.appCtrl.devices, 'update', _this.devicesChange);
                                require('electron').ipcRenderer.on('init-setup-close-message', _this.onCloseIpc);
                                DPMW.appCtrl.devices.fetch({
                                    success: function (modelOrCollection, response, options) {
                                        _this.render();
                                    }
                                });
                            }, error: function () {
                                console.log('apCtrl.initialize error');
                                var err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'apCtrl.initialize error');
                                var errCode = DPMW.mwe.genUserErrorCode(err);
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: errCode }),
                                }, function (response) {
                                    currentWindow.close();
                                });
                                return;
                            } });
                    });
                    var beforeCloseFunction = function () {
                        me.view_.closeIpcCallback(function (response) {
                            if (response === 0) {
                                if (me.registerSuccess === true) {
                                    me.dialogInitSetup_.submit(me.dialogInitSetup_);
                                }
                                else {
                                    me.dialogInitSetup_.closeDialog(me.dialogInitSetup_);
                                }
                            }
                        });
                        return false;
                    };
                    me.dialogInitSetup_.setBeforeCloseFunction(beforeCloseFunction);
                    $('body').on('keydown', function (e) {
                        var code = e.keyCode || e.which;
                        if (code == 27) {
                            me.view_.cancel(e);
                        }
                    });
                };
                InitSetupMainView.prototype.onCloseIpc = function (callback) {
                    debugger;
                    return this.view_.closeIpcCallback(callback);
                };
                InitSetupMainView.prototype.devicesFetchError = function (modelOrCollection, response, options) {
                    var code;
                    if (options && options.mwError) {
                        code = DPMW.mwe.genUserErrorCode(options.mwError);
                        if (options.mwError.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t('dialog.error.message.3', { errorCode: DPMW.mwe.genUserErrorCode(code) })
                            }, function (response) {
                                require('electron').remote.getCurrentWindow().close();
                            });
                        }
                    }
                    else {
                        var error = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Web API Error', null, null, null, null);
                        code = DPMW.mwe.genUserErrorCode(error);
                        View.Dialog.openErrorDialog({
                            title: $.i18n.t('dialog.title.error'),
                            message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(code) })
                        }, function (response) {
                            require('electron').remote.getCurrentWindow().close();
                        });
                    }
                };
                InitSetupMainView.prototype.render = function () {
                    var device = DPMW.appCtrl.devices.get(DPMW.appCtrl.currentDeviceId);
                    if (!device) {
                        this.devicesChange();
                        return;
                    }
                    if (device.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE) !== DPMW.Model.Device.VALUE_PHY_TYPE_USB ||
                        InitSetup.SKIP_WIFI_SETUP === true) {
                        $('#menu-connection-to-wifi').hide();
                        $('#menu-wifi').hide();
                    }
                    return this;
                };
                InitSetupMainView.prototype.devicesChange = function () {
                    var device = DPMW.appCtrl.devices.get(DPMW.appCtrl.currentDeviceId);
                    if (!device || device[DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE] === DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED) {
                        var error = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'Device not found');
                        var code = DPMW.mwe.genUserErrorCode(error);
                        View.Dialog.openErrorDialog({
                            title: $.i18n.t('dialog.title.error'),
                            message: $.i18n.t('dialog.error.message.65', { errorCode: code })
                        }, function (response) {
                            require('electron').remote.getCurrentWindow().close();
                        });
                    }
                };
                InitSetupMainView.prototype.goNext = function (nextView) {
                    var _this = this;
                    var oldView = this.view_;
                    this.view_ = nextView;
                    this.view_.$el.show();
                    this.view_.trigger('setDefaultFocus');
                    if (this.view_ instanceof InitSetup.InitSetupCertificateInstallView) {
                        this.listenTo(this.view_, 'registerCurrentDevice', function () {
                            _this.registerSuccess = true;
                        });
                    }
                    this.listenTo(this.view_, 'next', this.goNext);
                    this.listenTo(this.view_, 'back', this.goBack);
                    this.listenTo(this.view_, eventDefs.SHOW_TOP, this.showTop);
                    this.listenTo(this.view_, eventDefs.SHOW_LAST, this.showLast);
                    if (oldView instanceof InitSetup.InitSetupCertificateInstallView) {
                        this.stopListening(oldView, 'registerCurrentDevice');
                    }
                    this.stopListening(oldView, 'next');
                    this.stopListening(oldView, 'back');
                    this.stopListening(oldView, eventDefs.SHOW_TOP);
                    this.stopListening(oldView, eventDefs.SHOW_LAST);
                    this.backTranslation.push(oldView);
                    this.resetMenuBar();
                    oldView = null;
                };
                InitSetupMainView.prototype.goBack = function () {
                    var oldView = this.view_;
                    this.view_ = this.backTranslation.pop();
                    this.view_.$el.show();
                    this.listenTo(this.view_, 'next', this.goNext);
                    this.listenTo(this.view_, 'back', this.goBack);
                    this.listenTo(this.view_, eventDefs.SHOW_TOP, this.showTop);
                    this.listenTo(this.view_, eventDefs.SHOW_LAST, this.showLast);
                    this.stopListening(oldView, 'next');
                    this.stopListening(oldView, 'back');
                    this.stopListening(oldView, eventDefs.SHOW_TOP);
                    this.stopListening(oldView, eventDefs.SHOW_LAST);
                    this.resetMenuBar();
                    oldView.undelegateEvents();
                    oldView = null;
                };
                InitSetupMainView.prototype.resetMenuBar = function () {
                    var currentMenuId = this.view_.menuId;
                    this.$('#' + currentMenuId).addClass('selected');
                    if (currentMenuId == 'menu-wifi') {
                        this.$('#menu-welcome').addClass('finished');
                        this.$('#menu-welcome').removeClass('selected');
                    }
                    else if (currentMenuId == 'menu-finish') {
                        this.$('#menu-wifi').addClass('finished');
                        this.$('#menu-wifi').removeClass('selected');
                    }
                    currentMenuId = null;
                };
                InitSetupMainView.prototype.showTop = function () {
                    var oldView = this.view_;
                    oldView.$el.hide();
                    if (oldView instanceof InitSetup.InitSetupCertificateInstallView) {
                        this.stopListening(oldView, 'registerCurrentDevice');
                    }
                    this.stopListening(oldView, 'next');
                    this.stopListening(oldView, 'back');
                    this.listenTo(this.view_, eventDefs.SHOW_TOP, this.showTop);
                    this.listenTo(this.view_, eventDefs.SHOW_LAST, this.showLast);
                    oldView.undelegateEvents();
                    oldView = null;
                    for (var i = 0; i < this.backTranslation.length; i++) {
                        this.view_ = this.backTranslation.pop();
                        if (this.view_.id === 'page-pc-welcome-view') {
                            break;
                        }
                    }
                    this.view_.$el.show();
                    this.listenTo(this.view_, 'next', this.goNext);
                    this.listenTo(this.view_, 'back', this.goBack);
                    this.resetMenuBar();
                    this.dialogInitSetup_.getFirstAndLastItem();
                };
                InitSetupMainView.prototype.showLast = function () {
                };
                return InitSetupMainView;
            }(Backbone.View));
            InitSetup.InitSetupMainView = InitSetupMainView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupMainView.js.map