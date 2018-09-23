var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var ErrorUtils = (function () {
            function ErrorUtils() {
            }
            ErrorUtils.getDefaultErrorInfo = function (mwErrorCode, statusCode, webApiResCode) {
                var msgId = 'dialog.error.message.1';
                var type = 'warning';
                if (typeof mwErrorCode === 'string') {
                    switch (mwErrorCode) {
                        case DPMW.mwe.E_MW_ABORTED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_ALREADY_RUNNING:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_AUTH_FAILED:
                            msgId = 'dialog.error.message.65';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_AUTO_BT_PAN_CONNECTION_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_CANCELLED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DB_COMPACT_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DB_CORRUPT:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DB_CREATE_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DB_INVALID_ACCESS:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DB_READ_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DB_WRITE_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DEVICE_CONN_FAILED:
                            msgId = 'dialog.error.message.65';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DEVICE_NOT_FOUND:
                            msgId = 'dialog.error.message.65';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DEVICE_SCAN_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_DIR_CONFLICT_WZ_FILE:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_EXTERNAL_DOWNLOAD_INTERRUPTED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_EXT_HTTP_ERROR:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_EXT_HTTP_UNEXPECTED_STATUS:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_EXT_HTTP_UNEXPECTED_VALUE:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_EXT_RES_UNRECOGNIZABLE_VALUE:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FATAL_ERROR:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_CONFLICT_WZ_DIR:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_RENAME_LOCAL_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_SIZE_EXCEED_LIMIT:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_UNLINK_LOCAL_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_PORTFWDR_PORT_UNAVAILABLE:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_PORTFWDR_FAILED_TO_LISTEN_PORT:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_REG_PIN_MAY_BE_WRONG:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_STORE_GEN_KEYPAIR_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_STORE_GET_DEVICE_ID_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_STORE_GET_PRIVKEY_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_STORE_GET_PUBKEY_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_STORE_SET_CERT_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_STORE_SET_DEVICE_ID_FAILED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_SYNC_LOCAL_PATH_CONFLICT:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_SYNC_REMOTE_FOLDER_NOT_FOUND:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_SYNC_REMOTE_PATH_CONFLICT:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_TASK_NOT_FOUND:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_UO_NOT_ALLOWED:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT:
                            msgId = 'dialog.error.message.75';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_WEBAPI_ERROR:
                            msgId = 'dialog.error.message.65';
                            type = 'none';
                            break;
                        case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS:
                            msgId = 'dialog.error.message.91';
                            type = 'none';
                            if (statusCode) {
                                if (408 === statusCode) {
                                    if ('40800' === webApiResCode) {
                                        msgId = 'dialog.error.message.72';
                                        type = 'none';
                                    }
                                }
                                else if (507 === statusCode) {
                                    if ('50700' === webApiResCode) {
                                        msgId = 'dialog.error.message.24';
                                        type = 'none';
                                    }
                                    else if ('50701' === webApiResCode) {
                                        msgId = 'dialog.error.message.24';
                                        type = 'none';
                                    }
                                }
                                else if (500 <= statusCode && statusCode < 600) {
                                    msgId = 'dialog.error.message.3';
                                    type = 'warning';
                                }
                            }
                            break;
                        case DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE:
                            msgId = 'dialog.error.message.91';
                            type = 'none';
                            break;
                        default:
                            msgId = 'dialog.error.message.1';
                            type = 'warning';
                            break;
                    }
                }
                return { msgId: msgId, type: type };
            };
            return ErrorUtils;
        }());
        Utils.ErrorUtils = ErrorUtils;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ErrorUtils.js.map