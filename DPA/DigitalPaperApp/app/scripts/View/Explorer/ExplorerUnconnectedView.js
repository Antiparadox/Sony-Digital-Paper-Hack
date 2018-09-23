var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var ExplorerUnconnectedView = (function (_super) {
                __extends(ExplorerUnconnectedView, _super);
                function ExplorerUnconnectedView() {
                    _super.apply(this, arguments);
                }
                ExplorerUnconnectedView.prototype.initialize = function () {
                    this.electronShell = require('electron').shell;
                    this.render();
                };
                ExplorerUnconnectedView.prototype.render = function () {
                    var me = this;
                    $.get('../templates/explorer_unconnectedview.html', function (data) {
                        me.$el.html(data);
                        me.$el.localize();
                        var iconUrl = '../res/image/svg/Asset_Altair_NoConnection_Power.svg';
                        var icon = "<img src=\"" + iconUrl + "\" class=\"pause\"/>";
                        me.$('#powerCheck').html($.i18n.t('content.init.parts.noDeviceMsg.p4', { icon: icon }));
                        var linkTag = "<a id=\"noDeviceUrl\">" + $.i18n.t('content.init.linkOfNoDeviceMsg') + "</a>";
                        me.$('#online-manual-btn').on('click', function () {
                            me.openOnlineManual();
                        });
                    }, 'html');
                    return me;
                };
                ExplorerUnconnectedView.prototype.remove = function () {
                    this.electronShell = null;
                    return _super.prototype.remove.call(this);
                };
                ExplorerUnconnectedView.prototype.openOnlineManual = function () {
                    var urlStr;
                    var skuCode = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_SKU_CODE);
                    if (skuCode === 'J') {
                        urlStr = $.i18n.t('content.init.url.noDeviceMsg.jp');
                    }
                    else if (skuCode === 'C') {
                        urlStr = $.i18n.t('content.init.url.noDeviceMsg.cn');
                    }
                    else {
                        urlStr = $.i18n.t('content.init.url.noDeviceMsg.us');
                    }
                    this.electronShell.openExternal(urlStr);
                };
                return ExplorerUnconnectedView;
            }(Backbone.View));
            Explorer.ExplorerUnconnectedView = ExplorerUnconnectedView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerUnconnectedView.js.map