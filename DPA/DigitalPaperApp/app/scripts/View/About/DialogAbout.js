var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var About;
        (function (About) {
            var fs = require('fs');
            var osInfo = require('mw-automagic-client/lib/os-info');
            var DEFAULT_REGION = 'US';
            var RECOGNIZABLE_REGIONS = ['JP', 'US', 'CN'];
            var DialogAbout = (function (_super) {
                __extends(DialogAbout, _super);
                function DialogAbout(dialogName) {
                    var _this = this;
                    _super.call(this, dialogName);
                    this.versionTitle = $('#version-title');
                    this.versionAppName = $('#version-app-name');
                    this.versionLabel = $('#version-label');
                    this.versionValue = $('#version-value');
                    this.eulaAndLicenses = $('#eula-and-liecnses-text');
                    this.versionAppName.text($.i18n.t('app.name'));
                    this.versionTitle.text($.i18n.t('appInfo.title'));
                    this.versionLabel.text($.i18n.t('appInfo.label.version'));
                    var licenseText = "";
                    this.getRegion(function (err, region) {
                        var licenseFilePath = null;
                        if (region === 'JP') {
                            licenseFilePath = process.env.MW_APP_LICENSE_JP_FILEPATH;
                        }
                        else if (region === 'US') {
                            licenseFilePath = process.env.MW_APP_LICENSE_US_FILEPATH;
                        }
                        else if (region === 'CN') {
                            licenseFilePath = process.env.MW_APP_LICENSE_CN_FILEPATH;
                        }
                        else {
                            licenseFilePath = process.env.MW_APP_LICENSE_US_FILEPATH;
                        }
                        fs.readFile(licenseFilePath, 'utf8', function (err, text) {
                            if (typeof text === 'string') {
                                licenseText += text;
                            }
                            fs.readFile(process.env.MW_APP_LICENSES_FILEPATH, 'utf8', function (err, text) {
                                if (typeof text === 'string') {
                                    licenseText += '\n\n';
                                    licenseText += '\n-------------------------------------------------------------------------\n\n';
                                    licenseText += text;
                                }
                                _this.eulaAndLicenses.text(licenseText);
                            });
                        });
                    });
                }
                DialogAbout.prototype.getRegion = function (callback) {
                    osInfo.locale(function (err, locale) {
                        if (err) {
                            callback(null, DEFAULT_REGION);
                            return;
                        }
                        if (typeof locale !== 'string') {
                            callback(null, DEFAULT_REGION);
                            return;
                        }
                        var localeParts = locale.split('_');
                        if (localeParts.length != 2) {
                            callback(null, DEFAULT_REGION);
                            return;
                        }
                        var region = localeParts[1].toUpperCase();
                        if (RECOGNIZABLE_REGIONS.indexOf(region) < 0) {
                            callback(null, DEFAULT_REGION);
                            return;
                        }
                        callback(null, region);
                    });
                };
                DialogAbout.prototype.setInitValue = function (info) {
                    console.log(info.version);
                    this.versionValue.text($.i18n.t('appInfo.version.value', { version: info.version }));
                };
                return DialogAbout;
            }(View.Dialog.DialogBase));
            About.DialogAbout = DialogAbout;
            var dialogAbout = new DialogAbout(View.Dialog.DialogName.WINDOW_ABOUT);
        })(About = View.About || (View.About = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogAbout.js.map