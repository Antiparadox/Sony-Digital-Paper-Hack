jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Test;
            (function (Test) {
                debugger;
                var DEFAULT_FETCH_WAIT = 10000;
                describe('Manual Test', function () {
                    describe('ChildDIalog', function () {
                        it('should return Yes.', function (done) {
                            var opt = { title: 'Test', message: 'Please press "Yes"' };
                            View.Dialog.openYesNoDialog(opt, function (result) {
                                expect(result).toBe(0);
                                done();
                            });
                        });
                        it('should return No.', function (done) {
                            var opt = { title: 'Test', message: 'Please press "No"' };
                            View.Dialog.openYesNoDialog(opt, function (result) {
                                expect(result).toBe(1);
                                done();
                            });
                        });
                        it('should return Cancel.', function (done) {
                            var opt = { title: 'Test', message: 'Please close by "X"' };
                            View.Dialog.openYesNoDialog(opt, function (result) {
                                expect(result).toBe(1);
                                done();
                            });
                        });
                    });
                });
            })(Test = Explorer.Test || (Explorer.Test = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SandboxManual.js.map