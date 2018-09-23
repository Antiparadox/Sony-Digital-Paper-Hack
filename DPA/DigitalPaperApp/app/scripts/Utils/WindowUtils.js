var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var WindowUtils = (function () {
            function WindowUtils() {
            }
            WindowUtils.setWinClosable = function (closable) {
                var remote = require('electron').remote;
                var curwin = remote.getCurrentWindow();
                curwin.setClosable(closable);
            };
            WindowUtils.shwoMessageBox = function (args) {
                var remote = require('electron').remote;
                var curwin = remote.getCurrentWindow();
                var dialog = remote.require('electron').dialog;
                return dialog.showMessageBox(curwin, args);
            };
            WindowUtils.showWarningMessage = function (msg, titile) {
                if (titile === void 0) { titile = 'Digital Papger Message'; }
                var okButton = $.i18n.t('app.words.ok');
                var args = {
                    type: 'warning',
                    title: titile,
                    message: msg,
                    buttons: [okButton],
                };
                WindowUtils.shwoMessageBox(args);
            };
            WindowUtils.showErrorMessage = function (msg, titile) {
                if (titile === void 0) { titile = $.i18n.t('dialog.title.error'); }
                var okButton = $.i18n.t('app.words.ok');
                var args = {
                    type: 'error',
                    title: titile,
                    message: msg,
                    buttons: [okButton],
                };
                WindowUtils.shwoMessageBox(args);
            };
            WindowUtils.showConfirmDialog = function (msg, titile) {
                if (titile === void 0) { titile = 'Digital Papger Message'; }
                var okBtn = $.i18n.t('app.words.ok');
                var cancelBtn = $.i18n.t('app.words.cancel');
                var args = {
                    type: 'info',
                    title: titile,
                    message: msg,
                    buttons: [okBtn, cancelBtn],
                    noLink: true,
                    defaultId: 1,
                    cancelId: 1,
                };
                return WindowUtils.shwoMessageBox(args);
            };
            WindowUtils.closeWindows = function (callback, confirm) {
                if (confirm === void 0) { confirm = true; }
                if (confirm) {
                    require('electron').ipcRenderer.once('init-setup-close-message', callback);
                }
                else {
                    var ipcRenderer = require('electron').ipcRenderer;
                    ipcRenderer.sendSync('cancel-dialog-message', true);
                }
            };
            WindowUtils.CONFIRM_CANCEL_ID = 1;
            return WindowUtils;
        }());
        Utils.WindowUtils = WindowUtils;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WindowUtils.js.map