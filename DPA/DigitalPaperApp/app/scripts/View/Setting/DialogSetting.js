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
            var DialogSetting = (function (_super) {
                __extends(DialogSetting, _super);
                function DialogSetting(settingView) {
                    if (settingView instanceof Setting.SettingView === false) {
                        throw new Error('param settingView mast be instanceof DPMW.View.Settin.SettingView. ');
                    }
                    _super.call(this, View.Dialog.DialogName.WINDOW_SETTING, settingView);
                }
                DialogSetting.prototype.closeDialog = function (me) {
                    DPMW.appCtrl.terminate();
                    _super.prototype.closeDialog.call(this, me);
                };
                DialogSetting.prototype.onEsc = function (me) {
                    me.closeDialog(me);
                };
                DialogSetting.prototype.submitSuccess = function (e, detail, me) {
                    me.receiverView.trigger('noteTemplateUploadSuccess');
                };
                DialogSetting.prototype.submitFailure = function (e, detail, me) {
                    if (detail && detail.uploadNoteTemplate === true) {
                        me.receiverView.trigger('noteTemplateUploadFailure', detail.mwerr);
                    }
                    else {
                        _super.prototype.submitFailure.call(this, e, detail, me);
                    }
                };
                return DialogSetting;
            }(View.Dialog.DialogBase));
            Setting.DialogSetting = DialogSetting;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogSetting.js.map