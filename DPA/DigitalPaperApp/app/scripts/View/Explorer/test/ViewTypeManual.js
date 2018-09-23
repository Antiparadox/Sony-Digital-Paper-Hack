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
                describe('ViewType Manual Test', function () {
                    describe('ViewSwitchManual', function () {
                        var testView = null;
                        beforeEach(function () {
                            testView = new Backbone.View();
                        });
                        afterEach(function () {
                            testView.remove();
                        });
                        it('should be able to see VIEW_TYPE_FOLDER.', function (done) {
                            expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_FOLDER);
                            var promises = [];
                            promises.push(new Promise(function (resolve, reject) {
                                var opt = { title: 'Test',
                                    message: 'Is view changed to VIEW_TYPE_FOLDER and NO contents shown?' };
                                View.Dialog.openYesNoDialog(opt, function (result) {
                                    expect(result).toBe(0);
                                    resolve();
                                });
                            }));
                            promises.push(new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    var collection = Explorer.Status.viewStatus.getCollection();
                                    expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_FOLDER);
                                    expect(collection.length).toBe(0);
                                    resolve();
                                }, DEFAULT_FETCH_WAIT);
                            }));
                            Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                            var collection = Explorer.Status.viewStatus.getCollection();
                            Promise.all(promises).then(function () {
                                var collection = Explorer.Status.viewStatus.getCollection();
                                collection.reset(null);
                                done();
                            }, function (err) {
                                expect(err).toBeNull();
                            });
                        });
                        it('should be able to see VIEW_TYPE_DOCUMENTS.', function (done) {
                            expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                            var promises = [];
                            promises.push(new Promise(function (resolve, reject) {
                                var opt = { title: 'Test',
                                    message: 'Is view changed to VIEW_TYPE_DOCUMENTS and NO contents shown??' };
                                View.Dialog.openYesNoDialog(opt, function (result) {
                                    expect(result).toBe(0);
                                    resolve();
                                });
                            }));
                            promises.push(new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    var collection = Explorer.Status.viewStatus.getCollection();
                                    expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                                    expect(collection.length).toBe(0);
                                    resolve();
                                }, DEFAULT_FETCH_WAIT);
                            }));
                            Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                            Promise.all(promises).then(function () {
                                var collection = Explorer.Status.viewStatus.getCollection();
                                collection.reset(null);
                                done();
                            }, function (err) {
                                expect(err).toBeNull();
                            });
                        });
                        it('should be able to see VIEW_TYPE_FOLDER.2', function (done) {
                            expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_FOLDER);
                            var promises = [];
                            promises.push(new Promise(function (resolve, reject) {
                                var opt = { title: 'Test',
                                    message: 'Is view changed to VIEW_TYPE_FOLDER and ANY contents shown?' };
                                View.Dialog.openYesNoDialog(opt, function (result) {
                                    expect(result).toBe(0);
                                    resolve();
                                });
                            }));
                            promises.push(new Promise(function (resolve, reject) {
                                testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged', function (collection) {
                                    expect(collection).not.toBeNull();
                                    collection.fetch();
                                    resolve();
                                });
                            }));
                            promises.push(new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    var collection = Explorer.Status.viewStatus.getCollection();
                                    expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_FOLDER);
                                    expect(collection.length).toBeGreaterThan(0);
                                    resolve();
                                }, DEFAULT_FETCH_WAIT);
                            }));
                            Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                            Promise.all(promises).then(function () {
                                var collection = Explorer.Status.viewStatus.getCollection();
                                collection.reset(null);
                                done();
                            }, function (err) {
                                expect(err).toBeNull();
                            });
                        });
                        it('should be able to see VIEW_TYPE_DOCUMENTS.2', function (done) {
                            expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                            var promises = [];
                            promises.push(new Promise(function (resolve, reject) {
                                var opt = { title: 'Test',
                                    message: 'Is view changed to VIEW_TYPE_DOCUMENTS and ANY contents shown?' };
                                View.Dialog.openYesNoDialog(opt, function (result) {
                                    expect(result).toBe(0);
                                    resolve();
                                });
                            }));
                            promises.push(new Promise(function (resolve, reject) {
                                testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged', function (collection) {
                                    expect(collection).not.toBeNull();
                                    collection.fetch();
                                    resolve();
                                });
                            }));
                            promises.push(new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    var collection = Explorer.Status.viewStatus.getCollection();
                                    expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                                    expect(collection.length).toBeGreaterThan(0);
                                    resolve();
                                }, DEFAULT_FETCH_WAIT);
                            }));
                            Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                            Promise.all(promises).then(function () {
                                var collection = Explorer.Status.viewStatus.getCollection();
                                collection.reset(null);
                                done();
                            }, function (err) {
                                expect(err).toBeNull();
                            });
                        });
                    });
                });
            })(Test = Explorer.Test || (Explorer.Test = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ViewTypeManual.js.map