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
            var fetchHandler = DPMW.View.Explorer.Handler.fetchHandler;
            var viewStatus = DPMW.View.Explorer.Status.viewStatus;
            var subWindowHandler = DPMW.View.Explorer.Handler.subWindowHandler;
            var deviceHander = DPMW.View.Explorer.Handler.deviceHandler;
            var fileTransferHandler = DPMW.View.Explorer.Handler.fileTransferHandler;
            var syncFolderPairStore = DPMW.Model.FolderSync.syncFolderPairStore;
            var DiffType = DPMW.View.Explorer.Handler.DiffType;
            var DEVICE_COLOR_BLACK = '#000000';
            var DEVICE_COLOR_WHITE = '#ffffff';
            var INTERVA_CHECK_BT_CONNECTABLE_DEVICE_COUNT = 3000;
            var ExplorerToolbarView = (function (_super) {
                __extends(ExplorerToolbarView, _super);
                function ExplorerToolbarView(options) {
                    _super.call(this, options);
                    this.currentDevice = DPMW.appCtrl.currentDevice;
                    this.newFolderButtonTabIndex = 301;
                    this.searchBarCloseTabIndex = 201;
                }
                ExplorerToolbarView.prototype.events = function () {
                    return {
                        "click #fileimportBtnDiv": "importFile",
                        "click #externalOutputDiv": "openExternalOutput",
                        "click #settingDiv": "clickToolbarSetting",
                        "click #helpDiv": "clickToolbarHelp",
                        "click #helpGuide": "clickHelpGuide",
                        "click #helpSupport": "clickHelpSupport",
                        "click #helpSuppl": "clickHelpSupport",
                        "click #btnSearch": "search",
                        "click #folderview": "showFolderView",
                        "click #documentview": "showDocumentView",
                        "click #syncBtnDiv": "clickFolderSync",
                        "click #syncSettingDiv": "openSyncSettingUrl",
                        "click #searchText": "selectSearchTextType",
                        "click #searchMark": "selectSearchMarkType",
                        "click #syncErrorIcon": "clicksyncErrorIcon",
                        "input  #keyword": "onSearchKeywrodChange",
                        "focusin #keyword": "onSearchKeywordFocusIn",
                        "focusout #keyword": "onSearchKeywordFocusOut",
                        "mouseover  label.btn-lbl": "onBtnLabelMouseEvent",
                        "mouseleave  label.btn-lbl": "onBtnLabelMouseEvent",
                        "mousedown  label.btn-lbl": "onBtnLabelMouseEvent",
                        "mouseup  label.btn-lbl": "onBtnLabelMouseEvent",
                        "mouseover  #syncErrorIcon": "onSyncErrorIconMouseOver",
                        "mouseleave #syncErrorIcon": "onSyncErrorIconMouseleave",
                        "mousedown  #syncErrorIcon": "onSyncErrorIconMousedown",
                        "mouseup  #syncErrorIcon": "onSyncErrorIconMouseup"
                    };
                };
                ExplorerToolbarView.prototype.initialize = function () {
                    this.currentDevice = DPMW.appCtrl.currentDevice;
                    var _this = this;
                    var me = this;
                    if (process.platform === 'win32') {
                        var mwAutoBtPanConnector = require('electron').remote.require('mw-auto-bt-pan-connector');
                        this.remoteAutoBtPanConnector = mwAutoBtPanConnector.getInstance();
                        mwAutoBtPanConnector = null;
                    }
                    $.get('../templates/explorer_toolbar.html', function (data) {
                        _this.$el.html(data);
                        _this.firstItem = $('#syncSettingDiv');
                        _this.lastItem = $('#new-folder-button');
                        _this.btConnectEl = _this.$('#btConnect');
                        _this.syncBtnDivEl = _this.$('#syncBtnDiv');
                        _this.syncBtnDivElTabIndex = +$(_this.syncBtnDivEl).attr('tabindex');
                        _this.syncDatetimeEl = _this.$('#syncDatetime');
                        _this.syncErrorIconImgEl = _this.$('#syncErrorIcon');
                        _this.syncErrorIconImgElTabIndex = +$(_this.syncErrorIconImgEl).attr('tabindex');
                        _this.toolbarSyncResultDiv = _this.$('#toolbarSyncResultDiv');
                        _this.syncSettingEl = _this.$('#syncSettingDiv');
                        _this.syncSettingElTabIndex = +$(_this.syncSettingEl).attr('tabindex');
                        _this.fileimportBtnDivEl = _this.$('#fileimportBtnDiv');
                        _this.fileimportBtnDivElTabIndex = +$(_this.fileimportBtnDivEl).attr('tabindex');
                        _this.externalOutputDivEl = _this.$('#externalOutputDiv');
                        _this.externalOutputDivElTabIndex = +$(_this.externalOutputDivEl).attr('tabindex');
                        _this.viewTypeDiv = _this.$('#viewTypeDiv');
                        _this.folderView = _this.$('#folderView');
                        _this.folderLbl = _this.$('#folderLbl');
                        _this.folderLblTabIndex = +$(_this.folderLbl).attr('tabindex');
                        _this.docLbl = _this.$('#docLbl');
                        _this.docLblTabIndex = +$(_this.docLbl).attr('tabindex');
                        _this.searchDivImg = _this.$('#searchDiv-img');
                        _this.searchTypeDiv = _this.$('#searchTypeDiv');
                        _this.searchTextLbl = _this.$('#searchTextLbl');
                        _this.searchTextLblTabIndex = +$(_this.searchTextLbl).attr('tabindex');
                        _this.searchMarkLbl = _this.$('#searchMarkLbl');
                        _this.searchMarkLblTabIndex = +$(_this.searchMarkLbl).attr('tabindex');
                        _this.serachInputDiv = _this.$('#serachInputDiv');
                        _this.searchKeywordEl = _this.$('#keyword');
                        _this.searchKeywordElTabIndex = +$(_this.searchKeywordEl).attr('tabindex');
                        _this.markSearchDiv = _this.$('#markSearchDiv');
                        _this.typeMarkStar = _this.$('#typeMarkStar');
                        _this.typeMarkStarTabIndex = +$(_this.typeMarkStar).attr('tabindex');
                        _this.lblTypeMarkStar = _this.$('#lbl-typeMarkStar');
                        _this.lblTypeMarkStarTabIndex = +$(_this.lblTypeMarkStar).attr('tabindex');
                        _this.typeMarkAsterisk = _this.$('#typeMarkAsterisk');
                        _this.typeMarkAsteriskTabIndex = +$(_this.typeMarkAsterisk).attr('tabindex');
                        _this.lblTypeMarkAsterisk = _this.$('#lbl-typeMarkAsterisk');
                        _this.lblTypeMarkAsteriskTabIndex = +$(_this.lblTypeMarkAsterisk).attr('tabindex');
                        _this.btnSearch = _this.$('#btnSearch');
                        _this.btnSearchTabIndex = +$(_this.btnSearch).attr('tabindex');
                        _this.dpStatusEl = _this.$('#deviceConnSta');
                        _this.deviceStorageUsageEl = _this.$('#deviceStorageUsage');
                        _this.dpIconEl = _this.$('#deviceConnStaImg');
                        _this.newFolderButton = $('#new-folder-button');
                        _this.syncAddButtonEl = $('#sync-button');
                        _this.deleteButton = $('#delete-button');
                        _this.searchBarClose = $('#search-bar-close');
                        _this.syncErrorIconImgEl.hide();
                        _this.chkConnectionState();
                        _this.onSearchKeywrodChange(null);
                        _this.$el.localize();
                        $('#lbl-typeMarkStar, #lbl-typeMarkAsterisk').mouseover(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('hover-outline-appear').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('hover');
                            }
                        });
                        $('#lbl-typeMarkStar, #lbl-typeMarkAsterisk').mouseout(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('radio-border-clear');
                            }
                        });
                        $('#lbl-typeMarkStar, #lbl-typeMarkAsterisk').mousedown(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('pressed').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('pressed');
                            }
                        });
                        $('#lbl-typeMarkStar, #lbl-typeMarkAsterisk').mouseup(function (event) {
                            if ($(this).hasClass('tag-radio-outline-appear')) {
                                $(this).removeClass();
                                $(this).toggleClass('rest').addClass('tag-radio-outline-appear');
                            }
                            else {
                                $(this).removeClass();
                                $(this).toggleClass('radio-border-clear');
                            }
                        });
                        $('#lbl-typeMarkStar, #lbl-typeMarkAsterisk').focusout(function (event) {
                            $(this).removeClass();
                            $(this).toggleClass('rest');
                        });
                        _this.listenTo(viewStatus, 'viewTypeChanged', _this.onviewTypeChanged);
                        $('#keyword').prop('placeholder', $.i18n.t('func.search.typeTextMeta'));
                        _this.listenTo(Explorer.Handler.syncHandler, 'syncAllStart', function () {
                            _this.syncBtnDivEl.addClass('ui-state-disabled');
                            _this.syncBtnDivEl.attr('tabindex', -1);
                            _this.syncBtnDivEl.addClass('outline-clear');
                            _this.dispSynResultDiv();
                        });
                        _this.listenTo(Explorer.Handler.syncHandler, 'syncAllSucceed', function () {
                            _this.syncBtnDivEl.removeClass('ui-state-disabled');
                            _this.syncBtnDivEl.attr('tabindex', _this.syncBtnDivElTabIndex);
                            _this.syncBtnDivEl.removeClass('outline-clear');
                            var errors = Explorer.Handler.syncHandler.getLastErrors();
                            if (errors && errors.length > 0) {
                                _this.syncErrorIconImgEl.show();
                                _this.syncErrorIconImgEl.attr('tabindex', _this.syncErrorIconImgElTabIndex);
                            }
                            else {
                                _this.syncErrorIconImgEl.hide();
                                _this.syncErrorIconImgEl.attr('tabindex', -1);
                            }
                            _this.dispSynResultDiv();
                        });
                        _this.listenTo(Explorer.Handler.syncHandler, 'syncAllFailed', function (err) {
                            var connState = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE);
                            if (connState === DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED) {
                                _this.syncBtnDivEl.removeClass('ui-state-disabled');
                                _this.syncBtnDivEl.attr('tabindex', _this.syncBtnDivElTabIndex);
                                _this.syncBtnDivEl.removeClass('outline-clear');
                            }
                            _this.syncErrorIconImgEl.show();
                            _this.syncErrorIconImgEl.attr('tabindex', _this.syncErrorIconImgElTabIndex);
                            _this.dispSynResultDiv();
                        });
                        _this.listenTo(syncFolderPairStore, 'syncFolderPairChanged', _this.onSyncFolderPairChanged);
                        if (viewStatus.getViewType() === Explorer.VIEW_TYPE_DOCUMENTS) {
                            _this.$el.find('#VIEW_TYPE_DOCUMENTS').prop("checked", true);
                        }
                        else {
                            _this.$el.find('#folderview').prop("checked", true);
                        }
                        var typeText = _this.getTextWidth($.i18n.t('func.search.typeText'));
                        var typeMark = _this.getTextWidth($.i18n.t('func.search.typeMark'));
                        var max = typeText;
                        if (typeText < typeMark) {
                            max = typeMark;
                        }
                        var offset = 25;
                        if ((max + offset) > 90) {
                            max = typeText;
                            _this.$('#searchTextLbl').width(max + offset);
                            _this.$('#searchMarkLbl').width(max + offset);
                            _this.$('#searchTypeDiv').width((max + offset) * 2);
                        }
                        _this.$('#keyword').keydown(function (e) {
                            e.stopPropagation();
                        });
                    }, 'html');
                    $('#folderLbl').mouseover(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('folderLbl-Hover');
                    });
                    $('#folderLbl').mouseout(function (event) {
                        $(this).removeClass();
                        $(this).addClass('folderLbl');
                    });
                    $('#folderLbl').mousedown(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('folderLbl-Pressed');
                    });
                    $('#folderLbl').mouseup(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('folderLbl-Selected');
                    });
                    $('#docLbl').mouseover(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('docLbl-Hover');
                    });
                    $('#docLbl').mouseout(function (event) {
                        $(this).removeClass();
                        $(this).addClass('docLbl');
                    });
                    $('#docLbl').mousedown(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('docLbl-Pressed');
                    });
                    $('#docLbl').mouseup(function (event) {
                        $(this).removeClass();
                        $(this).toggleClass('docLbl-Selected');
                    });
                    this.listenTo(this, "keydown", function (e) {
                        e.stopPropagation();
                        var activeElement = document.activeElement;
                        var activeElementId = activeElement.id;
                        var activeElementTabindex = $(activeElement).attr('tabIndex');
                        var activeElementType = $(activeElement).attr('type');
                        var dropDownEl = _this.$el.find('.dropdown-content');
                        var code = e.which;
                        switch (code) {
                            case 27:
                                $('.dropdown-content').hide();
                                break;
                            case 9:
                                $('.dropdown-content').hide();
                                me.getFirstAndLastItem();
                                var firstItemId = me.firstItem.attr("id");
                                var lastItemId = me.lastItem.attr("id");
                                if (e.shiftKey) {
                                    if (activeElementTabindex === "" || activeElementTabindex === '0' || activeElementTabindex === '1' || firstItemId === activeElementId) {
                                        e.preventDefault();
                                        me.lastItem.focus();
                                    }
                                }
                                else {
                                    if (activeElementTabindex === "" || activeElementTabindex === '0' || lastItemId === activeElementId) {
                                        e.preventDefault();
                                        me.firstItem.focus();
                                    }
                                }
                                $(activeElement).removeClass('tag-radio-outline-appear');
                                break;
                            case 38:
                                if (dropDownEl.css('display') == 'block') {
                                    if (activeElementId === 'helpSupport') {
                                        $('#helpGuide').focus();
                                    }
                                }
                                break;
                            case 40:
                                if (dropDownEl.css('display') == 'block') {
                                    if (activeElementId === 'helpGuide') {
                                        $('#helpSupport').focus();
                                    }
                                    else if (activeElementId === 'helpSupport') {
                                    }
                                    else {
                                        $('#helpGuide').focus();
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    });
                    this.listenTo(this, "keyup", function (e) {
                        var activeElement = document.activeElement;
                        var activeElementId = activeElement.id;
                        var activeElementTabindex = $(activeElement).attr('tabIndex');
                        var activeElementLabel = $(activeElement).attr('for');
                        var code = e.which;
                        switch (code) {
                            case 32:
                            case 13:
                                me.enterKeyOnButton(code, activeElementId, activeElementLabel, e);
                                break;
                            case 9:
                                if (activeElementTabindex === "" || activeElementTabindex === '0') {
                                    e.preventDefault();
                                    me.firstItem.focus();
                                }
                                $(activeElement).removeClass('outline-clear');
                                $(activeElement).removeClass('radio-border-clear').addClass('tag-radio-outline-appear rest');
                                break;
                            default:
                                break;
                        }
                    });
                    this.listenTo(this, "mousedown", function (e) {
                        e.stopPropagation();
                        var id = $(e.target).attr("id");
                        var target;
                        switch (id) {
                            case 'toolbar-folderSync':
                            case 'folderSync':
                                target = '#syncBtnDiv';
                                break;
                            case 'syncSetting':
                                target = '#syncSettingDiv';
                                break;
                            case 'syncErrorIcon':
                                target = '#syncErrorIcon';
                                break;
                            case 'toolbar-export':
                            case 'fileimport':
                                target = '#fileimportBtnDiv';
                                break;
                            case 'toolbar-externalOutput':
                            case 'externalOutput':
                                target = '#externalOutputDiv';
                                break;
                            case 'toolbar-setting':
                            case 'lbl-toolbar-setting':
                                target = '#settingDiv';
                                break;
                            case 'toolbar-help':
                            case 'lbl-toolbar-help':
                                target = '#helpDiv';
                                break;
                            case 'new-folder-button-icon':
                                target = '#new-folder-button';
                                break;
                            case 'pick-button-icon':
                                target = '#pick-button';
                                break;
                            case 'delete-button-icon':
                                target = '#delete-button';
                                break;
                            case 'sync-button-icon':
                                target = '#sync-button';
                                break;
                            default:
                                target = e.target;
                                break;
                        }
                        if ($(target).css("outline-style") == "none") {
                            $(target).css("outline", "none").on("blur", function () {
                                $(target).off("blur").css("outline", "");
                                $(target).addClass('outline-clear');
                            });
                        }
                    });
                    this.listenTo(this, "mouseup", function (e) {
                        if (e.toElement.id === 'lbl-toolbar-help' ||
                            e.toElement.id === 'toolbar-help')
                            return;
                        $('.dropdown-content').hide();
                    });
                };
                ExplorerToolbarView.prototype.getFirstAndLastItem = function () {
                    var btConnectButtonTabIndex = +$('#btConnect').attr('tabindex');
                    var syncBtnTabIndex = +$('#syncBtnDiv').attr('tabindex');
                    var syncSettingTabIndex = +$('#syncSettingDiv').attr('tabindex');
                    var newFolderButtonTabindex = +$('#new-folder-button').attr('tabindex');
                    var syncAddButtonTabIndex = +$('#sync-button').attr('tabindex');
                    var deleteButtonTabIndex = +$('#delete-button').attr('tabindex');
                    var btnSearchTabIndex = +$('#btnSearch').attr('tabindex');
                    var searchBarCloseTabIndex = +$('#search-bar-close').attr('tabindex');
                    var fileimportBtnDivTabIndex = +$('#fileimportBtnDiv').attr('tabindex');
                    if (DPMW.Utils.StringUtils.isEmpty(DPMW.appCtrl.currentDeviceId)) {
                        this.firstItem = $('#settingDiv');
                        this.lastItem = $('#helpDiv');
                    }
                    else {
                        var connState = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE);
                        if (connState === DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED) {
                            if (syncBtnTabIndex === -1) {
                                if (syncSettingTabIndex === -1) {
                                    if (fileimportBtnDivTabIndex === -1) {
                                        this.firstItem = $('#settingDiv');
                                    }
                                    else {
                                        this.firstItem = $('#fileimportBtnDiv');
                                    }
                                }
                                else {
                                    this.firstItem = $('#syncSettingDiv');
                                }
                            }
                            else {
                                this.firstItem = $('#syncBtnDiv');
                            }
                            this.lastItem = $('#sync-button');
                        }
                        else {
                            if (btConnectButtonTabIndex === -1) {
                                this.firstItem = $('#settingDiv');
                            }
                            else {
                                this.firstItem = $('#btConnect');
                            }
                            this.lastItem = $('#helpDiv');
                        }
                    }
                    console.info("firsItem: " + this.firstItem.attr("id"));
                    console.info("lastItem: " + this.lastItem.attr("id"));
                };
                ExplorerToolbarView.prototype.clicksyncErrorIcon = function (e) {
                    if (Explorer.Handler.syncHandler.isSyncRunning())
                        return;
                    var syncResult = Explorer.Handler.syncHandler.getLastSyncResult();
                    if (syncResult === null) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.unsynced.title'),
                            message: $.i18n.t('dialog.notice.unsynced.message')
                        }, function (response) {
                        });
                    }
                    else {
                        if (syncResult === Explorer.Handler.SyncResult.Succeed) {
                            var errors = Explorer.Handler.syncHandler.getLastErrors();
                            if (errors && errors.length > 0) {
                                this.showSyncErrorDailog();
                            }
                            else {
                                View.Dialog.openOkDialog({
                                    title: $.i18n.t('dialog.notice.syncComplete.title'),
                                    message: $.i18n.t('dialog.notice.syncComplete.message')
                                }, function (response) {
                                });
                            }
                        }
                        else if (syncResult === Explorer.Handler.SyncResult.Failed) {
                            View.Dialog.openOkDialog({
                                title: $.i18n.t('dialog.notice.syncError.title'),
                                message: $.i18n.t('dialog.notice.syncError.message')
                            }, function (response) {
                            });
                        }
                        else if (syncResult === Explorer.Handler.SyncResult.Aborted) {
                            View.Dialog.openOkDialog({
                                title: $.i18n.t('dialog.notice.syncAborted.title'),
                                message: $.i18n.t('dialog.notice.syncAborted.message')
                            }, function (response) {
                            });
                        }
                    }
                };
                ExplorerToolbarView.prototype.enterKeyOnButton = function (keyCode, activeElementId, activeElementLabel, event) {
                    event.preventDefault();
                    var me = this;
                    var activeRadioId = '#' + activeElementLabel;
                    var checked = $(activeRadioId).prop('checked');
                    if (!checked) {
                        $(activeRadioId).prop('checked', !checked);
                    }
                    switch (activeElementLabel) {
                        case 'folderview':
                            me.showFolderView();
                            break;
                        case 'documentview':
                            me.showDocumentView();
                            break;
                        case 'searchText':
                            me.selectSearchTextType();
                            break;
                        case 'searchMark':
                            me.selectSearchMarkType();
                            break;
                        default:
                            break;
                    }
                    switch (activeElementId) {
                        case 'btConnect':
                            me.bluetoothConnect();
                            break;
                        case 'syncBtnDiv':
                            me.clickFolderSync(event);
                            break;
                        case 'syncErrorIcon':
                            me.clicksyncErrorIcon(event);
                            break;
                        case 'syncSettingDiv':
                            me.openSyncSettingUrl();
                            break;
                        case 'fileimportBtnDiv':
                            me.importFile();
                            break;
                        case 'externalOutputDiv':
                            me.openExternalOutput();
                            break;
                        case 'settingDiv':
                            me.clickToolbarSetting(event);
                            break;
                        case 'helpDiv':
                            me.clickToolbarHelp(event);
                            break;
                        case 'helpGuide':
                            me.clickHelpGuide();
                            break;
                        case 'helpSupport':
                            me.clickHelpSupport();
                            break;
                        case 'btnSearch':
                            me.search(event);
                            break;
                        default:
                            break;
                    }
                };
                ExplorerToolbarView.prototype.clickToolbarHelp = function (ev) {
                    if (ev.type === 'click') {
                        if (ev.toElement.id === 'helpGuide' ||
                            ev.toElement.id === 'helpSupport' ||
                            ev.toElement.id === 'helpSuppl')
                            return;
                    }
                    var dropDownEl = this.$el.find('.dropdown-content');
                    if (dropDownEl.css('display') === 'none') {
                        dropDownEl.show();
                    }
                    else {
                        dropDownEl.hide();
                    }
                };
                ExplorerToolbarView.prototype.clickHelpGuide = function () {
                    $('.dropdown-content').hide();
                    subWindowHandler.openHelpGuide();
                };
                ExplorerToolbarView.prototype.clickHelpSupport = function () {
                    $('.dropdown-content').hide();
                    subWindowHandler.openHelpSupport();
                };
                ExplorerToolbarView.prototype.onviewTypeChanged = function (ev) {
                    var viewType = viewStatus.getViewType();
                    if (viewType === Explorer.VIEW_TYPE_DOCUMENTS) {
                        this.$('#folderview').prop('checked', false);
                        this.$('#documentview').prop('checked', true);
                    }
                    else if (viewType === Explorer.VIEW_TYPE_FOLDER) {
                        this.$('#folderview').prop('checked', true);
                        this.$('#documentview').prop('checked', false);
                    }
                };
                ExplorerToolbarView.prototype.onSearchKeywrodChange = function (obj) {
                    if ($('input[name=searchType]:checked').val() === 'text') {
                        if (_.isEmpty(this.searchKeywordEl.val())) {
                            this.btnSearch.addClass('ui-state-disabled');
                            this.btnSearch.attr('tabindex', -1);
                        }
                        else {
                            this.btnSearch.removeClass('ui-state-disabled');
                            this.btnSearch.attr('tabindex', this.btnSearchTabIndex);
                        }
                    }
                };
                ExplorerToolbarView.prototype.onSearchKeywordFocusIn = function (obj) {
                    viewStatus.changeMainWinTextFocusState(true);
                };
                ExplorerToolbarView.prototype.onSearchKeywordFocusOut = function (obj) {
                    viewStatus.changeMainWinTextFocusState(false);
                };
                ExplorerToolbarView.prototype.selectSearchTextType = function () {
                    this.serachInputDiv.show();
                    this.markSearchDiv.hide();
                    this.onSearchKeywrodChange(null);
                    this.searchKeywordEl.removeClass('ui-state-disabled');
                    this.searchKeywordEl.attr('tabindex', this.searchKeywordElTabIndex);
                };
                ExplorerToolbarView.prototype.selectSearchMarkType = function () {
                    this.serachInputDiv.hide();
                    this.markSearchDiv.show();
                    this.btnSearch.removeClass('ui-state-disabled');
                    this.searchKeywordEl.addClass('ui-state-disabled');
                    this.btnSearch.attr('tabindex', this.btnSearchTabIndex);
                    this.searchKeywordEl.attr('tabindex', -1);
                };
                ExplorerToolbarView.prototype.chkConnectionState = function () {
                    var _this = this;
                    var physicalType = null;
                    var connState = null;
                    var color = null;
                    if (DPMW.appCtrl.currentDevice) {
                        physicalType = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_PHYSICAL_TYPE);
                        connState = DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE);
                        color = DPMW.appCtrl.currentDeviceColor;
                    }
                    var connStr = null;
                    var iconSrc = ExplorerToolbarView.IMG_PATH;
                    if (DPMW.Utils.StringUtils.isEmpty(DPMW.appCtrl.currentDeviceId)) {
                        $('body').focus();
                        connStr = $.i18n.t('state.dp.noRegist');
                        this.dpIconEl.hide();
                        this.DisableView();
                        this.dpStatusEl.text('');
                    }
                    else {
                        if (connState === DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED) {
                            connStr = $.i18n.t('state.dp.connected');
                            $('body').focus();
                            if (color === DEVICE_COLOR_BLACK) {
                                iconSrc += 'Asset_Altair_Main_Header_Condition_Connecting_Black.svg';
                            }
                            else if (color === DEVICE_COLOR_WHITE) {
                                iconSrc += 'Asset_Altair_Main_Header_Condition_Connecting_White.svg';
                            }
                            this.listenTo(this.currentDevice.deviceStorageModel, 'sync', this.setDeviceStorageUsage);
                            this.listenTo(this.currentDevice.deviceStorageModel, 'error', this.fetchError);
                            this.currentDevice.deviceStorageModel.fetch();
                            this.EnableView();
                            syncFolderPairStore.getFolderPairs(function (error, pairs) {
                                if (_.isUndefined(error)) {
                                    _this.syncPairExists = pairs.length > 0;
                                    _this.dispFolderSync();
                                    _this.dispSynResultDiv();
                                    var syncResult = Explorer.Handler.syncHandler.getLastSyncResult();
                                    var syncError = Explorer.Handler.syncHandler.getLastErrors();
                                    if (syncResult === Explorer.Handler.SyncResult.Failed ||
                                        syncResult === Explorer.Handler.SyncResult.Aborted ||
                                        (syncError && _.isArray(syncError) && syncError.length > 0)) {
                                        _this.syncErrorIconImgEl.show();
                                        _this.syncErrorIconImgEl.attr('tabindex', _this.syncErrorIconImgElTabIndex);
                                    }
                                    else {
                                        _this.syncErrorIconImgEl.hide();
                                        _this.syncErrorIconImgEl.attr('tabindex', -1);
                                    }
                                }
                                else {
                                    _this.syncPairExists = false;
                                    _this.syncErrorIconImgEl.hide();
                                    _this.syncErrorIconImgEl.attr('tabindex', -1);
                                }
                            });
                            var deviceSettingModel = DPMW.appCtrl.currentDevice.deviceSettingModel;
                            this.listenTo(deviceSettingModel, 'sync', this.onSettingChanged);
                        }
                        else {
                            $('body').focus();
                            connStr = $.i18n.t('state.dp.disconnected');
                            if (color === DEVICE_COLOR_BLACK) {
                                iconSrc += 'Asset_Altair_Main_Header_Condition_DisConnecting_Black.svg';
                            }
                            else if (color === DEVICE_COLOR_WHITE) {
                                iconSrc += 'Asset_Altair_Main_Header_Condition_DisConnecting_White.svg';
                            }
                            if (process.platform === 'win32') {
                                var htmlStr = '<img class="connIcon" id="btIcon" src="../res/image/svg/Asset_Altair_NoConnection_BT.svg" data-role="none" />';
                                htmlStr = htmlStr + $.i18n.t('toolbar.bluetooth.connect');
                                this.btConnectEl.html(htmlStr);
                                this.btConnectEl.on('click', function () {
                                    _this.bluetoothConnect();
                                });
                                this.remoteAutoBtPanConnector.on('connectableDenebCountChanged', this.setBluetoothConnectLinkVisubility);
                                this.pollingId = setInterval(function () {
                                    var connectableDenebCount = _this.remoteAutoBtPanConnector.getConnectableDenebCount();
                                    _this.setBluetoothConnectLinkVisubility(connectableDenebCount);
                                }, INTERVA_CHECK_BT_CONNECTABLE_DEVICE_COUNT);
                            }
                            this.DisableView();
                        }
                        this.dpIconEl.show();
                        this.dpIconEl.prop('src', iconSrc);
                        this.dpStatusEl.text(connStr);
                    }
                    this.dispSynResultDiv();
                };
                ExplorerToolbarView.prototype.setBluetoothConnectLinkVisubility = function (connectableDenebCount) {
                    var btConnect = $('#btConnect');
                    if (DPMW.Utils.getBluetoothAutoConnectSetting() === DPMW.Utils.LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_ON) {
                        btConnect.hide();
                        btConnect.attr('tabindex', -1);
                        return;
                    }
                    if (typeof connectableDenebCount === 'number' && connectableDenebCount > 0) {
                        var AutoBtPanConnector = require('electron').remote.require('mw-auto-bt-pan-connector');
                        var autoBtPanConnector = AutoBtPanConnector.getInstance();
                        autoBtPanConnector.isConnectedToDeneb(function (error, connected) {
                            if (!error) {
                                if (connected) {
                                    btConnect.hide();
                                    btConnect.attr('tabindex', -1);
                                }
                                else {
                                    btConnect.show();
                                    btConnect.attr('tabindex', 1);
                                }
                            }
                            else {
                                console.log(error.message);
                            }
                        });
                    }
                    else {
                        btConnect.hide();
                        btConnect.attr('tabindex', -1);
                    }
                };
                ExplorerToolbarView.prototype.bluetoothConnect = function () {
                    var denebCount = this.remoteAutoBtPanConnector.getConnectableDenebCount();
                    if (denebCount === 1) {
                        this.remoteAutoBtPanConnector.doConnect();
                        return;
                    }
                    if (denebCount > 1) {
                        var err = DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'Some connectable-Denebs were found.');
                        var errCode = DPMW.mwe.genUserErrorCode(err);
                        View.Dialog.openErrorDialog({
                            title: $.i18n.t('dialog.title.error'),
                            message: $.i18n.t('dialog.error.message.90', { errorCode: errCode }),
                        }, function (response) { });
                        return;
                    }
                };
                ExplorerToolbarView.prototype.DisableView = function () {
                    this.viewTypeDiv.addClass('ui-state-disabled');
                    this.searchDivImg.addClass('ui-state-disabled');
                    this.serachInputDiv.addClass('ui-state-disabled');
                    this.searchTypeDiv.addClass('ui-state-disabled');
                    this.markSearchDiv.addClass('ui-state-disabled');
                    this.btnSearch.addClass('ui-state-disabled');
                    this.fileimportBtnDivEl.addClass('ui-state-disabled');
                    this.externalOutputDivEl.addClass('ui-state-disabled');
                    this.syncBtnDivEl.addClass('ui-state-disabled');
                    this.syncSettingEl.addClass('ui-state-disabled');
                    this.syncBtnDivEl.attr('tabindex', -1);
                    this.syncSettingEl.attr('tabindex', -1);
                    this.fileimportBtnDivEl.attr('tabindex', -1);
                    this.externalOutputDivEl.attr('tabindex', -1);
                    this.folderLbl.attr('tabindex', -1);
                    this.docLbl.attr('tabindex', -1);
                    this.searchTextLbl.attr('tabindex', -1);
                    this.searchMarkLbl.attr('tabindex', -1);
                    this.searchKeywordEl.attr('tabindex', -1);
                    this.typeMarkStar.attr('tabindex', -1);
                    this.lblTypeMarkStar.attr('tabindex', -1);
                    this.typeMarkAsterisk.attr('tabindex', -1);
                    this.lblTypeMarkAsterisk.attr('tabindex', -1);
                    this.btnSearch.attr('tabindex', -1);
                };
                ExplorerToolbarView.prototype.EnableView = function () {
                    this.viewTypeDiv.removeClass('ui-state-disabled');
                    this.searchDivImg.removeClass('ui-state-disabled');
                    this.serachInputDiv.removeClass('ui-state-disabled');
                    this.searchTypeDiv.removeClass('ui-state-disabled');
                    this.markSearchDiv.removeClass('ui-state-disabled');
                    this.btnSearch.removeClass('ui-state-disabled');
                    this.fileimportBtnDivEl.removeClass('ui-state-disabled');
                    this.externalOutputDivEl.removeClass('ui-state-disabled');
                    this.syncBtnDivEl.removeClass('ui-state-disabled');
                    this.syncSettingEl.removeClass('ui-state-disabled');
                    this.syncBtnDivEl.attr('tabindex', this.syncBtnDivElTabIndex);
                    this.syncSettingEl.attr('tabindex', this.syncSettingElTabIndex);
                    this.fileimportBtnDivEl.attr('tabindex', this.fileimportBtnDivElTabIndex);
                    this.externalOutputDivEl.attr('tabindex', this.externalOutputDivElTabIndex);
                    this.folderLbl.attr('tabindex', this.folderLblTabIndex);
                    this.docLbl.attr('tabindex', this.docLblTabIndex);
                    this.searchTextLbl.attr('tabindex', this.searchTextLblTabIndex);
                    this.searchMarkLbl.attr('tabindex', this.searchMarkLblTabIndex);
                    this.searchKeywordEl.attr('tabindex', this.searchKeywordElTabIndex);
                    this.typeMarkStar.attr('tabindex', this.typeMarkStarTabIndex);
                    this.lblTypeMarkStar.attr('tabindex', this.lblTypeMarkStarTabIndex);
                    this.typeMarkAsterisk.attr('tabindex', this.typeMarkAsteriskTabIndex);
                    this.lblTypeMarkAsterisk.attr('tabindex', this.lblTypeMarkAsteriskTabIndex);
                    this.btnSearch.attr('tabindex', this.btnSearchTabIndex);
                };
                ExplorerToolbarView.prototype.onSyncErrorIconMouseOver = function (e) {
                    this.syncErrorIconImgEl.prop('src', ExplorerToolbarView.IMG_PATH + 'Asset_Altair_Main_Header_Tool_Caution_Hover.svg');
                };
                ExplorerToolbarView.prototype.onSyncErrorIconMouseleave = function (e) {
                    this.syncErrorIconImgEl.prop('src', ExplorerToolbarView.IMG_PATH + 'Asset_Altair_Main_Header_Tool_Caution_Rest.svg');
                };
                ExplorerToolbarView.prototype.onSyncErrorIconMousedown = function (e) {
                    this.syncErrorIconImgEl.prop('src', ExplorerToolbarView.IMG_PATH + 'Asset_Altair_Main_Header_Tool_Caution_Pressed.svg');
                };
                ExplorerToolbarView.prototype.onSyncErrorIconMouseup = function (e) {
                    this.syncErrorIconImgEl.prop('src', ExplorerToolbarView.IMG_PATH + 'Asset_Altair_Main_Header_Tool_Caution_Rest.svg');
                };
                ExplorerToolbarView.prototype.onBtnLabelMouseEvent = function (obj) {
                    var forName = obj.currentTarget.attributes['for'].value;
                    var imgSrc = ExplorerToolbarView.IMG_PATH;
                    if (obj.type === 'mouseover') {
                        if (forName === 'toolbar-export') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Import_Hover.svg';
                        }
                        else if (forName === 'toolbar-externalOutput') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_ExternalOutput_Hover.svg';
                        }
                        else if (forName === 'toolbar-setting') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Setting_Hover.svg';
                        }
                        else if (forName === 'toolbar-help') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Help_Hover.svg';
                        }
                        else if (forName === 'toolbar-folderSync') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Sync_Hover.svg';
                        }
                        else {
                            return;
                        }
                    }
                    else if (obj.type === 'mouseleave' || obj.type === 'mouseup') {
                        if (forName === 'toolbar-export') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Import_Rest.svg';
                        }
                        else if (forName === 'toolbar-externalOutput') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_ExternalOutput_Rest.svg';
                        }
                        else if (forName === 'toolbar-setting') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Setting_Rest.svg';
                        }
                        else if (forName === 'toolbar-help') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Help_Rest.svg';
                        }
                        else if (forName === 'toolbar-folderSync') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Sync_Rest.svg';
                        }
                        else {
                            return;
                        }
                    }
                    else if (obj.type === 'mousedown') {
                        if (forName === 'toolbar-export') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Import_Pressed.svg';
                        }
                        else if (forName === 'toolbar-externalOutput') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_ExternalOutput_Pressed.svg';
                        }
                        else if (forName === 'toolbar-setting') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Setting_Pressed.svg';
                        }
                        else if (forName === 'toolbar-help') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Help_Pressed.svg';
                        }
                        else if (forName === 'toolbar-folderSync') {
                            imgSrc += 'Asset_Altair_Main_Header_Tool_Sync_Pressed.svg';
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                    $('#' + forName).attr('src', imgSrc);
                };
                ExplorerToolbarView.prototype.fetchError = function (modelOrCollection, response, options) {
                    var err = null;
                    var msgId = null;
                    if (typeof options.mwError === 'undefined') {
                        msgId = 'dialog.error.message.75';
                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                    }
                    else {
                        err = options.mwError;
                        var mwCode = options.mwError.mwCode;
                        if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            if (response.status >= 400 && response.status <= 599) {
                                msgId = 'dialog.error.message.3';
                            }
                            else {
                                msgId = 'dialog.error.message.75';
                            }
                        }
                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                            msgId = 'dialog.error.message.75';
                        }
                        else {
                            msgId = 'dialog.error.message.75';
                        }
                    }
                    View.Dialog.openErrorDialog({
                        title: $.i18n.t('dialog.title.error'),
                        message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                    }, function (response) { });
                };
                ExplorerToolbarView.prototype.setDeviceStorageUsage = function () {
                    var capacity = parseInt(this.currentDevice.deviceStorageModel.get(DPMW.Model.Device.ATTR_NAME_CAPACITY));
                    var available = parseInt(this.currentDevice.deviceStorageModel.get(DPMW.Model.Device.ATTR_NAME_AVAILABLE));
                    var mbLimit = 900 * 1024 * 1024;
                    var byteToGb = 1024 * 1024 * 1024;
                    var byteToMb = 1024 * 1024;
                    var availableDisp;
                    if (available < mbLimit) {
                        availableDisp = this.floatFormat((available / byteToMb), 2) + $.i18n.t('state.dp.capacity.unit.mega');
                    }
                    else {
                        availableDisp = this.floatFormat((available / byteToGb), 2) + $.i18n.t('state.dp.capacity.unit.giga');
                    }
                    this.deviceStorageUsageEl.text(availableDisp + ' '
                        + $.i18n.t('state.dp.capacity.mid') + ' '
                        + (capacity / byteToGb).toFixed(1)
                        + $.i18n.t('state.dp.capacity.unit.giga'));
                };
                ExplorerToolbarView.prototype.floatFormat = function (number, n) {
                    var _pow = Math.pow(10, n);
                    return Math.round(number * _pow) / _pow;
                };
                ExplorerToolbarView.prototype.clickToolbarSetting = function (ev) {
                    subWindowHandler.openWindowSetting();
                };
                ExplorerToolbarView.prototype.search = function (ev) {
                    var me = this;
                    var searchCondition = {};
                    var checkedRadioButton;
                    if ($('input[name=searchType]:checked').val() === 'text') {
                        checkedRadioButton = '1';
                    }
                    else {
                        checkedRadioButton = $('input[name=searchTargetMark]:checked').val();
                    }
                    var keyword;
                    var annotationPattern;
                    if (checkedRadioButton === '1') {
                        searchCondition['entry_type'] = DPMW.Model.Content.ENTRY_TYPE_ALL;
                        searchCondition['search_target'] = DPMW.Model.Content.SEARCH_TARGET_DOCUMENT_META;
                        searchCondition['search_keyword'] = $('#keyword').val();
                        keyword = $('#keyword').val();
                    }
                    else if (checkedRadioButton === '3') {
                        searchCondition['entry_type'] = DPMW.Model.Content.ENTRY_TYPE_DOCUMENTS;
                        searchCondition['search_target'] = DPMW.Model.Content.SEARCH_TARGETE_ANNOTATION_PATTERN;
                        searchCondition['search_keyword'] = DPMW.Model.Content.ANNOTATION_KEYWORDE_STAR;
                        annotationPattern = DPMW.Model.Content.ANNOTATION_KEYWORDE_STAR;
                    }
                    else if (checkedRadioButton === '4') {
                        searchCondition['entry_type'] = DPMW.Model.Content.ENTRY_TYPE_DOCUMENTS;
                        searchCondition['search_target'] = DPMW.Model.Content.SEARCH_TARGETE_ANNOTATION_PATTERN;
                        searchCondition['search_keyword'] = DPMW.Model.Content.ANNOTATION_KEYWORDE_ASTERISK;
                        annotationPattern = DPMW.Model.Content.ANNOTATION_KEYWORDE_ASTERISK;
                    }
                    else {
                        throw new Error('error in search');
                    }
                    if (searchCondition['search_target'] === DPMW.Model.Content.SEARCH_TARGETE_ANNOTATION_PATTERN) {
                        searchCondition['annotation_type'] = DPMW.Model.Content.ANNOTATION_TYPE_ALL;
                    }
                    if (viewStatus.getViewType() === Explorer.VIEW_TYPE_DOCUMENTS) {
                        searchCondition['origin_folder_id'] = 'root';
                        viewStatus.changeViewType(Explorer.VIEW_TYPE_SEARCH_DOCUMENTS);
                    }
                    else if (viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER) {
                        searchCondition['origin_folder_id'] = viewStatus.getFolderId();
                        viewStatus.changeViewType(Explorer.VIEW_TYPE_SEARCH_FOLDER);
                    }
                    else if (viewStatus.getViewType() === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                        searchCondition['origin_folder_id'] = viewStatus.getFolderId();
                    }
                    else if (viewStatus.getViewType() === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS) {
                        searchCondition['origin_folder_id'] = 'root';
                    }
                    viewStatus.setSearchTarget(searchCondition['search_target'], keyword, annotationPattern, searchCondition['annotation_type'], searchCondition['entry_type']);
                    DPMW.View.Explorer.Status.selectionStatus.updateSelections([]);
                    fetchHandler.performFetchForNewStatus(searchCondition, {
                        success: function (modelOrCollection, response, options) {
                            $('#new-folder-button').attr('tabindex', -1);
                            $('#search-bar-close').attr('tabindex', me.searchBarCloseTabIndex);
                            console.log('success');
                        },
                        error: function (modelOrCollection, response, options) {
                            var err = null;
                            var msgId = null;
                            if (typeof options.mwError === 'undefined') {
                                msgId = 'dialog.error.message.75';
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                            }
                            else {
                                err = options.mwError;
                                var mwCode = options.mwError.mwCode;
                                if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40002') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40005') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 408 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (response.status >= 400 && response.status < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status >= 500 && response.status < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                            }
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerToolbarView.prototype.showFolderView = function () {
                    var me = this;
                    viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                    fetchHandler.performFetch({
                        success: function (modelOrCollection, response, options) {
                            $('#new-folder-button').attr('tabindex', me.newFolderButtonTabIndex);
                            $('#search-bar-close').attr('tabindex', -1);
                            console.log('success');
                        },
                        error: function (modelOrCollection, response, options) {
                            var err = null;
                            var msgId = null;
                            if (typeof options.mwError === 'undefined') {
                                msgId = 'dialog.error.message.75';
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                            }
                            else {
                                err = options.mwError;
                                var mwCode = options.mwError.mwCode;
                                if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40002') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40005') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 408 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (response.status >= 400 && response.status < 500) {
                                        msgId = 'dialog.error.message.65';
                                    }
                                    else if (response.status >= 500 && response.status < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                            }
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerToolbarView.prototype.showDocumentView = function () {
                    viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                    fetchHandler.performFetch({
                        success: function (modelOrCollection, response, options) {
                            $('#search-bar-close').attr('tabindex', -1);
                            console.log('success');
                        },
                        error: function (modelOrCollection, response, options) {
                            var err = null;
                            var msgId = null;
                            if (typeof options.mwError === 'undefined') {
                                msgId = 'dialog.error.message.75';
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                            }
                            else {
                                err = options.mwError;
                                var mwCode = options.mwError.mwCode;
                                if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40002') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40005') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 400 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status === 408 &&
                                        typeof response.responseJSON !== 'undefined' &&
                                        typeof response.responseJSON.error_code === 'string' &&
                                        response.responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (response.status >= 400 && response.status < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (response.status >= 500 && response.status < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                            }
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerToolbarView.prototype.importFile = function () {
                    if (viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.autoclose.exportOnDocView.title'),
                            message: $.i18n.t('dialog.autoclose.exportOnDocView.message'),
                        }, function (response) {
                            ;
                        });
                        return;
                    }
                    var remote = require('electron').remote;
                    var dialog = remote.dialog;
                    viewStatus.increaseSysDialogCount();
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        properties: ["openFile", "multiSelections"],
                        filters: [
                            {
                                name: $.i18n.t('app.system.win.filetype.document'),
                                extensions: ['pdf']
                            }
                        ]
                    }, function (filePathArray) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(filePathArray)) {
                            return;
                        }
                        var folderPath = viewStatus.getFolderPath().split('/');
                        var targetFolderName = folderPath[folderPath.length - 1];
                        fileTransferHandler.uploadDocuments(filePathArray, viewStatus.getFolderPath(), {
                            success: function () {
                                console.log('success');
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                if (errCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (errCode === DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT) {
                                    msgId = 'dialog.error.message.74';
                                }
                                else if (errCode === DPMW.mwe.E_MW_CANCELLED) {
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_FILE_READ_LOCAL_FAILED) {
                                    msgId = 'dialog.error.message.78';
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgId, {
                                            errorCode: DPMW.mwe.genUserErrorCode(err),
                                            file: err.mwTargetName
                                        }),
                                    }, function (response) {
                                    });
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    var responseJSON = err.cause;
                                    var statusCode = err.mwWebApiResCode;
                                    if (statusCode === 507 &&
                                        (responseJSON.error_code === '50701' || responseJSON.error_code === '50700')) {
                                        msgId = 'dialog.error.message.23';
                                    }
                                    else if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40002') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40005') {
                                        return;
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.79';
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                        return;
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40010') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40011') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.73';
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                folder: targetFolderName
                                            }),
                                        }, function (response) {
                                        });
                                        return;
                                    }
                                    else if (statusCode === 404 &&
                                        responseJSON.error_code === '40401') {
                                        msgId = 'dialog.error.message.14';
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                        return;
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.79';
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                        return;
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.79';
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgId, {
                                            errorCode: DPMW.mwe.genUserErrorCode(err),
                                            file: err.mwTargetName
                                        }),
                                    }, function (response) {
                                    });
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) {
                                });
                            }
                        });
                    });
                };
                ExplorerToolbarView.prototype.getScreenShotFileName = function () {
                    var now = new Date();
                    var y = now.getFullYear();
                    var m = now.getMonth() + 1;
                    var d = now.getDate();
                    var mm = ('0' + m).slice(-2);
                    var dd = ('0' + d).slice(-2);
                    var h = ('0' + now.getHours()).slice(-2);
                    var mi = ('0' + now.getMinutes()).slice(-2);
                    return 'DP_' + y + m + d + '_' + h + mi + '.png';
                };
                ExplorerToolbarView.prototype.takeScreenShot = function (ev) {
                    var currentWindow = require('electron').remote.getCurrentWindow();
                    var remote = require('electron').remote;
                    var dialog = remote.dialog;
                    var fileName = this.getScreenShotFileName();
                    viewStatus.increaseSysDialogCount();
                    dialog.showSaveDialog(currentWindow, {
                        properties: ["openDirectory"],
                        defaultPath: fileName,
                        filters: [
                            { name: 'Images', extensions: ['png'] }
                        ]
                    }, function (filename) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(filename) || _.isNull(filename)) {
                            return;
                        }
                        deviceHander.takeScreenshot(filename, {
                            success: function (modelOrCollection, response, options) {
                            },
                            error: function (modelOrCollection, response, options) {
                                var err = null;
                                var msgId = null;
                                if (typeof options.mwError === 'undefined') {
                                    msgId = 'dialog.error.message.75';
                                    err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                                }
                                else {
                                    err = options.mwError;
                                    var mwCode = err.mwCode;
                                    if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                        if (response.status >= 400 && response.status < 500) {
                                            msgId = 'dialog.error.message.75';
                                        }
                                        else if (response.status >= 500 && response.status < 600) {
                                            msgId = 'dialog.error.message.3';
                                        }
                                        else {
                                            msgId = 'dialog.error.message.65';
                                        }
                                    }
                                    else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                        msgId = 'dialog.error.message.65';
                                    }
                                    else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                        msgId = 'dialog.error.message.65';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.75';
                                    }
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) {
                                });
                            }
                        });
                    });
                };
                ExplorerToolbarView.prototype.openExternalOutput = function () {
                    subWindowHandler.openExternalOutput();
                };
                ExplorerToolbarView.prototype.onSyncFolderPairChanged = function (type, changeFile, syncStillLeft) {
                    this.syncPairExists = syncStillLeft;
                    this.dispFolderSync();
                    if (!this.syncPairExists) {
                        this.syncErrorIconImgEl.hide();
                        this.syncErrorIconImgEl.attr('tabindex', -1);
                    }
                    else {
                        var syncError = Explorer.Handler.syncHandler.getLastErrors();
                        if (syncError && _.isArray(syncError) && syncError.length > 0) {
                            this.syncErrorIconImgEl.show();
                            this.syncErrorIconImgEl.attr('tabindex', this.syncErrorIconImgElTabIndex);
                        }
                        else {
                            this.syncErrorIconImgEl.hide();
                            this.syncErrorIconImgEl.attr('tabindex', -1);
                        }
                    }
                    this.dispSynResultDiv();
                };
                ExplorerToolbarView.prototype.openSyncSettingUrl = function () {
                    require('electron').shell.openExternal($.i18n.t('state.dp.sync.urlGuide'));
                };
                ExplorerToolbarView.prototype.clickFolderSync = function (ev) {
                    var _this = this;
                    Explorer.Handler.syncHandler.syncAllPairs(Explorer.Handler.SyncType.Manual, {
                        success: function () {
                            _this.showSyncErrorDailog();
                        }, error: function (err) {
                            if (err.mwCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.35', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_UO_NOT_ALLOWED) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_CANCELLED) {
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_DEVICE_CONN_FAILED) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                var msgId = void 0;
                                if (typeof err.cause !== 'undefined' &&
                                    typeof err.cause.error_code === 'string') {
                                    if (err.mwWebApiResCode === 408 && err.cause.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (err.mwWebApiResCode === 507 && (err.cause.error_code === '50701' || err.cause.error_code === '50700')) {
                                        msgId = 'dialog.error.message.24';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40001') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40002') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40006') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40010') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode === 400 && err.cause.error_code === '40011') {
                                        msgId = 'dialog.error.message.86';
                                    }
                                    else if (err.mwWebApiResCode >= 400 && err.mwWebApiResCode <= 599) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.86';
                                    }
                                }
                                else {
                                    msgId = 'dialog.error.message.65';
                                }
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.65', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else if (err.mwCode === DPMW.mwe.E_MW_FILE_SIZE_EXCEED) {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.23', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                                return;
                            }
                            else {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.86', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) { });
                            }
                        }
                    });
                };
                ExplorerToolbarView.prototype.showSyncErrorDailog = function () {
                    var syncErrorArray = Explorer.Handler.syncHandler.getLastErrors();
                    if (!_.isUndefined(syncErrorArray) && syncErrorArray.length > 0) {
                        var localResultArray = [];
                        var remoteResultArray = [];
                        for (var i = 0; i < syncErrorArray.length; i++) {
                            var error = syncErrorArray[i];
                            var reulst = void 0;
                            if (error.mwCode === DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND) {
                                var syncFolderPair = error.mwTarget;
                                reulst = {
                                    path: syncFolderPair.localFolderPath,
                                    process: $.i18n.t('sync.ngResult.proc.PCnoRoot'),
                                };
                                localResultArray.push(reulst);
                            }
                            else if (error.mwCode === DPMW.mwe.E_MW_SYNC_REMOTE_FOLDER_NOT_FOUND) {
                                var syncFolderPair = error.mwTarget;
                                reulst = {
                                    path: syncFolderPair.remoteFolderPath,
                                    process: $.i18n.t('sync.ngResult.proc.DPnoRoot'),
                                };
                                remoteResultArray.push(reulst);
                            }
                            else {
                                var failedSyncInfo = error.mwTarget;
                                var localDiffType = failedSyncInfo.localDiffType;
                                var remoteDiffType = failedSyncInfo.remoteDiffType;
                                if (localDiffType === DiffType.Stay) {
                                    if (remoteDiffType === DiffType.Stay) {
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCadd'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCupdate'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCdelete'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed.');
                                    }
                                }
                                else if (localDiffType === DiffType.Added) {
                                    if (remoteDiffType === DiffType.Stay) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPadd'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCupdate'),
                                        };
                                        remoteResultArray.push(reulst);
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPupdate'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed. ');
                                    }
                                }
                                else if (localDiffType === DiffType.Modified) {
                                    if (remoteDiffType === DiffType.Stay) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPupdate'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCupdate'),
                                        };
                                        remoteResultArray.push(reulst);
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPupdate'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPadd'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed. ');
                                    }
                                }
                                else if (localDiffType === DiffType.Removed) {
                                    if (remoteDiffType === DiffType.Stay) {
                                        reulst = {
                                            path: failedSyncInfo.localFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.DPdelete'),
                                        };
                                        localResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Added) {
                                    }
                                    else if (remoteDiffType === DiffType.Modified) {
                                        reulst = {
                                            path: failedSyncInfo.remoteFilePath,
                                            process: $.i18n.t('sync.ngResult.proc.PCadd'),
                                        };
                                        remoteResultArray.push(reulst);
                                    }
                                    else if (remoteDiffType === DiffType.Removed) {
                                    }
                                    else {
                                        console.error('remoteDiffType is Failed. ');
                                    }
                                }
                                else {
                                    console.error('LocalDiffType is Failed. ');
                                }
                            }
                        }
                        var dialogController = null;
                        var initInfo = new DPMW.View.Dialog.DialogInfo.DialogSyncResultInfo();
                        initInfo.remoteResultArray = remoteResultArray;
                        initInfo.localResultArray = localResultArray;
                        var handler = {
                            submit: function (detail, dialogController) {
                                dialogController.success();
                            }
                        };
                        dialogController = View.Dialog.openDialogSyncResult(initInfo, handler);
                    }
                };
                ExplorerToolbarView.prototype.dispFolderSync = function () {
                    if (Explorer.Handler.syncHandler.isSyncRunning()) {
                        if (!this.syncBtnDivEl.hasClass('ui-state-disabled')) {
                            this.syncBtnDivEl.addClass('ui-state-disabled');
                            this.syncBtnDivEl.attr('tabindex', -1);
                        }
                    }
                    else {
                        if (this.syncPairExists) {
                            this.syncBtnDivEl.removeClass('ui-state-disabled');
                            this.syncBtnDivEl.attr('tabindex', this.syncBtnDivElTabIndex);
                        }
                        else {
                            if (!this.syncBtnDivEl.hasClass('ui-state-disabled')) {
                                this.syncBtnDivEl.addClass('ui-state-disabled');
                                this.syncBtnDivEl.attr('tabindex', -1);
                            }
                        }
                    }
                };
                ExplorerToolbarView.prototype.onSettingChanged = function () {
                    var deviceSettingModel = DPMW.appCtrl.currentDevice.deviceSettingModel;
                    this.dateFormat = deviceSettingModel
                        .get(DPMW.Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT);
                    this.timeFormat = deviceSettingModel
                        .get(DPMW.Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT);
                    this.dispSynResultDiv();
                };
                ExplorerToolbarView.prototype.dispSynResultDiv = function () {
                    if (this.syncPairExists) {
                        if (this.syncSettingEl.css('display') !== 'none') {
                            this.syncSettingEl.hide();
                            this.syncSettingEl.attr('tabindex', -1);
                        }
                        var lastDatetime = Explorer.Handler.syncHandler.getLastSyncExecutedDate();
                        if (lastDatetime) {
                            if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                this.toolbarSyncResultDiv.css('visibility', 'hidden');
                            }
                            else {
                                this.toolbarSyncResultDiv.css('display', 'flex');
                                this.syncDatetimeEl.html(this.getDisplayDate(lastDatetime) + ' ' + $.i18n.t('state.dp.sync.last.label'));
                                this.toolbarSyncResultDiv.css('visibility', 'visible');
                            }
                        }
                        else {
                            this.toolbarSyncResultDiv.hide();
                        }
                    }
                    else {
                        this.toolbarSyncResultDiv.hide();
                        this.syncSettingEl.show();
                        if (this.syncBtnDivEl.hasClass('ui-state-disabled')) {
                            this.syncSettingEl.attr('tabindex', -1);
                        }
                        else {
                            this.syncSettingEl.attr('tabindex', this.syncSettingElTabIndex);
                        }
                    }
                };
                ExplorerToolbarView.prototype.getDisplayDate = function (dateTime) {
                    if (!dateTime) {
                        return '';
                    }
                    var date;
                    var MM = '0' + (dateTime.getMonth() + 1);
                    MM = MM.slice(-2);
                    var dd = '0' + dateTime.getDate();
                    dd = dd.slice(-2);
                    if (this.dateFormat === DPMW.Model.DeviceSetting.DateFormatDefs.VALUE_YYYY_M_D) {
                        date = $.i18n.t('app.format.date.type1', {
                            dtYear: dateTime.getFullYear(),
                            dtMonth: MM,
                            dtDate: dd
                        });
                    }
                    else {
                        date = $.i18n.t('app.format.date.type2', {
                            dtYear: dateTime.getFullYear(),
                            dtMonth: MM,
                            dtDate: dd
                        });
                    }
                    var time;
                    var hh = '0' + dateTime.getHours();
                    hh = hh.slice(-2);
                    var mm = '0' + dateTime.getMinutes();
                    mm = mm.slice(-2);
                    var ss = '0' + dateTime.getSeconds();
                    ss = ss.slice(-2);
                    if (this.timeFormat === DPMW.Model.DeviceSetting.TimeFormatDefs.VALUE_12_HOUR) {
                        var hh12 = void 0;
                        var amPmResourceId = void 0;
                        if (dateTime.getHours() >= 12) {
                            hh12 = dateTime.getHours() - 12;
                            amPmResourceId = 'app.format.time.12h.pm';
                        }
                        else {
                            hh12 = dateTime.getHours();
                            amPmResourceId = 'app.format.time.12h.am';
                        }
                        hh12 = '0' + hh12;
                        hh12 = hh12.slice(-2);
                        time = $.i18n.t(amPmResourceId, {
                            dtHour: hh12,
                            dtMin: mm,
                            dtSec: ss
                        });
                    }
                    else {
                        time = $.i18n.t('app.format.time.type2', {
                            dtHour: hh,
                            dtMin: mm,
                            dtSec: ss
                        });
                    }
                    return date + ' ' + time;
                };
                ExplorerToolbarView.prototype.getTextWidth = function (str) {
                    var element = this.$('#toolbar_ruler');
                    var width = element.text(str).width();
                    element.empty();
                    return width;
                };
                ExplorerToolbarView.IMG_PATH = '../res/image/svg/';
                return ExplorerToolbarView;
            }(Backbone.View));
            Explorer.ExplorerToolbarView = ExplorerToolbarView;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerToolbarView.js.map