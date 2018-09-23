var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Setting;
        (function (Setting) {
            var WifiAPView = (function (_super) {
                __extends(WifiAPView, _super);
                function WifiAPView(options) {
                    _super.call(this, options);
                }
                WifiAPView.prototype.events = function () {
                    return {
                        'click': this.click,
                    };
                };
                WifiAPView.prototype.initialize = function () {
                    this.listenTo(this.model, 'destroy', this.remove);
                    var templateStr = $('#wifiAP-template').text();
                    this.template_ = Hogan.compile(templateStr);
                    this.$el.html(this.template_.render({
                        wifiAP: this.model.toJSON(),
                    }));
                };
                WifiAPView.prototype.render = function () {
                    return this;
                };
                WifiAPView.prototype.click = function () {
                    this.trigger('clickWifiAP', this);
                };
                return WifiAPView;
            }(Backbone.View));
            Setting.WifiAPView = WifiAPView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WifiAPView.js.map