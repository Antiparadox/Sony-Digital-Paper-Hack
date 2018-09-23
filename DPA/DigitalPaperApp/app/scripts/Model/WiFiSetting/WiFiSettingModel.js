var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiSettingModel = (function (_super) {
            __extends(WiFiSettingModel, _super);
            function WiFiSettingModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            WiFiSettingModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG] = null;
                return attributes;
            };
            WiFiSettingModel.prototype.close = function () {
            };
            WiFiSettingModel.prototype.sync = function (method, model, options) {
                if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                    options.urlPath = "/system/configs/wifi";
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                else if (method === Model.BackboneSyncDefs.METHOD_NAME_UPDATE ||
                    method === Model.BackboneSyncDefs.METHOD_NAME_CREATE) {
                    var value = model.get(Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG);
                    if (typeof value !== 'string') {
                        throw new Error('config attr is not string');
                    }
                    method = Model.BackboneSyncDefs.METHOD_NAME_UPDATE;
                    options.urlPath = "/system/configs/wifi";
                    options.validStatuses = [204];
                    options.attrs = {};
                    options.attrs[Model.WiFiSettingDefs.PARSE_NAME_VALUE] = value;
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            WiFiSettingModel.prototype.parse = function (response, options) {
                var newAttr = {};
                if (response && response[Model.WiFiSettingDefs.PARSE_NAME_VALUE]) {
                    newAttr[Model.WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG] = response[Model.WiFiSettingDefs.PARSE_NAME_VALUE];
                }
                return newAttr;
            };
            WiFiSettingModel.prototype.init = function () {
                this.wifiAPCurrentStatusModel_ = null;
                this.wifiAPRegisteredCollection_ = null;
                this.wifiAPScannedCollection_ = null;
                this.wifiCertCACollection_ = null;
                this.wifiCertClientCollection_ = null;
                this.wifiAPWpsModel_ = null;
                return this;
            };
            Object.defineProperty(WiFiSettingModel.prototype, "wifiAPCurrentStatusModel", {
                get: function () {
                    if (!this.wifiAPCurrentStatusModel_) {
                        this.wifiAPCurrentStatusModel_ = new Model.WiFiAPCurrentStatusModel(null, { deviceModel: this.deviceModel_ });
                    }
                    return this.wifiAPCurrentStatusModel_;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WiFiSettingModel.prototype, "wifiAPRegisteredCollection", {
                get: function () {
                    if (!this.wifiAPRegisteredCollection_) {
                        this.wifiAPRegisteredCollection_ = new Model.WiFiAPRegisteredCollection(this.deviceModel_);
                    }
                    return this.wifiAPRegisteredCollection_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(WiFiSettingModel.prototype, "wifiAPScannedCollection", {
                get: function () {
                    if (!this.wifiAPScannedCollection_) {
                        this.wifiAPScannedCollection_ = new Model.WiFiAPScannedCollection(this.deviceModel_);
                    }
                    return this.wifiAPScannedCollection_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(WiFiSettingModel.prototype, "wifiCertCACollection", {
                get: function () {
                    if (!this.wifiCertCACollection_) {
                        this.wifiCertCACollection_ = new Model.WiFiCertCACollection(this.deviceModel_);
                    }
                    return this.wifiCertCACollection_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(WiFiSettingModel.prototype, "wifiCertClientCollection", {
                get: function () {
                    if (!this.wifiCertClientCollection_) {
                        this.wifiCertClientCollection_ = new Model.WiFiCertClientCollection(this.deviceModel_);
                    }
                    return this.wifiCertClientCollection_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(WiFiSettingModel.prototype, "wifiAPWpsModel", {
                get: function () {
                    if (!this.wifiAPWpsModel_) {
                        this.wifiAPWpsModel_ = new Model.WiFiAPWpsModel(null, { deviceModel: this.deviceModel_ });
                    }
                    return this.wifiAPWpsModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            return WiFiSettingModel;
        }(Model.BaseDPAPIModel));
        Model.WiFiSettingModel = WiFiSettingModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiSettingModel.js.map