var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var DeviceSetting;
        (function (DeviceSetting) {
            function syncValue(method, model, options) {
                options = options || {};
                var urlRoot = DPMW.appCtrl.currentDevice.get(Model.Device.ATTR_NAME_BASE_URL);
                options.url = urlRoot + options.urlPath;
                if (method === 'read') {
                    var successOrig = options.success;
                    var errorOrig = options.error;
                    options.success = function (response, status, options_) {
                        var parsed = {};
                        parsed[options.valueAttribute] = response.value;
                        if (successOrig) {
                            successOrig(parsed, status, options_);
                        }
                    };
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                else if (method === 'create' || method === 'update') {
                    method = 'update';
                    options.validStatuses = [204];
                    options.attrs = { value: model.get(options.valueAttribute) };
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            }
            DeviceSetting.syncValue = syncValue;
            ;
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceSettingUtils.js.map