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
            var Content = DPMW.Model.Content;
            var selectionStatus = DPMW.View.Explorer.Status.selectionStatus;
            var fetchHandler = DPMW.View.Explorer.Handler.fetchHandler;
            var viewStatus = DPMW.View.Explorer.Status.viewStatus;
            var fileTransferHandler = DPMW.View.Explorer.Handler.fileTransferHandler;
            var fileManageHandler = DPMW.View.Explorer.Handler.fileManageHandler;
            var clipboardHandler = DPMW.View.Explorer.Handler.clipboardHandler;
            var syncFolderPairStore = DPMW.Model.FolderSync.syncFolderPairStore;
            var DiffType = DPMW.View.Explorer.Handler.DiffType;
            var PathUtils = DPMW.Utils.PathUtils;
            var ExplorerListView = (function (_super) {
                __extends(ExplorerListView, _super);
                function ExplorerListView(options) {
                    _super.call(this, options);
                    this.SEPARATOR = require('path').sep;
                    this.resizeInfo = null;
                    this.didFirstClick = false;
                    this.lastSelectedIndex = null;
                    this.headerMouseDownId = null;
                    this.myObj = { key1: 'value1', key2: 'value2' };
                    this.resizeTimer = false;
                    this.onDragStartRawBind = null;
                }
                ExplorerListView.prototype.initialize = function () {
                    var _this = this;
                    var me = this;
                    this.listCount = 0;
                    $.get('../templates/explorer_listview.html', function (data) {
                        me.$el.html(data);
                        var templateStr = $('#template_document').text();
                        me.template_ = Hogan.compile(templateStr);
                        me.topBlockOffset = null;
                        me.midBlockOffset = 0;
                        me.btmBlockOffset = Explorer.Handler.partialSize;
                        me.$el.localize();
                        $('#scrolltable').on('scroll', function () {
                            me.scroll();
                        });
                        me.showWaitingIcon(true);
                    }, 'html');
                    this.listenTo(this, 'keydown', this.onKeydown);
                    this.listenTo(this, 'mouseup', this.onResizerMouseUp);
                    this.listenTo(this, 'mousemove', this.onResizerMouseMove);
                    this.listenTo(this, 'resize', this.onWindowResize);
                    this.listenTo(selectionStatus, 'selectionsChanged', this.onSelectionsChanged);
                    var deviceSettingModel = DPMW.appCtrl.currentDevice.deviceSettingModel;
                    deviceSettingModel.fetch({
                        error: me.onFetchError,
                        success: function (ModelOrCollection, response, options) {
                            me.dateFormat = deviceSettingModel
                                .get(DPMW.Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT);
                            me.timeFormat = deviceSettingModel
                                .get(DPMW.Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT);
                            me.listenTo(Explorer.Handler.subWindowHandler, 'WindowSettingClosed', me.updateDeviceSetting);
                            Explorer.Status.fetchStatus.displayOffset_ = 0;
                            Explorer.Status.fetchStatus.displaySize_ = Math.ceil($('#scrolltable').height() / rowHeight);
                            me.list = Explorer.Status.viewStatus.getCollection();
                            me.listenTo(me.list, 'sync', me.updateList);
                            me.listenTo(me.list, 'error', function () {
                                me.list.reset();
                                me.showWaitingIcon(false);
                            });
                            Explorer.Handler.fetchHandler.performFetch({ error: me.onFetchError });
                            me.listenTo(Explorer.Status.viewStatus, 'collectionChanged', me.collectionChanged);
                        },
                    });
                    this.listenTo(Explorer.Handler.dragAndDropHandler, 'dragExternalError', this.onDragExternalError);
                    this.listenTo(viewStatus, 'sortOrderChanged', this.onSortOrderChanged);
                    var obj = {};
                    this.sortDownIconPath = '../res/image/svg/Asset_Altair_Main_List_Sort_Down_Selected_Rest.svg';
                    this.sortUpIconPath = '../res/image/svg/Asset_Altair_Main_List_Sort_Up_Selected_Rest.svg';
                    obj[Content.ORDER_TYPE_ENTRY_NAME_ASC] = { columnName: '#tablename', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_ENTRY_NAME_DESC] = { columnName: '#tablename', imgPath: this.sortDownIconPath };
                    obj[Content.ORDER_TYPE_CREATED_DATE_ASC] = { columnName: '#tableaddeddate', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_CREATED_DATE_DESC] = { columnName: '#tableaddeddate', imgPath: this.sortDownIconPath };
                    obj[Content.ORDER_TYPE_MODIFIED_DATE_ASC] = { columnName: '#tableupdateddate', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_MODIFIED_DATE_DESC] = { columnName: '#tableupdateddate', imgPath: this.sortDownIconPath };
                    obj[Content.ORDER_TYPE_READING_DATE_ASC] = { columnName: '#tablereaddate', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_READING_DATE_DESC] = { columnName: '#tablereaddate', imgPath: this.sortDownIconPath };
                    obj[Content.ORDER_TYPE_TITLE_ASC] = { columnName: '#tabletitle', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_TITLE_DESC] = { columnName: '#tabletitle', imgPath: this.sortDownIconPath };
                    obj[Content.ORDER_TYPE_AUTHOR_ASC] = { columnName: '#tableauthor', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_AUTHOR_DESC] = { columnName: '#tableauthor', imgPath: this.sortDownIconPath };
                    obj[Content.ORDER_TYPE_FILE_SIZE_ASC] = { columnName: '#filesize', imgPath: this.sortUpIconPath };
                    obj[Content.ORDER_TYPE_FILE_SIZE_DESC] = { columnName: '#filesize', imgPath: this.sortDownIconPath };
                    this.sortOrderCloumn = obj;
                    this.listenTo(syncFolderPairStore, 'syncFolderPairChanged', this.onSyncFolderPairChanged);
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (!error) {
                            _this.syncPairExists = pairs.length > 0;
                        }
                        else {
                            _this.syncPairExists = false;
                        }
                    });
                };
                ExplorerListView.prototype.events = function () {
                    return {
                        'scroll #scrolltable': 'scroll',
                        'click .document': 'selectFiles',
                        "contextmenu .document": "beforeSwitchContextMenu",
                        "contextmenu #scrolltable": "controlContextMenu",
                        "mouseup #tablename": "sortTableName",
                        "mouseup #tabletitle": "sortTableTitle",
                        "mouseup #tableauthor": "sortTableAuthor",
                        "mouseup #tableupdateddate": "sortTableUpdatedDate",
                        "mouseup #tableaddeddate": "sortTableAddedDate",
                        "mouseup #tablereaddate": "sortTableReadDate",
                        "mouseup #filesize": "sortFilezie",
                        "mousedown #tablename": "sortTableMouseDown",
                        "mousedown #tabletitle": "sortTableMouseDown",
                        "mousedown #tableauthor": "sortTableMouseDown",
                        "mousedown #tableupdateddate": "sortTableMouseDown",
                        "mousedown #tableaddeddate": "sortTableMouseDown",
                        "mousedown #tablereaddate": "sortTableMouseDown",
                        "mousedown #filesize": "sortTableMouseDown",
                        "mousedown .resizer": "onResizerMouseDown",
                        "click .resizer": "clickResizer",
                        'dragend .document': 'onDragEnd',
                        'dragleave .document': 'onDragLeave',
                        'dragover .document': 'onDragOverDocument',
                        'drop .document': 'onDropDocument',
                        'dragover #document-list': 'onDragOverList',
                        'drop #document-list': 'onDropList',
                        'dragleave #document-list': 'onDragLeave',
                        'dragenter #document-list': 'onDragEnter',
                        'dragexit #document-list': 'onDragExit',
                    };
                };
                ExplorerListView.prototype.updateDeviceSetting = function () {
                    var _this = this;
                    var deviceSettingModel = DPMW.appCtrl.currentDevice.deviceSettingModel;
                    deviceSettingModel.fetch({
                        error: this.onFetchError,
                        success: function (ModelOrCollection, response, options) {
                            var dateFormat_ = deviceSettingModel
                                .get(DPMW.Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT);
                            var timeFormat_ = deviceSettingModel
                                .get(DPMW.Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT);
                            if (dateFormat_ === _this.dateFormat && timeFormat_ === _this.timeFormat) {
                                return;
                            }
                            else {
                                _this.dateFormat = dateFormat_;
                                _this.timeFormat = timeFormat_;
                                $('#midBlock').empty();
                                $('#topBlock').empty();
                                $('#btmBlock').empty();
                                _this.display();
                            }
                        }
                    });
                };
                ExplorerListView.prototype.updateList = function (modelOrCollection, response, options) {
                    if (typeof options.offset !== 'number') {
                        return;
                    }
                    if (this.list.lengthTotal != this.listCount) {
                        this.listCount = this.list.lengthTotal;
                        $('#tablelist').height(rowHeight * this.listCount);
                        if (this.btmBlockOffset === null) {
                            var btmOffset = this.midBlockOffset + Explorer.Handler.partialSize;
                            if (btmOffset < this.list.lengthTotal) {
                                this.btmBlockOffset = btmOffset;
                            }
                        }
                        else {
                            if (this.btmBlockOffset >= this.list.lengthTotal) {
                                this.$('#btmBlock').empty();
                                this.btmBlockOffset = null;
                            }
                        }
                    }
                    var scrollPosition = this.$("#scrolltable").scrollTop();
                    var displayOffset = Math.floor(scrollPosition / rowHeight);
                    if (displayOffset > this.list.lengthTotal) {
                        var displaySize = Math.ceil(this.$('#scrolltable').height() / rowHeight);
                        Explorer.Status.fetchStatus.updateDisplayOffset(0, displaySize);
                        this.$('#midBlock').empty();
                        this.$('#topBlock').empty();
                        this.$('#btmBlock').empty();
                        this.topBlockOffset = null;
                        this.midBlockOffset = 0;
                        this.btmBlockOffset = Explorer.Handler.partialSize;
                        this.$('#scrolltable').scrollTop(0);
                        return;
                    }
                    this.$('#list-no-data').hide();
                    if (options.offset === this.midBlockOffset) {
                        this.displayBlock(options.offset, Block.midBlock);
                    }
                    else if (options.offset === this.btmBlockOffset) {
                        this.displayBlock(options.offset, Block.btmBlock);
                    }
                    else if (options.offset === this.topBlockOffset) {
                        this.displayBlock(options.offset, Block.topBlock);
                    }
                    if (this.listCount === 0) {
                        this.showNoDataList();
                    }
                };
                ExplorerListView.prototype.showNoDataList = function () {
                    var nodataText;
                    var viewType = viewStatus.getViewType();
                    switch (viewType) {
                        case Explorer.VIEW_TYPE_DOCUMENTS:
                            nodataText = $.i18n.t('content.list.caption.noItemDV');
                            break;
                        case Explorer.VIEW_TYPE_FOLDER:
                            nodataText = $.i18n.t('content.list.caption.noItemFV');
                            break;
                        case Explorer.VIEW_TYPE_SEARCH_DOCUMENTS:
                        case Explorer.VIEW_TYPE_SEARCH_FOLDER:
                            nodataText = $.i18n.t('content.list.caption.noItemSearch');
                            break;
                        default:
                            console.error("Unknown view type: " + viewType);
                            break;
                    }
                    this.$('#no-data-text').text(nodataText);
                    this.$('#list-no-data').show();
                };
                ExplorerListView.prototype.scroll = function () {
                    var scrollPosition = $("#scrolltable").scrollTop();
                    var displayOffset = Math.floor(scrollPosition / rowHeight);
                    var displaySize = Math.ceil($('#scrolltable').height() / rowHeight);
                    Explorer.Status.fetchStatus.updateDisplayOffset(displayOffset, displaySize);
                    var displayBlockOffset = this.getBlockOffset(displayOffset);
                    var lengthTotal = this.list.lengthTotal;
                    if (this.midBlockOffset !== displayBlockOffset) {
                        this.showWaitingIcon(true);
                        this.midBlockOffset = displayBlockOffset;
                        if (displayBlockOffset > 0) {
                            this.topBlockOffset = this.midBlockOffset - Explorer.Handler.partialSize;
                        }
                        else {
                            this.topBlockOffset = null;
                        }
                        if (displayBlockOffset + Explorer.Handler.partialSize < lengthTotal) {
                            this.btmBlockOffset = this.midBlockOffset + Explorer.Handler.partialSize;
                        }
                        else {
                            this.btmBlockOffset = null;
                        }
                        $('#midBlock').empty();
                        $('#topBlock').empty();
                        $('#btmBlock').empty();
                        this.showWaitingIcon(true);
                        this.display();
                    }
                    $("#tablecaptain").scrollLeft($("#scrolltable").scrollLeft());
                };
                ExplorerListView.prototype.collectionChanged = function (currentCollection) {
                    var _this = this;
                    this.showWaitingIcon(true);
                    this.stopListening(this.list);
                    this.list = currentCollection;
                    var displaySize = Math.ceil($('#scrolltable').height() / rowHeight);
                    Explorer.Status.fetchStatus.updateDisplayOffset(0, displaySize);
                    $('#midBlock').empty();
                    $('#topBlock').empty();
                    $('#btmBlock').empty();
                    $('#scrolltable').scrollTop(0);
                    this.topBlockOffset = null;
                    this.midBlockOffset = 0;
                    this.btmBlockOffset = Explorer.Handler.partialSize;
                    this.listenTo(this.list, 'sync', this.updateList);
                    this.listenTo(this.list, 'error', function () {
                        _this.list.reset();
                        _this.showWaitingIcon(false);
                    });
                    this.display();
                    var data = [];
                    selectionStatus.updateSelections(data);
                    this.lastSelectedIndex = null;
                };
                ExplorerListView.prototype.display = function () {
                    var lengthTotal = this.list.lengthTotal;
                    if (this.midBlockOffset < lengthTotal) {
                        this.displayBlock(this.midBlockOffset, Block.midBlock);
                    }
                    if (this.btmBlockOffset && this.btmBlockOffset < lengthTotal) {
                        this.displayBlock(this.btmBlockOffset, Block.btmBlock);
                    }
                    if (this.topBlockOffset && this.topBlockOffset < lengthTotal) {
                        this.displayBlock(this.topBlockOffset, Block.topBlock);
                    }
                };
                ExplorerListView.prototype.displayBlockInternal = function (offset, block, syncPairs) {
                    var lengthTotal = this.list.lengthTotal;
                    var target;
                    switch (block) {
                        case Block.topBlock:
                            target = $('#topBlock');
                            break;
                        case Block.midBlock:
                            target = $('#midBlock');
                            break;
                        case Block.btmBlock:
                            target = $('#btmBlock');
                            break;
                        default:
                            throw new Error('Unknown Block');
                    }
                    target.css('top', offset * 40 + 'px');
                    var old = target.children();
                    var existOld = (old.length > 0);
                    var selections = Explorer.Status.selectionStatus.getSelections();
                    if (this.list.isSyncedAny() === true
                        && this.list.lengthTotal === 0) {
                        target.empty();
                        this.showWaitingIcon(false);
                    }
                    if (this.list.isSyncedAny() === true
                        && this.list.lengthTotal > 0 && this.list.atOrdered(offset)) {
                        var viewType = viewStatus.getViewType();
                        var currentPahtIsSync = false;
                        var localFolderPath = void 0;
                        var remoteFolderPath = void 0;
                        if (viewType === Explorer.VIEW_TYPE_FOLDER ||
                            viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                            var currentPath = viewStatus.getFolderPath() + PathUtils.SEPARATOR;
                            for (var j = 0; j < syncPairs.length; j++) {
                                var value = syncPairs[j];
                                if (currentPath.indexOf(value.remoteFolderPath + PathUtils.SEPARATOR) === 0) {
                                    currentPahtIsSync = true;
                                    localFolderPath = value.localFolderPath;
                                    remoteFolderPath = value.remoteFolderPath;
                                    break;
                                }
                            }
                        }
                        var displayCount = void 0;
                        if (lengthTotal - offset < Explorer.Handler.partialSize) {
                            displayCount = lengthTotal - offset;
                        }
                        else {
                            displayCount = Explorer.Handler.partialSize;
                        }
                        var _loop_1 = function(i_1) {
                            var dataEntryIndex = offset + i_1;
                            var entry = this_1.list.atOrdered(dataEntryIndex);
                            var entryPath = entry.get(Content.ATTR_NAME_ENTRY_PATH);
                            var entryType = entry.get(Content.ATTR_NAME_ENTRY_TYPE);
                            var isSyncedFolder = currentPahtIsSync;
                            var tooltip = void 0;
                            if (!currentPahtIsSync) {
                                for (var j = 0; j < syncPairs.length; j++) {
                                    var value = syncPairs[j];
                                    if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                        var entryPathEq = entryPath + PathUtils.SEPARATOR;
                                        if (entryPathEq.indexOf(value.remoteFolderPath + PathUtils.SEPARATOR) === 0) {
                                            isSyncedFolder = true;
                                            localFolderPath = value.localFolderPath;
                                            remoteFolderPath = value.remoteFolderPath;
                                            break;
                                        }
                                    }
                                    else {
                                        if (entryPath.indexOf(value.remoteFolderPath + PathUtils.SEPARATOR) === 0) {
                                            isSyncedFolder = true;
                                            localFolderPath = value.localFolderPath;
                                            remoteFolderPath = value.remoteFolderPath;
                                            break;
                                        }
                                    }
                                }
                            }
                            var fileType = void 0;
                            if (entry.get(Content.ATTR_NAME_ENTRY_TYPE) === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                if (isSyncedFolder) {
                                    fileType = 'syncfolder';
                                    tooltip = $.i18n.t('tooltip.sync.pcpath');
                                    tooltip += ' ' + entryPath.replace(remoteFolderPath, localFolderPath);
                                }
                                else {
                                    fileType = Content.VALUE_ENTRY_TYPE_FOLDER;
                                }
                            }
                            else if (entry.get(Content.ATTR_NAME_DOCUMENT_TYPE) === Content.VALUE_DOCUMENT_TYPE_NOTE) {
                                if (isSyncedFolder) {
                                    fileType = 'syncNote';
                                    tooltip = $.i18n.t('tooltip.sync.pcpath');
                                    tooltip += ' ' + entryPath.replace(remoteFolderPath, localFolderPath);
                                }
                                else {
                                    fileType = Content.VALUE_DOCUMENT_TYPE_NOTE;
                                }
                            }
                            else {
                                if (isSyncedFolder) {
                                    fileType = 'syncNormal';
                                    tooltip = $.i18n.t('tooltip.sync.pcpath');
                                    tooltip += ' ' + entryPath.replace(remoteFolderPath, localFolderPath);
                                }
                                else {
                                    fileType = Content.VALUE_DOCUMENT_TYPE_NOT_NOTE;
                                }
                            }
                            var documentSize = void 0;
                            if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                documentSize = '';
                            }
                            else {
                                var size = entry.get(Content.ATTR_NAME_FILE_SIZE);
                                documentSize = this_1.getDisplaySize(size);
                            }
                            var entryId = entry.get(Content.ATTR_NAME_ENTRY_ID);
                            var selected = _.findIndex(selections, function (element, index, array) {
                                return element && typeof element.get === 'function' && entryId === element.get(Content.ATTR_NAME_ENTRY_ID);
                            });
                            var documentJson = {
                                isNew: entry.get(Content.ATTR_NAME_IS_NEW) === 'true' ? 'isNew' : '',
                                fileTypeImg: fileType,
                                dataEntryId: entryId,
                                dataEntryIndex: dataEntryIndex,
                                dataEntryType: entry.get(Content.ATTR_NAME_ENTRY_TYPE),
                                positionTop: i_1 * 40,
                                documentName: entry.get(Content.ATTR_NAME_ENTRY_NAME),
                                documentTitle: entry.get(Content.ATTR_NAME_TITLE),
                                documentAuthor: entry.get(Content.ATTR_NAME_AUTHOR),
                                modifiedDate: this_1.getDisplayDate(entry.get(Content.ATTR_NAME_MODIFIED_DATE)),
                                addedDate: this_1.getDisplayDate(entry.get(Content.ATTR_NAME_CREATED_DATE)),
                                readDate: this_1.getDisplayDate(entry.get(Content.ATTR_NAME_READING_DATE)),
                                documentSize: documentSize,
                                selected: selected >= 0 ? ' selected' : '',
                                tooltip: tooltip,
                                entryPath: entryPath
                            };
                            if (existOld) {
                                if (i_1 < old.length) {
                                    old[i_1].remove();
                                }
                            }
                            target.append(this_1.template_.render({
                                document: documentJson,
                            }));
                        };
                        var this_1 = this;
                        for (var i_1 = 0; i_1 < displayCount; i_1++) {
                            _loop_1(i_1);
                        }
                        if (old.length > displayCount) {
                            for (var i_2 = displayCount - 1; i_2 < old.length; i_2++) {
                                old[i_2].remove();
                            }
                        }
                        this.resizeDocumentList(target);
                        if (block === Block.midBlock) {
                            this.showWaitingIcon(false);
                        }
                    }
                    var docsel = this.$el.find('.document');
                    docsel.off('dragstart');
                    docsel.off('dragend');
                    docsel.off('dragleave');
                    docsel.off('dragover');
                    docsel.off('drop');
                    if (!this.onDragStartRawBind) {
                        this.onDragStartRawBind = this.onDragStartRaw.bind(this);
                    }
                    this.onDragStartRaw.bind(this);
                    for (var i = 0; i < docsel.length; i++) {
                        docsel[i].removeEventListener('dragstart', this.onDragStartRawBind);
                        docsel[i].addEventListener('dragstart', this.onDragStartRawBind);
                    }
                    docsel.on('dragend', this.onDragEnd.bind(this));
                    docsel.on('dragleave', this.onDragLeave.bind(this));
                    docsel.on('dragover', this.onDragOverDocument.bind(this));
                    docsel.on('drop', this.onDropDocument.bind(this));
                };
                ExplorerListView.prototype.displayBlock = function (offset, block) {
                    var _this = this;
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (_.isUndefined(error)) {
                            _this.displayBlockInternal(offset, block, pairs);
                        }
                        else {
                            pairs = [];
                            _this.displayBlockInternal(offset, block, pairs);
                        }
                    });
                };
                ExplorerListView.prototype.getDisplaySize = function (size) {
                    var KbRate = 1024;
                    var MbRate = 1048576;
                    var GbRate = 1073741824;
                    if (size < KbRate * 900) {
                        return $.i18n.t('app.format.fileSize.kilo', { filesize: (size / KbRate).toFixed(2) });
                    }
                    else if (size < MbRate * 900) {
                        return $.i18n.t('app.format.fileSize.mega', { filesize: (size / MbRate).toFixed(2) });
                    }
                    else {
                        return $.i18n.t('app.format.fileSize.giga', { filesize: (size / GbRate).toFixed(2) });
                    }
                };
                ExplorerListView.prototype.getDisplayDate = function (dateTime) {
                    if (!dateTime) {
                        return '';
                    }
                    var date;
                    var time;
                    var displayDateTime = new Date(dateTime);
                    var yyyy = displayDateTime.getFullYear().toString();
                    var MM = ("0" + (displayDateTime.getMonth() + 1)).slice(-2);
                    var dd = ("0" + displayDateTime.getDate()).slice(-2);
                    if (this.dateFormat === DPMW.Model.DeviceSetting.DateFormatDefs.VALUE_YYYY_M_D) {
                        date = $.i18n.t('app.format.date.type1', {
                            dtYear: yyyy,
                            dtMonth: MM,
                            dtDate: dd
                        });
                    }
                    else {
                        date = $.i18n.t('app.format.date.type2', {
                            dtYear: yyyy,
                            dtMonth: MM,
                            dtDate: dd
                        });
                    }
                    var hh = ("0" + displayDateTime.getHours()).slice(-2);
                    var mm = ("0" + displayDateTime.getMinutes()).slice(-2);
                    var ss = ("0" + displayDateTime.getSeconds()).slice(-2);
                    ;
                    if (this.timeFormat === DPMW.Model.DeviceSetting.TimeFormatDefs.VALUE_12_HOUR) {
                        var h = parseInt(hh);
                        if (h >= 12) {
                            h = h - 12;
                        }
                        hh = ("00" + h.toString(10)).substr(-2, 2);
                        var amPmResourceId = void 0;
                        if (displayDateTime.getHours() >= 12) {
                            amPmResourceId = 'app.format.time.12h.pm';
                        }
                        else {
                            amPmResourceId = 'app.format.time.12h.am';
                        }
                        time = $.i18n.t(amPmResourceId, {
                            dtHour: hh,
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
                ExplorerListView.prototype.onFetchError = function (ModelOrCollection, response, options) {
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
                            if (response.status >= 400 && response.status < 500) {
                                msgId = 'dialog.error.message.75';
                            }
                            else if (response.status >= 500 && response.status < 600) {
                                msgId = 'dialog.error.message.3';
                            }
                            else {
                                msgId = 'dialog.error.message.91';
                            }
                        }
                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            msgId = 'dialog.error.message.75';
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
                    }, function (response) { });
                };
                ExplorerListView.prototype.getBlockNum = function (offset) {
                    return Math.floor(offset / Explorer.Handler.partialSize);
                };
                ExplorerListView.prototype.getBlockOffset = function (index) {
                    return this.getBlockNum(index) * Explorer.Handler.partialSize;
                };
                ExplorerListView.prototype.onSelectionsChanged = function (entities) {
                    this.$el.find('.document.selected').removeClass('selected');
                    for (var i = 0; i < entities.length; i++) {
                        var model = entities[i];
                        var entryID = model.get(Content.ATTR_NAME_ENTRY_ID);
                        this.$el.find('.document[data-entry-id="' + entryID + '"]').addClass("selected");
                    }
                };
                ExplorerListView.prototype.selectFiles = function (ev) {
                    var _this = this;
                    if (!this.didFirstClick) {
                        this.didFirstClick = true;
                        setTimeout(function () {
                            _this.didFirstClick = false;
                        }, 350);
                    }
                    else {
                        this.openDocOrFolder();
                        this.didFirstClick = false;
                        return;
                    }
                    var selectedElement = $(ev.currentTarget);
                    var entryId = selectedElement.attr("data-entry-id");
                    var selectedIndex = Number(selectedElement.attr("data-entry-index"));
                    var selections = [];
                    var selectedModel = viewStatus.getCollection().atOrdered(selectedIndex);
                    var ctrlKey = false;
                    if (process.platform === 'darwin') {
                        ctrlKey = ev.metaKey;
                    }
                    else {
                        ctrlKey = ev.ctrlKey;
                    }
                    if (ctrlKey) {
                        if (selectedElement.hasClass("selected")) {
                            selectedElement.removeClass("selected");
                            var selectionArray = selectionStatus.getSelections();
                            var deleteIndex_1 = -1;
                            selectionArray.forEach(function (item, index, array) {
                                var loopId = item.get(Content.ATTR_NAME_ENTRY_ID);
                                if (entryId === loopId) {
                                    deleteIndex_1 = index;
                                }
                            });
                            selectionArray.splice(deleteIndex_1, 1);
                            selectionStatus.updateSelections(selectionArray);
                        }
                        else {
                            selectedElement.addClass("selected");
                            var selectionArray = selectionStatus.getSelections();
                            selectionArray.push(selectedModel);
                            selectionStatus.updateSelections(selectionArray);
                        }
                        this.lastSelectedIndex = selectedIndex;
                    }
                    else if (ev.shiftKey) {
                        var viewStatusCollection = viewStatus.getCollection();
                        var lastIndex = null;
                        if (this.lastSelectedIndex !== null) {
                            lastIndex = this.lastSelectedIndex;
                        }
                        else {
                            lastIndex = 0;
                        }
                        var start = void 0;
                        var end = void 0;
                        if (selectedIndex > lastIndex) {
                            start = lastIndex;
                            end = selectedIndex;
                        }
                        else {
                            end = lastIndex;
                            start = selectedIndex;
                        }
                        for (var i = start; i <= end; i++) {
                            selections.push(viewStatusCollection.atOrdered(i));
                        }
                        selectionStatus.updateSelections(selections);
                    }
                    else {
                        selections.push(selectedModel);
                        selectionStatus.updateSelections(selections);
                        this.lastSelectedIndex = selectedIndex;
                    }
                };
                ExplorerListView.prototype.openSyncFolder = function () {
                    var selections = selectionStatus.getSelections();
                    var model = selections[0];
                    var remotePath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    var shell = require('electron').shell;
                    var fs = require('fs');
                    var path = require('path');
                    var syncLocalPath;
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (!error) {
                            pairs.forEach(function (value, index, array) {
                                if (remotePath.startsWith(value.remoteFolderPath)) {
                                    syncLocalPath = remotePath.replace(value.remoteFolderPath, value.localFolderPath);
                                    return;
                                }
                            });
                            fs.exists(syncLocalPath, function (exists) {
                                if (exists) {
                                    shell.openItem(path.join(syncLocalPath));
                                }
                                else {
                                    var err = DPMW.mwe.genError(DPMW.mwe.E_MW_SYNC_LOCAL_FOLDER_NOT_FOUND, 'Sync root folder is not found in local.', null);
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.notice.syncNoPcFolder.title'),
                                        message: $.i18n.t('dialog.notice.syncNoPcFolder.message', { folderPath: syncLocalPath }),
                                    }, function (response) {
                                    });
                                }
                            });
                        }
                        else {
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerListView.prototype.onSyncFolderPairChanged = function (type, changeFile, syncStillLeft) {
                    var documentDiv = this.$el.find('.document').filter(function () {
                        var entryPath = $(this).attr('entry-path');
                        return entryPath === changeFile.remoteFolderPath;
                    });
                    var iconDiv = documentDiv.find('.documenticon');
                    if (type === 'add') {
                        iconDiv.removeClass('folder');
                        iconDiv.addClass('syncfolder');
                        iconDiv.find('span').text(changeFile.localFolderPath);
                    }
                    else {
                        iconDiv.removeClass('syncfolder');
                        iconDiv.addClass('folder');
                        iconDiv.find('span').text('');
                    }
                    this.syncPairExists = syncStillLeft;
                };
                ExplorerListView.prototype.addSyncFolder = function () {
                    var _this = this;
                    var dialogController = null;
                    var initInfo = new DPMW.View.Dialog.DialogInfo.DialogSyncIntroductionInfo();
                    var selections = selectionStatus.getSelections();
                    var model = selections[0];
                    var remotePath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    if (!this.syncPairExists) {
                        var handler = {
                            closed: function () {
                                var remote = require('electron').remote;
                                var dialog = require('electron').remote.dialog;
                                viewStatus.increaseSysDialogCount();
                                dialog.showOpenDialog(remote.getCurrentWindow(), {
                                    properties: ["openDirectory"]
                                }, function (selectedDirPath) {
                                    viewStatus.decreaseSysDialogCount();
                                    if (_.isUndefined(selectedDirPath)) {
                                        return;
                                    }
                                    syncFolderPairStore.addFolderPair(selectedDirPath[0], remotePath, function (error, addedPair) {
                                        if (!error) {
                                            if (DPMW.Utils.getAutoSyncSetting() === DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_ON) {
                                                return;
                                            }
                                            var title = $.i18n.t('dialog.confirm.syncNow.title');
                                            var msg = $.i18n.t('dialog.confirm.syncNow.message');
                                            var dialogOptions = {
                                                title: title,
                                                message: msg
                                            };
                                            DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                                                if (response === 0) {
                                                    _this.syncAllPairs();
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            View.Dialog.openErrorDialog({
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                            }, function (response) {
                                            });
                                        }
                                    });
                                });
                            }
                        };
                        dialogController = View.Dialog.openDialogSyncIntroduction(initInfo, handler);
                    }
                    else {
                        syncFolderPairStore.getFolderPairs(function (error, pairs) {
                            if (!error) {
                                if (pairs.length >= Explorer.SYNC_FOLDER_MAX) {
                                    var msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期フォルダーが設定できる最大値に達していた場合');
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t('dialog.error.message.84', { errorCode: DPMW.mwe.genUserErrorCode(msgError) })
                                    }, function (response) {
                                    });
                                }
                                else {
                                    var remotePathArray_1 = [];
                                    remotePathArray_1[0] = remotePath;
                                    syncFolderPairStore.filterRegisteredRemoteFolderPathContainsSpecifiedPath(remotePathArray_1, function (error, filteredPaths) {
                                        if (!error) {
                                            if (filteredPaths.length > 0) {
                                                var msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '選択されていたフォルダーが同期設定されているフォルダーに含まれていた');
                                                View.Dialog.openErrorDialog({
                                                    title: $.i18n.t('dialog.title.error'),
                                                    message: $.i18n.t('dialog.error.message.83', { errorCode: DPMW.mwe.genUserErrorCode(msgError) })
                                                }, function (response) {
                                                });
                                            }
                                            else {
                                                syncFolderPairStore.
                                                    filterSpecifiedPathContainsRegisteredRemoteFolderPath(remotePathArray_1, function (error, filteredPaths1) {
                                                    if (!error) {
                                                        if (filteredPaths1.length > 0) {
                                                            var msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '選択されていたフォルダーが同期設定されているフォルダーに含まれていた場合');
                                                            View.Dialog.openErrorDialog({
                                                                title: $.i18n.t('dialog.title.error'),
                                                                message: $.i18n.t('dialog.error.message.80', { errorCode: DPMW.mwe.genUserErrorCode(msgError) })
                                                            }, function (response) {
                                                            });
                                                        }
                                                        else {
                                                            _this.syncAddIntenal(remotePath);
                                                        }
                                                    }
                                                    else {
                                                        var dialogOptions = {
                                                            title: $.i18n.t('dialog.title.error'),
                                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                                        };
                                                        DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            var dialogOptions = {
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                            };
                                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                        }
                                    });
                                }
                            }
                            else {
                                var dialogOptions = {
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                };
                                DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                            }
                        });
                    }
                };
                ExplorerListView.prototype.syncAddIntenal = function (remotePath) {
                    var _this = this;
                    var dialog = require('electron').remote.dialog;
                    var remote = require('electron').remote;
                    viewStatus.increaseSysDialogCount();
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        properties: ["openDirectory"]
                    }, function (selectedDirPathArray) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(selectedDirPathArray)) {
                            return;
                        }
                        var selectedDirPath = selectedDirPathArray[0];
                        var title = $.i18n.t('dialog.notice.addedSyncFolder.title');
                        var msgID = null;
                        var msgError;
                        syncFolderPairStore.getFolderPairs(function (error, pairs) {
                            if (!error) {
                                var localPath_1 = DPMW.Utils.PathUtils.canonicalize(selectedDirPath) + DPMW.Utils.PathUtils.SEPARATOR;
                                pairs.forEach(function (syncFolderPair, index) {
                                    var sycnLocalPath = DPMW.Utils.PathUtils.canonicalize(syncFolderPair.localFolderPath) + DPMW.Utils.PathUtils.SEPARATOR;
                                    console.log(sycnLocalPath);
                                    if (sycnLocalPath === localPath_1) {
                                        msgID = 'dialog.error.message.85';
                                        msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'この処理の過程でフォルダー選択ダイアログが開かれ、選択されたフォルダーが同期設定されていた場合');
                                        return;
                                    }
                                    if (sycnLocalPath.indexOf(localPath_1) === 0) {
                                        msgID = 'dialog.error.message.80';
                                        msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'この処理の過程でフォルダー選択ダイアログが開かれ、選択されたフォルダーの子孫が同期設定されていた場合');
                                        return;
                                    }
                                    if (localPath_1.indexOf(sycnLocalPath) === 0) {
                                        msgID = 'dialog.error.message.83';
                                        msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'この処理の過程でフォルダー選択ダイアログが開かれ、選択されたフォルダーが同期設定されたフォルダーに含まれていた場合');
                                        return;
                                    }
                                });
                                if (msgID === null) {
                                    syncFolderPairStore.addFolderPair(selectedDirPath, remotePath, function (error2, addedPair) {
                                        if (!error) {
                                            if (DPMW.Utils.getAutoSyncSetting() === DPMW.Utils.LocalStorageItemValue.VALUE_AUTO_SYNC_ON) {
                                                return;
                                            }
                                            var title_1 = $.i18n.t('dialog.confirm.syncNow.title');
                                            var msg = $.i18n.t('dialog.confirm.syncNow.message');
                                            var dialogOptions = {
                                                title: title_1,
                                                message: msg
                                            };
                                            DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                                                if (response === 0) {
                                                    _this.syncAllPairs();
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            View.Dialog.openErrorDialog({
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error2) })
                                            }, function (response) {
                                            });
                                        }
                                    });
                                }
                                else {
                                    View.Dialog.openErrorDialog({
                                        title: $.i18n.t('dialog.title.error'),
                                        message: $.i18n.t(msgID, { errorCode: DPMW.mwe.genUserErrorCode(msgError) })
                                    }, function (response) {
                                    });
                                }
                            }
                        });
                    });
                };
                ExplorerListView.prototype.syncAllPairs = function () {
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
                                    msgId = 'dialog.error.message.75';
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
                ExplorerListView.prototype.showSyncErrorDailog = function () {
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
                ExplorerListView.prototype.removeSyncFolder = function () {
                    var selections = selectionStatus.getSelections();
                    var model = selections[0];
                    var remotePath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    var title = $.i18n.t('dialog.confirm.releaseSyncFolder.title');
                    var msg = $.i18n.t('dialog.confirm.releaseSyncFolder.message');
                    var dialogOptions = {
                        title: title,
                        message: msg
                    };
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (!error) {
                            var canDelete = false;
                            var syncID_1;
                            for (var i = 0; i < pairs.length; i++) {
                                var sfp = pairs[i];
                                if (sfp.remoteFolderPath === remotePath) {
                                    canDelete = true;
                                    syncID_1 = sfp.syncId;
                                    break;
                                }
                            }
                            if (canDelete) {
                                DPMW.View.Dialog.openYesNoDialog(dialogOptions, function (response) {
                                    if (response === 0) {
                                        syncFolderPairStore.removeFolderPair(syncID_1, function (error1, removedPair) {
                                            if (error) {
                                                View.Dialog.openErrorDialog({
                                                    title: $.i18n.t('dialog.title.error'),
                                                    message: $.i18n.t('dialog.error.message.72', { errorCode: DPMW.mwe.genUserErrorCode(error1) })
                                                }, function (response) {
                                                });
                                            }
                                        });
                                        return;
                                    }
                                });
                            }
                            else {
                                var msgError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期設定のルートフォルダーでない場合(同期設定されたフォルダーの子孫である場合)');
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.82', { errorCode: DPMW.mwe.genUserErrorCode(msgError) })
                                }, function (response) {
                                });
                            }
                        }
                        else {
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                            }, function (response) {
                            });
                        }
                    });
                };
                ExplorerListView.prototype.beforeSwitchContextMenu = function (ev) {
                    var _this = this;
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (_.isUndefined(error)) {
                            _this.switchContextMenu(ev, pairs);
                        }
                        else {
                            _this.switchContextMenu(ev);
                        }
                    });
                    ev.preventDefault();
                    ev.stopPropagation();
                };
                ExplorerListView.prototype.switchContextMenu = function (ev, pairs) {
                    var _this = this;
                    var remote = require('electron').remote;
                    var Menu = remote.Menu;
                    var MenuItem = remote.MenuItem;
                    var menu = new Menu();
                    if (selectionStatus.getSelections().length === 0 ||
                        selectionStatus.getSelections().length === 1) {
                        var selectedElement = $(ev.currentTarget);
                        var selectedIndex = Number(selectedElement.attr("data-entry-index"));
                        var selections = [];
                        var selectedModel = viewStatus.getCollection().atOrdered(selectedIndex);
                        selections.push(selectedModel);
                        selectionStatus.updateSelections(selections);
                        this.lastSelectedIndex = selectedIndex;
                        var model = selectionStatus.getSelections()[0];
                        var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.open'),
                            click: function (e) { _this.openDocOrFolder(); }
                        }));
                        if (entryType === Content.VALUE_ENTRY_TYPE_FILE &&
                            viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                            menu.append(new MenuItem({
                                label: $.i18n.t('func.fileDP.moveToFileFolder'),
                                click: function (e) { _this.moveToFileFolder(); }
                            }));
                        }
                        menu.append(new MenuItem({ type: 'separator' }));
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.import'),
                            click: function (e) { _this.importFile(); }
                        }));
                        menu.append(new MenuItem({ type: 'separator' }));
                        if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER &&
                            !_.isUndefined(pairs)) {
                            var entryPath_1 = model.get(Content.ATTR_NAME_ENTRY_PATH) + PathUtils.SEPARATOR;
                            var isSyncFolder_1 = false;
                            pairs.forEach(function (value) {
                                if (entryPath_1.indexOf(value.remoteFolderPath + PathUtils.SEPARATOR) === 0) {
                                    isSyncFolder_1 = true;
                                    return;
                                }
                            });
                            if (isSyncFolder_1) {
                                menu.append(new MenuItem({
                                    label: $.i18n.t('func.sync.openDst'),
                                    click: function (e) { _this.openSyncFolder(); }
                                }));
                                if (!Explorer.Handler.syncHandler.isSyncRunning()) {
                                    menu.append(new MenuItem({
                                        label: $.i18n.t('func.sync.remove'),
                                        click: function (e) { _this.removeSyncFolder(); }
                                    }));
                                }
                                menu.append(new MenuItem({ type: 'separator' }));
                            }
                            else {
                                if (!Explorer.Handler.syncHandler.isSyncRunning()) {
                                    menu.append(new MenuItem({
                                        label: $.i18n.t('func.sync.add'),
                                        click: function (e) { _this.addSyncFolder(); }
                                    }));
                                    menu.append(new MenuItem({ type: 'separator' }));
                                }
                            }
                        }
                        if (!clipboardHandler.isPasting()) {
                            menu.append(new MenuItem({
                                label: $.i18n.t('func.fileDP.cut'),
                                click: function (e) {
                                    _this.cut();
                                }
                            }));
                            menu.append(new MenuItem({
                                label: $.i18n.t('func.fileDP.copy'),
                                click: function (e) { _this.copy(); }
                            }));
                            menu.append(new MenuItem({ type: 'separator' }));
                        }
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.rename'),
                            click: function (e) {
                                _this.renameDocOrFolder();
                            }
                        }));

                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.delete'),
                            click: function (e) {
                                _this.beforeDelete();
                            }
                        }));
                    }
                    else {
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.import'),
                            click: function (e) { _this.importFile(); }
                        }));
                        menu.append(new MenuItem({ type: 'separator' }));
                        if (!clipboardHandler.isPasting()) {
                            menu.append(new MenuItem({
                                label: $.i18n.t('func.fileDP.cut'),
                                click: function (e) {
                                    _this.cut();
                                }
                            }));
                            menu.append(new MenuItem({
                                label: $.i18n.t('func.fileDP.copy'),
                                click: function (e) {
                                    _this.copy();
                                }
                            }));
                            menu.append(new MenuItem({ type: 'separator' }));
                        }
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.delete'),
                            click: function (e) {
                                _this.beforeDelete();
                            }
                        }));
                    }
                    var func = function () {
                        menu.popup(remote.getCurrentWindow());
                    };
                    setTimeout(func);
                };
                ExplorerListView.prototype.controlContextMenu = function (ev) {
                    var _this = this;
                    $('#tablelist #tbody').find('.selected').removeClass('selected');
                    var data = [];
                    selectionStatus.updateSelections(data);
                    var remote = require('electron').remote;
                    var Menu = remote.Menu;
                    var MenuItem = remote.MenuItem;
                    var menu = new Menu();
                    menu.append(new MenuItem({
                        label: $.i18n.t('func.filePC.export'),
                        click: function (e) { _this.exportFile(); }
                    }));
                    if (!clipboardHandler.isPasting()) {
                        menu.append(new MenuItem({ type: 'separator' }));
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileDP.paste'),
                            click: function (e) { _this.paste(); }
                        }));
                    }
                    if (viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER) {
                        menu.append(new MenuItem({ type: 'separator' }));
                        menu.append(new MenuItem({
                            label: $.i18n.t('func.fileManage.createFolder'),
                            click: function (e) { _this.createFolder(); }
                        }));
                    }
                    ev.preventDefault();
                    var func = function () {
                        menu.popup(remote.getCurrentWindow());
                    };
                    setTimeout(func);
                };
                ExplorerListView.prototype.onMacKeydown = function (e) {
                    if (e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                        if (e.keyCode === 67) {
                            this.copy();
                            return;
                        }
                        if (e.keyCode === 88) {
                            this.cut();
                            return;
                        }
                        if (e.keyCode === 86) {
                            this.paste();
                            return;
                        }
                        if (e.keyCode === 65) {
                            selectionStatus.updateSelections(viewStatus.getCollection().toArray());
                        }
                        if (e.keyCode === 8) {
                            this.beforeDelete();
                        }
                    }
                };
                ExplorerListView.prototype.onWinKeydown = function (e) {
                    if (!e.metaKey && e.ctrlKey && !e.altKey && !e.shiftKey) {
                        if (e.keyCode === 67) {
                            this.copy();
                            return;
                        }
                        if (e.keyCode === 88) {
                            this.cut();
                            return;
                        }
                        if (e.keyCode === 86) {
                            this.paste();
                            return;
                        }
                        if (e.keyCode === 65) {
                            selectionStatus.updateSelections(viewStatus.getCollection().toArray());
                        }
                    }
                    if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                        if (e.keyCode === 46) {
                            this.beforeDelete();
                        }
                    }
                };
                ExplorerListView.prototype.onKeydown = function (e) {
                    if (process.platform === 'darwin') {
                        this.onMacKeydown(e);
                    }
                    else {
                        this.onWinKeydown(e);
                    }
                };
                ExplorerListView.prototype.openDocOrFolder = function () {
                    if (selectionStatus.getSelections().length === 1) {
                        var model = selectionStatus.getSelections()[0];
                        var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                        var entryId = model.get(Content.ATTR_NAME_ENTRY_ID);
                        var entrPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                        if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                            var viewType = viewStatus.getViewType();
                            if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS ||
                                viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                                viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                            }
                            viewStatus.changeFolder(entryId, entrPath);
                            fetchHandler.performFetch({
                                error: this.onFetchError
                            });
                        }
                        else {
                            this.downloadAndOpenDocument(model);
                        }
                    }
                };
                ExplorerListView.prototype.downloadAndOpenDocument = function (srcDocEntry) {
                    var srcEntryArray = [srcDocEntry];
                    var dstDirPath = process.env.MW_TEMPORARY_FILE_DIR_PATH;
                    var self = this;
                    Promise.resolve()
                        .then(function onFullfilled() {
                        return new Promise(function (resolve, reject) {
                            fileTransferHandler.downloadDocuments(srcEntryArray, dstDirPath, {
                                success: function (downloadedPathArray) {
                                    if (!downloadedPathArray || typeof (downloadedPathArray[0]) !== 'string') {
                                        var error = new Error('The error object is not passed.');
                                        console.error('[ERROR] fileTransferHandler.downloadDocuments() : ' + error);
                                        reject(error);
                                        return;
                                    }
                                    resolve(downloadedPathArray[0]);
                                },
                                error: function (err) {
                                    reject(err);
                                }
                            });
                        });
                    })
                        .then(function onFulfilled(downloadedFilePath) {
                        return new Promise(function (resolve, reject) {
                            var fs = require('fs');
                            fs.chmod(downloadedFilePath, '0400', function (error) {
                                if (error) {
                                    console.log(error);
                                }
                                resolve(downloadedFilePath);
                            });
                        });
                    })
                        .then(function onFullfilled(downloadedFilePath) {
                        return new Promise(function (resolve, reject) {
                            self.openPdfFile(downloadedFilePath);
                            resolve();
                        });
                    })
                        .then(function onFulfilled() {
                    }, function onRejected(err) {
                        var errCode = err.mwCode;
                        var msgId = 'dialog.error.message.75';
                        if (errCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                            msgId = 'dialog.error.message.35';
                        }
                        else if (errCode === DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED) {
                            msgId = "dialog.error.message.78";
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
                        else if (errCode === DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT) {
                            msgId = 'dialog.error.message.74';
                        }
                        else if (errCode === DPMW.mwe.E_MW_CANCELLED) {
                            return;
                        }
                        else if (errCode === DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED) {
                            msgId = 'dialog.error.message.79';
                            View.Dialog.openErrorDialog({
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, {
                                    errorCode: DPMW.mwe.genUserErrorCode(err),
                                    folder: err.mwTargetName
                                }),
                            }, function (response) {
                            });
                            return;
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                            var responseJSON = err.cause;
                            var statusCode = err.mwWebApiResCode;
                            if (statusCode === 408 &&
                                responseJSON.error_code === '40800') {
                                msgId = 'dialog.error.message.72';
                            }
                            else if (statusCode === 400 &&
                                responseJSON.error_code === '40002') {
                                msgId = 'dialog.error.message.75';
                            }
                            else if (statusCode === 400 &&
                                responseJSON.error_code === '40005') {
                                msgId = 'dialog.error.message.75';
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
                                msgId = 'dialog.error.message.91';
                            }
                            else if (statusCode >= 500 && statusCode < 600) {
                                msgId = 'dialog.error.message.3';
                            }
                            else {
                                msgId = 'dialog.error.message.65';
                            }
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            msgId = 'dialog.error.message.91';
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
                    });
                };
                ExplorerListView.prototype.openPdfFile = function (filePath) {
                    var release = require('os').release();
                    if (process.platform === 'win32' && release.match(/^6\.[23](?:\.|$)/) !== null) {
                        var cp = require('child_process');
                        cp.exec('\"' + filePath + '\"');
                    }
                    else {
                        require('electron').shell.openItem(filePath);
                    }
                };
                ExplorerListView.prototype.moveToFileFolder = function () {
                    if (selectionStatus.getSelections().length === 1) {
                        var model = selectionStatus.getSelections()[0];
                        var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                        var entryId = model.get(Content.ATTR_NAME_ENTRY_ID);
                        var parentFolderId = model.get(Content.ATTR_NAME_PARENT_FOLDER_ID);
                        var entryPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                        if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                            var pathArray = entryPath.split('/');
                            var path = '';
                            var slash = '';
                            for (var i = 0; i < pathArray.length - 1; i++) {
                                path += slash + pathArray[i];
                                slash = '/';
                            }
                            viewStatus.changePathWhitFolderView(parentFolderId, path);
                            fetchHandler.performFetch({
                                error: this.onFetchError
                            });
                        }
                    }
                };
                ExplorerListView.prototype.importFile = function () {
                    var remote = require('electron').remote;
                    var dialog = require('electron').remote.dialog;
                    viewStatus.increaseSysDialogCount();
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        properties: ["openDirectory"]
                    }, function (selectedDirPath) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(selectedDirPath)) {
                            return;
                        }
                        var dstDirPath = selectedDirPath[0];
                        var selections = selectionStatus.getSelections();
                        if (!selections || selections.length === 0) {
                            return;
                        }
                        fileTransferHandler.downloadDocuments(selections, dstDirPath, {
                            success: function () {
                                console.log('success');
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                if (errCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                                    msgId = 'dialog.error.message.35';
                                }
                                else if (errCode === DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED) {
                                    msgId = "dialog.error.message.78";
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
                                else if (errCode === DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT) {
                                    msgId = 'dialog.error.message.74';
                                }
                                else if (errCode === DPMW.mwe.E_MW_CANCELLED) {
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED) {
                                    if (err.cause.code === 'ENOSPC') {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.23', {
                                                errorCode: DPMW.mwe.genUserErrorCode(err)
                                            }),
                                        }, function (response) {
                                        });
                                    }
                                    else {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.79', {
                                                errorCode: DPMW.mwe.genUserErrorCode(err),
                                                file: err.mwTargetName
                                            }),
                                        }, function (response) {
                                        });
                                    }
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    var responseJSON = err.cause;
                                    var statusCode = err.mwWebApiResCode;
                                    if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40002') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 &&
                                        responseJSON.error_code === '40005') {
                                        msgId = 'dialog.error.message.75';
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
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
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
                ExplorerListView.prototype.exportFile = function () {
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
                                        (responseJSON.error_code === '50701' ||
                                            responseJSON.error_code === '50700')) {
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
                                        msgId = 'dialog.error.message.75';
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
                ExplorerListView.prototype.cut = function () {
                    if (!clipboardHandler.isPasting() && selectionStatus.getSelections().length > 0) {
                        clipboardHandler.cut(selectionStatus.getSelections());
                    }
                };
                ExplorerListView.prototype.copy = function () {
                    if (!clipboardHandler.isPasting() && selectionStatus.getSelections().length > 0) {
                        clipboardHandler.copy(selectionStatus.getSelections());
                    }
                };
                ExplorerListView.prototype.isDescendant = function (ancestor, descendant) {
                    if (typeof ancestor !== 'string' || typeof descendant !== 'string') {
                        throw new Error('Paramater  is invlalid.');
                    }
                    var ancestorPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(ancestor) + DPMW.Utils.PathUtils.SEPARATOR;
                    var descendantPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(descendant) + DPMW.Utils.PathUtils.SEPARATOR;
                    return descendantPath.indexOf(ancestorPath) === 0;
                };
                ExplorerListView.prototype.paste = function () {
                    var _this = this;
                    if (viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER && !clipboardHandler.isPasting()) {
                        var clipboardElement = clipboardHandler.getClipboard();
                        if (clipboardElement.length <= 0) {
                            return;
                        }
                        var currentPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(viewStatus.getFolderPath()) + DPMW.Utils.PathUtils.SEPARATOR;
                        for (var j = 0; j < clipboardElement.length; j++) {
                            var modelLoop = clipboardElement[j];
                            var modelLoopPath = modelLoop.get(Content.ATTR_NAME_ENTRY_PATH);
                            var modelLoopType = modelLoop.get(Content.ATTR_NAME_ENTRY_TYPE);
                            if (modelLoopType === Content.VALUE_ENTRY_TYPE_FOLDER &&
                                this.isDescendant(modelLoopPath, currentPath)) {
                                var pahtNoteAllowedError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED, 'Copy path is not correct.');
                                var dialogOptions = {
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.63', { errorCode: DPMW.mwe.genUserErrorCode(pahtNoteAllowedError) })
                                };
                                DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                return;
                            }
                        }
                        var model = clipboardElement[0];
                        var parentFolderId = model.get(Content.ATTR_NAME_PARENT_FOLDER_ID);
                        if (this.syncPairExists && clipboardHandler.isCut() && viewStatus.getFolderId() !== parentFolderId) {
                            var entryPaths = this.filterSyncFolderPathArray(clipboardElement);
                            if (entryPaths.length > 0) {
                                syncFolderPairStore.filterRemoteFolderContaninsPath(entryPaths, function (error, filterSyncFolderPair) {
                                    if (!error) {
                                        if (filterSyncFolderPair.length > 0) {
                                            if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                                var syncRunningError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期中には、リネーム・削除・移動できません。');
                                                View.Dialog.openOkDialog({
                                                    title: $.i18n.t('dialog.title.error'),
                                                    message: $.i18n.t('dialog.error.message.89', { errorCode: DPMW.mwe.genUserErrorCode(syncRunningError) }),
                                                }, function () { });
                                                return;
                                            }
                                            var syncRemoveMsg = $.i18n.t('dialog.confirm.releaseSyncSettingByOperation.message');
                                            var syncRemovTitle = $.i18n.t('dialog.confirm.releaseSyncFolder.title');
                                            _this.showConfirmDialog(syncRemoveMsg, syncRemovTitle, function (res) {
                                                if (res === 0) {
                                                    _this.removeSyncPair(filterSyncFolderPair)
                                                        .then(function () {
                                                        _this.pasteIntelval();
                                                    }).
                                                        catch(function (errorRemove) {
                                                        View.Dialog.openErrorDialog({
                                                            title: $.i18n.t('dialog.title.error'),
                                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(errorRemove) })
                                                        }, function (response) {
                                                        });
                                                    });
                                                }
                                                else {
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            _this.pasteIntelval();
                                        }
                                    }
                                    else {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                        }, function (response) {
                                        });
                                    }
                                });
                            }
                            else {
                                this.pasteIntelval();
                            }
                        }
                        else {
                            this.pasteIntelval();
                        }
                    }
                };
                ExplorerListView.prototype.pasteIntelval = function () {
                    clipboardHandler.paste(viewStatus.getFolderId(), viewStatus.getFolderPath(), {
                        success: function () { },
                        error: function (err) {
                            var msgId;
                            if (typeof err === 'undefined') {
                                msgId = 'dialog.error.message.75';
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                            }
                            else {
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                var errCode = err.mwCode;
                                if (errCode === DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED) {
                                    msgId = 'dialog.error.message.63';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 400 && responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 && responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 && responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.71';
                                        var dialogOptions_1 = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { folder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_1, function () { });
                                        return;
                                    }
                                    else if (statusCode === 404 && responseJSON.error_code === '40401') {
                                        msgId = 'dialog.error.message.69';
                                        var dialogOptions_2 = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { fileFolder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_2, function () { });
                                        return;
                                    }
                                    else if (statusCode === 408 && responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode === 507 && (responseJSON.error_code === '50701' || responseJSON.error_code === '50700')) {
                                        msgId = 'dialog.error.message.24';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                            }
                            var dialogOptions = {
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                            };
                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                        }
                    });
                };
                ExplorerListView.prototype.renameDocOrFolder = function () {
                    var _this = this;
                    if (selectionStatus.getSelections().length === 1) {
                        var dialogController = null;
                        var model_1 = selectionStatus.getSelections()[0];
                        var entryPath = model_1.get(Content.ATTR_NAME_ENTRY_PATH);
                        var entryType = model_1.get(Content.ATTR_NAME_ENTRY_TYPE);
                        if (!this.syncPairExists || entryType !== Content.VALUE_ENTRY_TYPE_FOLDER) {
                            this.renameDocOrFolderInterval(model_1);
                            return;
                        }
                        syncFolderPairStore.filterRemoteFolderContaninsPath([entryPath], function (error, filterSyncFolderPair) {
                            if (!error) {
                                if (filterSyncFolderPair.length > 0) {
                                    if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                        var syncRunningError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期中には、リネーム・削除・移動できません。');
                                        View.Dialog.openOkDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.89', { errorCode: DPMW.mwe.genUserErrorCode(syncRunningError) }),
                                        }, function () { });
                                        return;
                                    }
                                    var syncRemoveMsg = $.i18n.t('dialog.confirm.releaseSyncSettingByOperation.message');
                                    var syncRemovTitle = $.i18n.t('dialog.confirm.releaseSyncFolder.title');
                                    _this.showConfirmDialog(syncRemoveMsg, syncRemovTitle, function (res) {
                                        if (res === 0) {
                                            _this.renameDocOrFolderInterval(model_1, filterSyncFolderPair);
                                        }
                                        else {
                                            return;
                                        }
                                    });
                                }
                                else {
                                    _this.renameDocOrFolderInterval(model_1);
                                }
                            }
                            else {
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                }, function (response) {
                                });
                            }
                        });
                    }
                };
                ExplorerListView.prototype.renameDocOrFolderInterval = function (model, filterSyncFolderPair) {
                    var _this = this;
                    var dialogController = null;
                    var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                    var entryId = model.get(Content.ATTR_NAME_ENTRY_ID);
                    var parentFolderId = model.get(Content.ATTR_NAME_PARENT_FOLDER_ID);
                    var entryPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    var entryName = model.get(Content.ATTR_NAME_ENTRY_NAME);
                    var handler = {
                        submit: function (detail, dialogController) {
                            var newName = detail.editbox;
                            var msg = null;
                            if (newName.indexOf('/') > -1) {
                                if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                                    msg = $.i18n.t('dialog.error.message.16');
                                }
                                else {
                                    msg = $.i18n.t('dialog.error.message.18');
                                }
                                var err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'File name is invalid.');
                                var dialogOptions = {
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msg, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                };
                                dialogController.error(dialogOptions);
                                return;
                            }
                            if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                                var EXTENSION_FILENAME_PDF = 'pdf';
                                var nameArray = newName.split('.');
                                if (nameArray.length === 1) {
                                    newName += '.' + EXTENSION_FILENAME_PDF;
                                }
                                else {
                                    var extnamePDF = nameArray[nameArray.length - 1];
                                    if (extnamePDF.toLowerCase() !== EXTENSION_FILENAME_PDF) {
                                        newName += '.' + EXTENSION_FILENAME_PDF;
                                    }
                                }
                            }
                            if (entryName === newName) {
                                dialogController.success();
                                return;
                            }
                            _this.removeSyncPair(filterSyncFolderPair)
                                .then(function () {
                                model.save({ "entry_name": newName, "entry_path": entryPath.substr(0, entryPath.lastIndexOf(entryName)) + newName }, {
                                    success: function (modelOrCollection, response, options) {
                                        fetchHandler.performFetchForUpdate(parentFolderId, {
                                            error: _this.onFetchError
                                        });
                                        dialogController.success();
                                    },
                                    error: function (modelOrCollection, res, options) {
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
                                                if (res.status === 404) {
                                                    if (typeof res.responseJSON !== 'undefined' &&
                                                        typeof res.responseJSON.error_code === 'string') {
                                                        if (res.responseJSON.error_code === '40401') {
                                                            msgId = 'dialog.error.message.75';
                                                        }
                                                        else {
                                                            msgId = 'dialog.error.message.75';
                                                        }
                                                    }
                                                    else {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                }
                                                else if (res.status === 400) {
                                                    if (typeof res.responseJSON !== 'undefined' &&
                                                        typeof res.responseJSON.error_code === 'string') {
                                                        if (res.responseJSON.error_code === '40001') {
                                                            msgId = 'dialog.error.message.75';
                                                        }
                                                        else if (res.responseJSON.error_code === '40006') {
                                                            if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                                                                msgId = 'dialog.error.message.31';
                                                            }
                                                            else {
                                                                msgId = 'dialog.error.message.59';
                                                            }
                                                        }
                                                        else if (res.responseJSON.error_code === '40007') {
                                                            if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                                                                msgId = 'dialog.error.message.21';
                                                            }
                                                            else {
                                                                msgId = 'dialog.error.message.22';
                                                            }
                                                        }
                                                        else {
                                                            msgId = 'dialog.error.message.75';
                                                        }
                                                    }
                                                    else {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                }
                                                else if (res.status === 507) {
                                                    if (typeof res.responseJSON !== 'undefined' &&
                                                        typeof res.responseJSON.error_code === 'string') {
                                                        if (res.responseJSON.error_code === '50701' || res.responseJSON.error_code === '50700') {
                                                            msgId = 'dialog.error.message.24';
                                                        }
                                                        else {
                                                            msgId = 'dialog.error.message.75';
                                                        }
                                                    }
                                                    else {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                }
                                                else if (res.status === 408) {
                                                    if (typeof res.responseJSON !== 'undefined' &&
                                                        typeof res.responseJSON.error_code === 'string') {
                                                        if (res.responseJSON.error_code === '40800') {
                                                            msgId = 'dialog.error.message.72';
                                                        }
                                                        else {
                                                            msgId = 'dialog.error.message.75';
                                                        }
                                                    }
                                                    else {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                }
                                                else if (res.status >= 400 && res.status < 500) {
                                                    msgId = 'dialog.error.message.75';
                                                }
                                                else if (res.status >= 500 && res.status < 600) {
                                                    msgId = 'dialog.error.message.3';
                                                }
                                                else {
                                                    msgId = 'dialog.error.message.65';
                                                }
                                            }
                                            else if (mwCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                                msgId = 'dialog.error.message.75';
                                            }
                                            else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                                msgId = 'dialog.error.message.65';
                                            }
                                            else {
                                                msgId = 'dialog.error.message.75';
                                            }
                                        }
                                        var dialogOptions = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) }),
                                        };
                                        dialogController.error(dialogOptions);
                                    }
                                });
                            })
                                .catch(function (errorRemove) {
                                dialogController.success();
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(errorRemove) })
                                }, function (response) {
                                });
                            });
                        }
                    };
                    var initInfo = new DPMW.View.Dialog.DialogInfo.DialogEditInfo();
                    initInfo.title = $.i18n.t('dialog.edit.folderName.title');
                    if (entryType === Content.VALUE_ENTRY_TYPE_FILE) {
                        initInfo.message = $.i18n.t('dialog.edit.fileName.message');
                    }
                    else {
                        initInfo.message = $.i18n.t('dialog.edit.folderName.message');
                    }
                    initInfo.masking = false;
                    var template_name = entryName;
                    initInfo.editbox = template_name;
                    dialogController = View.Dialog.createDialogEdit(initInfo, handler);
                };
                ExplorerListView.prototype.beforeDelete = function () {
                    var _this = this;
                    if (selectionStatus.getSelections().length === 0)
                        return;
                    var msg = $.i18n.t('dialog.confirm.delete.message');
                    var title = $.i18n.t('func.fileDP.delete');
                    var selections = selectionStatus.getSelections();
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (error) {
                            var dialogOptions = {
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                            };
                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                            return;
                        }
                        if (pairs.length > 0) {
                            _this.syncPairExists = true;
                            var entryPaths = _this.filterSyncFolderPathArray(selections);
                            if (entryPaths.length > 0) {
                                syncFolderPairStore.filterRemoteFolderContaninsPath(entryPaths, function (error, filterSyncFolderPair) {
                                    if (!error) {
                                        if (filterSyncFolderPair.length > 0) {
                                            if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                                var syncRunningError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期中には、リネーム・削除・移動できません。');
                                                View.Dialog.openOkDialog({
                                                    title: $.i18n.t('dialog.title.error'),
                                                    message: $.i18n.t('dialog.error.message.89', { errorCode: DPMW.mwe.genUserErrorCode(syncRunningError) }),
                                                }, function () { });
                                                return;
                                            }
                                            var syncRemoveMsg = $.i18n.t('dialog.confirm.releaseSyncSettingByOperation.message');
                                            var syncRemovTitle = $.i18n.t('dialog.confirm.releaseSyncFolder.title');
                                            _this.showConfirmDialog(syncRemoveMsg, syncRemovTitle, function (res) {
                                                if (res === 0) {
                                                    _this.removeSyncPair(filterSyncFolderPair)
                                                        .then(function () {
                                                        _this.deleteRecursively(selections.slice());
                                                    })
                                                        .catch(function (errorRemove) {
                                                        View.Dialog.openErrorDialog({
                                                            title: $.i18n.t('dialog.title.error'),
                                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(errorRemove) })
                                                        }, function (response) {
                                                        });
                                                    });
                                                }
                                                else {
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            _this.showConfirmDialog(msg, title, _this.deleteDocOrFolder.bind(_this));
                                        }
                                    }
                                    else {
                                        View.Dialog.openErrorDialog({
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                        }, function (response) {
                                        });
                                    }
                                });
                            }
                            else {
                                _this.showConfirmDialog(msg, title, _this.deleteDocOrFolder.bind(_this));
                            }
                        }
                        else {
                            _this.syncPairExists = false;
                            _this.showConfirmDialog(msg, title, _this.deleteDocOrFolder.bind(_this));
                        }
                    });
                };
                ExplorerListView.prototype.deleteDocOrFolder = function (index) {
                    if (index == 1) {
                        return;
                    }
                    var selections = selectionStatus.getSelections();
                    this.deleteRecursively(selections.slice());
                };
                ExplorerListView.prototype.deleteRecursively = function (selections) {
                    var _this = this;
                    if (selections.length === 0)
                        return;
                    var entity = selections.pop();
                    var entityType = entity.get(DPMW.Model.Content.ATTR_NAME_ENTRY_TYPE);
                    if (entityType === DPMW.Model.Content.VALUE_ENTRY_TYPE_FILE) {
                        fileManageHandler.deleteDocument(entity, {
                            success: function () {
                                selectionStatus.deleteOneSelection(entity);
                                _this.deleteRecursively(selections);
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 404 &&
                                        responseJSON.error_code === '40401') {
                                        return;
                                    }
                                    else if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.75';
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
                    }
                    else {
                        fileManageHandler.deleteFolder(entity, {
                            success: function () {
                                selectionStatus.deleteOneSelection(entity);
                                _this.deleteRecursively(selections);
                            },
                            error: function (err) {
                                var errCode = err.mwCode;
                                var msgId;
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 404 &&
                                        responseJSON.error_code === '40401') {
                                        return;
                                    }
                                    else if (statusCode === 408 &&
                                        responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.65';
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
                    }
                };
                ExplorerListView.prototype.createFolder = function () {
                    var dialogController = null;
                    var handler = {
                        submit: function (detail, dialogController) {
                            var editbox = detail.editbox;
                            if (editbox.indexOf('/') > -1) {
                                var err = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED, 'A destination designated by user is not allowed part.');
                                View.Dialog.openErrorDialog({
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t('dialog.error.message.18', { errorCode: DPMW.mwe.genUserErrorCode(err) })
                                }, function (response) {
                                });
                                return;
                            }
                            dialogController.success();
                            DPMW.appCtrl.currentDevice.createFolder(viewStatus.getFolderId(), editbox, {
                                success: function () {
                                    fetchHandler.performFetchForUpdate(viewStatus.getFolderId(), {
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
                                                        response.responseJSON.error_code === '40002') {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                    else if (response.status === 400 &&
                                                        typeof response.responseJSON !== 'undefined' &&
                                                        typeof response.responseJSON.error_code === 'string' &&
                                                        response.responseJSON.error_code === '40005') {
                                                        msgId = 'dialog.error.message.75';
                                                    }
                                                    else if (response.status === 404 &&
                                                        typeof response.responseJSON !== 'undefined' &&
                                                        typeof response.responseJSON.error_code === 'string' &&
                                                        response.responseJSON.error_code === '40401') {
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
                                                    msgId = 'diPalog.error.message.65';
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
                                                response.responseJSON.error_code === '40006') {
                                                msgId = 'dialog.error.message.75';
                                            }
                                            else if (response.status === 400 &&
                                                typeof response.responseJSON !== 'undefined' &&
                                                typeof response.responseJSON.error_code === 'string' &&
                                                response.responseJSON.error_code === '40007') {
                                                msgId = 'dialog.error.message.22';
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
                                            msgId = 'dialog.error.message.75';
                                        }
                                        else if (mwCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                            msgId = 'diPalog.error.message.65';
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
                        }
                    };
                    var initInfo = new DPMW.View.Dialog.DialogInfo.DialogEditInfo();
                    initInfo.title = $.i18n.t('dialog.edit.newFolder.title');
                    initInfo.message = $.i18n.t('dialog.edit.newFolder.message');
                    initInfo.masking = false;
                    dialogController = View.Dialog.createDialogEdit(initInfo, handler);
                };
                ExplorerListView.prototype.filterSyncFolderPathArray = function (selections) {
                    if (!_.isArray(selections)) {
                        throw new Error('Invalid argument.');
                    }
                    var entryPaths = [];
                    for (var i = 0; i < selections.length; i++) {
                        var model = selections[i];
                        var entryPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                        var entryType = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                        if (entryType === Content.VALUE_ENTRY_TYPE_FOLDER) {
                            entryPaths.push(entryPath);
                        }
                    }
                    return entryPaths;
                };
                ExplorerListView.prototype.removeSyncPair = function (filterSyncFolderPair) {
                    return new Promise(function (resolve, reject) {
                        if (filterSyncFolderPair && filterSyncFolderPair.length > 0) {
                            var syncIds = new Array();
                            for (var i = 0; i < filterSyncFolderPair.length; i++) {
                                syncIds.push(filterSyncFolderPair[i].syncId);
                            }
                            syncFolderPairStore.removeMultiFolderPair(syncIds, function (error) {
                                if (!error) {
                                    resolve();
                                }
                                else {
                                    reject(error);
                                }
                            });
                        }
                        else {
                            resolve();
                        }
                    });
                };
                ExplorerListView.prototype.showConfirmDialog = function (msg, titile, callback) {
                    if (titile === void 0) { titile = 'Digital Papger Message'; }
                    View.Dialog.openYesNoDialog({
                        type: 'warning',
                        title: titile,
                        message: msg,
                    }, callback);
                };
                ExplorerListView.prototype.sortTableMouseDown = function (ev) {
                    if (ev.which !== 1) {
                        return;
                    }
                    this.headerMouseDownId = ev.target.id;
                };
                ExplorerListView.prototype.sortTableName = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_ENTRY_NAME_ASC) {
                        sortType = Content.ORDER_TYPE_ENTRY_NAME_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_ENTRY_NAME_DESC) {
                        sortType = Content.ORDER_TYPE_ENTRY_NAME_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_ENTRY_NAME_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortTableTitle = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_TITLE_ASC) {
                        sortType = Content.ORDER_TYPE_TITLE_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_TITLE_DESC) {
                        sortType = Content.ORDER_TYPE_TITLE_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_TITLE_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortTableAuthor = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_AUTHOR_ASC) {
                        sortType = Content.ORDER_TYPE_AUTHOR_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_AUTHOR_DESC) {
                        sortType = Content.ORDER_TYPE_AUTHOR_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_AUTHOR_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortTableUpdatedDate = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_MODIFIED_DATE_ASC) {
                        sortType = Content.ORDER_TYPE_MODIFIED_DATE_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_MODIFIED_DATE_DESC) {
                        sortType = Content.ORDER_TYPE_MODIFIED_DATE_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_MODIFIED_DATE_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortTableAddedDate = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_CREATED_DATE_ASC) {
                        sortType = Content.ORDER_TYPE_CREATED_DATE_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_CREATED_DATE_DESC) {
                        sortType = Content.ORDER_TYPE_CREATED_DATE_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_CREATED_DATE_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortTableReadDate = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_READING_DATE_ASC) {
                        sortType = Content.ORDER_TYPE_READING_DATE_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_READING_DATE_DESC) {
                        sortType = Content.ORDER_TYPE_READING_DATE_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_READING_DATE_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortFilezie = function (ev) {
                    if (ev.which !== 1 || this.headerMouseDownId !== ev.target.id) {
                        return;
                    }
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var sortType;
                    if (viewStatus.getSortOrder() === Content.ORDER_TYPE_FILE_SIZE_ASC) {
                        sortType = Content.ORDER_TYPE_FILE_SIZE_DESC;
                    }
                    else if (viewStatus.getSortOrder() === Content.ORDER_TYPE_FILE_SIZE_DESC) {
                        sortType = Content.ORDER_TYPE_FILE_SIZE_ASC;
                    }
                    else {
                        sortType = Content.ORDER_TYPE_FILE_SIZE_ASC;
                    }
                    this.sortTableColumn(sortType);
                };
                ExplorerListView.prototype.sortTableColumn = function (orderType) {
                    viewStatus.setSortOrder(orderType);
                    var argParams = {};
                    argParams['order_type'] = orderType;
                    fetchHandler.performFetchForNewStatus(argParams, {
                        error: this.onFetchError
                    });
                };
                ExplorerListView.prototype.onSortOrderChanged = function (orderType) {
                    if (!orderType) {
                        this.$el.find('#columns img').css('visibility', 'hidden');
                        this.$el.find('#columns span').removeClass('selected');
                        return;
                    }
                    var sortColumn = this.sortOrderCloumn[orderType];
                    if (typeof sortColumn === 'undefined') {
                        throw new Error('Unknown order type');
                    }
                    this.$el.find('#columns img').css('visibility', 'hidden');
                    var column = this.$el.find(sortColumn.columnName + ' img');
                    column.attr('src', sortColumn.imgPath);
                    column.css('visibility', 'visible');
                    this.$el.find('#columns span').removeClass('selected');
                    this.$el.find(sortColumn.columnName + ' span').addClass('selected');
                };
                ExplorerListView.prototype.onWindowResize = function (event) {
                    if ($('#document-list').length <= 0) {
                        console.warn('invalid status.');
                        return;
                    }
                    var documentListSize = $('#document-list').width();
                    var total = 25;
                    $('.document:first>div.cell').each(function (index, elem) {
                        total += $(elem).innerWidth();
                    });
                    var scrollTable = this.$("#scrolltable");
                    var scrollHeight = scrollTable.get(0).scrollHeight;
                    var scrollWidth = 0;
                    if (scrollHeight > scrollTable.height()) {
                        scrollWidth = 6;
                    }
                    if (total < documentListSize) {
                        if ($('#columns').length <= 0 ||
                            $('#tablelist').length <= 0 ||
                            $('#tbody').length <= 0 ||
                            $('#midBlock').length <= 0 ||
                            $('#topBlock').length <= 0 ||
                            $('#btmBlock').length <= 0 ||
                            $('.document').length <= 0) {
                            console.warn('invalid status.');
                            return;
                        }
                        documentListSize -= scrollWidth;
                        $('#columns').width(documentListSize);
                        $('#tablelist').width(documentListSize);
                        $('#tbody').width(documentListSize);
                        $('#midBlock').width(documentListSize);
                        $('#topBlock').width(documentListSize);
                        $('#btmBlock').width(documentListSize);
                        $('.document').width(documentListSize);
                    }
                };
                ExplorerListView.prototype.onResizerMouseDown = function (event) {
                    if (event.which !== 1) {
                        return;
                    }
                    var $currentSelected = $(event.currentTarget).parent();
                    this.resizeInfo = {
                        $currentSelected: $currentSelected,
                        $span: $currentSelected.find('span'),
                        $img: $currentSelected.find('.img'),
                        $resizer: $currentSelected.find('.resizer'),
                        startX: event.pageX,
                        origiWidth: $currentSelected.width(),
                    };
                    event.preventDefault();
                };
                ExplorerListView.prototype.onResizerMouseMove = function (event) {
                    if (!this.resizeInfo) {
                        return;
                    }
                    var op = this.resizeInfo;
                    var difference = (event.pageX - op.startX);
                    if (difference === 0) {
                        return;
                    }
                    var minWidth = op.$span.width() +
                        op.$img.width() +
                        op.$resizer.width() + 8;
                    var newWidth = op.origiWidth + difference;
                    if (newWidth < minWidth) {
                        return;
                    }
                    var totalWidth = 60;
                    var currentId = op.$currentSelected.attr('id');
                    $('#columns>.th').each(function (index, domEle) {
                        var loopId = $(domEle).attr('id');
                        if (loopId === currentId) {
                            totalWidth += newWidth;
                        }
                        else {
                            totalWidth += $(domEle).width();
                        }
                    });
                    if (this.$('#document-list').width() < totalWidth) {
                        this.$('#columns').width(totalWidth);
                        this.$('#tablelist').width(totalWidth);
                        this.$('#tbody').width(totalWidth);
                        this.$('#midBlock').width(totalWidth);
                        this.$('.document').width(totalWidth);
                        this.$('#topBlock').width(totalWidth);
                        this.$('#btmBlock').width(totalWidth);
                    }
                    op.$currentSelected.width(newWidth + 11);
                    var colName = op.$currentSelected.attr('col-name');
                    $('.' + colName).width(newWidth);
                    this.onWindowResize(event);
                };
                ExplorerListView.prototype.clickResizer = function (event) {
                    return false;
                };
                ExplorerListView.prototype.onResizerMouseUp = function (e) {
                    this.headerMouseDownId = null;
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        event.preventDefault();
                    }
                };
                ExplorerListView.prototype.resizeDocumentList = function (target) {
                    var total = 0;
                    $('#columns>.th').each(function (index, domEle) {
                        var domEleWidth = $(domEle).width();
                        var colName = $(domEle).attr('col-name');
                        total += domEleWidth;
                        if (colName === 'mark')
                            return;
                        target.find('.' + colName).width($(domEle).width() - 11);
                    });
                    $('#columns').width($('#tablelist').width());
                    var documentListSize = $('#document-list').width();
                    if (total > documentListSize) {
                        $('#columns').width(total);
                        $('#tablelist').width(total);
                        $('#tbody').width(total);
                        $('#topBlock').width(total);
                        $('#midBlock').width(total);
                        $('#btmBlock').width(total);
                        $('.document').width(total);
                    }
                };
                ExplorerListView.prototype.onDragStartRaw = function (ev) {
                    console.log('onDragStart: ', ev);
                    var entryId = this.getEntryIdByEv(ev);
                    if (typeof entryId !== 'string') {
                        return;
                    }
                    var model = Explorer.Status.viewStatus.getCollection().get(entryId);
                    var selections;
                    if (ALLOW_MULTIPLE_DRAG === true) {
                        selections = Explorer.Status.selectionStatus.getSelections();
                        if (selections.length === 0) {
                            selections = [model];
                            Explorer.Status.selectionStatus.updateSelections(selections.slice());
                        }
                        else {
                            var filteredArray = selections.filter(function (element, index, array) {
                                var filterId = element.get(Content.ATTR_NAME_ENTRY_ID);
                                return filterId === entryId;
                            });
                            if (filteredArray.length === 0) {
                                selections = [model];
                                Explorer.Status.selectionStatus.updateSelections(selections.slice());
                            }
                        }
                    }
                    else {
                        selections = [model];
                        Explorer.Status.selectionStatus.updateSelections(selections.slice());
                    }
                    var downloadUrl = Explorer.Handler.dragAndDropHandler.startDrag(selections, model);
                    var downloadFileName = Explorer.Handler.FileTransferUtils.replaceInvalidCharsInPath(model.getName());
                    ev.dataTransfer.effectAllowed = "all";
                    if (downloadUrl) {
                        ev.dataTransfer.dropEffect = "copy";
                        ev.dataTransfer.setData('DownloadURL', 'application/pdf:' + downloadFileName + ':' + downloadUrl);
                    }
                    else {
                        ev.dataTransfer.dropEffect = "none";
                    }
                    ev.stopImmediatePropagation();
                };
                ExplorerListView.prototype.getEntryIdByEv = function (ev) {
                    var entryId = ev.currentTarget.getAttribute('data-entry-id');
                    return entryId;
                };
                ExplorerListView.prototype.isDragFromExternal = function (ev) {
                    if (ev.originalEvent.dataTransfer.files.length > 0) {
                        return true;
                    }
                    return false;
                };
                ExplorerListView.prototype.onDragEnd = function (ev) {
                    console.log('onDragEnd: ', ev);
                    Explorer.Handler.dragAndDropHandler.endDrag();
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                };
                ExplorerListView.prototype.onDragEnter = function (ev) {
                    console.log('onDragEnter: ', ev);
                };
                ExplorerListView.prototype.onDragLeave = function (ev) {
                    console.log('onDragLeave: ', ev);
                };
                ExplorerListView.prototype.onDragExit = function (ev) {
                    console.log('onDragExit: ', ev);
                };
                ExplorerListView.prototype.onDragOverDocument = function (ev) {
                    var entryId = this.getEntryIdByEv(ev);
                    if (typeof entryId !== 'string') {
                        if (Explorer.Status.viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                            ev.originalEvent.dataTransfer.dropEffect = "none";
                        }
                        else if (Explorer.Handler.dragAndDropHandler.isDroppable(Explorer.Status.viewStatus.getFolderPath())) {
                            if (this.isDragFromExternal(ev)) {
                                ev.originalEvent.dataTransfer.dropEffect = "copy";
                            }
                            else {
                                ev.originalEvent.dataTransfer.dropEffect = "move";
                            }
                        }
                        else {
                            ev.originalEvent.dataTransfer.dropEffect = "none";
                        }
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var model = Explorer.Status.viewStatus.getCollection().get(entryId);
                    var folderPath = null;
                    if (model.isFolder()) {
                        folderPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    }
                    else {
                        if (Explorer.Status.viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER &&
                            this.isDragFromExternal(ev)) {
                            folderPath = viewStatus.getFolderPath();
                        }
                        else {
                            ev.originalEvent.dataTransfer.dropEffect = "none";
                            ev.stopImmediatePropagation();
                            ev.preventDefault();
                            return;
                        }
                    }
                    if (Explorer.Handler.dragAndDropHandler.isDroppable(folderPath)) {
                        if (this.isDragFromExternal(ev)) {
                            ev.originalEvent.dataTransfer.dropEffect = "copy";
                        }
                        else {
                            ev.originalEvent.dataTransfer.dropEffect = "move";
                        }
                        ev.preventDefault();
                    }
                    else {
                        ev.originalEvent.dataTransfer.dropEffect = "none";
                        ev.preventDefault();
                    }
                    ev.stopImmediatePropagation();
                };
                ExplorerListView.prototype.onDropDocument = function (ev) {
                    var _this = this;
                    console.log('onDropDocument: ', ev);
                    var entryId = this.getEntryIdByEv(ev);
                    if (typeof entryId !== 'string') {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var model = Explorer.Status.viewStatus.getCollection().get(entryId);
                    if (_.isUndefined(model) || _.isNull(model)) {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    if (!model.isFolder() &&
                        Explorer.Status.viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    if (!model.isFolder() && ev.originalEvent.dataTransfer.files.length === 0) {
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var filepaths = [];
                    for (var i = 0; i < ev.originalEvent.dataTransfer.files.length; i++) {
                        filepaths.push(ev.originalEvent.dataTransfer.files[i].path);
                    }
                    var folderPath = null;
                    if (model.isFolder()) {
                        folderPath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    }
                    else {
                        folderPath = viewStatus.getFolderPath();
                    }
                    var draggingEntites = Explorer.Handler.dragAndDropHandler.getDraggingEntities();
                    if (draggingEntites) {
                        for (var i_3 = 0; i_3 < draggingEntites.length; i_3++) {
                            var draggingModel = draggingEntites[i_3];
                            var draggingEntryId = draggingModel.get(Content.ATTR_NAME_ENTRY_ID);
                            var modelId = model.get(Content.ATTR_NAME_ENTRY_ID);
                            if (modelId === draggingEntryId) {
                                return;
                            }
                        }
                    }
                    if (this.syncPairExists && filepaths.length <= 0) {
                        Explorer.Handler.dragAndDropHandler.setCanClear(false);
                        var entryPaths = this.filterSyncFolderPathArray(draggingEntites);
                        if (entryPaths.length > 0) {
                            syncFolderPairStore.filterRemoteFolderContaninsPath(entryPaths, function (error, filterSyncFolderPair) {
                                if (!error) {
                                    if (filterSyncFolderPair.length > 0) {
                                        if (Explorer.Handler.syncHandler.isSyncRunning()) {
                                            var syncRunningError = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, '同期中には、リネーム・削除・移動できません。');
                                            View.Dialog.openOkDialog({
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.89', { errorCode: DPMW.mwe.genUserErrorCode(syncRunningError) }),
                                            }, function () { });
                                            return;
                                        }
                                        View.Dialog.openYesNoDialog({
                                            type: 'warning',
                                            title: $.i18n.t('dialog.confirm.resetAndExit.title'),
                                            message: $.i18n.t('dialog.confirm.releaseSyncSettingByOperation.message'),
                                        }, function (res) {
                                            if (res === 0) {
                                                _this.removeSyncPair(filterSyncFolderPair)
                                                    .then(function () {
                                                    _this.onDropDocumentIntelval(entryId, folderPath, filepaths);
                                                }).
                                                    catch(function (errorRemove) {
                                                    View.Dialog.openErrorDialog({
                                                        title: $.i18n.t('dialog.title.error'),
                                                        message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(errorRemove) })
                                                    }, function (response) {
                                                    });
                                                });
                                            }
                                            else {
                                                Explorer.Handler.dragAndDropHandler.setCanClear(true);
                                                if (Explorer.Handler.dragAndDropHandler.isDarggging()) {
                                                    Explorer.Handler.dragAndDropHandler.endDrag();
                                                }
                                                return;
                                            }
                                        });
                                    }
                                    else {
                                        _this.onDropDocumentIntelval(entryId, folderPath, filepaths);
                                    }
                                }
                                else {
                                    _this.onDropDocumentIntelval(entryId, folderPath, filepaths);
                                }
                            });
                        }
                        else {
                            this.onDropDocumentIntelval(entryId, folderPath, filepaths);
                        }
                    }
                    else {
                        this.onDropDocumentIntelval(entryId, folderPath, filepaths);
                    }
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                };
                ExplorerListView.prototype.onDropDocumentIntelval = function (entryId, folderPath, filepaths) {
                    Explorer.Handler.dragAndDropHandler.drop(entryId, folderPath, filepaths, {
                        success: function () {
                            Explorer.Handler.dragAndDropHandler.setCanClear(true);
                            if (Explorer.Handler.dragAndDropHandler.isDarggging()) {
                                Explorer.Handler.dragAndDropHandler.endDrag();
                            }
                        }, error: function (err) {
                            Explorer.Handler.dragAndDropHandler.setCanClear(true);
                            if (Explorer.Handler.dragAndDropHandler.isDarggging()) {
                                Explorer.Handler.dragAndDropHandler.endDrag();
                            }
                            var msgId;
                            if (typeof err === 'undefined') {
                                msgId = 'dialog.error.message.75';
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                            }
                            else {
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                var errCode = err.mwCode;
                                if (errCode === DPMW.mwe.E_MW_CANCELLED) {
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED) {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (errCode === DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT) {
                                    msgId = 'dialog.error.message.74';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 400 && responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 && responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 && responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.71';
                                        var dialogOptions_3 = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { folder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_3, function () { });
                                        return;
                                    }
                                    else if (statusCode === 404 && responseJSON.error_code === '40401') {
                                        msgId = 'dialog.error.message.69';
                                        var dialogOptions_4 = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { fileFolder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_4, function () { });
                                        return;
                                    }
                                    else if (statusCode === 408 && responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode === 507 && (responseJSON.error_code === '50701' || responseJSON.error_code === '50700')) {
                                        msgId = 'dialog.error.message.24';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                            }
                            var dialogOptions = {
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                            };
                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                        }
                    });
                };
                ExplorerListView.prototype.onDragOverList = function (ev) {
                    if (Explorer.Status.viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                        ev.originalEvent.dataTransfer.dropEffect = "none";
                    }
                    else if (Explorer.Handler.dragAndDropHandler.isDroppable(Explorer.Status.viewStatus.getFolderPath())) {
                        if (this.isDragFromExternal(ev)) {
                            ev.originalEvent.dataTransfer.dropEffect = "copy";
                        }
                        else {
                            ev.originalEvent.dataTransfer.dropEffect = "move";
                        }
                    }
                    else {
                        ev.originalEvent.dataTransfer.dropEffect = "none";
                    }
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                };
                ExplorerListView.prototype.onDropList = function (ev) {
                    console.log('onDropList: ', ev);
                    if (Explorer.Status.viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                        ev.stopImmediatePropagation();
                        return;
                    }
                    var filepaths = [];
                    for (var i = 0; i < ev.originalEvent.dataTransfer.files.length; i++) {
                        filepaths.push(ev.originalEvent.dataTransfer.files[i].path);
                    }
                    var folderPath = Explorer.Status.viewStatus.getFolderPath();
                    var folderId = Explorer.Status.viewStatus.getFolderId();
                    Explorer.Handler.dragAndDropHandler.drop(folderId, folderPath, filepaths, {
                        success: function () {
                        }, error: function (err) {
                            var msgId;
                            if (typeof err === 'undefined') {
                                msgId = 'dialog.error.message.75';
                                err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                            }
                            else {
                                var responseJSON = err.cause;
                                var statusCode = err.mwWebApiResCode;
                                var errCode = err.mwCode;
                                if (errCode === DPMW.mwe.E_MW_CANCELLED) {
                                    return;
                                }
                                else if (errCode === DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED) {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (errCode === DPMW.mwe.E_MW_UO_SRC_NO_VALID_CONTENT) {
                                    msgId = 'dialog.error.message.74';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                                    if (statusCode === 400 && responseJSON.error_code === '40001') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 && responseJSON.error_code === '40006') {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode === 400 && responseJSON.error_code === '40012') {
                                        msgId = 'dialog.error.message.71';
                                        var dialogOptions_5 = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { folder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_5, function () { });
                                        return;
                                    }
                                    else if (statusCode === 404 && responseJSON.error_code === '40401') {
                                        msgId = 'dialog.error.message.69';
                                        var dialogOptions_6 = {
                                            title: $.i18n.t('dialog.title.error'),
                                            message: $.i18n.t(msgId, { fileFolder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                        };
                                        DPMW.View.Dialog.openErrorDialog(dialogOptions_6, function () { });
                                        return;
                                    }
                                    else if (statusCode === 408 && responseJSON.error_code === '40800') {
                                        msgId = 'dialog.error.message.72';
                                    }
                                    else if (statusCode === 507 && (responseJSON.error_code === '50701' || responseJSON.error_code === '50700')) {
                                        msgId = 'dialog.error.message.24';
                                    }
                                    else if (statusCode >= 400 && statusCode < 500) {
                                        msgId = 'dialog.error.message.75';
                                    }
                                    else if (statusCode >= 500 && statusCode < 600) {
                                        msgId = 'dialog.error.message.3';
                                    }
                                    else {
                                        msgId = 'dialog.error.message.65';
                                    }
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                                    msgId = 'dialog.error.message.75';
                                }
                                else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                                    msgId = 'dialog.error.message.65';
                                }
                                else {
                                    msgId = 'dialog.error.message.75';
                                }
                            }
                            var dialogOptions = {
                                title: $.i18n.t('dialog.title.error'),
                                message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                            };
                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                        }
                    });
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                };
                ExplorerListView.prototype.onDragExternalError = function (err) {
                    var msgId;
                    if (typeof err === 'undefined') {
                        msgId = 'dialog.error.message.75';
                        err = DPMW.mwe.genError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error object does not passed');
                    }
                    else {
                        var responseJSON = err.cause;
                        var statusCode = err.mwWebApiResCode;
                        var errCode = err.mwCode;
                        if (errCode === DPMW.mwe.E_MW_UO_DEST_NOT_ALLOWED) {
                            msgId = 'dialog.error.message.75';
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS) {
                            if (statusCode === 400 && responseJSON.error_code === '40001') {
                                msgId = 'dialog.error.message.75';
                            }
                            else if (statusCode === 400 && responseJSON.error_code === '40006') {
                                msgId = 'dialog.error.message.75';
                            }
                            else if (statusCode === 400 && responseJSON.error_code === '40012') {
                                msgId = 'dialog.error.message.71';
                                var dialogOptions_7 = {
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { folder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                };
                                DPMW.View.Dialog.openErrorDialog(dialogOptions_7, function () { });
                                return;
                            }
                            else if (statusCode === 404 && responseJSON.error_code === '40401') {
                                msgId = 'dialog.error.message.69';
                                var dialogOptions_8 = {
                                    title: $.i18n.t('dialog.title.error'),
                                    message: $.i18n.t(msgId, { fileFolder: err.mwTargetName, errorCode: DPMW.mwe.genUserErrorCode(err) })
                                };
                                DPMW.View.Dialog.openErrorDialog(dialogOptions_8, function () { });
                                return;
                            }
                            else if (statusCode === 408 && responseJSON.error_code === '40800') {
                                msgId = 'dialog.error.message.72';
                            }
                            else if (statusCode === 507 && (responseJSON.error_code === '50701' || responseJSON.error_code === '50700')) {
                                msgId = 'dialog.error.message.24';
                            }
                            else if (statusCode >= 400 && statusCode < 500) {
                                msgId = 'dialog.error.message.75';
                            }
                            else if (statusCode >= 500 && statusCode < 600) {
                                msgId = 'dialog.error.message.3';
                            }
                            else {
                                msgId = 'dialog.error.message.65';
                            }
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            msgId = 'dialog.error.message.75';
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR) {
                            msgId = 'dialog.error.message.65';
                        }
                        else {
                            msgId = 'dialog.error.message.75';
                        }
                    }
                    var dialogOptions = {
                        title: $.i18n.t('dialog.title.error'),
                        message: $.i18n.t(msgId, { errorCode: DPMW.mwe.genUserErrorCode(err) })
                    };
                    DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                };
                ExplorerListView.prototype.showWaitingIcon = function (show) {
                    if (show) {
                        this.$('#list-no-data').hide();
                        this.$('#list-view-waitting-icon').show();
                    }
                    else {
                        this.$('#list-view-waitting-icon').hide();
                    }
                };
                return ExplorerListView;
            }(Backbone.View));
            Explorer.ExplorerListView = ExplorerListView;
            var Block;
            (function (Block) {
                Block[Block["topBlock"] = 0] = "topBlock";
                Block[Block["midBlock"] = 1] = "midBlock";
                Block[Block["btmBlock"] = 2] = "btmBlock";
            })(Block || (Block = {}));
            var rowHeight = 40;
            var ALLOW_MULTIPLE_DRAG = false;
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerListView.js.map