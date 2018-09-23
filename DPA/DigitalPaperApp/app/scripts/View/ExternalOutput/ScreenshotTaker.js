var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var ScreenshotTaker = (function () {
                function ScreenshotTaker(channel) {
                    this.channel = channel;
                }
                ScreenshotTaker.prototype.take = function (doneCallback) {
                    var me = this;
                    var safeDoneCallack = (typeof doneCallback === 'function') ? doneCallback : (function () { });
                    var saveFileName = undefined;
                    Promise.resolve().then(function () {
                        return me.showSaveDialog();
                    }).then(function (fileName) {
                        saveFileName = fileName;
                        return me.inquiryBaseUrl();
                    }).then(function (baseUrl) {
                        return me.callWebApi(baseUrl);
                    }).then(function (xhrReq) {
                        return me.saveImageToFile(saveFileName, xhrReq);
                    }).then(function () {
                        safeDoneCallack();
                    }).catch(function (errorInfo) {
                        if (errorInfo) {
                            me.showErrorDialog(errorInfo, function () {
                                safeDoneCallack();
                            });
                        }
                        else {
                            safeDoneCallack();
                        }
                    });
                };
                ScreenshotTaker.prototype.showSaveDialog = function () {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        var currentWindow = require('electron').remote.getCurrentWindow();
                        var remote = require('electron').remote;
                        var dialog = remote.dialog;
                        var defaultFileName = me.makeDefaultFileName();
                        dialog.showSaveDialog(currentWindow, {
                            properties: ["openDirectory"],
                            defaultPath: defaultFileName,
                            filters: [
                                { name: 'Images', extensions: ['png'] }
                            ]
                        }, function (fileName) {
                            console.log('File Name: ' + fileName);
                            if (fileName) {
                                resolve(fileName);
                            }
                            else {
                                reject(undefined);
                            }
                        });
                    });
                };
                ScreenshotTaker.prototype.inquiryBaseUrl = function () {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        var baseUrlInquirer = new ExternalOutput.BaseUrlInquirer(me.channel);
                        baseUrlInquirer.inquiry('ScreenshotTaker', function (baseUrl) {
                            if (baseUrl) {
                                console.log('Base URL: ' + baseUrl);
                                resolve(baseUrl);
                            }
                            else {
                                var mwErr = new Error('Failed to get base url.');
                                reject({
                                    mwErr: mwErr,
                                    xhrReq: undefined
                                });
                            }
                        });
                    });
                };
                ScreenshotTaker.prototype.callWebApi = function (baseUrl) {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        var validStatuses = [200];
                        var httpMethod = 'GET';
                        var apiPath = '/system/controls/screen_shot';
                        var handled = false;
                        var xhrReq = new XMLHttpRequest();
                        xhrReq.responseType = 'arraybuffer';
                        xhrReq.timeout = 1000 * 30;
                        xhrReq.open(httpMethod, baseUrl + apiPath, true);
                        xhrReq.ontimeout = function (err) {
                            if (!handled) {
                                handled = true;
                                var mwErr = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR timeout occured.', httpMethod, apiPath, xhrReq.status, null);
                                reject({
                                    mwErr: mwErr,
                                    xhrReq: xhrReq
                                });
                            }
                        };
                        xhrReq.onabort = function (err) {
                            if (!handled) {
                                handled = true;
                                var mwErr = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR abort occured.', httpMethod, apiPath, xhrReq.status, null);
                                reject({
                                    mwErr: mwErr,
                                    xhrReq: xhrReq
                                });
                            }
                        };
                        xhrReq.onerror = function (err) {
                            if (!handled) {
                                handled = true;
                                var mwErr = undefined;
                                if (validStatuses.indexOf(xhrReq.status) < 0) {
                                    mwErr = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', httpMethod, apiPath, xhrReq.status, null);
                                }
                                else {
                                    mwErr = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error occured.', httpMethod, apiPath, xhrReq.status, null);
                                }
                                reject({
                                    mwErr: mwErr,
                                    xhrReq: xhrReq
                                });
                            }
                        };
                        xhrReq.onload = function () {
                            if (!handled) {
                                handled = true;
                                if (validStatuses.indexOf(xhrReq.status) < 0) {
                                    var mwErr = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', httpMethod, apiPath, xhrReq.status, null);
                                    reject({
                                        mwErr: mwErr,
                                        xhrReq: xhrReq
                                    });
                                }
                                else {
                                    resolve(xhrReq);
                                }
                            }
                        };
                        xhrReq.send();
                    });
                };
                ScreenshotTaker.prototype.saveImageToFile = function (fileName, xhrReq) {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        var buf = Buffer.from(xhrReq.response);
                        var len = parseInt(xhrReq.getResponseHeader('Content-Length'));
                        var fs = require('fs');
                        fs.writeFile(fileName, buf, function (err) {
                            if (err) {
                                var mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'Fail to create local file for screen capture.');
                                reject({
                                    mwErr: mwErr,
                                    xhrReq: xhrReq
                                });
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                };
                ScreenshotTaker.prototype.showErrorDialog = function (errorInfo, callback) {
                    var mwErr = errorInfo.mwErr;
                    var xhrReq = errorInfo.xhrReq;
                    var safeCallback = (typeof callback === 'function') ? callback : (function () { });
                    var messageId = undefined;
                    var errorCode = undefined;
                    if (mwErr) {
                        var mwCode = mwErr.mwCode;
                        if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                            if ((xhrReq.status >= 400) && (xhrReq.status < 500)) {
                                messageId = 'dialog.error.message.75';
                            }
                            else if ((xhrReq.status >= 500) && (xhrReq.status < 600)) {
                                messageId = 'dialog.error.message.3';
                            }
                            else {
                                messageId = 'dialog.error.message.65';
                            }
                        }
                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            messageId = 'dialog.error.message.65';
                        }
                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                            messageId = 'dialog.error.message.65';
                        }
                        else {
                            messageId = 'dialog.error.message.75';
                        }
                        errorCode = DPMW.mwe.genUserErrorCode(mwErr);
                    }
                    else {
                        messageId = 'dialog.error.message.75';
                        mwErr = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                        errorCode = DPMW.mwe.genUserErrorCode(mwErr);
                    }
                    View.Dialog.openErrorDialog({
                        title: $.i18n.t('dialog.title.error'),
                        message: $.i18n.t(messageId, { errorCode: errorCode }),
                    }, function (response) {
                        safeCallback();
                    });
                };
                ScreenshotTaker.prototype.makeDefaultFileName = function () {
                    var now = new Date();
                    var y = now.getFullYear();
                    var m = ('0' + (now.getMonth() + 1)).slice(-2);
                    var d = ('0' + now.getDate()).slice(-2);
                    var hh = ('0' + now.getHours()).slice(-2);
                    var mm = ('0' + now.getMinutes()).slice(-2);
                    return 'DP_' + y + m + d + '_' + hh + mm + '.png';
                };
                return ScreenshotTaker;
            }());
            ExternalOutput.ScreenshotTaker = ScreenshotTaker;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ScreenshotTaker.js.map