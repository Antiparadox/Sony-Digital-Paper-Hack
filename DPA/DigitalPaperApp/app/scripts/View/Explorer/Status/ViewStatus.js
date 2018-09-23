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
            var Status;
            (function (Status) {
                var ViewStatus = (function (_super) {
                    __extends(ViewStatus, _super);
                    function ViewStatus() {
                        _super.call(this);
                        this.currentViewType_ = null;
                        this.currentFolderId_ = 'root';
                        this.currentFolderPath_ = 'Document';
                        this.mainWinTextFocusState_ = false;
                        this.sysDialogCount_ = 0;
                        this.currentCollection_ = null;
                        this.searchTarget_ = null;
                        this.sortOrder_ = null;
                    }
                    ViewStatus.prototype.changeViewType = function (viewType) {
                        if (viewType === this.currentViewType_) {
                            console.warn('viewType is not changed but changeViewType called.');
                            return;
                        }
                        this.currentViewType_ = viewType;
                        this.updateCollection_();
                        this.clearSortOrder();
                        this.trigger('viewTypeChanged', viewType);
                        this.trigger('collectionChanged', this.currentCollection_);
                    };
                    ViewStatus.prototype.changePathWhitFolderView = function (folderId, folderPath) {
                        if (typeof folderId !== 'string') {
                            throw new Error('folderId must be string');
                        }
                        if (typeof folderPath !== 'string') {
                            throw new Error('folderPath must be a string');
                        }
                        this.currentViewType_ = Explorer.VIEW_TYPE_FOLDER;
                        this.currentFolderId_ = folderId;
                        this.currentFolderPath_ = folderPath;
                        this.updateCollection_();
                        this.clearSortOrder();
                        this.trigger('viewTypeChanged', Explorer.VIEW_TYPE_FOLDER);
                        this.trigger('collectionChanged', this.currentCollection_);
                    };
                    ViewStatus.prototype.getViewType = function () {
                        return this.currentViewType_;
                    };
                    ViewStatus.prototype.changeFolder = function (folderId, folderPath) {
                        if (this.currentViewType_ !== Explorer.VIEW_TYPE_FOLDER) {
                            throw new Error('Current ViewType is not FOLDER');
                        }
                        if (typeof folderId !== 'string') {
                            throw new Error('folderId must be string');
                        }
                        if (typeof folderPath !== 'string') {
                            throw new Error('folderPath must be a string');
                        }
                        if (this.currentFolderId_ === folderId && this.currentFolderPath_ === folderPath) {
                            console.warn('folderId and folderPath is not changed but changeFolder is called');
                            return false;
                        }
                        this.currentFolderId_ = folderId;
                        this.currentFolderPath_ = folderPath;
                        this.updateCollection_();
                        this.trigger('folderChanged', folderId, folderPath);
                        this.trigger('collectionChanged', this.currentCollection_);
                        return true;
                    };
                    ViewStatus.prototype.getFolderId = function () {
                        if (this.currentViewType_ !== Explorer.VIEW_TYPE_FOLDER &&
                            this.currentViewType_ !== Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                            throw new Error('Current ViewType is not FOLDER');
                        }
                        return this.currentFolderId_;
                    };
                    ViewStatus.prototype.getFolderPath = function () {
                        if (this.currentViewType_ !== Explorer.VIEW_TYPE_FOLDER &&
                            this.currentViewType_ !== Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                            throw new Error('Current ViewType is not FOLDER');
                        }
                        return this.currentFolderPath_;
                    };
                    ViewStatus.prototype.getCollection = function () {
                        return this.currentCollection_;
                    };
                    ViewStatus.prototype.updateCollection_ = function () {
                        if (this.currentCollection_) {
                        }
                        var viewType = this.currentViewType_;
                        var device = DPMW.appCtrl.currentDevice;
                        if (!device) {
                            throw new Error('currentDevice is not exists');
                        }
                        var collection = null;
                        if (viewType === Explorer.VIEW_TYPE_DOCUMENTS) {
                            collection = device.getDocumentCollection();
                        }
                        else if (viewType === Explorer.VIEW_TYPE_FOLDER) {
                            collection = device.getFolderEntityCollection(this.currentFolderId_);
                        }
                        else if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS || viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                            collection = device.getSearchCollection();
                        }
                        else {
                            throw new Error('View type is wrong');
                        }
                        if (!collection) {
                            throw new Error('collection is null!');
                        }
                        if (this.currentCollection_) {
                            this.currentCollection_.release();
                        }
                        this.currentCollection_ = collection;
                    };
                    ViewStatus.prototype.setSearchTarget = function (target, keyword, annotationPattern, annotationType, entryType) {
                        if (target === 'document_meta' || target === 'document_body') {
                            if (typeof keyword !== 'string') {
                                throw new TypeError('keyword must be string, when searching for document_*.');
                            }
                            if (typeof annotationType === 'string') {
                                throw new TypeError('annotationType must not be string, when searching for document_*.');
                            }
                            if (typeof annotationPattern === 'string') {
                                throw new TypeError('annotationPattern must not be string, when searching for annotation_pattern.');
                            }
                        }
                        else if (target === 'annotation_pattern') {
                            if (typeof annotationType !== 'string') {
                                throw new TypeError('annotationType must be string, when searching for annotation_pattern.');
                            }
                            if (typeof annotationPattern !== 'string') {
                                throw new TypeError('annotationPattern must be string, when searching for annotation_pattern.');
                            }
                            if (typeof keyword === 'string') {
                                throw new TypeError('keyword must not be string, when searching for annotation_pattern.');
                            }
                        }
                        else {
                            throw new Error('target looks wrong value');
                        }
                        this.searchTarget_ = {
                            target: target,
                            keyword: keyword,
                            annotationPattern: annotationPattern,
                            annotationType: annotationType,
                            entryType: entryType };
                        this.trigger('searchTargetChanged', _.clone(this.searchTarget_));
                        return;
                    };
                    ViewStatus.prototype.clearSearchTarget = function () {
                        this.searchTarget_ = null;
                        this.trigger('searchTargetChanged', null);
                        return;
                    };
                    ViewStatus.prototype.getSearchTarget = function () {
                        if (this.searchTarget_ === null) {
                            return null;
                        }
                        return _.clone(this.searchTarget_);
                    };
                    ViewStatus.prototype.setSortOrder = function (orderType) {
                        if (typeof orderType !== 'string') {
                            throw new TypeError('orderType is wrong type');
                        }
                        this.sortOrder_ = orderType;
                        this.trigger('sortOrderChanged', this.sortOrder_);
                        return;
                    };
                    ViewStatus.prototype.clearSortOrder = function () {
                        this.sortOrder_ = null;
                        this.trigger('sortOrderChanged', null);
                        return;
                    };
                    ViewStatus.prototype.getSortOrder = function () {
                        if (this.sortOrder_ === null) {
                            return null;
                        }
                        return this.sortOrder_;
                    };
                    ViewStatus.prototype.reset = function () {
                        this.currentViewType_ = null;
                        if (this.currentCollection_) {
                            this.currentCollection_.release();
                            this.currentCollection_ = null;
                        }
                        this.currentFolderId_ = 'root';
                        this.currentFolderPath_ = 'Document';
                        this.searchTarget_ = null;
                        this.sortOrder_ = null;
                        this.mainWinTextFocusState_ = false;
                    };
                    ViewStatus.prototype.increaseSysDialogCount = function () {
                        this.sysDialogCount_ = this.sysDialogCount_ + 1;
                        this.trigger('sysDialogCountChanged', this.sysDialogCount_);
                    };
                    ViewStatus.prototype.decreaseSysDialogCount = function () {
                        this.sysDialogCount_ = this.sysDialogCount_ - 1;
                        this.trigger('sysDialogCountChanged', this.sysDialogCount_);
                    };
                    ViewStatus.prototype.getSysDialogCount = function () {
                        return this.sysDialogCount_;
                    };
                    ViewStatus.prototype.changeMainWinTextFocusState = function (focused) {
                        this.mainWinTextFocusState_ = focused;
                        this.trigger('MainWinTextFocusStateChanged', this.mainWinTextFocusState_);
                    };
                    ViewStatus.prototype.getMainWinTextFocusState = function () {
                        return this.mainWinTextFocusState_;
                    };
                    return ViewStatus;
                }(Backbone.EventsAdopter));
                Status.ViewStatus = ViewStatus;
                Status.viewStatus = new ViewStatus();
            })(Status = Explorer.Status || (Explorer.Status = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ViewStatus.js.map