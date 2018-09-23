var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var NoteTemplateCollection = (function (_super) {
            __extends(NoteTemplateCollection, _super);
            function NoteTemplateCollection(deviceModel, models, options) {
                _super.call(this, deviceModel, models, options);
                this.model = Model.NoteTemplateModel;
                if (!options || !options.stub) {
                    var connCtrl = DPMW.appCtrl.currentDevice.connCtrl;
                    this.fileTransfer_ = DPMW.appCtrl.currentDevice.getNoteTemplateTransfer();
                }
            }
            NoteTemplateCollection.prototype.close = function () {
            };
            NoteTemplateCollection.prototype.parse = function (response, options) {
                var templateList;
                if (!response) {
                    return [];
                }
                templateList = response[Model.NoteTemplateDefs.PARSE_NAME_TEMPLATE_LIST];
                if (!templateList) {
                    return [];
                }
                return templateList;
            };
            NoteTemplateCollection.prototype.sync = function (method, model, options) {
                switch (method) {
                    case Model.BackboneSyncDefs.METHOD_NAME_READ:
                        options.urlPath = '/viewer/configs/note_templates';
                        options.validStatuses = [200];
                        break;
                    default:
                        throw new Error('method is not allowed here: ' + method);
                }
                return Model.BackboneSync.syncWithMwe(method, model, options);
            };
            NoteTemplateCollection.prototype.uploadNoteTemplate = function (srcFilePath, destTemplateName, options) {
                var collection = this;
                this.fileTransfer_.uploadNoteTemplate(srcFilePath, destTemplateName, function (err) {
                    if (err) {
                        options.mwError = err;
                        if (options && options.error) {
                            options.error(collection, null, options);
                        }
                        return;
                    }
                    if (options && options.success) {
                        options.success(collection, null, options);
                    }
                });
            };
            NoteTemplateCollection.prototype.cancelUpload = function (options) {
                var collection = this;
                this.fileTransfer_.cancelCurrent(function (err) {
                    if (err) {
                        options.mwError = err;
                        if (options && options.error) {
                            options.error(collection, null, options);
                        }
                        return;
                    }
                    if (options && options.success) {
                        options.success(collection, null, options);
                    }
                });
            };
            return NoteTemplateCollection;
        }(Model.BaseDPAPICollection));
        Model.NoteTemplateCollection = NoteTemplateCollection;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=NoteTemplateCollection.js.map