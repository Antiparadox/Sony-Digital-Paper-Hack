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
            var InitSetupBaseView = (function (_super) {
                __extends(InitSetupBaseView, _super);
                function InitSetupBaseView(dialog, options) {
                    _super.call(this, options);
                    this.menuId = this.attributes.menuId;
                    this.dialog_ = dialog;
                }
                InitSetupBaseView.prototype.events = function () {
                    return {
                        'click #next': 'goNext',
                        'click #cancel': 'cancel',
                        'click #back': 'goBack',
                    };
                };
                InitSetupBaseView.prototype.initialize = function (options) {
                    _super.prototype.initialize.call(this, options);
                };
                InitSetupBaseView.prototype.goNext = function (ev) {
                    var nextView = this.getNextView();
                    if (nextView === null) {
                        return;
                    }
                    this.$el.hide();
                    this.trigger("next", nextView);
                };
                InitSetupBaseView.prototype.goBack = function (ev) {
                    this.stopListening();
                    this.undelegateEvents();
                    this.$el.hide();
                    this.trigger('back', ev);
                };
                InitSetupBaseView.prototype.cancel = function (ev) {
                    if (process.platform === 'darwin') {
                        this.dialog_.checkCloseDialog(this.dialog_);
                        return;
                    }
                    close();
                };
                InitSetupBaseView.prototype.closeIpcCallback = function (callback) {
                    var title = $.i18n.t('dialog.confirm.pairingCancel.title');
                    var msg = $.i18n.t('dialog.confirm.pairingCancel.message');
                    var btn_index;
                    var dialogOptions = {
                        title: title,
                        message: msg
                    };
                    DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                        callback(response);
                    });
                };
                InitSetupBaseView.prototype.getNextView = function () {
                    return null;
                };
                InitSetupBaseView.prototype.changeWifiSetup = function (e) { };
                ;
                InitSetupBaseView.prototype.clickSecurityDisplay = function (e) { };
                ;
                InitSetupBaseView.prototype.clikcDhcpCheck = function () { };
                ;
                InitSetupBaseView.prototype.toggleTabIndex = function () { };
                ;
                return InitSetupBaseView;
            }(Backbone.View));
            InitSetup.InitSetupBaseView = InitSetupBaseView;
        })(InitSetup = View.InitSetup || (View.InitSetup = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=InitSetupBaseView.js.map