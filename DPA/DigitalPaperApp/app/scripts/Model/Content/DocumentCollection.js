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
            var DocumentCollection = (function (_super) {
                __extends(DocumentCollection, _super);
                function DocumentCollection(deviceModel) {
                    _super.call(this, deviceModel);
                    this.model = Model.EntityModel;
                    this.syncParams = {};
                }
                DocumentCollection.prototype.close = function () {
                };
                DocumentCollection.prototype.fetch = function (options) {
                    options = options ? options : {};
                    options.argParams = options.argParams ? options.argParams : {};
                    if (!options.argParams.order_type) {
                        options.argParams.order_type = this.orderType_;
                    }
                    this.orderType_ = options.argParams.order_type;
                    return _super.prototype.fetch.call(this, options);
                };
                DocumentCollection.prototype.sync = function (method, model, options) {
                    if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                        if (this.syncMode === Content.SYNC_MODE_REGULAR || this.syncMode === Content.SYNC_MODE_LINER) {
                            options.urlPath = "/documents";
                            options.attrs = {};
                            if (options.argParams) {
                                var params = {};
                                if (typeof options.argParams.order_type === 'string') {
                                    params.order_type = options.argParams.order_type;
                                }
                                if (typeof options.argParams.entry_type === 'string') {
                                    params.entry_type = options.argParams.entry_type;
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
                            throw new Error('not supported sync mode');
                        }
                    }
                    else {
                        throw new Error('method is not allowed here: ' + method);
                    }
                };
                DocumentCollection.prototype.setOptionsForRead = function (options, params) {
                    if (options.argParams) {
                        if (typeof options.argParams.order_type === 'string') {
                            params.order_type = options.argParams.order_type;
                        }
                        if (typeof options.argParams.entry_type === 'string') {
                            params.entry_type = options.argParams.entry_type;
                        }
                    }
                    var queryPart = $.param(params);
                    if (queryPart.length > 0) {
                        options.urlPath += '?' + queryPart;
                    }
                    options.validStatuses = [200];
                    return options;
                };
                DocumentCollection.prototype.invalidate = function () {
                    _super.prototype.invalidate.call(this);
                    this.deviceModel_.invalidateDocumentCollection();
                };
                return DocumentCollection;
            }(Content.EntityCollection));
            Content.DocumentCollection = DocumentCollection;
        })(Content = Model.Content || (Model.Content = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DocumentCollection.js.map