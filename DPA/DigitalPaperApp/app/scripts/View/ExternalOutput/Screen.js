var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var Screen = (function () {
                function Screen(elTarget) {
                    this.elTarget = elTarget;
                }
                Screen.prototype.setSource = function (response) {
                    if (response) {
                        var base64EncodedImage = undefined;
                        try {
                            base64EncodedImage = new Buffer(response).toString('base64');
                        }
                        catch (e) {
                            console.warn(e);
                        }
                        if (base64EncodedImage) {
                            this.elTarget.attr('src', "data:image/jpeg;base64," + base64EncodedImage);
                        }
                    }
                };
                Screen.prototype.clearSource = function () {
                    this.elTarget.attr('src', '');
                };
                return Screen;
            }());
            ExternalOutput.Screen = Screen;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=Screen.js.map