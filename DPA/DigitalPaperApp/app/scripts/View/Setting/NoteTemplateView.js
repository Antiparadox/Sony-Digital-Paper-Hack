var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Setting;
        (function (Setting) {
            var NoteTemplateView = (function (_super) {
                __extends(NoteTemplateView, _super);
                function NoteTemplateView(options) {
                    _super.call(this, options);
                }
                NoteTemplateView.prototype.events = function () {
                    return {
                        'click': this.click,
                    };
                };
                NoteTemplateView.prototype.initialize = function () {
                    this.listenTo(this.model, 'destroy', this.remove);
                    var templateStr = $('#note-template').text();
                    this.template_ = Hogan.compile(templateStr);
                    this.$el.html(this.template_.render({
                        noteTemplate: this.model.toJSON(),
                    }));
                };
                NoteTemplateView.prototype.render = function () {
                    return this;
                };
                NoteTemplateView.prototype.click = function () {
                    this.trigger('clickTemplate', this);
                };
                return NoteTemplateView;
            }(Backbone.View));
            Setting.NoteTemplateView = NoteTemplateView;
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=NoteTemplateView.js.map