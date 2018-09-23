var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var Content;
        (function (Content) {
            Content.SYNC_MODE_REGULAR = 0;
            Content.SYNC_MODE_LINER_PROTO = 1;
            Content.SYNC_MODE_LINER = 2;
            var FETCH_PARTIAL_FETCH_COUNT = 100;
            var EntityCollection = (function (_super) {
                __extends(EntityCollection, _super);
                function EntityCollection(deviceModel) {
                    _super.call(this, deviceModel, null, null);
                    this.orderType_ = Content.ORDER_TYPE_ENTRY_NAME_ASC;
                    this.lengthTotal = 0;
                    this.timestamp = 0;
                    this.syncMode = Content.SYNC_MODE_LINER;
                    this.syncParams = {};
                    this.listStamp = null;
                    this.resetWhenChangeDetected_ = true;
                    this.orderedIndexArray = null;
                    this.lastSyncedAny = null;
                    this.on('update', function (collection, options) {
                        var changes = options.changes;
                        if ((changes.added.length > 0 || changes.merged.length > 0) && changes.removed.length > 0) {
                            console.error('Unexpected this must be removed in parse().');
                            throw new Error('Error');
                        }
                    });
                }
                EntityCollection.prototype.parse = function (response, options) {
                    var count;
                    var entryList;
                    if (!response) {
                        return [];
                    }
                    count = response[Content.PARSE_NAME_COUNT];
                    if (count < 0) {
                        return [];
                    }
                    entryList = response[Content.PARSE_NAME_ENTRY_LIST];
                    if (!entryList) {
                        return [];
                    }
                    var offset = options.offset;
                    if (typeof offset !== 'number') {
                        offset = 0;
                    }
                    if (options.partial) {
                        options.partial.size = entryList.length;
                    }
                    if (!this.orderedIndexArray) {
                        this.lengthTotal = count;
                        this.orderedIndexArray = new Array(count);
                    }
                    else if (this.orderedIndexArray.length !== count) {
                        if (this.resetWhenChangeDetected_) {
                            this.reset(null);
                            if (options.partial) {
                                options.partial.refreshed = true;
                            }
                            this.lengthTotal = count;
                            this.orderedIndexArray = new Array(count);
                        }
                        else {
                            console.warn('Total count changed detected');
                            this.orderedIndexArray.length = count;
                        }
                    }
                    if (this.resetWhenChangeDetected_) {
                        var anyExisting = false;
                        for (var i = 0; i < entryList.length; i++) {
                            var entryJson = entryList[i];
                            var existing = this.get(entryJson);
                            if (existing && this.atOrdered(offset + i) !== existing) {
                                anyExisting = true;
                            }
                        }
                        if (anyExisting) {
                            this.reset(null);
                            if (options.partial) {
                                options.partial.refreshed = true;
                            }
                            this.lengthTotal = count;
                            this.orderedIndexArray = new Array(count);
                        }
                    }
                    if (typeof response.entry_list_hash === 'string') {
                        if (this.listStamp === null) {
                            this.listStamp = response.entry_list_hash;
                        }
                        else if (this.listStamp !== response.entry_list_hash) {
                            console.warn('entry_list_hash update detected');
                            this.reset(null);
                            if (options.partial) {
                                options.partial.refreshed = true;
                            }
                            this.listStamp = response.entry_list_hash;
                            this.lengthTotal = count;
                            this.orderedIndexArray = new Array(count);
                        }
                    }
                    for (var i = 0; i < entryList.length; i++) {
                        var entryJson = entryList[i];
                        var existing = this.get(entryJson);
                        if (existing) {
                            var existingIndex = this.indexOf(existing);
                            var atIndex = this.orderedIndexArray.indexOf(existingIndex);
                            this.orderedIndexArray[atIndex] = null;
                            for (var j = existingIndex + 1; j < this.models.length + i; j++) {
                                var atIndex_1 = this.orderedIndexArray.indexOf(j);
                                this.orderedIndexArray[atIndex_1]--;
                            }
                            _super.prototype.remove.call(this, existing, options);
                        }
                        this.orderedIndexArray[offset + i] = this.models.length + i;
                    }
                    return entryList;
                };
                EntityCollection.prototype.fetch = function (options) {
                    options = options || {};
                    if (this.syncMode === Content.SYNC_MODE_REGULAR) {
                        var resOptions = _.clone(options);
                        resOptions.argParams = _.extend(resOptions.argParams || {}, this.syncParams);
                        return _super.prototype.fetch.call(this, resOptions);
                    }
                    else if (this.syncMode === Content.SYNC_MODE_LINER) {
                        return this.fetchInternal_(0, options);
                    }
                };
                EntityCollection.prototype.fetchInternal_ = function (offset, options) {
                    var _this = this;
                    var argOptions = _.clone(options);
                    var success = options.success;
                    argOptions.success = function (modelOrCollection, response, resOptions) {
                        if (_this.lengthTotal === _this.length) {
                            if (resOptions.partial.refreshed) {
                                console.warn('refresh detected, but all downloaded');
                            }
                            if (success) {
                                success(modelOrCollection, response, resOptions);
                            }
                            _this.lastSyncedAny = new Date();
                            var resArgOptions = _.clone(resOptions);
                            delete resArgOptions.offset;
                            delete resArgOptions.size;
                            _this.trigger('sync', modelOrCollection, response, resArgOptions);
                            return;
                        }
                        else if (_this.length > _this.lengthTotal) {
                            resOptions.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE, 'Remote list parsing fail detected.', 'GET', resOptions.urlPath, 200, response);
                            if (error) {
                                error(modelOrCollection, response, resOptions);
                            }
                            _this.trigger('error', modelOrCollection, response, resArgOptions);
                            return;
                        }
                        if (resOptions.partial.refreshed) {
                            console.warn('refresh detected, then read from beginning');
                            _this.fetchInternal_(0, options);
                            return;
                        }
                        _this.fetchInternal_(offset + FETCH_PARTIAL_FETCH_COUNT, options);
                    };
                    var error = options.error;
                    argOptions.error = function (modelOrCollection, response, resOptions) {
                        if (error) {
                            error(modelOrCollection, response, resOptions);
                        }
                        _this.trigger('error', modelOrCollection, response, resOptions);
                    };
                    return this.fetchPartial(offset, FETCH_PARTIAL_FETCH_COUNT, argOptions);
                };
                EntityCollection.prototype.fetchPartial = function (offset, size, options) {
                    options.partial = { offset: offset, size: size };
                    return this.fetchPartialOrderedIndex(offset, size, options);
                };
                EntityCollection.prototype.fetchPartialOrderedIndex = function (offset, size, options) {
                    var _this = this;
                    options = options || {};
                    if (options.reset) {
                        throw new Error('reset is not supported');
                    }
                    var resOptions = _.clone(options);
                    resOptions.argParams = _.extend(resOptions.argParams || {}, this.syncParams, { offset: offset.toString(), limit: size.toString() });
                    resOptions.offset = offset;
                    resOptions.size = size;
                    resOptions.add = true;
                    resOptions.merge = true;
                    resOptions.remove = false;
                    var success = resOptions.success;
                    resOptions.success = function (modelOrCollection, response, options) {
                        if (success) {
                            success(modelOrCollection, response, options);
                        }
                        _this.lastSyncedAny = new Date();
                    };
                    return _super.prototype.fetch.call(this, resOptions);
                };
                EntityCollection.prototype.isSyncedAny = function () {
                    if (this.lastSyncedAny === null) {
                        return false;
                    }
                    return true;
                };
                EntityCollection.prototype.atOrdered = function (index) {
                    if (!this.orderedIndexArray) {
                        throw new RangeError('not yet fetched');
                    }
                    if (index < 0 || index >= this.orderedIndexArray.length) {
                        throw new RangeError('index is out of range');
                    }
                    var actIndex = this.orderedIndexArray[index];
                    if (typeof actIndex !== 'number') {
                        return null;
                    }
                    var model = this.models[actIndex];
                    if (!model) {
                        return null;
                    }
                    return model;
                };
                EntityCollection.prototype.sliceOrdered = function (min, max) {
                    var resModels = [];
                    if (typeof max === 'undefined' || max === null) {
                        max = this.lengthTotal;
                    }
                    var actIndex = 0;
                    for (var i = min; i < max; i++) {
                        resModels.push(this.atOrdered(i));
                    }
                    return resModels;
                };
                EntityCollection.prototype.indexOfOrdered = function (element, isSorted) {
                    var actIndex = this.indexOf(element, isSorted);
                    return this.orderedIndexArray.indexOf(actIndex);
                };
                EntityCollection.prototype.reset = function (models, options) {
                    if (models !== null && typeof models !== 'undefined') {
                        throw new Error('models argument must be null');
                    }
                    this.orderedIndexArray = null;
                    this.lengthTotal = 0;
                    this.listStamp = null;
                    return _super.prototype.reset.call(this, models, options);
                };
                EntityCollection.prototype.removeRangeOrdered = function (offset, size, options) {
                    var length = this.models.length;
                    var resModels = this.sliceOrdered(offset, offset + size);
                    for (var i = 0; i < size; i++) {
                        var atIndex = offset + i;
                        var actIndex = this.orderedIndexArray[atIndex];
                        if (typeof actIndex !== 'number') {
                            continue;
                        }
                        this.orderedIndexArray[atIndex] = null;
                        for (var j = actIndex + 1; j < length; j++) {
                            var atIndex_2 = this.orderedIndexArray.indexOf(j);
                            this.orderedIndexArray[atIndex_2]--;
                        }
                    }
                    return _super.prototype.remove.call(this, resModels, options);
                };
                EntityCollection.prototype.getEntityModelByPath = function (path, callback) {
                    var _this = this;
                    var collection = this;
                    if (!path || !callback || !callback.success) {
                        throw new Error('Fail to argument: path = ' + path + ' callback = ' + JSON.stringify(callback));
                    }
                    var syncOptions = {
                        success: function (resp) {
                            var resModel = null;
                            if (resp) {
                                resModel = new Model.EntityModel(resp, { deviceModel: _this.deviceModel_ });
                            }
                            if (callback.success) {
                                callback.success(collection, resModel, syncOptions);
                            }
                        },
                        error: function (resp) {
                            if (callback.error) {
                                callback.error(collection, resp, syncOptions);
                            }
                        },
                        urlPath: '/resolve/entry/' + encodeURIComponent(path),
                        validStatuses: [200],
                    };
                    Model.BackboneSync.syncWithMwe(Model.BackboneSyncDefs.METHOD_NAME_READ, this, syncOptions);
                };
                EntityCollection.prototype.loadMultipleData = function (options, url, setOptionsFunc) {
                    var _this = this;
                    var successCallback = null;
                    var fetchedCount = 0;
                    var params = {};
                    var syncWithMWe = Model.BackboneSync.syncWithMwe;
                    options.urlPath = url;
                    params.limit = Content.LIMIT;
                    params.offset = 0;
                    successCallback = options.success;
                    var syncCallBack = function (success) {
                        if (_this.timestamp !== options.timestamp) {
                            return;
                        }
                        var totalCount = success.count;
                        if (fetchedCount === 0) {
                            options.remove = true;
                        }
                        else {
                            options.remove = false;
                        }
                        fetchedCount += success.entry_list.length;
                        options.totalCount = totalCount;
                        if (totalCount > fetchedCount) {
                            var newParams = { offset: fetchedCount, limit: Content.LIMIT };
                            var newOptions = setOptionsFunc({
                                parse: true,
                                remove: false,
                                argParams: options.argParams,
                                urlPath: url,
                                totalCount: totalCount,
                                success: syncCallBack.bind(_this)
                            }, newParams);
                            _this['set'](success, options);
                            syncWithMWe('read', _this, newOptions);
                        }
                        else if (totalCount === fetchedCount) {
                            successCallback(success);
                        }
                    };
                    options.success = syncCallBack.bind(this);
                    options = setOptionsFunc(options, params);
                    return options;
                };
                return EntityCollection;
            }(Model.BaseDPAPICollection));
            Content.EntityCollection = EntityCollection;
        })(Content = Model.Content || (Model.Content = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=EntityCollection.js.map