var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var ImageCaptor = (function () {
                function ImageCaptor(channel, doneCallback) {
                    var me = this;
                    me.channel = channel;
                    me.doneCallback = (typeof doneCallback === 'function') ? doneCallback : (function (result) { });
                    me.knownBaseUrl = undefined;
                    me.baseUrlInquirer = new ExternalOutput.BaseUrlInquirer(channel);
                    me.disposed = false;
                }
                ImageCaptor.prototype.dispose = function () {
                    var me = this;
                    if (!me.disposed) {
                        me.disposed = true;
                        me.baseUrlInquirer.dispose();
                    }
                };
                ImageCaptor.prototype.capture = function () {
                    var me = this;
                    if (!me.disposed) {
                        Promise.resolve().then(function () {
                            return me.inquiryBaseUrl();
                        }).then(function (baseUrl) {
                            return me.callCaptureWebApi(baseUrl);
                        }).then(function (result) {
                            me.callDoneCallback(result);
                        }).catch(function (result) {
                            me.callDoneCallback(result);
                        });
                    }
                };
                ImageCaptor.prototype.inquiryBaseUrl = function () {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        if (me.knownBaseUrl) {
                            resolve(me.knownBaseUrl);
                        }
                        else {
                            me.baseUrlInquirer.inquiry('ImageCaptor', function (baseUrl) {
                                if (baseUrl) {
                                    resolve(baseUrl);
                                }
                                else {
                                    var mwErr = new Error('Failed to get base url.');
                                    reject({
                                        mwErr: mwErr,
                                        xhrReq: undefined,
                                        baseUrl: undefined
                                    });
                                }
                            });
                        }
                    });
                };
                ImageCaptor.prototype.callCaptureWebApi = function (baseUrl) {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        var validStatuses = [200];
                        var httpMethod = 'GET';
                        var apiPath = '/system/controls/screen_shot2?query=jpeg';
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
                                    xhrReq: xhrReq,
                                    baseUrl: undefined
                                });
                            }
                        };
                        xhrReq.onabort = function (err) {
                            if (!handled) {
                                handled = true;
                                var mwErr = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR abort occured.', httpMethod, apiPath, xhrReq.status, null);
                                reject({
                                    mwErr: mwErr,
                                    xhrReq: xhrReq,
                                    baseUrl: undefined
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
                                    xhrReq: xhrReq,
                                    baseUrl: undefined
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
                                        xhrReq: xhrReq,
                                        baseUrl: undefined
                                    });
                                }
                                else {
                                    resolve({
                                        mwErr: undefined,
                                        xhrReq: xhrReq,
                                        baseUrl: baseUrl
                                    });
                                }
                            }
                        };
                        xhrReq.send();
                    });
                };
                ImageCaptor.prototype.callDoneCallback = function (result) {
                    var me = this;
                    var mwErr = result.mwErr;
                    var xhrReq = result.xhrReq;
                    var baseUrl = result.baseUrl;
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
                    me.knownBaseUrl = (!mwErr && baseUrl) ? baseUrl : undefined;
                    me.doneCallback({
                        errorCode: errorCode,
                        messageId: messageId,
                        xhrReq: xhrReq,
                        baseUrl: baseUrl,
                        madeBy: 'imageCaptor'
                    });
                };
                return ImageCaptor;
            }());
            ExternalOutput.ImageCaptor = ImageCaptor;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ImageCaptor.js.map