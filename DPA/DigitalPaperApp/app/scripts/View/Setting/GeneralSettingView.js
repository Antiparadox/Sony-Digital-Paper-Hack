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
            var ds = DPMW.Model.DeviceSetting;
            var GeneralSettingView = (function (_super) {
                __extends(GeneralSettingView, _super);
                function GeneralSettingView(options) {
                    _super.call(this, options);
                    var templateStr = $('#template_general_setting_section').text();
                    this.template_ = Hogan.compile(templateStr);
                }
                GeneralSettingView.prototype.events = function () {
                    return {
                        'click #base-setting-button': this.changeSetting
                    };
                };
                GeneralSettingView.prototype.initialize = function () {
                    this.dialogControllers = new Array();
                    var device = DPMW.appCtrl.currentDevice;
                    this.deviceSettingModel = device.deviceSettingModel;
                    this.deviceSettingModel.fetch();
                    this.listenTo(this.deviceSettingModel, 'change', this.render);
                    this.listenTo(this.deviceSettingModel, 'destroy', this.remove);
                };
                GeneralSettingView.prototype.render = function () {
                    this.$el.html(this.template_.render({
                        title: $.i18n.t('config.label.generalSettings'),
                        owner: this.deviceSettingModel.get(ds.OwnerDefs.ATTR_NAME_OWNER),
                        owner_label: $.i18n.t('config.generalSettings.label.userName'),
                        date_format: $.i18n.t(Setting.ValToI18.DateFormat[this.deviceSettingModel.get(ds.DateFormatDefs.ATTR_NAME_DATE_FORMAT)]),
                        date_format_label: $.i18n.t('config.generalSettings.label.formatDate'),
                        time_format: $.i18n.t(Setting.ValToI18.TimeFormat[this.deviceSettingModel.get(ds.TimeFormatDefs.ATTR_NAME_TIME_FORMAT)]),
                        time_format_label: $.i18n.t('config.generalSettings.label.formatTime'),
                        time_zone: $.i18n.t(Setting.ValToI18.TimeZone[this.deviceSettingModel.get(ds.TimeZoneDefs.ATTR_NAME_TIMEZONE)]),
                        time_zone_label: $.i18n.t('config.generalSettings.label.timezone'),
                        timeout_to_standby: $.i18n.t(Setting.ValToI18.TimeoutToStandby[this.deviceSettingModel.get(ds.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY)]),
                        timeout_to_standby_label: $.i18n.t('config.generalSettings.label.autosleep'),
                        edit_btn_label: $.i18n.t('config.generalSettings.label.button.edit'),
                    }));
                    this.timeZoneEl = this.$('#time-zone');
                    this.dateFormatEl = this.$('#date-format');
                    this.timeFormatEl = this.$('#time-format');
                    this.timeoutToStandbyEl = this.$('#timeout_to_standby');
                    this.ownerEl = this.$('#owner');
                    return this;
                };
                GeneralSettingView.prototype.changeSetting = function () {
                    var _this = this;
                    var me = this;
                    var dialogController = null;
                    var handler = {
                        submit: function (data, dialogController) {
                            console.log(data);
                            var settings = new DPMW.View.Dialog.DialogInfo.DialogGeneralSettingInfo();
                            settings.time_zone = data.time_zone;
                            settings.date_format = data.date_format;
                            settings.time_format = data.time_format;
                            settings.timeout_to_standby = data.timeout_to_standby;
                            settings.owner = data.owner;
                            _this.deviceSettingModel.save(settings, {
                                success: function (modelOrCollection, res, options) {
                                    dialogController.success();
                                },
                                error: function (modelOrCollection, res, options) {
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
                                            if (res.status === 400) {
                                                if (typeof res.responseJSON !== 'undefined' &&
                                                    typeof res.responseJSON.error_code === 'string') {
                                                    if (res.responseJSON.error_code === '40001') {
                                                        msgId = 'dialog.error.message.65';
                                                    }
                                                    else if (res.responseJSON.error_code === '40004') {
                                                        msgId = 'dialog.error.message.65';
                                                    }
                                                    else {
                                                        msgId = 'dialog.error.message.65';
                                                    }
                                                }
                                                else {
                                                    msgId = 'dialog.error.message.65';
                                                }
                                            }
                                            else if (res.status >= 400 && res.status < 500) {
                                                msgId = 'dialog.error.message.65';
                                            }
                                            else if (res.status >= 500 && res.status < 600) {
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
                                    var dialogOptions = {
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                    };
                                    dialogController.error(dialogOptions);
                                }
                            });
                        },
                        closed: function () {
                            me.deleteDialogController(dialogController);
                        }
                    };
                    var initInfo = new DPMW.View.Dialog.DialogInfo.DialogGeneralSettingInfo();
                    initInfo.time_zone = this.deviceSettingModel.get(ds.TimeZoneDefs.ATTR_NAME_TIMEZONE);
                    initInfo.date_format = this.deviceSettingModel.get(ds.DateFormatDefs.ATTR_NAME_DATE_FORMAT);
                    initInfo.time_format = this.deviceSettingModel.get(ds.TimeFormatDefs.ATTR_NAME_TIME_FORMAT);
                    initInfo.timeout_to_standby = this.deviceSettingModel.get(ds.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY);
                    initInfo.owner = this.deviceSettingModel.get(ds.OwnerDefs.ATTR_NAME_OWNER);
                    dialogController = View.Dialog.openDialogGeneralSetting(initInfo, handler);
                    this.dialogControllers.push(dialogController);
                };
                GeneralSettingView.prototype.beforeRemove = function () {
                    if (this.dialogControllers || this.dialogControllers.length > 0) {
                        this.dialogControllers.forEach(function (dialogController, index, array) {
                            dialogController.close();
                        });
                    }
                };
                GeneralSettingView.prototype.deleteDialogController = function (dialogController) {
                    for (var i = 0; i < this.dialogControllers.length; i++) {
                        if (this.dialogControllers[i] === dialogController) {
                            this.dialogControllers.splice(i, 1);
                        }
                    }
                };
                GeneralSettingView.prototype.onFetchError = function (odelOrCollection, response, options) {
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
                            if (response.status >= 400 && response.status < 500) {
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
                        message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                    }, function (response) { });
                };
                return GeneralSettingView;
            }(Backbone.View));
            Setting.GeneralSettingView = GeneralSettingView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=GeneralSettingView.js.map