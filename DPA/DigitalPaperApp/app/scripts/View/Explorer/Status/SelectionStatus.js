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
                var SelectionStatus = (function (_super) {
                    __extends(SelectionStatus, _super);
                    function SelectionStatus() {
                        _super.call(this);
                        this.selections_ = [];
                    }
                    SelectionStatus.prototype.updateSelections = function (entities) {
                        this.selections_ = entities.slice(0);
                        this.trigger('selectionsChanged', entities.slice(0));
                    };
                    SelectionStatus.prototype.deleteOneSelection = function (entity) {
                        var len = this.selections_.length;
                        for (var i = 0; i < len; i++) {
                            if (entity.getId() === this.selections_[i].getId()) {
                                this.selections_.splice(i, 1);
                                this.updateSelections(this.selections_);
                                break;
                            }
                        }
                    };
                    SelectionStatus.prototype.getSelections = function () {
                        return this.selections_.slice(0);
                    };
                    SelectionStatus.prototype.reset = function () {
                        this.selections_ = [];
                    };
                    return SelectionStatus;
                }(Backbone.EventsAdopter));
                Status.SelectionStatus = SelectionStatus;
                Status.selectionStatus = new SelectionStatus();
            })(Status = Explorer.Status || (Explorer.Status = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SelectionStatus.js.map