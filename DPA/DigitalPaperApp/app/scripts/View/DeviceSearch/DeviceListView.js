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
            var DeviceListView = (function (_super) {
                __extends(DeviceListView, _super);
                function DeviceListView(options) {
                    _super.call(this, options);
                }
                DeviceListView.prototype.events = function () {
                    return {
                        "click #submit-button": this.pairing,
                        "click #cancel-button": this.cancelPairing,
                    };
                };
                DeviceListView.prototype.initialize = function () {
                    var _this = this;
                    this.submitButton = $('#submit-button');
                    this.cancelButton = $('#cancel-button');
                    this.resultTitle = $('#search-result-title');
                    this.resultArea = $('#search-result-area');
                    this.nodpMsg = $('#nodp');
                    this.ul = this.$('#device-list');
                    this.currentWindow = require('electron').remote.getCurrentWindow();
                    var me = this;
                    this.on('initValue', function (detail) {
                        _this.headerConnectWidth = $('#tdconnect').width();
                        _this.headerSerialnoWidth = $('#tdserialno').width();
                        var deviceId;
                        if (detail && typeof detail.deviceId === 'string') {
                            deviceId = detail.deviceId;
                        }
                        else {
                            deviceId = null;
                        }
                        DPMW.appCtrl.initializeNew(deviceId, { success: function () {
                                _this.deviceCollection = DPMW.appCtrl.devices;
                                _this.listenTo(_this.deviceCollection, 'error', _this.devicesFetchError);
                                _this.listenTo(_this.deviceCollection, 'update', _this.reloadList);
                                me.deviceCollection.fetch({
                                    success: function (modelOrCollection, response, options) {
                                        me.reloadList();
                                    }
                                });
                            }, error: function (err) {
                                console.log('apCtrl.initialize error');
                                if (!err) {
                                    err = DPMW.mwe.genError(DPMW.mwe.E_MW_FATAL_ERROR, 'apCtrl.initialize error');
                                }
                                var errCode = DPMW.mwe.genUserErrorCode(err);
                                var errorInfo = { msgId: null, type: null };
                                switch (err.mwCode) {
                                    default:
                                        errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                                        break;
                                }
                                View.Dialog.openErrorDialog({
                                    message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                                    type: errorInfo.type,
                                }, function (response) {
                                    me.currentWindow.close();
                                });
                                return;
                            } });
                    });
                    this.dialogDeviceSearch = new DeviceSearch.DialogDeviceSearch(this);
                };
                DeviceListView.prototype.render = function () {
                    return this;
                };
                DeviceListView.prototype.reloadList = function () {
                    if (this.deviceCollection.length <= 0) {
                        this.resultTitle.hide();
                        this.resultArea.hide();
                        this.nodpMsg.show();
                        this.submitButton.prop('disabled', true);
                        this.submitButton.attr('tabindex', -1);
                        return;
                    }
                    else {
                        this.resultTitle.show();
                        this.resultArea.show();
                        this.nodpMsg.hide();
                    }
                    this.ul.empty();
                    this.deviceCollection.each(this.addOne, this);
                    $('#tdconnect').width(this.headerConnectWidth);
                    $('#tdserialno').width(this.headerSerialnoWidth);
                    var me = this;
                    $('#device-list .phyType').each(function (index, elem) {
                        $(elem).width(me.headerConnectWidth);
                    });
                    $('#device-list .deviceId').each(function (index, elem) {
                        $(elem).width(me.headerSerialnoWidth);
                    });
                };
                DeviceListView.prototype.devicesFetchError = function (modelOrCollection, response, options) {
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    var err;
                    if (options && options.mwError) {
                        err = options.mwError;
                    }
                    else if (options) {
                        err = options;
                    }
                    else {
                        err = DPMW.mwe.genError(null, 'Devices error');
                    }
                    var errCode = DPMW.mwe.genUserErrorCode(err);
                    var errorInfo = { msgId: null, type: null };
                    switch (err.mwCode) {
                        default:
                            errorInfo = DPMW.Utils.ErrorUtils.getDefaultErrorInfo(err.mwCode);
                            break;
                    }
                    View.Dialog.openErrorDialog({
                        message: $.i18n.t(errorInfo.msgId, { errorCode: errCode }),
                        type: errorInfo.type,
                    }, function (response) {
                        currentWindow.close();
                    });
                };
                DeviceListView.prototype.addOne = function (device) {
                    var view = new DeviceSearch.DeviceView({ model: device });
                    this.$("#device-list").append(view.render().el);
                    var deviceIdWidth = view.$el.find('.deviceId').width();
                    var phyTypeWidth = view.$el.find('.phyType').width();
                    var connectedWidth = view.$el.find('.connected').width();
                    if (phyTypeWidth > this.headerConnectWidth) {
                        this.headerConnectWidth = phyTypeWidth;
                    }
                    if (deviceIdWidth > this.headerSerialnoWidth) {
                        this.headerSerialnoWidth = deviceIdWidth;
                    }
                    this.listenTo(view, 'clickDevice', this.selectDevice);
                };
                DeviceListView.prototype.selectDevice = function (device) {
                    this.selectedDevice = device;
                    this.$('li').removeClass('selected');
                    if (device) {
                        var attrName = DPMW.Model.Device.ATTR_NAME_DEVICE_ID;
                        var deviceId = this.selectedDevice.get(attrName);
                        this.$('#' + deviceId).addClass('selected');
                    }
                    if (device === null) {
                        this.submitButton.prop('disabled', true);
                        this.submitButton.attr('tabindex', -1);
                    }
                    else {
                        if (device.id !== DPMW.appCtrl.currentDeviceId) {
                            this.submitButton.prop('disabled', false);
                            this.submitButton.attr('tabindex', 1);
                        }
                        else {
                            this.submitButton.prop('disabled', true);
                            this.submitButton.attr('tabindex', -1);
                        }
                    }
                    this.dialogDeviceSearch.getFirstAndLastItem();
                };
                DeviceListView.prototype.pairing = function () {
                    var _this = this;
                    DPMW.View.Dialog.openYesNoDialog({
                        title: $.i18n.t('dialog.confirm.rePairing.title'),
                        message: $.i18n.t('dialog.confirm.rePairing.message'),
                    }, function (response) {
                        if (response === 0) {
                            var initSetupInfo = new View.Dialog.DialogInfo.WindowInitSetupInfo();
                            initSetupInfo.deviceId = _this.selectedDevice.get(DPMW.Model.Device.ATTR_NAME_DEVICE_ID);
                            var dialogRelayInfo = new View.Dialog.DialogInfo.DialogRelayInfo();
                            dialogRelayInfo.dialogName = View.Dialog.DialogName.WINDOW_INIT_SETUP;
                            dialogRelayInfo.dialogInfo = initSetupInfo;
                            DPMW.appCtrl.terminate();
                            _this.dialogDeviceSearch.dialogRelay(dialogRelayInfo);
                        }
                    });
                };
                DeviceListView.prototype.cancelPairing = function () {
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    currentWindow.close();
                };
                return DeviceListView;
            }(Backbone.View));
            DeviceSearch.DeviceListView = DeviceListView;
        })(DeviceSearch = View.DeviceSearch || (View.DeviceSearch = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceListView.js.map