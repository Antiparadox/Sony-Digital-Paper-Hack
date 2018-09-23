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
                xdescribe('Sandbox', function () {
                    beforeEach(function () {
                    });
                    it('should be able to fetch current model', function (done) {
                        var collection = DPMW.appCtrl.currentDevice.getFolderEntityCollection('root');
                        expect(collection).toEqual(jasmine.any(Object));
                        new Promise(function (resolve, reject) {
                            collection.fetch({ success: function () {
                                    resolve();
                                } });
                        }).then(function () {
                            expect(collection.length).toBeGreaterThan(0);
                            expect(collection.lengthTotal).toBeGreaterThan(0);
                        }).then(function () {
                            done();
                        }, function (err) {
                            done();
                        });
                    });
                });
                describe('File manage', function () {
                    describe('Status', function () {
                        beforeEach(function () {
                        });
                        it('should be able to get viewStatus', function () {
                            expect(Explorer.Status.viewStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get fetchStatus', function () {
                            expect(Explorer.Status.fetchStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get selectionStatus', function () {
                            expect(Explorer.Status.selectionStatus).toEqual(jasmine.any(Object));
                        });
                    });
                    describe('Handlers', function () {
                        beforeEach(function () {
                        });
                        it('should be able to get viewStatus', function () {
                            expect(Explorer.Status.viewStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get fetchStatus', function () {
                            expect(Explorer.Status.fetchStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get selectionStatus', function () {
                            expect(Explorer.Status.selectionStatus).toEqual(jasmine.any(Object));
                        });
                    });
                });
                describe('Object exists', function () {
                    describe('Status', function () {
                        beforeEach(function () {
                        });
                        it('should be able to get viewStatus', function () {
                            expect(Explorer.Status.viewStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get fetchStatus', function () {
                            expect(Explorer.Status.fetchStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get selectionStatus', function () {
                            expect(Explorer.Status.selectionStatus).toEqual(jasmine.any(Object));
                        });
                    });
                    describe('Handlers', function () {
                        beforeEach(function () {
                        });
                        it('should be able to get viewStatus', function () {
                            expect(Explorer.Status.viewStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get fetchStatus', function () {
                            expect(Explorer.Status.fetchStatus).toEqual(jasmine.any(Object));
                        });
                        it('should be able to get selectionStatus', function () {
                            expect(Explorer.Status.selectionStatus).toEqual(jasmine.any(Object));
                        });
                    });
                });
            })(Test = Explorer.Test || (Explorer.Test = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=Sandbox.js.map