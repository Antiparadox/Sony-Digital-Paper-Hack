var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var Toast = (function () {
                function Toast(elTarget) {
                    this.elTarget = elTarget;
                }
                Toast.prototype.show = function (messageId, duration) {
                    if ((typeof messageId === 'string') && (typeof duration === 'string')) {
                        var me_1 = this;
                        clearTimeout(me_1.timeoutId);
                        me_1.timeoutId = undefined;
                        var durationMilliseconds = 2000;
                        if (duration.toLowerCase() === 'long') {
                            durationMilliseconds = 3500;
                        }
                        me_1.timeoutId = setTimeout(function () {
                            me_1.elTarget.css('display', 'none');
                        }, durationMilliseconds);
                        var translatedMessage = $.i18n.t(messageId);
                        if ((!translatedMessage) || (translatedMessage.length <= 0)) {
                            translatedMessage = messageId;
                        }
                        me_1.elTarget.text(translatedMessage);
                        me_1.elTarget.css('display', 'inline-block');
                    }
                };
                Toast.prototype.hide = function () {
                    var me = this;
                    clearTimeout(me.timeoutId);
                    me.timeoutId = undefined;
                    me.elTarget.class('display', 'none');
                };
                return Toast;
            }());
            ExternalOutput.Toast = Toast;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=Toast.js.map