var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiCertClientModel = (function (_super) {
            __extends(WiFiCertClientModel, _super);
            function WiFiCertClientModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            WiFiCertClientModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.WiFiCertClientDefs.ATTR_NAME_NAME] = null;
                return attributes;
            };
            WiFiCertClientModel.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_CREATE) {
                    if (typeof options.argParams === 'undefined') {
                        throw new Error('argParams must be set');
                    }
                    options.urlPath = "/system/configs/certificates/client";
                    options.validStatuses = [204];
                    options.attrs = options.argParams;
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            return WiFiCertClientModel;
        }(Model.BaseDPAPIModel));
        Model.WiFiCertClientModel = WiFiCertClientModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiCertClientModel.js.map