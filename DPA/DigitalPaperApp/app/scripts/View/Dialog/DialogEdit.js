var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var DialogEdit = (function (_super) {
                __extends(DialogEdit, _super);
                function DialogEdit(dialogName) {
                    _super.call(this, dialogName);
                    this.editboxEl = $('#editbox');
                    var me = this;
                    this.editboxEl.keyup(function () {
                        if ($.trim(me.editboxEl.val())) {
                            me.submitButton.prop('disabled', false);
                        }
                        else {
                            me.submitButton.prop('disabled', true);
                        }
                    });
                }
                DialogEdit.prototype.setInitValue = function (info) {
                    var me = this;
                    console.log(info);
                    if (info.masking) {
                        document.getElementById('editbox').setAttribute('type', 'password');
                    }
                    if (_.isUndefined(info.editbox)) {
                        $('#submit-button').prop("disabled", true);
                    }
                    else {
                        this.editboxEl.val(info.editbox);
                    }
                    $('#dialog-message').text(info.message);
                };
                DialogEdit.prototype.setDefaultFocus = function () {
                    this.editboxEl.focus();
                    $(this.editboxEl).addClass('outline-clear');
                };
                DialogEdit.prototype.getUserInput = function () {
                    var me = this;
                    var userInput = new Dialog.DialogInfo.DialogEditInfo();
                    userInput.editbox = this.editboxEl.val();
                    return userInput;
                };
                return DialogEdit;
            }(Dialog.DialogBase));
            Dialog.DialogEdit = DialogEdit;
            var editDialog = new DialogEdit(Dialog.DialogName.DIALOG_EDIT);
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogEdit.js.map