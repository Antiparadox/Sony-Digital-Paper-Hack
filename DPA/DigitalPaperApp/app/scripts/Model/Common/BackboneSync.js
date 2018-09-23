var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var BackboneSync;
        (function (BackboneSync) {
            var methodMap = {
                'create': 'POST',
                'update': 'PUT',
                'patch': 'PATCH',
                'delete': 'DELETE',
                'read': 'GET'
            };
            function getHttpMethod(method) {
                return methodMap[method];
            }
            BackboneSync.getHttpMethod = getHttpMethod;
            var REAUTH_STATUSES = [401];
            var ENABLE_REAUTH = (!!process.env.MW_SUPPORT_DPAPI_REAUTH);
            function callWebApiForDevice(model, type, urlPath, data, validStatuses, options) {
                if (!model.connCtrl) {
                    throw new Error('Wrong call! device model is not set');
                }
                return callWebApiInternal_(model, model, type, urlPath, data, validStatuses, options);
            }
            BackboneSync.callWebApiForDevice = callWebApiForDevice;
            function callWebApi(model, type, urlPath, data, validStatuses, options) {
                var device = model.getDeviceModel();
                if (!device) {
                    throw new Error('Wrong call! device model is not set');
                }
                return callWebApiInternal_(model, device, type, urlPath, data, validStatuses, options);
            }
            BackboneSync.callWebApi = callWebApi;
            function callWebApiInternal_(model, device, type, urlPath, data, validStatuses, options) {
                var discoveryCtrl = require('electron').remote.require('mw-discovery-ctrl');
                if (typeof type !== 'string') {
                    throw new Error('type must be http method');
                }
                if (typeof urlPath !== 'string') {
                    throw new TypeError('urlPath must be string.');
                }
                if (!Array.isArray(validStatuses)) {
                    throw new TypeError('validStatuses must be array.');
                }
                var urlRoot = device.get(DPMW.Model.Device.ATTR_NAME_BASE_URL);
                var successOrig = options ? options.success : null;
                var errorOrig = options ? options.error : null;
                var options = options || {};
                var ajaxOptions = {
                    success: function (data, textStatus, jqXHR) {
                        errorEmulator_(jqXHR);
                        if (validStatuses.indexOf(jqXHR.status) < 0) {
                            options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', type, urlPath, jqXHR.status, jqXHR.responseJSON);
                            if (typeof errorOrig === 'function') {
                                errorOrig(model, jqXHR, options);
                            }
                            return;
                        }
                        if (typeof successOrig === 'function') {
                            successOrig(model, jqXHR, options);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (ENABLE_REAUTH &&
                            REAUTH_STATUSES.indexOf(jqXHR.status) >= 0 && !options.reauthed) {
                            device.auth({ success: function () {
                                    options.reauthed = true;
                                    if (options.xhr)
                                        delete options.xhr;
                                    callWebApiInternal_(model, device, type, urlPath, data, validStatuses, options);
                                }, error: function () {
                                    if (jqXHR.status === 0) {
                                        discoveryCtrl.refresh();
                                    }
                                    options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', type, urlPath, jqXHR.status, jqXHR.responseJSON);
                                    if (typeof errorOrig === 'function') {
                                        errorOrig(model, jqXHR, options);
                                    }
                                } });
                            return;
                        }
                        if (jqXHR.status === 0) {
                            discoveryCtrl.refresh();
                        }
                        if (validStatuses.indexOf(jqXHR.status) < 0) {
                            options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', type, urlPath, jqXHR.status, jqXHR.responseJSON);
                            if (typeof errorOrig === 'function') {
                                errorOrig(model, jqXHR, options);
                            }
                            return;
                        }
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error occured.', type, urlPath, jqXHR.status, jqXHR.responseJSON);
                        if (typeof errorOrig === 'function') {
                            errorOrig(model, jqXHR, options);
                        }
                    },
                    type: type,
                    url: urlRoot + urlPath,
                    contentType: 'application/json',
                    timeout: Model.BackboneSyncDefs.XHR_TIMEOUT,
                    data: JSON.stringify(data)
                };
                $.ajax(ajaxOptions);
            }
            BackboneSync.callWebApiInternal_ = callWebApiInternal_;
            function syncWithMwe(method, model, options) {
                var discoveryCtrl = require('electron').remote.require('mw-discovery-ctrl');
                var device = model.getDeviceModel();
                if (!device) {
                    throw new Error('Wrong call! device model is not set');
                }
                if (typeof options.urlPath !== 'string') {
                    throw new TypeError('options.urlPath must be string.');
                }
                if (!Array.isArray(options.validStatuses)) {
                    throw new TypeError('options.validStatuses must be array.');
                }
                var validStatuses = options.validStatuses;
                var successOrig = options.success;
                var errorOrig = options.error;
                var urlPath = options.urlPath;
                var urlRoot = device.get(DPMW.Model.Device.ATTR_NAME_BASE_URL);
                if (typeof urlRoot !== 'string') {
                    options.mwError = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_CONN_FAILED, 'Accessing already disconnected device. THIS IS ALTAIR PROGRAMMING ISSUE', device);
                    if (typeof errorOrig === 'function') {
                        errorOrig(null, "error", options.mwError);
                    }
                    return;
                }
                if (!urlRoot) {
                    if (typeof errorOrig === 'function') {
                        errorOrig(null, "error", new Error('base url is null and there is a need to discard the invalid model or collection.'));
                    }
                    return null;
                }
                options.url = urlRoot + urlPath;
                options.success = function (success, statusText, jqXHR) {
                    errorEmulator_(jqXHR);
                    if (validStatuses.indexOf(jqXHR.status) < 0) {
                        if (typeof options.mwError !== 'undefined') {
                            if (typeof errorOrig === 'function') {
                                errorOrig(jqXHR, "error", new Error('mwError looks already set.'));
                            }
                            return;
                        }
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', getHttpMethod(method), urlPath, jqXHR.status, jqXHR.responseJSON);
                        if (typeof errorOrig === 'function') {
                            errorOrig(jqXHR, "error", options.mwError);
                        }
                        return;
                    }
                    if (typeof successOrig === 'function') {
                        successOrig(success, statusText, jqXHR);
                    }
                };
                options.error = function (jqXHR, statusText, error) {
                    if (ENABLE_REAUTH &&
                        REAUTH_STATUSES.indexOf(jqXHR.status) >= 0 && !options.reauthed) {
                        device.auth({ success: function () {
                                options.success = successOrig;
                                options.error = errorOrig;
                                options.reauthed = true;
                                if (options.xhr)
                                    delete options.xhr;
                                syncWithMwe(method, model, options);
                            }, error: function () {
                                if (jqXHR.status === 0) {
                                    discoveryCtrl.refresh();
                                }
                                options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', getHttpMethod(method), urlPath, jqXHR.status, jqXHR.responseJSON);
                                if (typeof errorOrig === 'function') {
                                    errorOrig(jqXHR, statusText, options.mwError);
                                }
                            } });
                        return;
                    }
                    if (jqXHR.status === 0) {
                        discoveryCtrl.refresh();
                    }
                    if (typeof options.mwError !== 'undefined') {
                        if (typeof errorOrig === 'function') {
                            errorOrig(jqXHR, statusText, new Error('mwError looks already set.'));
                        }
                        return;
                    }
                    if (validStatuses.indexOf(jqXHR.status) < 0) {
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', getHttpMethod(method), urlPath, jqXHR.status, jqXHR.responseJSON);
                        if (typeof errorOrig === 'function') {
                            errorOrig(jqXHR, statusText, options.mwError);
                        }
                        return;
                    }
                    options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error occured.', getHttpMethod(method), urlPath, jqXHR.status, jqXHR.responseJSON);
                    if (typeof errorOrig === 'function') {
                        errorOrig(jqXHR, statusText, options.mwError);
                    }
                };
                options.timeout = Model.BackboneSyncDefs.XHR_TIMEOUT;
                return Backbone.sync(method, model, options);
            }
            BackboneSync.syncWithMwe = syncWithMwe;
            var errorEmuStatus = null;
            var errorEmuBodyJson = null;
            function errorEmulate(status, responseBodyJson) {
                errorEmuStatus = status;
                errorEmuBodyJson = responseBodyJson;
            }
            BackboneSync.errorEmulate = errorEmulate;
            function errorEmulator_(jqXHR) {
                if (errorEmuStatus) {
                    jqXHR.status = errorEmuStatus;
                    errorEmuStatus = null;
                }
                if (errorEmuBodyJson) {
                    jqXHR.responseJSON = errorEmuBodyJson;
                    errorEmuBodyJson = null;
                }
                return;
            }
        })(BackboneSync = Model.BackboneSync || (Model.BackboneSync = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=BackboneSync.js.map