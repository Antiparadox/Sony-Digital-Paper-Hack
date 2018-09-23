var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var FetchHandler = (function () {
                    function FetchHandler(viewStatus, fetchStatus) {
                        this.viewStatus_ = viewStatus;
                        this.fetchStatus_ = fetchStatus;
                    }
                    FetchHandler.prototype.performFetchForUpdate = function (updatedFolderId, performFetchOptions) {
                        var _this = this;
                        switch (this.viewStatus_.getViewType()) {
                            case Explorer.VIEW_TYPE_DOCUMENTS:
                                this.performFetch(performFetchOptions);
                                break;
                            case Explorer.VIEW_TYPE_FOLDER:
                                if (updatedFolderId === this.viewStatus_.getFolderId()) {
                                    this.performFetch(performFetchOptions);
                                }
                                else {
                                    if (performFetchOptions && performFetchOptions.success) {
                                        performFetchOptions.success();
                                    }
                                }
                                break;
                            case Explorer.VIEW_TYPE_SEARCH_DOCUMENTS:
                                this.performFetch(performFetchOptions);
                                break;
                            case Explorer.VIEW_TYPE_SEARCH_FOLDER:
                                var search_folder_id = this.viewStatus_.getFolderId();
                                if (search_folder_id === DPMW.Model.Content.VALUE_ENTRY_ID_ROOT) {
                                    this.performFetch(performFetchOptions);
                                }
                                else if (search_folder_id === updatedFolderId) {
                                    this.performFetch(performFetchOptions);
                                }
                                else {
                                    var search_path_1 = this.viewStatus_.getFolderPath();
                                    var updatedFolder_1 = DPMW.appCtrl.currentDevice.getFolderModel(updatedFolderId);
                                    updatedFolder_1.fetch({
                                        success: function (modelOrCollection, response, options) {
                                            var updatedFolderPath = updatedFolder_1.get(DPMW.Model.Content.ATTR_NAME_ENTRY_PATH);
                                            updatedFolder_1.release();
                                            if (0 === updatedFolderPath.indexOf(search_path_1)) {
                                                _this.performFetch(performFetchOptions);
                                            }
                                            else {
                                                if (performFetchOptions && performFetchOptions.success) {
                                                    performFetchOptions.success(modelOrCollection, response, options);
                                                }
                                            }
                                        },
                                        error: function (modelOrCollection, jqxhr, options) {
                                            if (performFetchOptions && performFetchOptions.error) {
                                                performFetchOptions.error(modelOrCollection, jqxhr, options);
                                            }
                                            updatedFolder_1.release();
                                        }
                                    });
                                }
                                break;
                            default:
                                throw new Error('Unknown ViewType');
                        }
                    };
                    FetchHandler.prototype.performFetchForNewStatus = function (fetchParams, options) {
                        if (!fetchParams) {
                            throw new Error('fetchParams is indispensable');
                        }
                        var fetchOptions = this.fetchStatus_.getFetchParams();
                        fetchOptions = fetchOptions ? fetchOptions : {};
                        switch (this.viewStatus_.getViewType()) {
                            case Explorer.VIEW_TYPE_DOCUMENTS:
                                if (fetchParams.order_type) {
                                    fetchOptions.order_type = fetchParams.order_type;
                                }
                                break;
                            case Explorer.VIEW_TYPE_FOLDER:
                                if (fetchParams.folder_id) {
                                    fetchOptions.folder_id = fetchParams.folder_id;
                                }
                                if (fetchParams.order_type) {
                                    fetchOptions.order_type = fetchParams.order_type;
                                }
                                break;
                            case Explorer.VIEW_TYPE_SEARCH_DOCUMENTS:
                            case Explorer.VIEW_TYPE_SEARCH_FOLDER:
                                if (fetchParams.origin_folder_id) {
                                    fetchOptions.origin_folder_id = fetchParams.origin_folder_id;
                                }
                                if (fetchParams.entry_type) {
                                    fetchOptions.entry_type = fetchParams.entry_type;
                                }
                                if (fetchParams.search_target) {
                                    fetchOptions.search_target = fetchParams.search_target;
                                }
                                if (fetchParams.annotation_type) {
                                    fetchOptions.annotation_type = fetchParams.annotation_type;
                                }
                                if (fetchParams.search_keyword) {
                                    fetchOptions.search_keyword = fetchParams.search_keyword;
                                }
                                if (fetchParams.order_type) {
                                    fetchOptions.order_type = fetchParams.order_type;
                                }
                                break;
                            default:
                                throw new Error('Unknown ViewType');
                        }
                        this.fetchStatus_.preserveFetchParams(fetchOptions);
                        this.performFetch(options);
                    };
                    FetchHandler.prototype.performFetch = function (performFetchOptions) {
                        var _this = this;
                        this.timeStamp = Date.now();
                        var timeStamp_ = this.timeStamp;
                        var collection = this.viewStatus_.getCollection();
                        collection.reset();
                        var totalCount;
                        var blockArr;
                        var displayOffset = this.fetchStatus_.getDisplayOffset();
                        var displayBlockOffset = this.getBlockOffset(displayOffset);
                        var fetchOptions = {
                            argParams: this.fetchStatus_.getFetchParams(),
                            success: function (modelOrCollection, response, options) {
                                if (collection.lengthTotal > collection.length) {
                                    var acquiredBlock = {
                                        upperBound: displayBlockOffset,
                                        lowerBound: displayBlockOffset,
                                    };
                                    _this.partialFetch(timeStamp_, acquiredBlock, performFetchOptions);
                                }
                                else {
                                    if (performFetchOptions && performFetchOptions.success) {
                                        performFetchOptions.success(modelOrCollection, response, options);
                                    }
                                }
                            },
                            error: function (modelOrCollection, response, options) {
                                if (performFetchOptions && performFetchOptions.error) {
                                    performFetchOptions.error(modelOrCollection, response, options);
                                }
                            }
                        };
                        collection.fetchPartial(displayBlockOffset, Handler.partialSize, fetchOptions);
                    };
                    FetchHandler.prototype.getBlockNum = function (offset) {
                        return Math.floor(offset / Handler.partialSize);
                    };
                    FetchHandler.prototype.getBlockOffset = function (index) {
                        return this.getBlockNum(index) * Handler.partialSize;
                    };
                    FetchHandler.prototype.searchTargetBlock = function (acquiredBlock) {
                        var targetBlockOffset;
                        var displayOffset = this.fetchStatus_.getDisplayOffset();
                        var displayBlockOffset = this.getBlockOffset(displayOffset);
                        var collection = this.viewStatus_.getCollection();
                        var totalCount = collection.lengthTotal;
                        var targetDirection;
                        var upperBound = acquiredBlock.upperBound;
                        var lowerBound = acquiredBlock.lowerBound;
                        if (upperBound === 0) {
                            targetBlockOffset = this.searchUnAquiredBlockForDirection(Direction.lower, lowerBound);
                        }
                        else if (lowerBound + Handler.partialSize >= totalCount) {
                            targetBlockOffset = this.searchUnAquiredBlockForDirection(Direction.upper, upperBound);
                        }
                        else {
                            if (displayBlockOffset - upperBound < lowerBound - displayBlockOffset) {
                                targetBlockOffset = this.searchUnAquiredBlockForDirection(Direction.upper, upperBound);
                                if (targetBlockOffset === null) {
                                    targetBlockOffset = this.searchUnAquiredBlockForDirection(Direction.lower, lowerBound);
                                }
                            }
                            else {
                                targetBlockOffset = this.searchUnAquiredBlockForDirection(Direction.lower, lowerBound);
                                if (targetBlockOffset === null) {
                                    targetBlockOffset = this.searchUnAquiredBlockForDirection(Direction.upper, upperBound);
                                }
                            }
                        }
                        return targetBlockOffset;
                    };
                    FetchHandler.prototype.searchUnAquiredBlockForDirection = function (direction, offset) {
                        var collection = this.viewStatus_.getCollection();
                        var totalCount = collection.lengthTotal;
                        var index;
                        if (direction === Direction.lower) {
                            index = offset + Handler.partialSize;
                            while (index < totalCount) {
                                if (collection.atOrdered(index) === null) {
                                    break;
                                }
                                index += Handler.partialSize;
                            }
                        }
                        else {
                            index = offset - Handler.partialSize;
                            while (index >= 0) {
                                if (collection.atOrdered(index) === null) {
                                    break;
                                }
                                index -= Handler.partialSize;
                            }
                        }
                        if (index >= 0 && index < totalCount) {
                            return index;
                        }
                        else {
                            return null;
                        }
                    };
                    FetchHandler.prototype.getAquiredBlock = function () {
                        var displayOffset = this.fetchStatus_.getDisplayOffset();
                        var displayBlockOffset = this.getBlockOffset(displayOffset);
                        var collection = this.viewStatus_.getCollection();
                        var totalCount = collection.lengthTotal;
                        var upperBound;
                        var lowerBound;
                        var next;
                        upperBound = displayBlockOffset;
                        next = displayBlockOffset - Handler.partialSize;
                        if (next < 0) {
                            upperBound = 0;
                        }
                        else {
                            while (next >= 0) {
                                if (collection.atOrdered(next) === null) {
                                    break;
                                }
                                upperBound = next;
                                next -= Handler.partialSize;
                            }
                        }
                        lowerBound = displayBlockOffset;
                        next = displayBlockOffset + Handler.partialSize;
                        if (next >= totalCount) {
                            lowerBound = displayBlockOffset;
                        }
                        else {
                            while (next < totalCount) {
                                if (collection.atOrdered(next) === null) {
                                    break;
                                }
                                lowerBound = next;
                                next += Handler.partialSize;
                            }
                        }
                        return {
                            upperBound: upperBound,
                            lowerBound: lowerBound,
                        };
                    };
                    FetchHandler.prototype.partialFetch = function (timeStamp, acquiredBlock, performFetchOptions) {
                        var _this = this;
                        if (timeStamp !== this.timeStamp) {
                            if (performFetchOptions && performFetchOptions.success) {
                                performFetchOptions.success();
                            }
                            return;
                        }
                        var acquiredBlock_ = acquiredBlock;
                        var collection = this.viewStatus_.getCollection();
                        var displayOffset = this.fetchStatus_.getDisplayOffset();
                        if (displayOffset >= collection.lengthTotal) {
                            displayOffset = 0;
                        }
                        var displayBlockOffset = this.getBlockOffset(displayOffset);
                        var targetBlockOffset;
                        if (displayBlockOffset >= acquiredBlock_.upperBound
                            && displayBlockOffset <= acquiredBlock_.lowerBound) {
                            targetBlockOffset = this.searchTargetBlock(acquiredBlock_);
                        }
                        else {
                            if (collection.atOrdered(displayBlockOffset) === null) {
                                targetBlockOffset = displayBlockOffset;
                                acquiredBlock_ = null;
                            }
                            else {
                                acquiredBlock_ = this.getAquiredBlock();
                                targetBlockOffset = this.searchTargetBlock(acquiredBlock_);
                            }
                        }
                        if (targetBlockOffset === null) {
                            if (performFetchOptions && performFetchOptions.success) {
                                performFetchOptions.success(collection, null, null);
                            }
                            return;
                        }
                        else {
                            var fetchOptions = {
                                argParams: this.fetchStatus_.getFetchParams(),
                                success: function (modelOrCollection, response, options) {
                                    if (options.partial.refreshed === true) {
                                        console.log('refreshed.   ' + collection.length);
                                        acquiredBlock_ = {
                                            upperBound: options.offset,
                                            lowerBound: options.offset,
                                        };
                                    }
                                    else {
                                        if (acquiredBlock_ === null) {
                                            acquiredBlock_ = {
                                                upperBound: options.offset,
                                                lowerBound: options.offset,
                                            };
                                        }
                                        else {
                                            if (options.offset < acquiredBlock_.upperBound) {
                                                acquiredBlock_.upperBound = options.offset;
                                            }
                                            if (options.offset > acquiredBlock_.lowerBound) {
                                                acquiredBlock_.lowerBound = options.offset;
                                            }
                                        }
                                    }
                                    _this.partialFetch(timeStamp, acquiredBlock_, performFetchOptions);
                                },
                                error: function (modelOrCollection, response, options) {
                                    console.log('collection.fetchPartial error. offset: ' + options.offset
                                        + '  count: ' + modelOrCollection.length + '/' + modelOrCollection.lengthTotal);
                                    if (performFetchOptions && performFetchOptions.error) {
                                        performFetchOptions.error(modelOrCollection, response, options);
                                    }
                                }
                            };
                            collection.fetchPartial(targetBlockOffset, Handler.partialSize, fetchOptions);
                        }
                    };
                    return FetchHandler;
                }());
                Handler.FetchHandler = FetchHandler;
                var Direction;
                (function (Direction) {
                    Direction[Direction["upper"] = 0] = "upper";
                    Direction[Direction["lower"] = 1] = "lower";
                })(Direction || (Direction = {}));
                Handler.fetchHandler = new FetchHandler(Explorer.Status.viewStatus, Explorer.Status.fetchStatus);
                Handler.partialSize = 50;
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FetchHandler.js.map