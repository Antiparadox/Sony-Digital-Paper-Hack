var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiAPConfigModel = (function (_super) {
            __extends(WiFiAPConfigModel, _super);
            function WiFiAPConfigModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            WiFiAPConfigModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_SSID] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_PASSWD] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_DHCP] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_STATIC_ADDRESS] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_GATEWAY] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_NETWORK_MASK] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_DNS_1] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_DNS_2] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_PROXY] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_PROXY_HOST] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_PROXY_PORT] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_EAP] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_EAP_PHASE2] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ID] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_EAP_ANID] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CACERT] = '';
                attributes[Model.WiFiAPConfigDefs.ATTR_NAME_EAP_CERT] = '';
                return attributes;
            };
            WiFiAPConfigModel.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    var ssid = model.get(Model.WiFiAPConfigDefs.ATTR_NAME_SSID);
                    var security = model.get(Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY);
                    if (typeof ssid !== 'string' || typeof security !== 'string') {
                        var error = new TypeError('ssid or security is wrong type');
                        if (options && options.error) {
                            options.error(error);
                        }
                        return error;
                    }
                    options.urlPath = '/system/configs/wifi_accesspoints/' +
                        encodeURIComponent(ssid) + '/' + security;
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                else if (method === Model.BackboneSyncDefs.METHOD_NAME_DELETE) {
                    var ssid = model.get(Model.WiFiAPConfigDefs.ATTR_NAME_SSID);
                    var security = model.get(Model.WiFiAPConfigDefs.ATTR_NAME_SECURITY);
                    if (typeof ssid !== 'string' || typeof security !== 'string') {
                        var error = new TypeError('ssid or security is wrong type');
                        if (options && options.error) {
                            options.error(error);
                        }
                        return error;
                    }
                    options.urlPath = '/system/configs/wifi_accesspoints/' +
                        encodeURIComponent(ssid) + '/' + security;
                    options.attrs = {};
                    options.validStatuses = [204];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                else if (method === Model.BackboneSyncDefs.METHOD_NAME_CREATE ||
                    method === Model.BackboneSyncDefs.METHOD_NAME_UPDATE) {
                    method = Model.BackboneSyncDefs.METHOD_NAME_UPDATE;
                    options.urlPath = '/system/controls/wifi_accesspoints/register';
                    options.attrs = model.toJSON();
                    if (options.attrs) {
                        ssid = options.attrs[Model.WiFiAPConfigDefs.ATTR_NAME_SSID];
                        if (typeof ssid !== 'string') {
                            var error = new TypeError('ssid or security is wrong type');
                            if (options && options.error) {
                                options.error(error);
                            }
                            return error;
                        }
                        options.attrs[Model.WiFiAPConfigDefs.ATTR_NAME_SSID] = window.btoa(ssid);
                    }
                    options.validStatuses = [204];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiAPConfigModel.prototype.parse = function (response, options) {
                if (response && response[Model.WiFiAPConfigDefs.ATTR_NAME_SSID]) {
                    response[Model.WiFiAPConfigDefs.ATTR_NAME_SSID] = window.atob(response[Model.WiFiAPConfigDefs.ATTR_NAME_SSID]);
                }
                return response;
            };
            return WiFiAPConfigModel;
        }(Model.BaseDPAPIModel));
        Model.WiFiAPConfigModel = WiFiAPConfigModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiAPConfigModel.js.map