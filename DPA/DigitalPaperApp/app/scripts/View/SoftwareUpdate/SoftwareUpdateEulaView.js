var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var SoftwareUpdate;
        (function (SoftwareUpdate) {
            var SoftwareUpdateEulaView = (function (_super) {
                __extends(SoftwareUpdateEulaView, _super);
                function SoftwareUpdateEulaView(options) {
                    _super.call(this, options);
                }
                SoftwareUpdateEulaView.prototype.events = function () {
                    return {
                        'click #agree-yes': 'setDownloadEnabled',
                        'click #agree-no': 'setDownloadDisaabled',
                        'click #download-button': 'onDownloadClicked',
                        'click #cancel-button': 'onCancelClicked',
                        'keydown': this.keyHandler,
                    };
                };
                SoftwareUpdateEulaView.prototype.initialize = function () {
                    var _this = this;
                    $.get('../templates/software_update_eula.html', function (data) {
                        _this.$el.html(data);
                        _this.$el.localize();
                        _this.downloadButton = $('#download-button');
                        _this.eulaMessage = $('#eula');
                        $('input[type=radio] + label,input[type=checkbox] + label').mouseover(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('hover-outline-appear').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('hover');
                            }
                        });
                        $('input[type=radio] + label,input[type=checkbox] + label').mouseout(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('radio-border-clear');
                            }
                        });
                        $('input[type=radio] + label,input[type=checkbox] + label').mousedown(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('pressed').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('pressed');
                            }
                        });
                        $('input[type=radio] + label,input[type=checkbox] + label').mouseup(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('radio-border-clear');
                            }
                        });
                        $('input[type=radio] + label,input[type=checkbox] + label').focusout(function (event) {
                            $(this).removeClass();
                            $(this).toggleClass('rest');
                        });
                    }, 'html');
                };
                SoftwareUpdateEulaView.prototype.render = function () {
                    return this;
                };
                SoftwareUpdateEulaView.prototype.setVarialbles = function (softwareUpdateDialog) {
                    this.softwareUpdateDialog = softwareUpdateDialog;
                    this.eulaMessage.text(this.softwareUpdateDialog.initInfo.eula);
                };
                SoftwareUpdateEulaView.prototype.onDownloadClicked = function () {
                    this.softwareUpdateDialog.submit(this.softwareUpdateDialog);
                };
                SoftwareUpdateEulaView.prototype.onCancelClicked = function () {
                    this.softwareUpdateDialog.closeDialog(this.softwareUpdateDialog);
                };
                SoftwareUpdateEulaView.prototype.setDownloadEnabled = function () {
                    this.downloadButton.prop('disabled', false);
                };
                SoftwareUpdateEulaView.prototype.setDownloadDisaabled = function () {
                    this.downloadButton.prop('disabled', true);
                };
                SoftwareUpdateEulaView.prototype.keyHandler = function (e) {
                    e.stopPropagation();
                    var me = this;
                    var activeElement = document.activeElement;
                    var activeElementId = activeElement.id;
                    var activeElementLabel = $(activeElement).attr('for');
                    var activeRadioId = '#' + activeElementLabel;
                    var checked = $(activeRadioId).prop('checked');
                    var code = e.which;
                    switch (code) {
                        case 32:
                        case 13:
                            if (activeElementLabel === 'agree-yes') {
                                if (!checked) {
                                    $(activeRadioId).prop('checked', !checked);
                                }
                                this.setDownloadEnabled();
                            }
                            if (activeElementLabel === 'agree-no') {
                                if (!checked) {
                                    $(activeRadioId).prop('checked', !checked);
                                }
                                this.setDownloadDisaabled();
                            }
                            break;
                        case 27:
                            this.onCancelClicked();
                            break;
                        default:
                            break;
                    }
                };
                return SoftwareUpdateEulaView;
            }(Backbone.View));
            SoftwareUpdate.SoftwareUpdateEulaView = SoftwareUpdateEulaView;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateEulaView.js.map