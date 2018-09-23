var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiCertClientCollection = (function (_super) {
            __extends(WiFiCertClientCollection, _super);
            function WiFiCertClientCollection(deviceModel) {
                _super.call(this, deviceModel);
                this.model = Model.WiFiCertClientModel;
            }
            WiFiCertClientCollection.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    options.urlPath = "/system/configs/certificates/client";
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiCertClientCollection.prototype.parse = function (response, options) {
                var wifiCertClientList;
                if (!response) {
                    return [];
                }
                wifiCertClientList = response[Model.WiFiCertClientDefs.PARSE_NAME_CERT];
                if (!wifiCertClientList) {
                    return [];
                }
                return wifiCertClientList;
            };
            WiFiCertClientCollection.prototype.upload = function (srcFilePath, fileName, certName, password, callback) {
                var fileArrayBuffer = null;
                var argParams = {};
                if (typeof srcFilePath !== 'string' || typeof fileName !== 'string' || typeof certName !== 'string' || typeof password !== 'string') {
                    throw new TypeError('srcFilePath or fileName or certName is not string');
                }
                var ft = require('mw-file-transfer').createFileTransfer();
                var me = this;
                var successOrig = callback ? callback.success : null;
                var errorOrig = callback ? callback.error : null;
                ft.getCert(srcFilePath, function (err, data) {
                    if (err) {
                        if (typeof errorOrig === 'function') {
                            errorOrig(me, null, { mwError: err });
                        }
                        return;
                    }
                    else {
                        argParams[Model.WiFiCertClientDefs.UPLOAD_VALUE_NAME_FILE] = data;
                        argParams[Model.WiFiCertClientDefs.UPLOAD_VALUE_NAME_FILENAME] = fileName;
                        argParams[Model.WiFiCertClientDefs.UPLOAD_VALUE_NAME_NAME] = certName;
                        argParams[Model.WiFiCertClientDefs.UPLOAD_VALUE_NAME_PASSWORD] = password;
                        me.create(null, {
                            argParams: argParams,
                            success: function (modelOrCollection, response, options) {
                                if (typeof successOrig === 'function') {
                                    successOrig(modelOrCollection, response, options);
                                }
                            },
                            error: function (modelOrCollection, response, options) {
                                if (typeof errorOrig === 'function') {
                                    errorOrig(modelOrCollection, response, options);
                                }
                            }
                        });
                    }
                });
            };
            return WiFiCertClientCollection;
        }(Model.BaseDPAPICollection));
        Model.WiFiCertClientCollection = WiFiCertClientCollection;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiCertClientCollection.js.map