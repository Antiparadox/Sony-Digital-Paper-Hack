var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var Content;
        (function (Content) {
            var SearchCollection = (function (_super) {
                __extends(SearchCollection, _super);
                function SearchCollection(deviceModel) {
                    _super.call(this, deviceModel);
                    this.model = Model.EntityModel;
                    this.syncParams = {};
                }
                SearchCollection.prototype.close = function () {
                };
                SearchCollection.prototype.sync = function (method, model, options) {
                    if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                        if (this.syncMode === Content.SYNC_MODE_REGULAR || this.syncMode === Content.SYNC_MODE_LINER) {
                            if (!options.argParams ||
                                typeof options.argParams.entry_type !== 'string' ||
                                typeof options.argParams.search_target !== 'string') {
                                if (options && options.error) {
                                    options.error(null, "error", new Error('parameter for search is not found.'));
                                }
                                return null;
                            }
                            options.urlPath = "/documents";
                            var params = {
                                entry_type: options.argParams.entry_type,
                                search_target: options.argParams.search_target
                            };
                            if (typeof options.argParams.annotation_type === 'string') {
                                params.annotation_type = options.argParams.annotation_type;
                            }
                            if (typeof options.argParams.search_keyword === 'string') {
                                params.search_keyword = options.argParams.search_keyword;
                            }
                            if (typeof options.argParams.origin_folder_id === 'string') {
                                params.origin_folder_id = options.argParams.origin_folder_id;
                            }
                            if (typeof options.argParams.order_type === 'string') {
                                params.order_type = options.argParams.order_type;
                            }
                            if (typeof options.argParams.offset === 'string') {
                                params.offset = options.argParams.offset;
                            }
                            if (typeof options.argParams.limit === 'string') {
                                params.limit = options.argParams.limit;
                            }
                            var queryPart = $.param(params);
                            if (queryPart.length > 0) {
                                options.urlPath += '?' + queryPart;
                            }
                            options.validStatuses = [200];
                            return Model.BackboneSync.syncWithMwe(method, model, options);
                        }
                        else if (this.syncMode === Content.SYNC_MODE_LINER_PROTO) {
                            this.timestamp = Date.now();
                            options.timestamp = this.timestamp;
                            options = this.loadMultipleData(options, "/documents", this.setOptionsForRead);
                            return Model.BackboneSync.syncWithMwe(method, model, options);
                        }
                        else {
                            throw new Error('sync mode is not supported');
                        }
                    }
                    else {
                        throw new Error('method is not allowed here: ' + method);
                    }
                };
                SearchCollection.prototype.setOptionsForRead = function (options, params) {
                    if (!options.argParams ||
                        typeof options.argParams.entry_type !== 'string' ||
                        typeof options.argParams.search_target !== 'string') {
                        if (options && options.error) {
                            options.error(null, "error", new Error('parameter for search is not found.'));
                        }
                        return null;
                    }
                    options.urlPath = "/documents";
                    params.entry_type = options.argParams.entry_type;
                    params.search_target = options.argParams.search_target;
                    if (typeof options.argParams.annotation_type === 'string') {
                        params.annotation_type = options.argParams.annotation_type;
                    }
                    if (typeof options.argParams.search_keyword === 'string') {
                        params.search_keyword = options.argParams.search_keyword;
                    }
                    if (typeof options.argParams.origin_folder_id === 'string') {
                        params.origin_folder_id = options.argParams.origin_folder_id;
                    }
                    if (typeof options.argParams.order_type === 'string') {
                        params.order_type = options.argParams.order_type;
                    }
                    var queryPart = $.param(params);
                    if (queryPart.length > 0) {
                        options.urlPath += '?' + queryPart;
                    }
                    options.validStatuses = [200];
                    return options;
                };
                SearchCollection.prototype.invalidate = function () {
                    _super.prototype.invalidate.call(this);
                    this.deviceModel_.invalidateSearchCollection();
                };
                return SearchCollection;
            }(Content.EntityCollection));
            Content.SearchCollection = SearchCollection;
        })(Content = Model.Content || (Model.Content = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SearchCollection.js.map