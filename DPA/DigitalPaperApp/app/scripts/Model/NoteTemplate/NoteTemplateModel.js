var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var NoteTemplateModel = (function (_super) {
            __extends(NoteTemplateModel, _super);
            function NoteTemplateModel(attributes, options) {
                _super.call(this, attributes, options);
            }
            NoteTemplateModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.NoteTemplateDefs.ATTR_NAME_NOTE_TEMPLATE_ID] = null;
                attributes[Model.NoteTemplateDefs.ATTR_NAME_TEMPLATE_NAME] = null;
                attributes[Model.NoteTemplateDefs.ATTR_NAME_CREATED_DATE] = null;
                attributes[Model.NoteTemplateDefs.ATTR_NAME_IS_MODIFIABLE] = null;
                return attributes;
            };
            Object.defineProperty(NoteTemplateModel.prototype, "idAttribute", {
                get: function () {
                    return Model.NoteTemplateDefs.ATTR_NAME_NOTE_TEMPLATE_ID;
                },
                enumerable: true,
                configurable: true
            });
            NoteTemplateModel.prototype.sync = function (method, model, options) {
                var noteTemplateId = this.get(Model.NoteTemplateDefs.ATTR_NAME_NOTE_TEMPLATE_ID);
                options.urlPath = '/viewer/configs/note_templates/' + noteTemplateId;
                if (method === 'read') {
                    options.validStatuses = [200];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                else if (method === 'update') {
                    options.validStatuses = [204];
                    options.attrs = { template_name: model.get(Model.NoteTemplateDefs.ATTR_NAME_TEMPLATE_NAME) };
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                else if (method === 'delete') {
                    options.validStatuses = [204];
                    return Model.BackboneSync.syncWithMwe(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            return NoteTemplateModel;
        }(Model.BaseDPAPIModel));
        Model.NoteTemplateModel = NoteTemplateModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=NoteTemplateModel.js.map