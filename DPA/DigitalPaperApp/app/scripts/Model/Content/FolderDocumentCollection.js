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
            var FolderDocumentCollection = (function (_super) {
                __extends(FolderDocumentCollection, _super);
                function FolderDocumentCollection(deviceModel, folderId) {
                    _super.call(this, deviceModel);
                    this.model = Model.EntityModel;
                    this.currentFolderId_ = null;
                    this.folderId_ = null;
                    this.transition = true;
                    this.syncParams = {};
                    if (typeof folderId === 'string') {
                        this.folderId_ = folderId;
                        this.syncParams = { folder_id: folderId };
                    }
                }
                FolderDocumentCollection.prototype.close = function () {
                };
                FolderDocumentCollection.prototype.sync = function (method, model, options) {
                    if (method === Model.BackboneSyncDefs.METHOD_NAME_READ) {
                        if (this.syncMode === Content.SYNC_MODE_REGULAR || this.syncMode === Content.SYNC_MODE_LINER) {
                            var folder_id = Content.VALUE_ENTRY_ID_ROOT;
                            if (options && options.argParams && typeof options.argParams.folder_id === 'string') {
                                folder_id = options.argParams.folder_id;
                            }
                            options.urlPath = "/folders/" + folder_id + "/entries";
                            if (options.argParams) {
                                var params = {};
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
                            }
                            options.validStatuses = [200];
                            return Model.BackboneSync.syncWithMwe(method, model, options);
                        }
                        else if (this.syncMode === Content.SYNC_MODE_LINER_PROTO) {
                            var folder_id = Content.VALUE_ENTRY_ID_ROOT;
                            if (options && options.argParams && typeof options.argParams.folder_id === 'string') {
                                folder_id = options.argParams.folder_id;
                            }
                            this.timestamp = Date.now();
                            options.timestamp = this.timestamp;
                            options = this.loadMultipleData(options, "/folders/" + folder_id + "/entries", this.setOptionsForRead);
                            return Model.BackboneSync.syncWithMwe(method, model, options);
                        }
                        else {
                            new Error('sync mode is not supported');
                        }
                    }
                    else {
                        throw new Error('method is not allowed here: ' + method);
                    }
                };
                FolderDocumentCollection.prototype.setOptionsForRead = function (options, params) {
                    if (options.argParams) {
                        if (typeof options.argParams.order_type === 'string') {
                            params.order_type = options.argParams.order_type;
                        }
                    }
                    var queryPart = $.param(params);
                    if (queryPart.length > 0) {
                        options.urlPath += '?' + queryPart;
                    }
                    options.validStatuses = [200];
                    return options;
                };
                FolderDocumentCollection.prototype.invalidate = function () {
                    _super.prototype.invalidate.call(this);
                    this.deviceModel_.invalidateFolderEntityCollection(this.folderId_);
                };
                return FolderDocumentCollection;
            }(Content.EntityCollection));
            Content.FolderDocumentCollection = FolderDocumentCollection;
        })(Content = Model.Content || (Model.Content = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=FolderDocumentCollection.js.map