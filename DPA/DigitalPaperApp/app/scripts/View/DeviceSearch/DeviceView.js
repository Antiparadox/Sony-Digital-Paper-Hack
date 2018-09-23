var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var DeviceSearch;
        (function (DeviceSearch) {
            var DeviceColorDef;
            (function (DeviceColorDef) {
                DeviceColorDef.BLACK = '#000000';
                DeviceColorDef.WHITE = '#ffffff';
            })(DeviceColorDef = DeviceSearch.DeviceColorDef || (DeviceSearch.DeviceColorDef = {}));
            var DeviceView = (function (_super) {
                __extends(DeviceView, _super);
                function DeviceView(options) {
                    _super.call(this, options);
                    var templateStr = $('#device-template').text();
                    this.template_ = Hogan.compile(templateStr);
                }
                DeviceView.prototype.events = function () {
                    return {
                        'click li': this.click
                    };
                };
                DeviceView.prototype.initialize = function () {
                    this.listenTo(this.model, 'sync', this.render);
                    this.listenTo(this.model, 'destroy', this.remove);
                };
                DeviceView.prototype.render = function () {
                    var connected;
                    if (DPMW.appCtrl.currentDeviceId === this.model.attributes[DPMW.Model.Device.ATTR_NAME_DEVICE_ID]) {
                        connected = $.i18n.t('searchDp.paired');
                    }
                    var deviceIconUrl;
                    if (DeviceColorDef.BLACK === this.model.attributes[DPMW.Model.Device.ATTR_NAME_DEVICE_COLOR]) {
                        deviceIconUrl = '../res/image/svg/Asset_Altair_DeviceSearch_Black.svg';
                    }
                    else {
                        deviceIconUrl = '../res/image/svg/Asset_Altair_DeviceSearch_White.svg';
                    }
                    var connStr;
                    if (this.model.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE) === DPMW.Model.Device.VALUE_PHY_TYPE_USB) {
                        connStr = $.i18n.t('searchDp.connect.usb');
                    }
                    else {
                        connStr = $.i18n.t('searchDp.connect.wifi');
                    }
                    this.$el.html(this.template_.render({
                        device: {
                            'deviceIconUrl': deviceIconUrl,
                            'connected': connected,
                            'deviceId': this.model.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID),
                            'phyType': connStr,
                        }
                    }));
                    return this;
                };
                DeviceView.prototype.click = function () {
                    var isSelected = this.$('li').hasClass('selected');
                    if (isSelected) {
                        this.trigger('clickDevice', null);
                    }
                    else {
                        this.trigger('clickDevice', this.model);
                    }
                };
                return DeviceView;
            }(Backbone.View));
            DeviceSearch.DeviceView = DeviceView;
        })(DeviceSearch = View.DeviceSearch || (View.DeviceSearch = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceView.js.map