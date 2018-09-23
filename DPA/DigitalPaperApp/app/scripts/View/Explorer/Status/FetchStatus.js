var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Status;
            (function (Status) {
                var FetchStatus = (function () {
                    function FetchStatus(viewStatus) {
                        this.fetchParams_ = null;
                        this.fetchTargetCollection_ = null;
                        this.viewStatus_ = viewStatus;
                    }
                    FetchStatus.prototype.updateDisplayOffset = function (displayOffset, displaySize) {
                        this.displayOffset_ = displayOffset;
                        this.displaySize_ = displaySize;
                    };
                    FetchStatus.prototype.getDisplayOffset = function () {
                        return this.displayOffset_;
                    };
                    FetchStatus.prototype.getDisplaySize = function () {
                        return this.displaySize_;
                    };
                    FetchStatus.prototype.preserveFetchParams = function (params) {
                        var fetchParams = null;
                        var viewType = this.viewStatus_.getViewType();
                        var targetCollection = this.viewStatus_.getCollection();
                        if (!targetCollection) {
                            throw new Error('currentCollection is not set.');
                        }
                        if (viewType === Explorer.VIEW_TYPE_DOCUMENTS) {
                            fetchParams = {
                                order_type: params.order_type
                            };
                        }
                        else if (viewType === Explorer.VIEW_TYPE_FOLDER) {
                            fetchParams = {
                                folder_id: params.folder_id,
                                order_type: params.order_type
                            };
                        }
                        else if (viewType === Explorer.VIEW_TYPE_SEARCH_DOCUMENTS) {
                            fetchParams = {
                                entry_type: params.entry_type,
                                search_target: params.search_target,
                                annotation_type: params.annotation_type,
                                search_keyword: params.search_keyword,
                                order_type: params.order_type
                            };
                        }
                        else if (viewType === Explorer.VIEW_TYPE_SEARCH_FOLDER) {
                            fetchParams = {
                                entry_type: params.entry_type,
                                search_target: params.search_target,
                                annotation_type: params.annotation_type,
                                origin_folder_id: params.origin_folder_id,
                                search_keyword: params.search_keyword,
                                order_type: params.order_type
                            };
                        }
                        this.fetchParams_ = fetchParams;
                        this.fetchTargetCollection_ = targetCollection;
                    };
                    FetchStatus.prototype.getFetchParams = function () {
                        if (this.viewStatus_.getCollection() !== this.fetchTargetCollection_) {
                            return null;
                        }
                        return this.fetchParams_;
                    };
                    FetchStatus.prototype.reset = function () {
                        this.displayOffset_ = 0;
                        this.displaySize_ = 0;
                        this.fetchParams_ = null;
                        this.fetchTargetCollection_ = null;
                    };
                    return FetchStatus;
                }());
                Status.FetchStatus = FetchStatus;
                Status.fetchStatus = new FetchStatus(Status.viewStatus);
            })(Status = Explorer.Status || (Explorer.Status = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FetchStatus.js.map