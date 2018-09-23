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
                describe('ViewSwitch', function () {
                    var testView = null;
                    beforeEach(function () {
                        testView = new Backbone.View();
                    });
                    afterEach(function () {
                        testView.remove();
                    });
                    it('should be able to switch to VIEW_TYPE_DOCUMENTS', function () {
                        testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged');
                        Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                        expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                    });
                    it('should be able to switch to VIEW_TYPE_FOLDER', function () {
                        testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged');
                        Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                        expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_FOLDER);
                    });
                    it('should be able to switch to VIEW_TYPE_SEARCH_FOLDER', function () {
                        testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged');
                        Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_SEARCH_FOLDER);
                        expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_SEARCH_FOLDER);
                    });
                    it('should be able to switch to VIEW_TYPE_SEARCH_DOCUMENTS', function () {
                        testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged');
                        Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_SEARCH_DOCUMENTS);
                        expect(Explorer.Status.viewStatus.getViewType()).toBe(Explorer.VIEW_TYPE_SEARCH_DOCUMENTS);
                    });
                    it('should be able to switch to VIEW_TYPE_FOLDER, with events.', function (done) {
                        expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_FOLDER);
                        var promises = [];
                        promises.push(new Promise(function (resolve, reject) {
                            testView.listenTo(Explorer.Status.viewStatus, 'viewTypeChanged', function (viewType) {
                                expect(viewType).toBe(Explorer.VIEW_TYPE_FOLDER);
                                resolve();
                            });
                        }));
                        promises.push(new Promise(function (resolve, reject) {
                            testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged', function (collection) {
                                expect(collection).not.toBeNull();
                                resolve();
                            });
                        }));
                        Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_FOLDER);
                        Promise.all(promises).then(function () {
                            done();
                        }, function (err) {
                            expect(err).toBeNull();
                        });
                    });
                    it('should be able to switch to VIEW_TYPE_DOCUMENTS, with events.', function (done) {
                        expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                        var promises = [];
                        promises.push(new Promise(function (resolve, reject) {
                            testView.listenTo(Explorer.Status.viewStatus, 'viewTypeChanged', function (viewType) {
                                expect(viewType).toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                                resolve();
                            });
                        }));
                        promises.push(new Promise(function (resolve, reject) {
                            testView.listenTo(Explorer.Status.viewStatus, 'collectionChanged', function (collection) {
                                expect(collection).not.toBeNull();
                                resolve();
                            });
                        }));
                        Explorer.Status.viewStatus.changeViewType(Explorer.VIEW_TYPE_DOCUMENTS);
                        Promise.all(promises).then(function () {
                            done();
                        }, function (err) {
                            expect(err).toBeNull();
                        });
                    });
                    it('should be able to see VIEW_TYPE_FOLDER with contents.', function (done) {
                        expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_FOLDER);
                        var promises = [];
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
                    it('should be able to see VIEW_TYPE_DOCUMENTS with contents.', function (done) {
                        expect(Explorer.Status.viewStatus.getViewType()).not.toBe(Explorer.VIEW_TYPE_DOCUMENTS);
                        var promises = [];
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
            })(Test = Explorer.Test || (Explorer.Test = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ViewType.js.map