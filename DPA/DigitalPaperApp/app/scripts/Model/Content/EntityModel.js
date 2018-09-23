var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var EntityModel = (function (_super) {
            __extends(EntityModel, _super);
            function EntityModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            EntityModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.Content.ATTR_NAME_ENTRY_ID] = null;
                attributes[Model.Content.ATTR_NAME_ENTRY_NAME] = null;
                attributes[Model.Content.ATTR_NAME_ENTRY_PATH] = null;
                attributes[Model.Content.ATTR_NAME_ENTRY_TYPE] = null;
                attributes[Model.Content.ATTR_NAME_CREATED_DATE] = null;
                attributes[Model.Content.ATTR_NAME_MODIFIED_DATE] = null;
                attributes[Model.Content.ATTR_NAME_MIME_TYPE] = null;
                attributes[Model.Content.ATTR_NAME_FILE_SIZE] = null;
                attributes[Model.Content.ATTR_NAME_DOCUMENT_TYPE] = null;
                attributes[Model.Content.ATTR_NAME_AUTHOR] = null;
                attributes[Model.Content.ATTR_NAME_TITLE] = null;
                attributes[Model.Content.ATTR_NAME_TOTAL_PAGE] = null;
                attributes[Model.Content.ATTR_NAME_READING_DATE] = null;
                attributes[Model.Content.ATTR_NAME_PARENT_FOLDER_ID] = null;
                attributes[Model.Content.ATTR_NAME_IS_NEW] = null;
                attributes[Model.Content.ATTR_NAME_DOCUMENT_SOURCE] = null;
                attributes[Model.Content.ATTR_NAME_FILE_REVISION] = null;
                return attributes;
            };
            EntityModel.prototype.sync = function (method, model, options) {
                var entry_type = model.get(Model.Content.ATTR_NAME_ENTRY_TYPE);
                if (entry_type === Model.Content.VALUE_ENTRY_TYPE_FILE) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = "/documents/" + model.id;
                            options.validStatuses = [200];
                            break;
                        case Model.BackboneSyncDefs.METHOD_NAME_DELETE:
                            options.urlPath = "/documents/" + model.id;
                            options.validStatuses = [204];
                            break;
                        case Model.BackboneSyncDefs.METHOD_NAME_UPDATE:
                            var updateAttr_1 = {};
                            var parent_folder_id_1 = model.get(Model.Content.ATTR_NAME_PARENT_FOLDER_ID);
                            var file_name = model.get(Model.Content.ATTR_NAME_ENTRY_NAME);
                            if (parent_folder_id_1) {
                                updateAttr_1[Model.Content.UPDATE_VALUE_NAME_PARENT_FOLDER_ID] = parent_folder_id_1;
                            }
                            if (file_name) {
                                updateAttr_1[Model.Content.UPDATE_VALUE_NAME_FILE_NAME] = file_name;
                            }
                            options.urlPath = "/documents/" + model.id;
                            options.attrs = updateAttr_1;
                            options.validStatuses = [204];
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                }
                else if (entry_type === Model.Content.VALUE_ENTRY_TYPE_FOLDER) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            options.urlPath = "/folders/" + model.id;
                            options.validStatuses = [200];
                            break;
                        case Model.BackboneSyncDefs.METHOD_NAME_DELETE:
                            options.urlPath = "/folders/" + model.id;
                            options.validStatuses = [204];
                            break;
                        case Model.BackboneSyncDefs.METHOD_NAME_UPDATE:
                            var updateAttr = {};
                            var parent_folder_id = model.get(Model.Content.ATTR_NAME_PARENT_FOLDER_ID);
                            var folder_name = model.get(Model.Content.ATTR_NAME_ENTRY_NAME);
                            if (parent_folder_id) {
                                updateAttr[Model.Content.UPDATE_VALUE_NAME_PARENT_FOLDER_ID] = parent_folder_id;
                            }
                            if (folder_name) {
                                updateAttr[Model.Content.UPDATE_VALUE_NAME_FOLDER_NAME] = folder_name;
                            }
                            options.urlPath = "/folders/" + model.id;
                            options.attrs = updateAttr;
                            options.validStatuses = [204];
                            break;
                        default:
                            throw new Error('method is not allowed here: ' + method);
                    }
                }
                else if (entry_type === null) {
                    if (model.id !== null) {
                        throw new Error('entry_type is not set while id is valid');
                    }
                    var entry_path = model.get(Model.Content.ATTR_NAME_ENTRY_PATH);
                    if (typeof entry_path !== 'string') {
                        throw new Error('entry_path is not set then can not resolve');
                    }
                    if (method !== Model.BackboneSyncDefs.METHOD_NAME_READ) {
                        throw new Error('can not call other than read method while only entry_path is set.');
                    }
                    options.urlPath = "/resolve/entry/" + encodeURIComponent(entry_path);
                    options.validStatuses = [200];
                }
                else {
                    throw new Error('entry_type is unknown: ' + model.get(Model.Content.ATTR_NAME_ENTRY_TYPE));
                }
                return Model.BackboneSync.syncWithMwe(method, model, options);
            };
            Object.defineProperty(EntityModel.prototype, "idAttribute", {
                get: function () {
                    return Model.Content.ATTR_NAME_ENTRY_ID;
                },
                enumerable: true,
                configurable: true
            });
            EntityModel.prototype.isFolder = function () {
                var entry_type = this.get(Model.Content.ATTR_NAME_ENTRY_TYPE);
                return (entry_type === Model.Content.VALUE_ENTRY_TYPE_FOLDER);
            };
            EntityModel.prototype.isDocument = function () {
                var entry_type = this.get(Model.Content.ATTR_NAME_ENTRY_TYPE);
                return (entry_type === Model.Content.VALUE_ENTRY_TYPE_FILE);
            };
            EntityModel.prototype.getName = function () {
                return this.get(Model.Content.ATTR_NAME_ENTRY_NAME);
            };
            EntityModel.prototype.getPath = function () {
                return this.get(Model.Content.ATTR_NAME_ENTRY_PATH);
            };
            EntityModel.prototype.getStamp = function () {
                return this.get(Model.Content.ATTR_NAME_FILE_REVISION);
            };
            EntityModel.prototype.getId = function () {
                return this.get(Model.Content.ATTR_NAME_ENTRY_ID);
            };
            return EntityModel;
        }(Model.BaseDPAPIModel));
        Model.EntityModel = EntityModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=EntityModel.js.map