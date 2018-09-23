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
            var DialogAddNoteTemplate = (function (_super) {
                __extends(DialogAddNoteTemplate, _super);
                function DialogAddNoteTemplate(dialogName) {
                    _super.call(this, dialogName);
                    this.selectButton = $('#select-button');
                    this.templateNameEl = $('#template-name');
                    this.dispTemplateNameEl = $('#dispTemplate-name');
                    this.fileSelectButton = $('#select-button');
                    var me = this;
                    this.selectButton.on('click', function () {
                        var dialog = require('electron').remote.dialog;
                        var currentWindow = require('electron').remote.getCurrentWindow();
                        var options = {
                            filters: [
                                {
                                    name: 'PDF Files',
                                    extensions: ['pdf']
                                }
                            ],
                            properties: ['openFile']
                        };
                        dialog.showOpenDialog(currentWindow, options, function (files) {
                            if (files) {
                                me.templateFile = files[0];
                                var templateFileName = me.templateFile.split(/[\\\/]/).pop();
                                me.templateNameEl.val(templateFileName.slice(0, -4));
                                me.dispTemplateNameEl.text(templateFileName);
                                if (me.templateNameEl.val()) {
                                    me.submitButton.prop('disabled', false);
                                }
                            }
                        });
                    });
                    this.templateNameEl.keyup(function () {
                        if (me.templateFile && $.trim(me.templateNameEl.val())) {
                            me.submitButton.prop('disabled', false);
                        }
                        else {
                            me.submitButton.prop('disabled', true);
                        }
                    });
                }
                DialogAddNoteTemplate.prototype.setDefaultFocus = function () {
                    this.templateNameEl.focus();
                    $(this.templateNameEl).addClass('outline-clear');
                };
                DialogAddNoteTemplate.prototype.getUserInput = function () {
                    var me = this;
                    var userInput = new View.Dialog.DialogInfo.DialogAddNoteTemplateInfo();
                    userInput.template_name = this.templateNameEl.val();
                    userInput.template_file = this.templateFile;
                    return userInput;
                };
                DialogAddNoteTemplate.prototype.BeforeSubmit = function (submitFunction) {
                    console.log('BeforeSubmit');
                    var me = this;
                    var handler = {
                        dialogShowed: function () {
                            submitFunction('Dialog_Loading Showed');
                        },
                        canceled: function (dialogController) {
                            me.loadingCancel(me);
                        },
                    };
                    var initData = new View.Dialog.DialogInfo.DialogLoadingInfo();
                    initData.title = $.i18n.t('dialog.wait.title');
                    initData.message = $.i18n.t('dialog.wait.message');
                    initData.cancelable = true;
                    this.loadingDialogController = View.Dialog.createDialogLoading(initData, handler);
                };
                return DialogAddNoteTemplate;
            }(View.Dialog.DialogBase));
            Setting.DialogAddNoteTemplate = DialogAddNoteTemplate;
            var noteTemplateDialog = new DialogAddNoteTemplate(View.Dialog.DialogName.DIALOG_ADD_NOTE_TEMPLATE);
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogAddNoteTemplate.js.map