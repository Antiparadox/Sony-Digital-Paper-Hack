var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var DebugBoard = (function () {
                function DebugBoard(elTarget) {
                    this.elTarget = elTarget;
                    this.shown = false;
                }
                DebugBoard.prototype.isShown = function () {
                    return this.shown;
                };
                DebugBoard.prototype.show = function (message) {
                    this.elTarget.text(message);
                    this.elTarget.css('display', 'inline-block');
                    this.shown = true;
                };
                DebugBoard.prototype.hide = function () {
                    this.elTarget.css('display', 'none');
                    this.shown = false;
                };
                return DebugBoard;
            }());
            ExternalOutput.DebugBoard = DebugBoard;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DebugBoard.js.map