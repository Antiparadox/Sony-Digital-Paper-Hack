var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var ExternalOutputView = (function (_super) {
                __extends(ExternalOutputView, _super);
                function ExternalOutputView(options) {
                    _super.call(this, options);
                }
                ExternalOutputView.prototype.events = function () {
                    return {
                        'click #screenshot-button': this.onClickedScreenshotButton,
                        'click #fullscreen-button': this.onClickedFullScreenButton,
                    };
                };
                ExternalOutputView.prototype.initialize = function () {
                    var _this = this;
                    this.on('initValue', function (initInfo) {
                        _this.render();
                    });
                    this.externalOutputDialog = new ExternalOutput.ExternalOutputDialog(this);
                };
                ExternalOutputView.prototype.render = function () {
                    return this;
                };
                ExternalOutputView.prototype.onClickedScreenshotButton = function (e) {
                    console.log('onClickedScreenshotButton()');
                    if (this.externalOutputDialog) {
                        this.externalOutputDialog.takeScreenshot();
                    }
                };
                ExternalOutputView.prototype.onClickedFullScreenButton = function (e) {
                    console.log('onClickedFullScreenButton()');
                    if (this.externalOutputDialog) {
                        this.externalOutputDialog.requestEnterFullScreen();
                    }
                };
                return ExternalOutputView;
            }(Backbone.View));
            ExternalOutput.ExternalOutputView = ExternalOutputView;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExternalOutputView.js.map