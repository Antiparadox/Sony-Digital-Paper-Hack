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
            var NoteTemplateListView = (function (_super) {
                __extends(NoteTemplateListView, _super);
                function NoteTemplateListView(options) {
                    _super.call(this, options);
                }
                NoteTemplateListView.prototype.events = function () {
                    return {
                        "click #addTemplate-button": this.addTemplate,
                        "click #deleteTemplate-button": this.deleteTemplate,
                        "click #renameTemplate-button": this.renameTemplate,
                    };
                };
                NoteTemplateListView.prototype.initialize = function () {
                    var _this = this;
                    this.dialogControllers = new Array();
                    this.noteTemplateViewList = new Array();
                    var device = DPMW.appCtrl.currentDevice;
                    this.listenTo(this, 'noteTemplateUploadSuccess', function () {
                        if (_this.dialogAddNoteTemplateController) {
                            _this.dialogAddNoteTemplateController.success();
                            _this.noteTemplates.fetch({ error: _this.onFetchError });
                        }
                    });
                    this.listenTo(this, 'noteTemplateUploadFailure', function (mwError) {
                        _this.onNoteTemplateUploadFailur(mwError);
                    });
                    var templateStr = $('#template_note_template_section').text();
                    this.template_ = Hogan.compile(templateStr);
                    this.$el.html(this.template_.render({}));
                    this.ul = this.$('#note_template-list');
                    this.deleteTemplateButton = this.$('#deleteTemplate-button');
                    this.renameTemplateButton = this.$('#renameTemplate-button');
                    this.noteTemplates = device.noteTemplateCollection;
                    this.listenTo(this.noteTemplates, 'sync', this.reloadList);
                    this.noteTemplates.fetch({ error: this.onFetchError });
                };
                NoteTemplateListView.prototype.render = function () {
                    return this;
                };
                NoteTemplateListView.prototype.reloadList = function (e) {
                    while (this.noteTemplateViewList.length > 0) {
                        this.noteTemplateViewList.pop().remove();
                    }
                    var me = this;
                    this.noteTemplates.each(function (noteTemplate) {
                        var noteTemplateView = me.addOne(noteTemplate);
                        if (me.selectedTempalte && me.selectedTempalte.id === noteTemplateView.model.id) {
                            noteTemplateView.$el.addClass('selected');
                        }
                    });
                };
                NoteTemplateListView.prototype.beforeRemove = function () {
                    if (this.dialogControllers || this.dialogControllers.length > 0) {
                        this.dialogControllers.forEach(function (dialogController, index, array) {
                            dialogController.close();
                        });
                    }
                };
                NoteTemplateListView.prototype.addOne = function (noteTemplate) {
                    var view = new Setting.NoteTemplateView({ model: noteTemplate, tagName: 'li' });
                    this.noteTemplateViewList.push(view);
                    this.$("#note_template-list").append(view.render().el);
                    this.listenTo(view, 'clickTemplate', this.selectTemplate);
                    return view;
                };
                NoteTemplateListView.prototype.selectTemplate = function (noteTemplateView) {
                    if (this.selectedTempalte && noteTemplateView.model.id === this.selectedTempalte.id) {
                        noteTemplateView.$el.removeClass('selected');
                        this.selectedTempalte = null;
                    }
                    else {
                        this.$('ul').children().removeClass('selected');
                        noteTemplateView.$el.addClass('selected');
                        this.selectedTempalte = noteTemplateView.model;
                    }
                    var isModifiable = this.selectedTempalte &&
                        this.selectedTempalte.get(DPMW.Model.NoteTemplateDefs.ATTR_NAME_IS_MODIFIABLE);
                    this.deleteTemplateButton.prop('disabled', isModifiable !== 'true');
                    this.renameTemplateButton.prop('disabled', isModifiable !== 'true');
                };
                NoteTemplateListView.prototype.addTemplate = function () {
                    var _this = this;
                    var me = this;
                    var dialogController = null;
                    var handler = {
                        submit: function (data, dialogCtr) {
                            var template_file = data.template_file;
                            var template_name = data.template_name;
                            var fileSize;
                            var err = null;
                            var msgId = null;
                            DPMW.Utils.fs.stat(template_file, function (error, stats) {
                                if (!stats || !stats.size) {
                                    err = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED, 'File not accessable');
                                    msgId = 'dialog.error.message.76';
                                    var dialogOptions = {
                                        message: $.i18n.t(msgId, { file: template_file, errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                        type: 'none',
                                    };
                                    dialogCtr.error(dialogOptions);
                                    return;
                                }
                                else {
                                    fileSize = stats.size;
                                    _this.deviceStorageCheck(fileSize, template_file, template_name, dialogCtr, me);
                                }
                            });
                        },
                        loadingCancel: function (dialogCtr) {
                            me.noteTemplates.cancelUpload();
                        },
                        closed: function () {
                            me.deleteDialogController(dialogController);
                            me.dialogAddNoteTemplateController = null;
                        },
                    };
                    dialogController = View.Dialog.createDialogAddNoteTemplate(null, handler);
                    me.dialogAddNoteTemplateController = dialogController;
                    me.dialogControllers.push(dialogController);
                };
                NoteTemplateListView.prototype.deviceStorageCheck = function (fileSize, template_file, template_name, dialogCtr, me) {
                    var _this = this;
                    var available;
                    var err = null;
                    var msgId = null;
                    var device = DPMW.appCtrl.currentDevice;
                    var dialogOptions = new View.Dialog.DialogInfo.DialogOpthions;
                    dialogOptions.type = 'error';
                    dialogOptions.title = $.i18n.t('dialog.title.error');
                    dialogOptions.buttons = [$.i18n.t('app.words.ok')];
                    dialogOptions.message = '';
                    device.deviceStorageModel.fetch({
                        success: function (modelOrCollection, response, options) {
                            available = device.deviceStorageModel.get(DPMW.Model.Device.ATTR_NAME_AVAILABLE);
                            if (parseInt(fileSize) > parseInt(available)) {
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_SIZE_EXCEED_LIMIT, 'Device storage is not enough');
                                msgId = 'dialog.error.message.62';
                                var dialogOptions_1 = {
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                    type: 'none',
                                };
                                dialogCtr.error(dialogOptions_1);
                                return;
                            }
                            _this.trigger('uploadNoteTemplate', template_file, template_name);
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
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                    break;
                                default:
                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                    break;
                            }
                            var dialogOptions = {
                                message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                type: errorInfo.type,
                            };
                            dialogCtr.error(dialogOptions);
                            return;
                        }
                    });
                };
                NoteTemplateListView.prototype.deleteTemplate = function () {
                    var _this = this;
                    View.Dialog.openYesNoDialog({
                        title: $.i18n.t('dialog.confirm.deleteTemplate.title'),
                        message: $.i18n.t('dialog.confirm.deleteTemplate.message'),
                    }, function (res) {
                        console.log(res);
                        if (res === 0) {
                            _this.selectedTempalte.destroy({
                                success: function (modelOrCollection, res, options) {
                                    _this.noteTemplates.fetch({ error: _this.onFetchError });
                                    _this.selectedTempalte = null;
                                    _this.deleteTemplateButton.prop('disabled', true);
                                    _this.renameTemplateButton.prop('disabled', true);
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
                                            if (400 === statusCode) {
                                                if ('40009' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.75';
                                                    errorInfo.type = 'none';
                                                }
                                                else {
                                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                                }
                                            }
                                            else if (404 === statusCode) {
                                                if ('40401' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.54';
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
                                }
                            });
                        }
                    });
                };
                NoteTemplateListView.prototype.renameTemplate = function () {
                    var me = this;
                    var dialogController = null;
                    var handler = {
                        submit: function (detail, dialogController) {
                            console.log(detail);
                            var attr = {
                                template_name: detail.editbox
                            };
                            me.selectedTempalte.save(attr, {
                                success: function () {
                                    dialogController.success();
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
                                            if (400 === statusCode) {
                                                if ('40001' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.75';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40006' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.75';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40007' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.32';
                                                    errorInfo.type = 'none';
                                                }
                                                else if ('40009' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.75';
                                                    errorInfo.type = 'none';
                                                }
                                                else {
                                                    errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                                }
                                            }
                                            else if (404 === statusCode) {
                                                if ('40401' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.54';
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
                                            else if (507 === statusCode) {
                                                if ('50701' === webApiResCode) {
                                                    errorInfo.msgId = 'dialog.error.message.24';
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
                                    var dialogOptions = {
                                        message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                        type: errorInfo.type,
                                    };
                                    dialogController.error(dialogOptions);
                                },
                            });
                        },
                        closed: function () {
                            me.deleteDialogController(dialogController);
                        }
                    };
                    var initInfo = new DPMW.View.Dialog.DialogInfo.DialogEditInfo();
                    initInfo.title = $.i18n.t('dialog.edit.templateName.title');
                    initInfo.message = $.i18n.t('dialog.edit.templateName.message');
                    initInfo.masking = false;
                    var attrName = DPMW.Model.NoteTemplateDefs.ATTR_NAME_TEMPLATE_NAME;
                    initInfo.editbox = this.selectedTempalte.get(attrName);
                    dialogController = View.Dialog.createDialogEdit(initInfo, handler);
                    this.dialogControllers.push(dialogController);
                };
                NoteTemplateListView.prototype.deleteDialogController = function (dialogController) {
                    for (var i = 0; i < this.dialogControllers.length; i++) {
                        if (this.dialogControllers[i] === dialogController) {
                            this.dialogControllers.splice(i, 1);
                        }
                    }
                };
                NoteTemplateListView.prototype.onFetchError = function (odelOrCollection, response, options) {
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
                            if (408 === statusCode) {
                                if ('40800' === webApiResCode) {
                                    errorInfo.msgId = 'dialog.error.message.72';
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
                NoteTemplateListView.prototype.onNoteTemplateUploadFailur = function (mwError) {
                    if (this.dialogAddNoteTemplateController) {
                        var err = void 0;
                        if (!mwError) {
                            err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'Error object does not passed');
                        }
                        else {
                            err = mwError;
                        }
                        var errCode = DPMW.mwe.genUserErrorCode(err);
                        var errorInfo = { msgId: null, type: null };
                        switch (err.mwCode) {
                            case DPMW.mwe.E_MW_ALREADY_RUNNING:
                                errorInfo.msgId = 'dialog.error.message.75';
                                errorInfo.type = 'none';
                                break;
                            case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                                errorInfo.msgId = 'dialog.error.message.65';
                                errorInfo.type = 'none';
                                break;
                            case DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED:
                                if (err.cause && err.cause.path) {
                                    errorInfo.msgId = 'dialog.error.message.76';
                                    errorInfo.type = 'none';
                                    var dialogOptions_2 = {
                                        message: $.i18n.t(errorInfo.msgId, { file: err.cause.path, errorCode: errCode }),
                                        type: errorInfo.type,
                                    };
                                    this.dialogAddNoteTemplateController.error(dialogOptions_2);
                                    return;
                                }
                                else {
                                    errorInfo.msgId = 'dialog.error.message.75';
                                    errorInfo.type = 'none';
                                }
                                break;
                            case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                                var statusCode = void 0;
                                var webApiResCode = void 0;
                                statusCode = err.mwWebApiResCode;
                                if (err.cause && typeof err.cause.error_code === 'string') {
                                    webApiResCode = err.cause.error_code;
                                }
                                if (400 === statusCode) {
                                    if ('40001' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40002' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40006' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.16';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40007' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.32';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40008' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.52';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40009' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40010' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40011' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40011' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.75';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40013' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.60';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40014' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.60';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40015' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.61';
                                        errorInfo.type = 'none';
                                    }
                                    else if ('40016' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.62';
                                        errorInfo.type = 'none';
                                    }
                                    else {
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode, statusCode, webApiResCode);
                                    }
                                }
                                else if (404 === statusCode) {
                                    if ('40401' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.54';
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
                                else if (507 === statusCode) {
                                    if ('50701' === webApiResCode) {
                                        errorInfo.msgId = 'dialog.error.message.24';
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
                        var dialogOptions = {
                            message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                            type: errorInfo.type,
                        };
                        this.dialogAddNoteTemplateController.error(dialogOptions);
                    }
                };
                return NoteTemplateListView;
            }(Backbone.View));
            Setting.NoteTemplateListView = NoteTemplateListView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=NoteTemplateListView.js.map