var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var DialogInfo;
            (function (DialogInfo) {
                var DialogGeneralSettingInfo = (function () {
                    function DialogGeneralSettingInfo() {
                    }
                    return DialogGeneralSettingInfo;
                }());
                DialogInfo.DialogGeneralSettingInfo = DialogGeneralSettingInfo;
                var WifiCertUpload = (function () {
                    function WifiCertUpload() {
                    }
                    return WifiCertUpload;
                }());
                DialogInfo.WifiCertUpload = WifiCertUpload;
                var DialogEditInfo = (function () {
                    function DialogEditInfo() {
                        this.masking = false;
                    }
                    return DialogEditInfo;
                }());
                DialogInfo.DialogEditInfo = DialogEditInfo;
                var DialogAddNoteTemplateInfo = (function () {
                    function DialogAddNoteTemplateInfo() {
                    }
                    return DialogAddNoteTemplateInfo;
                }());
                DialogInfo.DialogAddNoteTemplateInfo = DialogAddNoteTemplateInfo;
                var DialogWpsCountdownInfo = (function () {
                    function DialogWpsCountdownInfo() {
                        this.time = 120;
                        this.countdownInterval = 1;
                    }
                    return DialogWpsCountdownInfo;
                }());
                DialogInfo.DialogWpsCountdownInfo = DialogWpsCountdownInfo;
                var DialogLoadingInfo = (function () {
                    function DialogLoadingInfo() {
                        this.cancelable = true;
                    }
                    return DialogLoadingInfo;
                }());
                DialogInfo.DialogLoadingInfo = DialogLoadingInfo;
                var WindowWifiSettingInfo = (function () {
                    function WindowWifiSettingInfo() {
                    }
                    return WindowWifiSettingInfo;
                }());
                DialogInfo.WindowWifiSettingInfo = WindowWifiSettingInfo;
                var WindowInitSetupInfo = (function () {
                    function WindowInitSetupInfo() {
                    }
                    return WindowInitSetupInfo;
                }());
                DialogInfo.WindowInitSetupInfo = WindowInitSetupInfo;
                var WindowDeviceSearchInfo = (function () {
                    function WindowDeviceSearchInfo() {
                    }
                    return WindowDeviceSearchInfo;
                }());
                DialogInfo.WindowDeviceSearchInfo = WindowDeviceSearchInfo;
                var WindowSettingInfo = (function () {
                    function WindowSettingInfo() {
                    }
                    return WindowSettingInfo;
                }());
                DialogInfo.WindowSettingInfo = WindowSettingInfo;
                var WindowExternalOutputInfo = (function () {
                    function WindowExternalOutputInfo() {
                    }
                    return WindowExternalOutputInfo;
                }());
                DialogInfo.WindowExternalOutputInfo = WindowExternalOutputInfo;
                var WindowSoftwareUpdateFoundInfo = (function () {
                    function WindowSoftwareUpdateFoundInfo() {
                    }
                    return WindowSoftwareUpdateFoundInfo;
                }());
                DialogInfo.WindowSoftwareUpdateFoundInfo = WindowSoftwareUpdateFoundInfo;
                var WindowSoftwareUpdateProgressInfo = (function () {
                    function WindowSoftwareUpdateProgressInfo() {
                    }
                    return WindowSoftwareUpdateProgressInfo;
                }());
                DialogInfo.WindowSoftwareUpdateProgressInfo = WindowSoftwareUpdateProgressInfo;
                var WindowAboutInfo = (function () {
                    function WindowAboutInfo() {
                    }
                    return WindowAboutInfo;
                }());
                DialogInfo.WindowAboutInfo = WindowAboutInfo;
                var DialogOpthions = (function () {
                    function DialogOpthions() {
                        this.noLink = false;
                    }
                    return DialogOpthions;
                }());
                DialogInfo.DialogOpthions = DialogOpthions;
                var DialogRelayInfo = (function () {
                    function DialogRelayInfo() {
                    }
                    return DialogRelayInfo;
                }());
                DialogInfo.DialogRelayInfo = DialogRelayInfo;
                var DialogSyncResultInfo = (function () {
                    function DialogSyncResultInfo() {
                    }
                    return DialogSyncResultInfo;
                }());
                DialogInfo.DialogSyncResultInfo = DialogSyncResultInfo;
                var DialogSyncResult = (function () {
                    function DialogSyncResult() {
                    }
                    return DialogSyncResult;
                }());
                DialogInfo.DialogSyncResult = DialogSyncResult;
                var DialogSyncIntroductionInfo = (function () {
                    function DialogSyncIntroductionInfo() {
                    }
                    return DialogSyncIntroductionInfo;
                }());
                DialogInfo.DialogSyncIntroductionInfo = DialogSyncIntroductionInfo;
            })(DialogInfo = Dialog.DialogInfo || (Dialog.DialogInfo = {}));
            var DialogName;
            (function (DialogName) {
                DialogName.DIALOG_EDIT = 'dialog_edit';
                DialogName.DIALOG_GENERAL_SETTING = 'dialog_general_setting';
                DialogName.DIALOG_ADD_NOTE_TEMPLATE = 'dialog_add_note_template';
                DialogName.DIALOG_WPS_COUNTDOWN = 'dialog_wps_countdown';
                DialogName.DIALOG_LOADING = 'dialog_loading';
                DialogName.DIALOG_SYNC_RESULT = 'dialog_sync_result';
                DialogName.DIALOG_SYNC_INTRODUCTION = 'dialog_sync_introduction';
                DialogName.WINDOW_SETTING = 'window_setting';
                DialogName.WINDOW_EXTERNAL_OUTPUT = 'window_external_output';
                DialogName.WINDOW_DEVICE_SEARCH = 'window_device_search';
                DialogName.WINDOW_WIFI_SETTING = 'window_wifi_setting';
                DialogName.WINDOW_INIT_SETUP = 'window_init_setup';
                DialogName.WINDOW_ABOUT = 'window_about';
                DialogName.WINDOW_SOFTWARE_UPDATE_CHECK = 'window_software_update_check';
                DialogName.WINDOW_SOFTWARE_UPDATE_FOUND = 'window_software_update_found';
                DialogName.WINDOW_SOFTWARE_UPDATE_PROGRESS = 'window_software_update_progress';
            })(DialogName = Dialog.DialogName || (Dialog.DialogName = {}));
            Dialog.IpcMessage = {
                PARENT_TO_MAIN: {
                    OPEN_DIALOG: 'open_dialog',
                    CLOSE_DIALOG: 'close_dialog',
                    SEND_INIT_INFO: 'send_init_info',
                    SUBMIT_SUCCEED: 'submit_succeed',
                    SUBMIT_FAILED: 'submit_failed',
                    SEND_PROGRESS: 'send_progress',
                    OPEN_DIALOG_CONNECTING: 'open_dialog_connecting',
                    CLOSE_DIALOG_CONNECTING: 'close_dialog_connecting',
                    IMAGE_CAPTURED: 'image_captured',
                    ANSWER_BASE_URL: 'answer_base_url',
                    RESULT_OF_TRY_TO_AUTH: 'result_of_try_to_auth',
                },
                MAIN_TO_PARENT: {
                    FINISH_CONNECT: 'finish_connect',
                    DIALOG_SHOWED: 'dialog_showed',
                    SUBMIT: 'submit',
                    CANCEL: 'cancel',
                    DIALOG_CLOSED: 'dialog_closed',
                    DIALOG_CLOSE: 'dialog_close',
                    GET_PROGRESS: 'get-progress',
                    DIALOG_RELAY: 'dialog_relay',
                    LOADING_CANCEL: 'loading_cancel',
                    INQUIRY_BASE_URL: 'inquiry_base_url',
                    TRY_TO_AUTH: 'try_to_auth',
                },
                MAIN_TO_CHILD: {
                    INIT_INFO: 'init_info',
                    SUBMIT_SUCCEED: 'submit_succeed',
                    SUBMIT_FAILED: 'submit_failed',
                    DIALOG_ON_CLOSE: 'dialog_on_close',
                    PROGRESS: 'progress',
                    OPEN_DIALOG_CONNECTING: 'open_dialog_connecting',
                    CLOSE_DIALOG_CONNECTING: 'close_dialog_connecting',
                    ENTERED_FULL_SCREEN: 'entered_full_screen',
                    LEFT_FULL_SCREEN: 'left_full_screen',
                    IMAGE_CAPTURED: 'image_captured',
                    ANSWER_BASE_URL: 'answer_base_url',
                    RESULT_OF_TRY_TO_AUTH: 'result_of_try_to_auth',
                },
                CHILD_TO_MAIN: {
                    CLOSE_DIALOG: 'close_dialog',
                    FINISH_INIT: 'finish-init',
                    GET_PROGRESS: 'get-progress',
                    SUBMIT: 'submit',
                    CANCEL: 'cancel',
                    DIALOG_RELAY: 'dialog_relay',
                    LOADING_CANCEL: 'loading_cancel',
                    REQUEST_ENTER_FULL_SCREEN: 'request_enter_full_screen',
                    REQUEST_LEAVE_FULL_SCREEN: 'request_leave_full_screen',
                    INQUIRY_BASE_URL: 'inquiry_base_url',
                    TRY_TO_AUTH: 'try_to_auth',
                },
            };
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogDefs.js.map