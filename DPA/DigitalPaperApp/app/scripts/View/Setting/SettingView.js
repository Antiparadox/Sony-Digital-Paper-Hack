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
            var SettingView = (function (_super) {
                __extends(SettingView, _super);
                function SettingView() {
                    _super.apply(this, arguments);
                }
                SettingView.prototype.events = function () {
                    return {
                        "click #pairing-button": this.pairing,
                        "click #close-button": this.closeWindow,
                        "click #bt-on": this.btOn,
                        "click #bt-off": this.btOff,
                        "click #sync-on": this.syncOn,
                        "click #sync-off": this.syncOff,
                        "change #autosync-interval": this.autoSyncIntervalChange,
                    };
                };
                SettingView.prototype.initialize = function (options) {
                    var _this = this;
                    var me = this;
                    this.currentWindow = require('electron').remote.getCurrentWindow();
                    this.firstItem = $('#pairing-button');
                    this.lastItem = $('#close-button');
                    this.intervalToAutoSync = $('#autosync-interval');
                    this.autosyncIntervalTabIndex = +$(this.intervalToAutoSync).attr('tabindex');
                    var linkTag = "<a id=\"helpUrl\">" + $.i18n.t('config.btautoconnect.linkOfDescription') + "</a>";
                    this.$('#btdscrpt').html($.i18n.t('config.btautoconnect.description', { link: linkTag }));
                    if (process.platform === 'win32') {
                        var mwAutoBtPanConnector = require('electron').remote.require('mw-auto-bt-pan-connector');
                        me.remoteAutoBtPanConnector = mwAutoBtPanConnector.getInstance();
                        mwAutoBtPanConnector = null;
                        if (DPMW.Utils.LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_OFF === DPMW.Utils.getBluetoothAutoConnectSetting()) {
                            me.bAutoBtConn = false;
                            this.$('#bt-off').prop('checked', true);
                        }
                        else {
                            me.bAutoBtConn = true;
                            this.$('#bt-on').prop('checked', true);
                        }
                    }
                    else {
                        me.$('.hidebtautoconnect').hide();
                    }
                    if (DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_OFF === DPMW.Utils.getAutoSyncSetting()) {
                        me.bAutoSync = false;
                        this.$('#sync-off').prop('checked', true);
                        this.$('#syncinterval-row').addClass('ui-state-disabled');
                        this.$('#autosync-interval').attr('tabindex', -1);
                    }
                    else {
                        me.bAutoSync = true;
                        this.$('#sync-on').prop('checked', true);
                        this.$('#syncinterval-row').removeClass('ui-state-disabled');
                    }
                    this.$('label[for][isRadioLabel]').on('keydown', function (ev) {
                        if (ev.which === 32) {
                            ev.preventDefault();
                            ev.stopImmediatePropagation();
                        }
                    });
                    this.$('label[for][isRadioLabel]').on('keyup', function (ev) {
                        me.onRadioKeyup(ev);
                    });
                    me.$('input[type=radio] + label,input[type=checkbox] + label').mouseover(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('hover-outline-appear').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('hover');
                        }
                    });
                    me.$('input[type=radio] + label,input[type=checkbox] + label').mouseout(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('radio-border-clear');
                        }
                    });
                    me.$('input[type=radio] + label,input[type=checkbox] + label').mousedown(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('pressed').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('pressed');
                        }
                    });
                    me.$('input[type=radio] + label,input[type=checkbox] + label').mouseup(function (event) {
                        if ($(this).hasClass('tag-radio-outline-appear')) {
                            $(this).removeClass();
                            $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                        }
                        else {
                            $(this).removeClass();
                            $(this).toggleClass('radio-border-clear');
                        }
                    });
                    me.$('input[type=radio] + label,input[type=checkbox] + label').focusout(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('rest');
                    });
                    me.$('.hideWhenDisconnected').hide();
                    this.on('initValue', function (detail) {
                        _this.intervalToAutoSync = $('#autosync-interval');
                        switch (DPMW.Utils.getAutoSyncInterval()) {
                            case 30:
                                _this.intervalToAutoSync.val("30M");
                                break;
                            case 60:
                                _this.intervalToAutoSync.val("60M");
                                break;
                            case 90:
                                _this.intervalToAutoSync.val("90M");
                                break;
                            default:
                                _this.intervalToAutoSync.val("10M");
                                break;
                        }
                        if (!detail || typeof detail.deviceId !== 'string') {
                            console.log('deviceId is not specified');
                            me.$('.hideWhenDisconnected').hide();
                            me.$('#device-serial-id').text('-');
                            me.$('#pairing-button').val($.i18n.t('config.button.pairing'));
                            me.$('#device-version-area').hide();
                            me.$('#helpUrl').on('click', function () {
                                var url;
                                if (navigator.language === 'ja') {
                                    url = $.i18n.t('page.wifiConf.bt.url.jp');
                                }
                                else {
                                    url = $.i18n.t('page.wifiConf.bt.url.us');
                                }
                                require('electron').shell.openExternal(url);
                            });
                            return;
                        }
                        me.deviceId = detail.deviceId;
                        $('#device-serial-id').text(detail.deviceId);
                        me.$('#helpUrl').on('click', function () {
                            var url;
                            var skuCode = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE);
                            if (skuCode === 'J') {
                                url = $.i18n.t('page.wifiConf.bt.url.jp');
                            }
                            else if (skuCode === 'C') {
                                url = $.i18n.t('page.wifiConf.bt.url.cn');
                            }
                            else {
                                url = $.i18n.t('page.wifiConf.bt.url.us');
                            }
                            require('electron').shell.openExternal(url);
                        });
                        _this.listenTo(_this, 'noteTemplateUploadSuccess', function () {
                            _this.noteTemplateListView.trigger('noteTemplateUploadSuccess');
                        });
                        _this.listenTo(_this, 'noteTemplateUploadFailure', function (detail) {
                            _this.noteTemplateListView.trigger('noteTemplateUploadFailure', detail);
                        });
                        var CONNECTION_STATE = DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE;
                        DPMW.appCtrl.initializeNew(detail.deviceId, {
                            success: function () {
                                DPMW.appCtrl.connectDevice({ success: function () {
                                        me.device = DPMW.appCtrl.currentDevice;
                                        me.deviceStateChange();
                                        me.listenTo(me.device, 'change:' + CONNECTION_STATE, me.deviceStateChange);
                                    }, error: function () {
                                        me.device = DPMW.appCtrl.currentDevice;
                                        if (!me.device) {
                                            me.$('#pairing-button').val($.i18n.t('config.button.repairing'));
                                            me.$('.hideWhenDisconnected').hide();
                                            me.$('#device-version-area').show();
                                            return;
                                        }
                                        me.deviceStateChange();
                                        me.listenTo(me.device, 'change:' + CONNECTION_STATE, me.deviceStateChange);
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
                                    me.currentWindow.close();
                                });
                                return;
                            }
                        });
                    });
                    this.dialogSetting = new Setting.DialogSetting(this);
                };
                SettingView.prototype.render = function () {
                    return this;
                };
                SettingView.prototype.pairing = function () {
                    var deviceSearchInfo = new View.Dialog.DialogInfo.WindowDeviceSearchInfo();
                    deviceSearchInfo.deviceId = this.deviceId;
                    var dialogRelayInfo = new View.Dialog.DialogInfo.DialogRelayInfo();
                    dialogRelayInfo.dialogName = View.Dialog.DialogName.WINDOW_DEVICE_SEARCH;
                    dialogRelayInfo.dialogInfo = deviceSearchInfo;
                    DPMW.appCtrl.terminate();
                    this.dialogSetting.dialogRelay(dialogRelayInfo);
                };
                SettingView.prototype.closeWindow = function () {
                    DPMW.appCtrl.terminate();
                    this.currentWindow.close();
                };
                SettingView.prototype.onRadioKeyup = function (ev) {
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
                            case 'bt-on':
                                this.btOn();
                                break;
                            case 'bt-off':
                                this.btOff();
                                break;
                            case 'sync-on':
                                this.syncOn();
                                break;
                            case 'sync-off':
                                this.syncOff();
                                break;
                            default:
                                break;
                        }
                    }
                };
                SettingView.prototype.btOn = function () {
                    if (this.bAutoBtConn === false && process.platform === 'win32') {
                        this.bAutoBtConn = true;
                        DPMW.Utils.setBluetoothAutoConnectSetting(DPMW.Utils.LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_ON);
                        this.remoteAutoBtPanConnector.enableAutoConnect();
                    }
                };
                SettingView.prototype.btOff = function () {
                    if (this.bAutoBtConn === true && process.platform === 'win32') {
                        this.bAutoBtConn = false;
                        DPMW.Utils.setBluetoothAutoConnectSetting(DPMW.Utils.LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_OFF);
                        this.remoteAutoBtPanConnector.disableAutoConnect();
                    }
                };
                SettingView.prototype.syncOff = function () {
                    var me = this;
                    if (this.bAutoSync === true) {
                        this.bAutoSync = false;
                        DPMW.Utils.setAutoSyncSetting(DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_OFF);
                        this.$('#syncinterval-row').addClass('ui-state-disabled');
                        this.$('#autosync-interval').attr('tabindex', -1);
                    }
                };
                SettingView.prototype.syncOn = function () {
                    var me = this;
                    if (this.bAutoSync === false) {
                        this.bAutoSync = true;
                        DPMW.Utils.setAutoSyncSetting(DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_ON);
                        this.$('#syncinterval-row').removeClass('ui-state-disabled');
                        this.$('#autosync-interval').attr('tabindex', me.autosyncIntervalTabIndex);
                    }
                };
                SettingView.prototype.autoSyncIntervalChange = function () {
                    switch (this.intervalToAutoSync.val()) {
                        case '30M':
                            DPMW.Utils.setAutoSyncInterval(30);
                            break;
                        case '60M':
                            DPMW.Utils.setAutoSyncInterval(60);
                            break;
                        case '90M':
                            DPMW.Utils.setAutoSyncInterval(90);
                            break;
                        default:
                            DPMW.Utils.setAutoSyncInterval(10);
                            break;
                    }
                };
                SettingView.prototype.deviceStateChange = function () {
                    var _this = this;
                    var CONNECTION_STATE = DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE;
                    var CONNECTED = DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED;
                    var DISCONNECTED = DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED;
                    console.log(this.device.get(CONNECTION_STATE));
                    if (this.device && CONNECTED === this.device.get(CONNECTION_STATE)) {
                        this.dialogSetting.closeDialogConnecting();
                        this.noteTemplateListView = new Setting.NoteTemplateListView();
                        this.$("#note_template_section").append(this.noteTemplateListView.render().el);
                        this.listenTo(this.noteTemplateListView, 'uploadNoteTemplate', function (template_file, template_name) {
                            var uploadNoteTemplateInfo = {
                                template_file: template_file,
                                template_name: template_name,
                            };
                            _this.dialogSetting.submit(_this.dialogSetting, uploadNoteTemplateInfo);
                        });
                        this.wifiAPListView = new Setting.WifiAPListView();
                        this.$("#wifi_setting_section").append(this.wifiAPListView.render().el);
                        this.generalSettingView = new Setting.GeneralSettingView();
                        this.$("#general_setting_section").append(this.generalSettingView.render().el);
                        this.$('.hideWhenDisconnected').show();
                        this.$('#device-version-area').show();
                        this.$('#pairing-button').val($.i18n.t('config.button.repairing'));
                        $('#setting-sections').localize();
                        this.listenTo(this.device, 'sync', this.render);
                        this.device.deviceFirmwareModel.fetch({
                            success: function (model, res, options) {
                                var VERSION = DPMW.Model.Device.ATTR_NAME_VERSION;
                                var firmwareVersion = _this.device.deviceFirmwareModel.get(VERSION);
                                _this.$('#device-version').text(firmwareVersion);
                            },
                            error: function (model, res, options) {
                                console.log("version err");
                            }
                        });
                    }
                    else {
                        if (this.noteTemplateListView) {
                            this.noteTemplateListView.beforeRemove();
                            this.noteTemplateListView.remove();
                        }
                        if (this.wifiAPListView) {
                            this.wifiAPListView.remove();
                        }
                        if (this.generalSettingView) {
                            this.generalSettingView.beforeRemove();
                            this.generalSettingView.remove();
                        }
                        this.$('.hideWhenDisconnected').hide();
                        this.$('#device-version').text('-');
                        this.$('#device-version-area').show();
                        this.$('#pairing-button').val($.i18n.t('config.button.repairing'));
                    }
                };
                return SettingView;
            }(Backbone.View));
            Setting.SettingView = SettingView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SettingView.js.map