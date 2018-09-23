var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var DeviceSettingModel = (function (_super) {
            __extends(DeviceSettingModel, _super);
            function DeviceSettingModel(attributes, options) {
                var _this = this;
                _super.call(this, attributes, options);
                var timeZoneModel = new Model.DeviceSetting.TimeZoneModel(null, { deviceModel: this.deviceModel_ });
                var dateFormatModel = new Model.DeviceSetting.DateFormatModel(null, { deviceModel: this.deviceModel_ });
                var timeFormatModel = new Model.DeviceSetting.TimeFormatModel(null, { deviceModel: this.deviceModel_ });
                var initializedFlagModel = new Model.DeviceSetting.InitializedFlagModel(null, { deviceModel: this.deviceModel_ });
                var timeoutToStandbyModel = new Model.DeviceSetting.TimeoutToStandbyModel(null, { deviceModel: this.deviceModel_ });
                var ownerModel = new Model.DeviceSetting.OwnerModel(null, { deviceModel: this.deviceModel_ });
                timeZoneModel.on('change', function () {
                    _this.set(Model.DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE, timeZoneModel.get(Model.DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE));
                });
                dateFormatModel.on('change', function () {
                    _this.set(Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT, dateFormatModel.get(Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT));
                });
                timeFormatModel.on('change', function () {
                    _this.set(Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT, timeFormatModel.get(Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT));
                });
                initializedFlagModel.on('change', function () {
                    _this.set(Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG, initializedFlagModel.get(Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG));
                });
                timeoutToStandbyModel.on('change', function () {
                    _this.set(Model.DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY, timeoutToStandbyModel.get(Model.DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY));
                });
                ownerModel.on('change', function () {
                    _this.set(Model.DeviceSetting.OwnerDefs.ATTR_NAME_OWNER, ownerModel.get(Model.DeviceSetting.OwnerDefs.ATTR_NAME_OWNER));
                });
                this.timeZoneModel_ = timeZoneModel;
                this.dateFormatModel_ = dateFormatModel;
                this.timeFormatModel_ = timeFormatModel;
                this.initializedFlagModel_ = initializedFlagModel;
                this.timeoutToStandbyModel_ = timeoutToStandbyModel;
                this.ownerModel_ = ownerModel;
            }
            DeviceSettingModel.prototype.defaults = function () {
                var attributes = {};
                attributes[Model.DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE] = null;
                attributes[Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT] = null;
                attributes[Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT] = null;
                attributes[Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG] = null;
                attributes[Model.DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY] = null;
                attributes[Model.DeviceSetting.OwnerDefs.ATTR_NAME_OWNER] = null;
                return attributes;
            };
            DeviceSettingModel.prototype.close = function () {
            };
            DeviceSettingModel.prototype.fetchInternal_ = function (options) {
                var success;
                var error;
                var model = this;
                options = options || {};
                success = options.success || null;
                error = options.error || null;
                options.success = function () {
                    if (model.timeZoneModel_) {
                        model.timeZoneModel_.set(Model.DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE, model.get(Model.DeviceSettingDefs.ATTR_NAME_TIMEZONE), { silent: true });
                    }
                    if (model.dateFormatModel_) {
                        model.dateFormatModel_.set(Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT, model.get(Model.DeviceSettingDefs.ATTR_NAME_DATE_FORMAT), { silent: true });
                    }
                    if (model.timeFormatModel_) {
                        model.timeFormatModel_.set(Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT, model.get(Model.DeviceSettingDefs.ATTR_NAME_TIME_FORMAT), { silent: true });
                    }
                    if (model.initializedFlagModel_) {
                        model.initializedFlagModel_.set(Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG, model.get(Model.DeviceSettingDefs.ATTR_NAME_INITIALIZED_FLAG), { silent: true });
                    }
                    if (model.timeoutToStandbyModel_) {
                        model.timeoutToStandbyModel_.set(Model.DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY, model.get(Model.DeviceSettingDefs.ATTR_NAME_TIMEOUT_TO_STANBY), { silent: true });
                    }
                    if (model.ownerModel_) {
                        model.ownerModel_.set(Model.DeviceSetting.OwnerDefs.ATTR_NAME_OWNER, model.get(Model.DeviceSettingDefs.ATTR_NAME_OWNER), { silent: true });
                    }
                    if (success) {
                        success(model, model.toJSON(), options);
                    }
                };
                return _super.prototype.fetch.call(this, options);
            };
            DeviceSettingModel.prototype.save = function (attributes, options) {
                var _this = this;
                var dfs = [];
                var dfTimeZone;
                var dfDateFormat;
                var dfTimeFormat;
                var dfInitializedFlag;
                var dfTimeoutToStandby;
                var dfOwner;
                var value;
                var model = this;
                var careMode = process.env['DENEB_CARE_MODE'];
                var care = false;
                if (typeof careMode === 'string') {
                    var careNumber = parseInt(careMode);
                    if (careNumber >= 1) {
                        care = true;
                    }
                }
                value = attributes[Model.DeviceSettingDefs.ATTR_NAME_TIMEZONE];
                if (typeof value === 'string' && this.timeZoneModel_) {
                    var savedAttr_1 = {};
                    savedAttr_1[Model.DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE] = value;
                    dfTimeZone = $.Deferred();
                    dfs.push(dfTimeZone);
                    if (care) {
                        setTimeout(function () {
                            _this.timeZoneModel_.save(savedAttr_1, {
                                success: function () {
                                    model.set(model.timeZoneModel_.toJSON());
                                    dfTimeZone.resolve();
                                },
                                error: function () {
                                    dfTimeZone.reject();
                                },
                                silent: true,
                            });
                        }, 100);
                    }
                    else {
                        this.timeZoneModel_.save(savedAttr_1, {
                            success: function () {
                                model.set(model.timeZoneModel_.toJSON());
                                dfTimeZone.resolve();
                            },
                            error: function () {
                                dfTimeZone.reject();
                            },
                            silent: true,
                        });
                    }
                }
                value = attributes[Model.DeviceSettingDefs.ATTR_NAME_DATE_FORMAT];
                if (typeof value === 'string' && this.dateFormatModel_) {
                    var savedAttr_2 = {};
                    savedAttr_2[Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT] = value;
                    dfDateFormat = $.Deferred();
                    dfs.push(dfDateFormat);
                    if (care) {
                        setTimeout(function () {
                            _this.dateFormatModel_.save(savedAttr_2, {
                                success: function () {
                                    model.set(model.dateFormatModel_.toJSON());
                                    dfDateFormat.resolve();
                                },
                                error: function () {
                                    dfDateFormat.reject();
                                },
                                silent: true,
                            });
                        }, 200);
                    }
                    else {
                        this.dateFormatModel_.save(savedAttr_2, {
                            success: function () {
                                model.set(model.dateFormatModel_.toJSON());
                                dfDateFormat.resolve();
                            },
                            error: function () {
                                dfDateFormat.reject();
                            },
                            silent: true,
                        });
                    }
                }
                value = attributes[Model.DeviceSettingDefs.ATTR_NAME_TIME_FORMAT];
                if (typeof value === 'string' && this.timeFormatModel_) {
                    var savedAttr_3 = {};
                    savedAttr_3[Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT] = value;
                    dfTimeFormat = $.Deferred();
                    dfs.push(dfTimeFormat);
                    if (care) {
                        setTimeout(function () {
                            _this.timeFormatModel_.save(savedAttr_3, {
                                success: function () {
                                    model.set(model.timeFormatModel_.toJSON());
                                    dfTimeFormat.resolve();
                                },
                                error: function () {
                                    dfTimeFormat.reject();
                                },
                                silent: true,
                            });
                        }, 300);
                    }
                    else {
                        this.timeFormatModel_.save(savedAttr_3, {
                            success: function () {
                                model.set(model.timeFormatModel_.toJSON());
                                dfTimeFormat.resolve();
                            },
                            error: function () {
                                dfTimeFormat.reject();
                            },
                            silent: true,
                        });
                    }
                }
                value = attributes[Model.DeviceSettingDefs.ATTR_NAME_INITIALIZED_FLAG];
                if (typeof value === 'string' && this.initializedFlagModel_) {
                    var savedAttr_4 = {};
                    savedAttr_4[Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG] = value;
                    dfInitializedFlag = $.Deferred();
                    dfs.push(dfInitializedFlag);
                    if (care) {
                        setTimeout(function () {
                            _this.initializedFlagModel_.save(savedAttr_4, {
                                success: function () {
                                    model.set(model.initializedFlagModel_.toJSON());
                                    dfInitializedFlag.resolve();
                                },
                                error: function () {
                                    dfInitializedFlag.reject();
                                },
                                silent: true,
                            });
                        }, 300);
                    }
                    else {
                        this.initializedFlagModel_.save(savedAttr_4, {
                            success: function () {
                                model.set(model.initializedFlagModel_.toJSON());
                                dfInitializedFlag.resolve();
                            },
                            error: function () {
                                dfInitializedFlag.reject();
                            },
                            silent: true,
                        });
                    }
                }
                value = attributes[Model.DeviceSettingDefs.ATTR_NAME_TIMEOUT_TO_STANBY];
                if (typeof value === 'string' && this.timeoutToStandbyModel_) {
                    var savedAttr_5 = {};
                    savedAttr_5[Model.DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY] = value;
                    dfTimeoutToStandby = $.Deferred();
                    dfs.push(dfTimeoutToStandby);
                    if (care) {
                        setTimeout(function () {
                            _this.timeoutToStandbyModel_.save(savedAttr_5, {
                                success: function () {
                                    model.set(model.timeoutToStandbyModel_.toJSON());
                                    dfTimeoutToStandby.resolve();
                                },
                                error: function () {
                                    dfTimeoutToStandby.reject();
                                },
                                silent: true,
                            });
                        }, 400);
                    }
                    else {
                        this.timeoutToStandbyModel_.save(savedAttr_5, {
                            success: function () {
                                model.set(model.timeoutToStandbyModel_.toJSON());
                                dfTimeoutToStandby.resolve();
                            },
                            error: function () {
                                dfTimeoutToStandby.reject();
                            },
                            silent: true,
                        });
                    }
                }
                value = attributes[Model.DeviceSettingDefs.ATTR_NAME_OWNER];
                if (typeof value === 'string' && this.ownerModel_) {
                    var savedAttr_6 = {};
                    savedAttr_6[Model.DeviceSetting.OwnerDefs.ATTR_NAME_OWNER] = value;
                    dfOwner = $.Deferred();
                    dfs.push(dfOwner);
                    if (care) {
                        setTimeout(function () {
                            _this.ownerModel_.save(savedAttr_6, {
                                success: function () {
                                    model.set(model.ownerModel_.toJSON());
                                    dfOwner.resolve();
                                },
                                error: function () {
                                    dfOwner.reject();
                                },
                                silent: true,
                            });
                        }, 500);
                    }
                    else {
                        this.ownerModel_.save(savedAttr_6, {
                            success: function () {
                                model.set(model.ownerModel_.toJSON());
                                dfOwner.resolve();
                            },
                            error: function () {
                                dfOwner.reject();
                            },
                            silent: true,
                        });
                    }
                }
                $.when.apply(this, dfs)
                    .then(function () {
                    if (options && options.success) {
                        options.success(model, model.toJSON(), options);
                    }
                    model.trigger('sync', model, model.toJSON(), options);
                })
                    .fail(function () {
                    if (options && options.error) {
                        options.error(model, attributes, options);
                    }
                    model.trigger('error', model, attributes, options);
                });
                return {};
            };
            DeviceSettingModel.prototype.init = function () {
                this.clear();
                this.timeZoneModel_ = null;
                this.dateFormatModel_ = null;
                this.timeFormatModel_ = null;
                this.initializedFlagModel_ = null;
                this.timeoutToStandbyModel_ = null;
                this.ownerModel_ = null;
                return this;
            };
            Object.defineProperty(DeviceSettingModel.prototype, "timeZoneModel", {
                get: function () {
                    return this.timeZoneModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(DeviceSettingModel.prototype, "dateFormatModel", {
                get: function () {
                    return this.dateFormatModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(DeviceSettingModel.prototype, "timeFormatModel", {
                get: function () {
                    return this.timeFormatModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(DeviceSettingModel.prototype, "initializedFlagModel", {
                get: function () {
                    return this.initializedFlagModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(DeviceSettingModel.prototype, "timeoutToStandbyModel", {
                get: function () {
                    return this.timeoutToStandbyModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(DeviceSettingModel.prototype, "ownerModel", {
                get: function () {
                    return this.ownerModel_;
                },
                enumerable: true,
                configurable: true
            });
            ;
            DeviceSettingModel.prototype.sync = function (method, model, options) {
                if (method === 'read') {
                    options = options || {};
                    var successCallbackOrig_1 = options.success || null;
                    var errorCallbackOrig = options.error || null;
                    options.success = function (response, status, options) {
                        model.timeZoneModel_.set(Model.DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE, response.timezone.value, {});
                        model.dateFormatModel_.set(Model.DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT, response.date_format.value, {});
                        model.timeFormatModel_.set(Model.DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT, response.time_format.value, {});
                        model.initializedFlagModel_.set(Model.DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG, response.initialized_flag.value, {});
                        model.timeoutToStandbyModel_.set(Model.DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY, response.timeout_to_standby.value, {});
                        model.ownerModel_.set(Model.DeviceSetting.OwnerDefs.ATTR_NAME_OWNER, response.owner.value, {});
                        if (successCallbackOrig_1) {
                            successCallbackOrig_1(null, status, options);
                        }
                    };
                    var urlRoot = DPMW.appCtrl.currentDevice.get(Model.Device.ATTR_NAME_BASE_URL);
                    options.url = urlRoot + '/system/configs';
                    return Backbone.sync(method, model, options);
                }
                throw new Error('method is not allowed here: ' + method);
            };
            DeviceSettingModel.prototype.parse = function (response, options) {
                if (response === null) {
                    return null;
                }
                console.error('can not be happen');
                return {};
            };
            return DeviceSettingModel;
        }(Model.BaseDPAPIModel));
        Model.DeviceSettingModel = DeviceSettingModel;
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceSettingModel.js.map