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
            var SoftwareUpdateView = (function (_super) {
                __extends(SoftwareUpdateView, _super);
                function SoftwareUpdateView(options) {
                    _super.call(this, options);
                }
                SoftwareUpdateView.prototype.events = function () {
                    return {
                        'change #accept-checkbox': 'onAcceptCheckChanged',
                        'click #update-button': 'onUpdateClicked',
                        'click #cancel-button': 'onCancelClicked',
                        'keydown': this.keyHandler,
                    };
                };
                SoftwareUpdateView.prototype.initialize = function () {
                    var _this = this;
                    this.on('initValue', function (initInfo) {
                        _this.render();
                    });
                    this.updateMessage = this.$('#new-version-message');
                    this.currenVersion = this.$('#current-version');
                    this.description = this.$('#description');
                    this.disclaimer = this.$('#disclaimer');
                    this.acceptCheckbox = this.$('#accept-checkbox');
                    this.updateButton = this.$('#update-button');
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
                    this.softwareUpdateDialog = new SoftwareUpdate.SoftwareUpdateDialog(this);
                    this.softwareUpdateEulaView = new SoftwareUpdate.SoftwareUpdateEulaView();
                    this.$('#update-eula').append(this.softwareUpdateEulaView.render().el);
                };
                SoftwareUpdateView.prototype.render = function () {
                    this.currenVersion.text($.i18n.t('update.currentVersion.value', { versionCurrent: this.softwareUpdateDialog.initInfo.oldVersion }));
                    if (this.softwareUpdateDialog.initInfo.updateType === SoftwareUpdate.UPDATE_TYPE.APP) {
                        this.updateMessage.text($.i18n.t('update.message.newApp', { versionNew: this.softwareUpdateDialog.initInfo.newVersion }));
                    }
                    else {
                        this.updateMessage.text($.i18n.t('update.message.newDp', { versionNew: this.softwareUpdateDialog.initInfo.newVersion }));
                    }
                    this.description.text(this.softwareUpdateDialog.initInfo.description);
                    this.disclaimer.text(this.softwareUpdateDialog.initInfo.disclaimer);
                    return this;
                };
                SoftwareUpdateView.prototype.onUpdateClicked = function () {
                    $('#update-detect').remove();
                    $('#update-eula').css('display', 'block');
                    this.softwareUpdateEulaView.setVarialbles(this.softwareUpdateDialog);
                    this.softwareUpdateDialog.getFirstAndLastItem();
                };
                SoftwareUpdateView.prototype.onCancelClicked = function () {
                    this.softwareUpdateDialog.closeDialog(this.softwareUpdateDialog);
                };
                SoftwareUpdateView.prototype.onAcceptCheckChanged = function () {
                    this.updateButton.prop('disabled', !this.acceptCheckbox.prop('checked'));
                };
                SoftwareUpdateView.prototype.keyHandler = function (e) {
                    e.stopPropagation();
                    var me = this;
                    var activeElement = document.activeElement;
                    var activeElementId = activeElement.id;
                    var activeElementLabel = $(activeElement).attr('for');
                    var activeRadioId = '#' + activeElementLabel;
                    var checked = $(activeRadioId).prop('checked');
                    var code = e.code || e.which;
                    switch (code) {
                        case 32:
                        case 13:
                            if (activeElementId === 'accept-checkbox-lbl') {
                                $(activeRadioId).prop('checked', !checked);
                                this.onAcceptCheckChanged();
                            }
                            break;
                        case 27:
                            this.onCancelClicked();
                            break;
                        default:
                            break;
                    }
                };
                return SoftwareUpdateView;
            }(Backbone.View));
            SoftwareUpdate.SoftwareUpdateView = SoftwareUpdateView;
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateView.js.map