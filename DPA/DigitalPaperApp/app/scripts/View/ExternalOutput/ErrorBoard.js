var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var ErrorBoard = (function () {
                function ErrorBoard(elTarget) {
                    this.elTarget = elTarget;
                    this.shown = false;
                }
                ErrorBoard.prototype.isShown = function () {
                    return this.shown;
                };
                ErrorBoard.prototype.show = function (errorCode, messageId) {
                    var translatedMessage = $.i18n.t(messageId, { errorCode: errorCode });
                    if ((!translatedMessage) || (translatedMessage.length <= 0)) {
                        translatedMessage = messageId;
                    }
                    var elPre = $('<pre></pre>');
                    elPre.text(translatedMessage);
                    this.elTarget.empty();
                    this.elTarget.append(elPre);
                    this.elTarget.css('display', 'inline-block');
                    this.shown = true;
                };
                ErrorBoard.prototype.hide = function () {
                    this.elTarget.css('display', 'none');
                    this.shown = false;
                };
                return ErrorBoard;
            }());
            ExternalOutput.ErrorBoard = ErrorBoard;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ErrorBoard.js.map