var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var selectProfileManagerMenu = function () {
    if (process) {
        process.env.MW_PROFILE_MANAGER_MENU_SELECTED = 'SELECTED';
    }
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
            var subWindowHandler = DPMW.View.Explorer.Handler.subWindowHandler;
            var fileTransferHandler = DPMW.View.Explorer.Handler.fileTransferHandler;
            var fileManageHandler = DPMW.View.Explorer.Handler.fileManageHandler;
            var clipboardHandler = DPMW.View.Explorer.Handler.clipboardHandler;
            var softwareUpdateHandler = DPMW.View.Explorer.Handler.softwareUpdateHandler;
            var syncHandler = DPMW.View.Explorer.Handler.syncHandler;
            var DiffType = DPMW.View.Explorer.Handler.DiffType;
            var syncFolderPairStore = DPMW.Model.FolderSync.syncFolderPairStore;
            var ExplorerMenu = (function (_super) {
                __extends(ExplorerMenu, _super);
                function ExplorerMenu() {
                    _super.call(this);
                    this.initializedForCurrentDevice_ = false;
                    this.electron = require('electron');
                    this.curWin = this.electron.remote.getCurrentWindow();
                    var Menu = this.electron.remote.Menu;
                    var MenuItem = this.electron.remote.MenuItem;
                    this.SEPARATOR = require('path').sep;
                    switch (process.platform) {
                        case 'win32':
                            this.win32DisconnectedMenu = Menu.buildFromTemplate(WIN32_MAIN_MENU_DISCONNECTED_TEMPLATE);
                            this.win32ConnectedMenu = null;
                            this.setWin32MainWindowMenu();
                            this.curWin.setMenuBarVisibility(true);
                            break;
                        case 'darwin':
                            this.MacDialogMenu = Menu.buildFromTemplate(MAC_DIALOG_MENU_TEMPLATE);
                            this.MacMainMenuDisconnected = Menu.buildFromTemplate(MAC_MAIN_MENU_DISCONNECTED_TEMPLATE);
                            this.MacMainMenuConnectedTextFocused = null;
                            this.MacMainMenuConnectedTextUnfocused = null;
                            this.listenTo(this, 'SubWindowOpenCalled', this.changeMenu);
                            this.listenTo(this, 'SubWindowClosed', this.changeMenu);
                            this.setMacApplicationMenu();
                            break;
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                    Menu = null;
                    MenuItem = null;
                }
                ExplorerMenu.prototype.changeMenu = function () {
                    switch (process.platform) {
                        case 'win32':
                            this.setWin32MainWindowMenu();
                            break;
                        case 'darwin':
                            this.setMacApplicationMenu();
                            break;
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.setWin32MainWindowMenu = function () {
                    if (this.initializedForCurrentDevice_ &&
                        DPMW.appCtrl.currentDevice &&
                        DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE)
                            === DPMW.Model.Device.VALUE_CONNECTION_STATE_CONNECTED) {
                        this.curWin.setMenu(this.win32ConnectedMenu);
                    }
                    else {
                        this.curWin.setMenu(this.win32DisconnectedMenu);
                    }
                };
                ExplorerMenu.prototype.setMacApplicationMenu = function () {
                    var Menu = this.electron.remote.Menu;
                    if (this.curWin.getChildWindows().length > 0) {
                        Menu.setApplicationMenu(this.MacDialogMenu);
                        return;
                    }
                    if (viewStatus.getSysDialogCount() > 0) {
                        Menu.setApplicationMenu(this.MacDialogMenu);
                        return;
                    }
                    if (this.initializedForCurrentDevice_ === false) {
                        Menu.setApplicationMenu(this.MacMainMenuDisconnected);
                        return;
                    }
                    if (!DPMW.appCtrl.currentDeviceId) {
                        Menu.setApplicationMenu(this.MacMainMenuDisconnected);
                        return;
                    }
                    if (!DPMW.appCtrl.currentDevice || DPMW.appCtrl.currentDevice.get(DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE)
                        === DPMW.Model.Device.VALUE_CONNECTION_STATE_DISCONNECTED) {
                        Menu.setApplicationMenu(this.MacMainMenuDisconnected);
                        return;
                    }
                    if (viewStatus.getMainWinTextFocusState() === true) {
                        Menu.setApplicationMenu(this.MacMainMenuConnectedTextFocused);
                    }
                    else {
                        Menu.setApplicationMenu(this.MacMainMenuConnectedTextUnfocused);
                    }
                    Menu = null;
                };
                ExplorerMenu.prototype.initMenuForCurrentDevice = function () {
                    var _this = this;
                    this.initializedForCurrentDevice_ = true;
                    this.stopListening();
                    this.listenTo(this, 'SubWindowOpenCalled', this.changeMenu);
                    this.listenTo(this, 'SubWindowClosed', this.changeMenu);
                    this.macAppMenu = null;
                    this.fileMenu = null;
                    this.editMenu = null;
                    this.macOSDefaultEditMenu = null;
                    this.displayMenu = null;
                    this.sortOrderSubMenu = null;
                    this.toolMenu = null;
                    this.helpMenu = null;
                    this.win32ConnectedMenu = null;
                    this.MacMainMenuConnectedTextFocused = null;
                    this.MacMainMenuConnectedTextUnfocused = null;
                    this.list = null;
                    var Menu = this.electron.remote.Menu;
                    var MenuItem = this.electron.remote.MenuItem;
                    this.fileMenu = new MenuItem(this.getFileMenuOptions());
                    this.editMenu = new MenuItem(this.getEditMenuOptions());
                    this.displayMenu = new MenuItem(this.getDisplayMenuOptions());
                    this.sortOrderSubMenu = this.displayMenu.submenu.items[2];
                    this.toolMenu = new MenuItem(this.getToolMenuOptions());
                    this.helpMenu = new MenuItem(this.getHelpMenuOptions());
                    switch (process.platform) {
                        case 'win32':
                            this.win32ConnectedMenu = new Menu();
                            this.win32ConnectedMenu.append(this.fileMenu);
                            this.win32ConnectedMenu.append(this.editMenu);
                            this.win32ConnectedMenu.append(this.displayMenu);
                            this.win32ConnectedMenu.append(this.toolMenu);
                            this.win32ConnectedMenu.append(this.helpMenu);
                            this.setWin32MainWindowMenu();
                            break;
                        case 'darwin':
                            this.macAppMenu = new MenuItem(this.getMacAppMenuOptions());
                            this.MacMainMenuConnectedTextUnfocused = new Menu();
                            this.MacMainMenuConnectedTextUnfocused.append(this.macAppMenu);
                            this.MacMainMenuConnectedTextUnfocused.append(this.fileMenu);
                            this.MacMainMenuConnectedTextUnfocused.append(this.editMenu);
                            this.MacMainMenuConnectedTextUnfocused.append(this.displayMenu);
                            this.MacMainMenuConnectedTextUnfocused.append(this.toolMenu);
                            this.MacMainMenuConnectedTextUnfocused.append(this.helpMenu);
                            this.MacMainMenuConnectedTextFocused = new Menu();
                            this.MacMainMenuConnectedTextFocused.append(this.macAppMenu);
                            this.MacMainMenuConnectedTextFocused.append(this.fileMenu);
                            this.macOSDefaultEditMenu = new MenuItem({
                                label: $.i18n.t('menu.category.edit'),
                                submenu: [
                                    { label: $.i18n.t('func.edit.cut'), role: 'cut' },
                                    { label: $.i18n.t('func.edit.copy'), role: 'copy' },
                                    { label: $.i18n.t('func.edit.paste'), role: 'paste' },
                                    { type: 'separator' },
                                    { label: $.i18n.t('func.edit.selectall'), role: 'selectall' },
                                ]
                            });
                            this.MacMainMenuConnectedTextFocused.append(this.macOSDefaultEditMenu);
                            this.MacMainMenuConnectedTextFocused.append(this.displayMenu);
                            this.MacMainMenuConnectedTextFocused.append(this.toolMenu);
                            this.MacMainMenuConnectedTextFocused.append(this.helpMenu);
                            this.setMacApplicationMenu();
                            this.listenTo(viewStatus, 'sysDialogCountChanged', this.changeMenu);
                            this.listenTo(viewStatus, 'MainWinTextFocusStateChanged', this.changeMenu);
                            break;
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                    Menu = null;
                    MenuItem = null;
                    this.listenTo(DPMW.appCtrl.currentDevice, 'change:' + DPMW.Model.Device.ATTR_NAME_CONNECTION_STATE, this.changeMenu);
                    this.listenTo(Explorer.Status.viewStatus, 'viewTypeChanged', this.setStatusCauseViewType);
                    this.listenTo(Explorer.Status.selectionStatus, 'selectionsChanged', function (entities) {
                        _this.setCopyCutEnable();
                        _this.setStatusCauseSelection(entities);
                        _this.setSyncButton();
                    });
                    this.listenTo(Explorer.Handler.clipboardHandler, 'pasteStarted', function () {
                        _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileDP.cut'), MenuItemProp.enabled, false);
                        _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileDP.copy'), MenuItemProp.enabled, false);
                        _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileDP.paste'), MenuItemProp.enabled, false);
                    });
                    this.listenTo(Explorer.Handler.clipboardHandler, 'pasteFailed', function () {
                        _this.setCopyCutEnable();
                        _this.setPastEnable();
                    });
                    this.listenTo(Explorer.Handler.clipboardHandler, 'pasteSucceeded', function () {
                        _this.setCopyCutEnable();
                        _this.setPastEnable();
                    });
                    this.listenTo(Explorer.Handler.clipboardHandler, 'clipboardChanged', function () {
                        _this.setPastEnable();
                    });
                    this.list = Explorer.Status.viewStatus.getCollection();
                    if (this.list) {
                        this.listenTo(this.list, 'sync', function () {
                            if (_this.list.lengthTotal > 0) {
                                _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileManage.selectAll'), MenuItemProp.enabled, true);
                            }
                            else {
                                _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileManage.selectAll'), MenuItemProp.enabled, false);
                            }
                        });
                    }
                    this.listenTo(Explorer.Status.viewStatus, 'collectionChanged', function () {
                        if (_this.list) {
                            _this.list.stopListening();
                        }
                        _this.list = Explorer.Status.viewStatus.getCollection();
                        _this.listenTo(_this.list, 'sync', function () {
                            if (_this.list.lengthTotal > 0) {
                                _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileManage.selectAll'), MenuItemProp.enabled, true);
                            }
                            else {
                                _this.setMenuItemProperty(_this.editMenu, $.i18n.t('func.fileManage.selectAll'), MenuItemProp.enabled, false);
                            }
                        });
                    });
                    this.listenTo(syncHandler, 'syncAllStart', function () {
                        _this.onSyncAllStarted();
                    });
                    this.listenTo(syncHandler, 'syncAllSucceed', function () {
                        _this.onSyncAllFinish();
                    });
                    this.listenTo(syncHandler, 'syncAllFailed', function () {
                        _this.onSyncAllFinish();
                    });
                    this.listenTo(syncFolderPairStore, 'syncFolderPairChanged', this.onSyncFolderPairChanged);
                    syncFolderPairStore.getFolderPairs(function (error, pairs) {
                        if (!error) {
                            _this.syncPairExists = pairs.length > 0;
                        }
                        else {
                            _this.syncPairExists = false;
                        }
                        _this.setSyncButton();
                    });
                    this.listenTo(viewStatus, 'sortOrderChanged', this.setSortOrderSubMenu);
                };
                ExplorerMenu.prototype.onSyncFolderPairChanged = function (type, changeFile, syncStillLeft) {
                    this.syncPairExists = syncStillLeft;
                    this.setSyncButton();
                };
                ExplorerMenu.prototype.onSyncAllStarted = function () {
                    this.setSyncButton();
                };
                ExplorerMenu.prototype.onSyncAllFinish = function () {
                    this.setSyncButton();
                };
                ExplorerMenu.prototype.setSyncButton = function () {
                    var _this = this;
                    if (syncHandler.isSyncRunning()) {
                        this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.exec'), MenuItemProp.enabled, false);
                        this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.remove'), MenuItemProp.enabled, false);
                    }
                    else {
                        if (this.syncPairExists) {
                            this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.exec'), MenuItemProp.enabled, true);
                        }
                        else {
                            this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.exec'), MenuItemProp.enabled, false);
                        }
                        var selection = selectionStatus.getSelections();
                        if (selection.length === 1) {
                            var model = selection[0];
                            var type = model.get(Content.ATTR_NAME_ENTRY_TYPE);
                            if (type === Content.VALUE_ENTRY_TYPE_FOLDER) {
                                var pathArray_1 = [];
                                pathArray_1[0] = model.get(Content.ATTR_NAME_ENTRY_PATH);
                                syncFolderPairStore.filterSpecifiedPathIsRemoteFolderPath(pathArray_1, function (error, filteredPaths) {
                                    if (!error) {
                                        if (filteredPaths.length === 0) {
                                            syncFolderPairStore.filterRegisteredRemoteFolderPathContainsSpecifiedPath(pathArray_1, function (error, filteredPaths1) {
                                                if (!error) {
                                                    if (filteredPaths1.length === 0) {
                                                        _this.setMenuItemProperty(_this.toolMenu, $.i18n.t('func.sync.openDst'), MenuItemProp.enabled, false);
                                                        _this.setMenuItemProperty(_this.toolMenu, $.i18n.t('func.sync.remove'), MenuItemProp.enabled, false);
                                                    }
                                                    else {
                                                        _this.setMenuItemProperty(_this.toolMenu, $.i18n.t('func.sync.openDst'), MenuItemProp.enabled, true);
                                                        _this.setMenuItemProperty(_this.toolMenu, $.i18n.t('func.sync.remove'), MenuItemProp.enabled, true);
                                                    }
                                                }
                                                else {
                                                }
                                            });
                                        }
                                        else {
                                            _this.setMenuItemProperty(_this.toolMenu, $.i18n.t('func.sync.openDst'), MenuItemProp.enabled, true);
                                            _this.setMenuItemProperty(_this.toolMenu, $.i18n.t('func.sync.remove'), MenuItemProp.enabled, true);
                                        }
                                    }
                                });
                            }
                            else {
                                this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.openDst'), MenuItemProp.enabled, false);
                                this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.remove'), MenuItemProp.enabled, false);
                            }
                        }
                        else {
                            this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.openDst'), MenuItemProp.enabled, false);
                            this.setMenuItemProperty(this.toolMenu, $.i18n.t('func.sync.remove'), MenuItemProp.enabled, false);
                        }
                    }
                };
                ExplorerMenu.prototype.setAscDesc = function (isAsc) {
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.asc'), MenuItemProp.checked, isAsc);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.desc'), MenuItemProp.checked, !isAsc);
                };
                ExplorerMenu.prototype.clearSortOrderKey = function () {
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.file'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.title'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.author'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateModified'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateAdded'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateRead'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.size'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.asc'), MenuItemProp.checked, false);
                    this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.desc'), MenuItemProp.checked, false);
                };
                ExplorerMenu.prototype.setSortOrderSubMenu = function (sortOrder) {
                    if (sortOrder) {
                        this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.asc'), MenuItemProp.enabled, true);
                        this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.desc'), MenuItemProp.enabled, true);
                        this.clearSortOrderKey();
                        switch (sortOrder) {
                            case Content.ORDER_TYPE_ENTRY_NAME_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.file'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_ENTRY_NAME_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.file'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            case Content.ORDER_TYPE_TITLE_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.title'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_TITLE_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.title'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            case Content.ORDER_TYPE_AUTHOR_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.author'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_AUTHOR_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.author'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            case Content.ORDER_TYPE_MODIFIED_DATE_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateModified'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_MODIFIED_DATE_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateModified'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            case Content.ORDER_TYPE_CREATED_DATE_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateAdded'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_CREATED_DATE_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateAdded'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            case Content.ORDER_TYPE_READING_DATE_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateRead'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_READING_DATE_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.dateRead'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            case Content.ORDER_TYPE_FILE_SIZE_ASC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.size'), MenuItemProp.checked, true);
                                this.setAscDesc(true);
                                break;
                            case Content.ORDER_TYPE_FILE_SIZE_DESC:
                                this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('content.list.header.size'), MenuItemProp.checked, true);
                                this.setAscDesc(false);
                                break;
                            default:
                                throw new Error('Unknown sortOrder');
                        }
                    }
                    else {
                        this.clearSortOrderKey();
                        this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.asc'), MenuItemProp.enabled, false);
                        this.setMenuItemProperty(this.sortOrderSubMenu, $.i18n.t('func.view.sort.desc'), MenuItemProp.enabled, false);
                    }
                };
                ExplorerMenu.prototype.events = function () {
                    return {};
                };
                ExplorerMenu.prototype.setStatusCauseSelection = function (entities) {
                    if (entities && entities.length === 1) {
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.rename'), MenuItemProp.enabled, true);
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.open'), MenuItemProp.enabled, true);
                    }
                    else {
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.rename'), MenuItemProp.enabled, false);
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.open'), MenuItemProp.enabled, false);
                    }
                    if (entities && entities.length > 0) {
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.delete'), MenuItemProp.enabled, true);
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.import'), MenuItemProp.enabled, true);
                    }
                    else {
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.delete'), MenuItemProp.enabled, false);
                        this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileDP.import'), MenuItemProp.enabled, false);
                    }
                };
                ExplorerMenu.prototype.setCopyCutEnable = function () {
                    if (Explorer.Status.selectionStatus.getSelections().length > 0
                        && Explorer.Handler.clipboardHandler.isPasting() === false) {
                        this.setMenuItemProperty(this.editMenu, $.i18n.t('func.fileDP.cut'), MenuItemProp.enabled, true);
                        this.setMenuItemProperty(this.editMenu, $.i18n.t('func.fileDP.copy'), MenuItemProp.enabled, true);
                    }
                    else {
                        this.setMenuItemProperty(this.editMenu, $.i18n.t('func.fileDP.cut'), MenuItemProp.enabled, false);
                        this.setMenuItemProperty(this.editMenu, $.i18n.t('func.fileDP.copy'), MenuItemProp.enabled, false);
                    }
                };
                ExplorerMenu.prototype.setPastEnable = function () {
                    if (Explorer.Status.viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER
                        && Explorer.Handler.clipboardHandler.isEmpty() === false
                        && Explorer.Handler.clipboardHandler.isPasting() === false) {
                        this.setMenuItemProperty(this.editMenu, $.i18n.t('func.fileDP.paste'), MenuItemProp.enabled, true);
                    }
                    else {
                        this.setMenuItemProperty(this.editMenu, $.i18n.t('func.fileDP.paste'), MenuItemProp.enabled, false);
                    }
                };
                ExplorerMenu.prototype.setStatusCauseViewType = function (viewType) {
                    switch (viewType) {
                        case Explorer.VIEW_TYPE_FOLDER:
                            this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileManage.createFolder'), MenuItemProp.enabled, true);
                            this.setMenuItemProperty(this.displayMenu, $.i18n.t('func.view.folder'), MenuItemProp.checked, true);
                            this.setMenuItemProperty(this.displayMenu, $.i18n.t('func.view.document'), MenuItemProp.checked, false);
                            this.setPastEnable();
                            break;
                        case Explorer.VIEW_TYPE_DOCUMENTS:
                            this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileManage.createFolder'), MenuItemProp.enabled, false);
                            this.setMenuItemProperty(this.displayMenu, $.i18n.t('func.view.folder'), MenuItemProp.checked, false);
                            this.setMenuItemProperty(this.displayMenu, $.i18n.t('func.view.document'), MenuItemProp.checked, true);
                            this.setPastEnable();
                            break;
                        case Explorer.VIEW_TYPE_SEARCH_DOCUMENTS:
                        case Explorer.VIEW_TYPE_SEARCH_FOLDER:
                            this.setMenuItemProperty(this.fileMenu, $.i18n.t('func.fileManage.createFolder'), MenuItemProp.enabled, false);
                            this.setPastEnable();
                            break;
                        default:
                            throw new Error('Unknown ViewType');
                    }
                };
                ExplorerMenu.prototype.setMenuItemProperty = function (menuItem, label, prop, value) {
                    var items;
                    items = menuItem.submenu.items;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].label === label) {
                            switch (prop) {
                                case MenuItemProp.enabled:
                                    if (items[i].submenu) {
                                        var subItems = items[i].submenu.items;
                                        _.each(subItems, function (subItem, index, subItems) {
                                            subItem.enabled = value;
                                        });
                                    }
                                    items[i].enabled = value;
                                    return items[i];
                                case MenuItemProp.visible:
                                    items[i].visible = value;
                                    return items[i];
                                case MenuItemProp.checked:
                                    items[i].checked = value;
                                    return items[i];
                                default:
                                    throw new Error('Unknown MenuItem Property');
                            }
                        }
                    }
                };
                ExplorerMenu.prototype.chengeAppMenu = function (menu) {
                    var Menu = this.electron.remote.Menu;
                    Menu.setApplicationMenu(menu);
                };
                ExplorerMenu.prototype.getMacAppMenuOptions = function () {
                    switch (process.platform) {
                        case 'win32':
                            return null;
                        case 'darwin':
                            return {
                                label: $.i18n.t('app.name'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.app.about'),
                                        click: function () { Explorer.Handler.subWindowHandler.openWindowAbout(); },
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.config.manageProfile'),
                                        click: function (item, focusedWindow) {
                                            selectProfileManagerMenu();
                                            focusedWindow.close();
                                        }
                                    },
                                    {
                                        label: $.i18n.t('func.config.showConfig'),
                                        click: function () {
                                            Explorer.Handler.subWindowHandler.openWindowSetting();
                                        }
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.mac.hideMe'),
                                        role: 'hide',
                                    },
                                    {
                                        label: $.i18n.t('func.mac.hideOther'),
                                        role: 'hideothers',
                                    },
                                    { label: $.i18n.t('func.mac.displayAll'), },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.mac.quit'),
                                        click: function (item, focusedWindow) { focusedWindow.close(); },
                                    },
                                ]
                            };
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.getFileMenuOptions = function () {
                    switch (process.platform) {
                        case 'win32':
                            return {
                                label: $.i18n.t('menu.category.file'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.filePC.export'),
                                        click: this.exportFile,
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.fileManage.createFolder'),
                                        enabled: false,
                                        click: this.createFolder,
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.rename'),
                                        enabled: false,
                                        click: this.renameDocOrFolder.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.delete'),
                                        enabled: false,
                                        click: this.beforeDelete.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.open'),
                                        enabled: false,
                                        click: this.openDocOrFolder.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.import'),
                                        enabled: false,
                                        click: this.importFile,
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.app.quit'),
                                        click: function (item, focusedWindow) { focusedWindow.close(); },
                                    },
                                ]
                            };
                        case 'darwin':
                            return {
                                label: $.i18n.t('menu.category.file'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.filePC.export'),
                                        click: this.exportFile,
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.fileManage.createFolder'),
                                        enabled: false,
                                        click: this.createFolder,
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.rename'),
                                        enabled: false,
                                        click: this.renameDocOrFolder.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.delete'),
                                        enabled: false,
                                        click: this.beforeDelete.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.open'),
                                        enabled: false,
                                        click: this.openDocOrFolder.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.import'),
                                        enabled: false,
                                        click: this.importFile,
                                    },
                                ]
                            };
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.getEditMenuOptions = function () {
                    switch (process.platform) {
                        case 'win32':
                            return {
                                label: $.i18n.t('menu.category.edit'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.fileDP.cut'),
                                        enabled: false,
                                        click: function () {
                                            Explorer.Handler.clipboardHandler.cut(Explorer.Status.selectionStatus.getSelections());
                                        }
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.copy'),
                                        enabled: false,
                                        click: function () {
                                            Explorer.Handler.clipboardHandler.copy(Explorer.Status.selectionStatus.getSelections());
                                        }
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.paste'),
                                        enabled: false,
                                        click: this.paste.bind(this),
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.fileManage.selectAll'),
                                        enabled: false,
                                        click: this.selectAll,
                                    },
                                ]
                            };
                        case 'darwin':
                            return {
                                label: $.i18n.t('menu.category.edit'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.fileDP.cut'),
                                        enabled: false,
                                        click: function () {
                                            Explorer.Handler.clipboardHandler.cut(Explorer.Status.selectionStatus.getSelections());
                                        }
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.copy'),
                                        enabled: false,
                                        click: function () {
                                            Explorer.Handler.clipboardHandler.copy(Explorer.Status.selectionStatus.getSelections());
                                        }
                                    },
                                    {
                                        label: $.i18n.t('func.fileDP.paste'),
                                        enabled: false,
                                        click: this.paste.bind(this),
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.fileManage.selectAll'),
                                        enabled: false,
                                        click: this.selectAll,
                                    },
                                ]
                            };
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.getDisplayMenuOptions = function () {
                    switch (process.platform) {
                        case 'win32':
                            return {
                                label: $.i18n.t('menu.category.display'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.view.folder'),
                                        type: 'checkbox',
                                        checked: false,
                                        click: this.showFolderView,
                                    },
                                    {
                                        label: $.i18n.t('func.view.document'),
                                        type: 'checkbox',
                                        checked: true,
                                        click: this.showDocumentView,
                                    },
                                    {
                                        label: $.i18n.t('func.view.sort.changeSortKey'),
                                        submenu: [
                                            { label: $.i18n.t('content.list.header.file'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.title'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.author'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.dateModified'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.dateAdded'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.dateRead'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.size'), type: 'checkbox', click: this.performSort },
                                            { type: 'separator' },
                                            {
                                                label: $.i18n.t('func.view.sort.asc'),
                                                type: 'checkbox',
                                                enabled: false,
                                                checked: false,
                                                click: this.performSort
                                            },
                                            {
                                                label: $.i18n.t('func.view.sort.desc'),
                                                type: 'checkbox',
                                                enabled: false,
                                                checked: false,
                                                click: this.performSort
                                            },
                                        ]
                                    },
                                    {
                                        label: $.i18n.t('func.view.refresh'),
                                        click: this.performRefesh,
                                    },
                                ]
                            };
                        case 'darwin':
                            return {
                                label: $.i18n.t('menu.category.display'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.view.folder'),
                                        type: 'checkbox',
                                        checked: false,
                                        click: this.showFolderView,
                                    },
                                    {
                                        label: $.i18n.t('func.view.document'),
                                        type: 'checkbox',
                                        checked: true,
                                        click: this.showDocumentView,
                                    },
                                    {
                                        label: $.i18n.t('func.view.sort.changeSortKey'),
                                        submenu: [
                                            { label: $.i18n.t('content.list.header.file'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.title'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.author'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.dateModified'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.dateAdded'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.dateRead'), type: 'checkbox', click: this.performSort },
                                            { label: $.i18n.t('content.list.header.size'), type: 'checkbox', click: this.performSort },
                                            { type: 'separator' },
                                            {
                                                label: $.i18n.t('func.view.sort.asc'),
                                                type: 'checkbox',
                                                enabled: false,
                                                checked: false,
                                                click: this.performSort
                                            },
                                            {
                                                label: $.i18n.t('func.view.sort.desc'),
                                                type: 'checkbox',
                                                enabled: false,
                                                checked: false,
                                                click: this.performSort
                                            },
                                        ]
                                    },
                                    {
                                        label: $.i18n.t('func.view.refresh'),
                                        click: this.performRefesh,
                                    },
                                ]
                            };
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.getToolMenuOptions = function () {
                    switch (process.platform) {
                        case 'win32':
                            return {
                                label: $.i18n.t('menu.category.tool'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.dp.externalOutput'),
                                        click: this.openExternalOutput.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.exec'),
                                        click: this.syncAllPairs.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.add'),
                                        click: this.syncAdd.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.openDst'),
                                        click: this.openSyncLocalPath.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.remove'),
                                        click: this.syncRemove.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.config.manageProfile'),
                                        click: function (item, focusedWindow) {
                                            selectProfileManagerMenu();
                                            focusedWindow.close();
                                        }
                                    },
                                    {
                                        label: $.i18n.t('func.config.showConfig'),
                                        click: function () {
                                            Explorer.Handler.subWindowHandler.openWindowSetting();
                                        }
                                    },
                                ]
                            };
                        case 'darwin':
                            return {
                                label: $.i18n.t('menu.category.tool'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.dp.externalOutput'),
                                        click: this.openExternalOutput.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.exec'),
                                        click: this.syncAllPairs.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.add'),
                                        click: this.syncAdd.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.openDst'),
                                        click: this.openSyncLocalPath.bind(this),
                                    },
                                    {
                                        label: $.i18n.t('func.sync.remove'),
                                        click: this.syncRemove.bind(this),
                                    },
                                ]
                            };
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.getHelpMenuOptions = function () {
                    var me = this;
                    switch (process.platform) {
                        case 'win32':
                            return {
                                label: $.i18n.t('menu.category.help'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.app.softwareUpdate'),
                                        click: function () {

                                            softwareUpdateHandler.startSoftwareUpdate();
                                        },
                                    },
                                    {
                                        label: $.i18n.t('func.app.onlineHelp'),
                                        click: function () { Explorer.Handler.subWindowHandler.openHelpGuide(); },
                                    },
                                    {
                                        label: $.i18n.t('func.app.launchSupportSite'),
                                        click: function () { Explorer.Handler.subWindowHandler.openHelpSupport(); },
                                    },
                                    { type: 'separator' },
                                    {
                                        label: $.i18n.t('func.app.about'),
                                        click: function () { Explorer.Handler.subWindowHandler.openWindowAbout(); },
                                    },
                                ]
                            };
                        case 'darwin':
                            return {
                                label: $.i18n.t('menu.category.help'),
                                submenu: [
                                    {
                                        label: $.i18n.t('func.app.softwareUpdate'),
                                        click: function () {
                                            softwareUpdateHandler.startSoftwareUpdate();
                                        },
                                    },
                                    {
                                        label: $.i18n.t('func.app.onlineHelp'),
                                        click: function () { Explorer.Handler.subWindowHandler.openHelpGuide(); },
                                    },
                                    {
                                        label: $.i18n.t('func.app.launchSupportSite'),
                                        click: function () { Explorer.Handler.subWindowHandler.openHelpSupport(); },
                                    },
                                ]
                            };
                        default:
                            throw new Error('The platform "' + process.platform + '" is not supported.');
                    }
                };
                ExplorerMenu.prototype.onFetchError = function (ModelOrCollection, response, options) {
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
                    }, function (response) { });
                };
                ExplorerMenu.prototype.syncAdd = function () {
                    var _this = this;
                    var selections = selectionStatus.getSelections();
                    if (selections.length !== 1) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.syncSettingCondition.title'),
                            message: $.i18n.t('dialog.notice.syncSettingCondition.message'),
                        }, function (response) { });
                        return;
                    }
                    if (!selections[0].isFolder()) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.syncSettingCondition.title'),
                            message: $.i18n.t('dialog.notice.syncSettingCondition.message'),
                        }, function (response) { });
                        return;
                    }
                    if (syncHandler.isSyncRunning()) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.notice.syncAddSyncing.title'),
                            message: $.i18n.t('dialog.notice.syncAddSyncing.message'),
                        }, function (response) { });
                        return;
                    }
                    var model = selections[0];
                    var remotePath = model.get(Content.ATTR_NAME_ENTRY_PATH);
                    if (!this.syncPairExists) {
                        var dialogController = null;
                        var initInfo = new DPMW.View.Dialog.DialogInfo.DialogSyncIntroductionInfo();
                        var handler = {
                            closed: function () {
                                var dialog = require('electron').remote.dialog;
                                var remote = require('electron').remote;
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
                                    View.Dialog.openOkDialog({
                                        title: $.i18n.t('dialog.notice.syncAddMax.title'),
                                        message: $.i18n.t('dialog.notice.syncAddMax.message'),
                                    }, function (response) { });
                                }
                                else {
                                    var remotePathArray_1 = [];
                                    remotePathArray_1[0] = remotePath;
                                    syncFolderPairStore.filterSpecifiedPathIsRemoteFolderPath(remotePathArray_1, function (error, filteredPaths) {
                                        if (error) {
                                            var dialogOptions = {
                                                title: $.i18n.t('dialog.title.error'),
                                                message: $.i18n.t('dialog.error.message.75', { errorCode: DPMW.mwe.genUserErrorCode(error) })
                                            };
                                            DPMW.View.Dialog.openErrorDialog(dialogOptions, function () { });
                                            return;
                                        }
                                        if (filteredPaths.length > 0) {
                                            View.Dialog.openOkDialog({
                                                title: $.i18n.t('dialog.notice.syncAddDuplicate.title'),
                                                message: $.i18n.t('dialog.notice.syncAddDuplicate.message'),
                                            }, function (response) { });
                                            return;
                                        }
                                        syncFolderPairStore.filterRegisteredRemoteFolderPathContainsSpecifiedPath(remotePathArray_1, function (error, filteredPaths) {
                                            if (!error) {
                                                if (filteredPaths.length > 0) {
                                                    View.Dialog.openOkDialog({
                                                        title: $.i18n.t('dialog.notice.syncAddSyncSubfolder.title'),
                                                        message: $.i18n.t('dialog.notice.syncAddSyncSubfolder.message'),
                                                    }, function (response) { });
                                                }
                                                else {
                                                    syncFolderPairStore.
                                                        filterSpecifiedPathContainsRegisteredRemoteFolderPath(remotePathArray_1, function (error, filteredPaths1) {
                                                        if (!error) {
                                                            if (filteredPaths1.length > 0) {
                                                                View.Dialog.openOkDialog({
                                                                    title: $.i18n.t('dialog.notice.syncAddIncludeSyncFolder.title'),
                                                                    message: $.i18n.t('dialog.notice.syncAddIncludeSyncFolder.message'),
                                                                }, function (response) { });
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
                ExplorerMenu.prototype.syncAddIntenal = function (remotePath) {
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
                ExplorerMenu.prototype.syncRemove = function () {
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
                ExplorerMenu.prototype.openSyncLocalPath = function () {
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
                ExplorerMenu.prototype.syncAllPairs = function () {
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
                ExplorerMenu.prototype.showSyncErrorDailog = function () {
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
                ExplorerMenu.prototype.importFile = function () {
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
                ExplorerMenu.prototype.openDocOrFolder = function () {
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
                ExplorerMenu.prototype.downloadAndOpenDocument = function (srcDocEntry) {
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
                    });
                };
                ExplorerMenu.prototype.openPdfFile = function (filePath) {
                    var release = require('os').release();
                    if (process.platform === 'win32' && release.match(/^6\.[23](?:\.|$)/) !== null) {
                        var cp = require('child_process');
                        cp.exec('\"' + filePath + '\"');
                    }
                    else {
                        require('electron').shell.openItem(filePath);
                    }
                };
                ExplorerMenu.prototype.beforeDelete = function () {
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
                ExplorerMenu.prototype.deleteDocOrFolder = function (index) {
                    if (index == 1) {
                        return;
                    }
                    var selections = selectionStatus.getSelections();
                    this.deleteRecursively(selections.slice());
                };
                ExplorerMenu.prototype.removeSyncPair = function (filterSyncFolderPair) {
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
                ExplorerMenu.prototype.showConfirmDialog = function (msg, titile, callback) {
                    if (titile === void 0) { titile = 'Digital Papger Message'; }
                    View.Dialog.openYesNoDialog({
                        type: 'warning',
                        title: titile,
                        message: msg,
                    }, callback);
                };
                ExplorerMenu.prototype.deleteRecursively = function (selections) {
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
                                }, function (response) { });
                            }
                        });
                    }
                };
                ExplorerMenu.prototype.exportFile = function () {
                    if (viewStatus.getViewType() !== Explorer.VIEW_TYPE_FOLDER) {
                        View.Dialog.openOkDialog({
                            title: $.i18n.t('dialog.autoclose.exportOnDocView.title'),
                            message: $.i18n.t('dialog.autoclose.exportOnDocView.message'),
                        }, function (response) { });
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
                ExplorerMenu.prototype.renameDocOrFolder = function () {
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
                ExplorerMenu.prototype.renameDocOrFolderInterval = function (model, filterSyncFolderPair) {
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
                                                        msgId = 'dialog.error.message.65';
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
                                                msgId = 'dialog.error.message.65';
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
                ExplorerMenu.prototype.createFolder = function () {
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
                ExplorerMenu.prototype.selectAll = function () {
                    Explorer.Status.selectionStatus.updateSelections(Explorer.Status.viewStatus.getCollection().toArray());
                };
                ExplorerMenu.prototype.isDescendant = function (ancestor, descendant) {
                    if (typeof ancestor !== 'string' || typeof descendant !== 'string') {
                        throw new Error('Paramater  is invlalid.');
                    }
                    var ancestorPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(ancestor) + DPMW.Utils.PathUtils.SEPARATOR;
                    var descendantPath = DPMW.Utils.PathUtils.canonicalizeForRemoteFolderPath(descendant) + DPMW.Utils.PathUtils.SEPARATOR;
                    return descendantPath.indexOf(ancestorPath) === 0;
                };
                ExplorerMenu.prototype.paste = function () {
                    var _this = this;
                    if (Explorer.Status.viewStatus.getViewType() === Explorer.VIEW_TYPE_FOLDER
                        && !Explorer.Handler.clipboardHandler.isPasting()) {
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
                ExplorerMenu.prototype.pasteIntelval = function () {
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
                                    msgId = 'dialog.error.message.65';
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
                ExplorerMenu.prototype.filterSyncFolderPathArray = function (selections) {
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
                ExplorerMenu.prototype.performSort = function (item) {
                    var fetchParams = Explorer.Status.fetchStatus.getFetchParams();
                    fetchParams = fetchParams ? fetchParams : {};
                    var sortKey = viewStatus.getSortOrder();
                    switch (item.label) {
                        case $.i18n.t('content.list.header.file'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_ASC;
                            }
                            break;
                        case $.i18n.t('content.list.header.title'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_TITLE_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_TITLE_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_TITLE_ASC;
                            }
                            break;
                        case $.i18n.t('content.list.header.author'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_AUTHOR_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_AUTHOR_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_AUTHOR_ASC;
                            }
                            break;
                        case $.i18n.t('content.list.header.dateModified'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_ASC;
                            }
                            break;
                        case $.i18n.t('content.list.header.dateAdded'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_ASC;
                            }
                            break;
                        case $.i18n.t('content.list.header.dateRead'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_READING_DATE_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_READING_DATE_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_READING_DATE_ASC;
                            }
                            break;
                        case $.i18n.t('content.list.header.size'):
                            if (sortKey === DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_ASC) {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_DESC;
                            }
                            else {
                                sortKey = DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_ASC;
                            }
                            break;
                        case $.i18n.t('func.view.sort.asc'):
                            switch (sortKey) {
                                case DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_ASC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_TITLE_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_TITLE_ASC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_AUTHOR_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_AUTHOR_ASC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_ASC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_ASC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_READING_DATE_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_READING_DATE_ASC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_DESC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_ASC;
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case $.i18n.t('func.view.sort.desc'):
                            switch (sortKey) {
                                case DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_ENTRY_NAME_DESC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_TITLE_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_TITLE_DESC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_AUTHOR_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_AUTHOR_DESC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_MODIFIED_DATE_DESC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_CREATED_DATE_DESC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_READING_DATE_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_READING_DATE_DESC;
                                    break;
                                case DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_ASC:
                                    sortKey = DPMW.Model.Content.ORDER_TYPE_FILE_SIZE_DESC;
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            throw new Error('Unknown MenuItem');
                    }
                    viewStatus.setSortOrder(sortKey);
                    fetchParams.order_type = sortKey;
                    Explorer.Handler.fetchHandler.performFetchForNewStatus(fetchParams, {
                        success: function (modelOrCollection, response, options) {
                            console.log('sorted by ' + sortKey);
                        },
                        error: this.onFetchError,
                    });
                };
                ExplorerMenu.prototype.performRefesh = function () {
                    Explorer.Handler.fetchHandler.performFetch({
                        success: function (modelOrCollection, response, options) {
                            console.log('refresh success');
                        },
                        error: this.onFetchError,
                    });
                };
                ExplorerMenu.prototype.showFolderView = function (item) {
                    item.checked = true;
                    Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                    Explorer.Handler.fetchHandler.performFetch({
                        success: function (modelOrCollection, response, options) {
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
                ExplorerMenu.prototype.showDocumentView = function (item) {
                    item.checked = true;
                    Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                    Explorer.Handler.fetchHandler.performFetch({
                        success: function (modelOrCollection, response, options) {
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
                ExplorerMenu.prototype.getScreenShotFileName = function () {
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
                ExplorerMenu.prototype.takeScreenShot = function (item, focusedWindow) {
                    var dialog = require('electron').remote.dialog;
                    var fileName = this.getScreenShotFileName();
                    viewStatus.increaseSysDialogCount();
                    dialog.showSaveDialog(focusedWindow, {
                        defaultPath: fileName,
                        properties: ["openDirectory"],
                        filters: [
                            { name: 'Images', extensions: ['png'] }
                        ]
                    }, function (filename) {
                        viewStatus.decreaseSysDialogCount();
                        if (_.isUndefined(filename) || _.isNull(filename)) {
                            return;
                        }
                        Explorer.Handler.deviceHandler.takeScreenshot(filename, {
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
                ExplorerMenu.prototype.openExternalOutput = function () {
                    subWindowHandler.openExternalOutput();
                };
                return ExplorerMenu;
            }(Backbone.EventsAdopter));
            Explorer.ExplorerMenu = ExplorerMenu;
            var MenuItemProp;
            (function (MenuItemProp) {
                MenuItemProp[MenuItemProp["enabled"] = 0] = "enabled";
                MenuItemProp[MenuItemProp["visible"] = 1] = "visible";
                MenuItemProp[MenuItemProp["checked"] = 2] = "checked";
            })(MenuItemProp || (MenuItemProp = {}));
            var MAC_DIALOG_MENU_TEMPLATE = [
                {
                    label: $.i18n.t('app.name'),
                    submenu: [
                        {
                            label: $.i18n.t('func.app.about'),
                            click: function () { Explorer.Handler.subWindowHandler.openWindowAbout(); },
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.config.manageProfile'),
                            click: function (item, focusedWindow) {
                                selectProfileManagerMenu();
                                focusedWindow.close();
                            },
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.config.showConfig'),
                            click: function () {
                                Explorer.Handler.subWindowHandler.openWindowSetting();
                            },
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.mac.hideMe'),
                            role: 'hide',
                        },
                        {
                            label: $.i18n.t('func.mac.hideOther'),
                            role: 'hideothers',
                        },
                        { label: $.i18n.t('func.mac.displayAll'), },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.mac.quit'),
                            click: function (item, focusedWindow) { focusedWindow.close(); },
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.file'),
                    submenu: [
                        {
                            label: $.i18n.t('func.filePC.export'),
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.fileManage.createFolder'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.rename'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.delete'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.open'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.import'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.edit'),
                    submenu: [
                        { label: $.i18n.t('func.edit.cut'), role: 'cut' },
                        { label: $.i18n.t('func.edit.copy'), role: 'copy' },
                        { label: $.i18n.t('func.edit.paste'), role: 'paste' },
                        { type: 'separator' },
                        { label: $.i18n.t('func.edit.selectall'), role: 'selectall' }
                    ]
                },
                {
                    label: $.i18n.t('menu.category.display'),
                    submenu: [
                        {
                            label: $.i18n.t('func.view.folder'),
                            type: 'checkbox',
                            checked: false,
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.document'),
                            type: 'checkbox',
                            checked: false,
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.sort.changeSortKey'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.refresh'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.tool'),
                    submenu: [
                        {
                            label: $.i18n.t('func.dp.externalOutput'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.exec'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.add'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.openDst'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.remove'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.help'),
                    submenu: [
                        {
                            label: $.i18n.t('func.app.softwareUpdate'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.app.onlineHelp'),
                            click: function () { Explorer.Handler.subWindowHandler.openHelpGuide(); },
                        },
                        {
                            label: $.i18n.t('func.app.launchSupportSite'),
                            click: function () { Explorer.Handler.subWindowHandler.openHelpSupport(); },
                        },
                    ]
                }
            ];
            var MAC_MAIN_MENU_DISCONNECTED_TEMPLATE = [
                {
                    label: $.i18n.t('app.name'),
                    submenu: [
                        {
                            label: $.i18n.t('func.app.about'),
                            click: function () { Explorer.Handler.subWindowHandler.openWindowAbout(); },
                            enabled: true,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.config.manageProfile'),
                            click: function (item, focusedWindow) {
                                selectProfileManagerMenu();
                                focusedWindow.close();
                            }
                        },
                        {
                            label: $.i18n.t('func.config.showConfig'),
                            click: function () {
                                Explorer.Handler.subWindowHandler.openWindowSetting();
                            },
                            enabled: true,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.mac.hideMe'),
                            role: 'hide',
                        },
                        {
                            label: $.i18n.t('func.mac.hideOther'),
                            role: 'hideothers',
                        },
                        { label: $.i18n.t('func.mac.displayAll'), },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.mac.quit'),
                            click: function (item, focusedWindow) { focusedWindow.close(); },
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.file'),
                    submenu: [
                        {
                            label: $.i18n.t('func.filePC.export'),
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.fileManage.createFolder'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.rename'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.delete'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.open'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.import'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.edit'),
                    submenu: [
                        {
                            label: $.i18n.t('func.fileDP.cut'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.copy'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.paste'),
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.fileManage.selectAll'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.display'),
                    submenu: [
                        {
                            label: $.i18n.t('func.view.folder'),
                            type: 'checkbox',
                            checked: false,
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.document'),
                            type: 'checkbox',
                            checked: false,
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.sort.changeSortKey'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.refresh'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.tool'),
                    submenu: [
                        {
                            label: $.i18n.t('func.dp.externalOutput'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.exec'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.add'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.openDst'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.remove'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.help'),
                    submenu: [
                        {
                            label: $.i18n.t('func.app.softwareUpdate'),
                            enabled: true,
                            click: function () {
                                softwareUpdateHandler.startSoftwareUpdate();
                            },
                        },
                        {
                            label: $.i18n.t('func.app.onlineHelp'),
                            click: function () { Explorer.Handler.subWindowHandler.openHelpGuide(); },
                        },
                        {
                            label: $.i18n.t('func.app.launchSupportSite'),
                            click: function () { Explorer.Handler.subWindowHandler.openHelpSupport(); },
                        },
                    ]
                }
            ];
            var WIN32_MAIN_MENU_DISCONNECTED_TEMPLATE = [
                {
                    label: $.i18n.t('menu.category.file'),
                    submenu: [
                        {
                            label: $.i18n.t('func.filePC.export'),
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.fileManage.createFolder'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.rename'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.delete'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.open'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.import'),
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.app.quit'),
                            click: function (item, focusedWindow) { focusedWindow.close(); },
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.edit'),
                    submenu: [
                        {
                            label: $.i18n.t('func.fileDP.cut'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.copy'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.fileDP.paste'),
                            enabled: false,
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.fileManage.selectAll'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.display'),
                    submenu: [
                        {
                            label: $.i18n.t('func.view.folder'),
                            type: 'checkbox',
                            checked: false,
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.document'),
                            type: 'checkbox',
                            checked: false,
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.sort.changeSortKey'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.view.refresh'),
                            enabled: false,
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.tool'),
                    submenu: [
                        {
                            label: $.i18n.t('func.dp.externalOutput'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.exec'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.add'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.openDst'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.sync.remove'),
                            enabled: false,
                        },
                        {
                            label: $.i18n.t('func.config.manageProfile'),
                            click: function (item, focusedWindow) {
                                selectProfileManagerMenu();
                                focusedWindow.close();
                            }
                        },
                        {
                            label: $.i18n.t('func.config.showConfig'),
                            click: function () {
                                Explorer.Handler.subWindowHandler.openWindowSetting();
                            }
                        },
                    ]
                },
                {
                    label: $.i18n.t('menu.category.help'),
                    submenu: [
                        {
                            label: $.i18n.t('func.app.softwareUpdate'),
                            click: function () {
                                softwareUpdateHandler.startSoftwareUpdate();
                            },
                        },
                        {
                            label: $.i18n.t('func.app.onlineHelp'),
                            click: function () { Explorer.Handler.subWindowHandler.openHelpGuide(); },
                        },
                        {
                            label: $.i18n.t('func.app.launchSupportSite'),
                            click: function () { Explorer.Handler.subWindowHandler.openHelpSupport(); },
                        },
                        { type: 'separator' },
                        {
                            label: $.i18n.t('func.app.about'),
                            click: function () { Explorer.Handler.subWindowHandler.openWindowAbout(); },
                        },
                    ]
                }
            ];
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerMenu.js.map