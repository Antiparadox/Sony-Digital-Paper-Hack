var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiCertCACollection = (function (_super) {
            __extends(WiFiCertCACollection, _super);
            function WiFiCertCACollection(deviceModel) {
                _super.call(this, deviceModel);
                this.model = Model.WiFiCertCAModel;
            }
            WiFiCertCACollection.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    options.urlPath = "/system/configs/certificates/ca";
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiCertCACollection.prototype.parse = function (response, options) {
                var wifiCertCAList;
                if (!response) {
                    return [];
                }
                wifiCertCAList = response[Model.WiFiCertCADefs.PARSE_NAME_CERT];
                if (!wifiCertCAList) {
                    return [];
                }
                return wifiCertCAList;
            };
            WiFiCertCACollection.prototype.upload = function (srcFilePath, fileName, certName, callback) {
                var fileArrayBuffer = null;
                var argParams = {};
                var fs = require('fs');
                if (typeof srcFilePath !== 'string' || typeof fileName !== 'string' || typeof certName !== 'string') {
                    throw new TypeError('srcFilePath or fileName or certName is not string');
                }
                var ft = require('mw-file-transfer').createFileTransfer();
                var me = this;
                var successOrig = callback ? callback.success : null;
                var errorOrig = callback ? callback.error : null;
                ft.getCert(srcFilePath, function (err, data) {
                    if (err) {
                        if (typeof errorOrig === 'function') {
                            callback.error(me, null, { mwError: err });
                        }
                        return;
                    }
                    else {
                        argParams[Model.WiFiCertCADefs.UPLOAD_VALUE_NAME_FILE] = data;
                        argParams[Model.WiFiCertCADefs.UPLOAD_VALUE_NAME_FILENAME] = fileName;
                        argParams[Model.WiFiCertCADefs.UPLOAD_VALUE_NAME_NAME] = certName;
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
            return WiFiCertCACollection;
        }(Model.BaseDPAPICollection));
        Model.WiFiCertCACollection = WiFiCertCACollection;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiCertCACollection.js.map