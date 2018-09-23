var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var Device;
        (function (Device) {
            var DevicePrimitiveModel = (function (_super) {
                __extends(DevicePrimitiveModel, _super);
                function DevicePrimitiveModel(attributes, options) {
                    _super.call(this, attributes, options);
                }
                DevicePrimitiveModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_DEVICE_ID] = null;
                    attributes[Device.ATTR_NAME_DEVICE_NAME] = null;
                    attributes[Device.ATTR_NAME_PHYSICAL_TYPE] = Device.VALUE_PHY_TYPE_NONE;
                    attributes[Device.ATTR_NAME_SKU_CODE] = null;
                    attributes[Device.ATTR_NAME_DEVICE_COLOR] = null;
                    return attributes;
                };
                Object.defineProperty(DevicePrimitiveModel.prototype, "idAttribute", {
                    get: function () {
                        return Device.ATTR_NAME_DEVICE_ID;
                    },
                    enumerable: true,
                    configurable: true
                });
                DevicePrimitiveModel.prototype.parse = function (response, options) {
                    if (typeof response.info !== 'undefined' && response.info !== null) {
                        if (typeof response.info.sku_code === 'string') {
                            response[Device.ATTR_NAME_SKU_CODE] = response.info.sku_code;
                        }
                        if (typeof response.info.device_color === 'string') {
                            response[Device.ATTR_NAME_DEVICE_COLOR] = response.info.device_color;
                        }
                    }
                    return response;
                };
                return DevicePrimitiveModel;
            }(Model.BaseModel));
            Device.DevicePrimitiveModel = DevicePrimitiveModel;
            var DeviceModel = (function (_super) {
                __extends(DeviceModel, _super);
                function DeviceModel(attributes, options) {
                    var _this = this;
                    _super.call(this, attributes, options);
                    this.deviceSettingModel_ = null;
                    this.documentCollection_ = null;
                    this.folderDocumentCollection_ = null;
                    this.searchCollection_ = null;
                    this.noteTemplateCollection_ = null;
                    this.wifiSettingModel_ = null;
                    this.deviceStorageModel_ = null;
                    this.deviceFirmwareModel_ = null;
                    this.deviceMacAddressModel_ = null;
                    this.connCtrl_ = null;
                    this.closed_ = false;
                    this.folderCollectionMap_ = new Map;
                    this.connCtrl_ = require('mw-conn-ctrl').createConnCtrl();
                    this.connCtrl_.on('deviceAppear', this.onDeviceAppear.bind(this));
                    this.connCtrl_.on('deviceDisappear', this.onDeviceDisappear.bind(this));
                    this.connCtrl_.on('deviceConnChanging', this.onDeviceConnChanging.bind(this));
                    this.connCtrl_.on('deviceConnChanged', this.onDeviceConnChanged.bind(this));
                    this.connCtrl_.on('deviceConnChangeFailed', this.onDeviceConnChangeFailed.bind(this));
                    this.connCtrl_.on('error', this.onError.bind(this));
                    this.mft_ = require('mw-file-transfer');
                    this.fileDownloader_ = require('mw-file-transfer').createFileTransfer(this.connCtrl_);
                    this.fileDownloader_.on('start', function (task) {
                        _this.trigger('startDownloadDocument', task);
                    });
                    this.fileDownloader_.on('end', function (task) {
                        _this.trigger('endDownloadDocument', task);
                    });
                    this.fileDownloader_.on('fail', function (task) {
                        _this.trigger('failDownloadDocument', task);
                    });
                    this.fileUploader_ = require('mw-file-transfer').createFileTransfer(this.connCtrl, { taskAutoRun: false });
                    this.fileUploader_.on('start', function (task) {
                        _this.trigger('startUploadDocument', task);
                    });
                    this.fileUploader_.on('taskAdded', function (task) {
                        _this.runUploadTask();
                    });
                    this.fileUploader_.on('end', function (task) {
                        _this.trigger('endUploadDocument', task);
                        _this.runUploadTask();
                    });
                    this.fileUploader_.on('fail', function (task) {
                        _this.trigger('failUploadDocument', task);
                        _this.runUploadTask();
                    });
                    this.filePrinter_ = require('mw-file-transfer').createFileTransfer(this.connCtrl, { taskAutoRun: false });
                    this.filePrinter_.on('start', function (task) {
                        _this.trigger('startPrintDocument', task);
                    });
                    this.filePrinter_.on('taskAdded', function (task) {
                        _this.runUploadTask();
                    });
                    this.filePrinter_.on('end', function (task) {
                        _this.trigger('endPrintDocument', task);
                        _this.runUploadTask();
                    });
                    this.filePrinter_.on('fail', function (task) {
                        _this.trigger('failPrintDocument', task);
                        _this.runUploadTask();
                    });
                    this.syncTransfer_ = require('mw-file-transfer').createFileTransfer(this.connCtrl, { taskAutoRun: false });
                    this.syncTransfer_.on('taskAdded', function (task) {
                        _this.runUploadTask();
                    });
                    this.syncTransfer_.on('end', function (task) {
                        _this.runUploadTask();
                    });
                    this.syncTransfer_.on('fail', function (task) {
                        _this.runUploadTask();
                    });
                    this.firmwareTransfer_ = require('mw-file-transfer').createFileTransfer(this.connCtrl, { singleTransfer: true, taskAutoRun: false });
                    this.firmwareTransfer_.on('taskAdded', function (task) {
                        _this.runUploadTask();
                    });
                    this.firmwareTransfer_.on('end', function (task) {
                        _this.runUploadTask();
                    });
                    this.firmwareTransfer_.on('fail', function (task) {
                        _this.runUploadTask();
                    });
                    this.noteTemplateTransfer_ = require('mw-file-transfer').createFileTransfer(this.connCtrl, { singleTransfer: true, taskAutoRun: false });
                    this.noteTemplateTransfer_.on('taskAdded', function (task) {
                        _this.runUploadTask();
                    });
                    this.noteTemplateTransfer_.on('end', function (task) {
                        _this.runUploadTask();
                    });
                    this.noteTemplateTransfer_.on('fail', function (task) {
                        _this.runUploadTask();
                    });
                }
                DeviceModel.prototype.defaults = function () {
                    var attributes = {};
                    attributes[Device.ATTR_NAME_DEVICE_ID] = null;
                    attributes[Device.ATTR_NAME_DEVICE_NAME] = null;
                    attributes[Device.ATTR_NAME_PHYSICAL_TYPE] = Device.VALUE_PHY_TYPE_NONE;
                    attributes[Device.ATTR_NAME_REMOTE_IP] = null;
                    attributes[Device.ATTR_NAME_REMOTE_PORT] = null;
                    attributes[Device.ATTR_NAME_LOCAL_IP] = null;
                    attributes[Device.ATTR_NAME_BASE_URL] = null;
                    attributes[Device.ATTR_NAME_CONNECTION_STATE] = Device.VALUE_CONNECTION_STATE_DISCONNECTED;
                    return attributes;
                };
                DeviceModel.prototype.close = function () {
                    this.closed_ = true;
                    this.connCtrl_.close();
                    this.connCtrl_.removeAllListeners();
                    this.connCtrl_ = null;
                    this.fileDownloader_.removeAllListeners();
                    this.fileDownloader_ = null;
                    this.fileUploader_.removeAllListeners();
                    this.fileUploader_ = null;
                    this.filePrinter_.removeAllListeners();
                    this.filePrinter_ = null;
                    this.deviceSettingModel_ = null;
                    this.documentCollection_ = null;
                    this.folderDocumentCollection_ = null;
                    this.searchCollection_ = null;
                    this.noteTemplateCollection_ = null;
                    this.wifiSettingModel_ = null;
                    this.deviceStorageModel_ = null;
                    this.deviceFirmwareModel_ = null;
                    this.deviceMacAddressModel_ = null;
                };
                DeviceModel.prototype.sync = function (method, model, options) {
                    switch (method) {
                        case Model.BackboneSyncDefs.METHOD_NAME_READ:
                            if (!this.connCtrl_) {
                                throw new Error('connection control is not found');
                            }
                            var attr = {};
                            var deviceInfo = this.connCtrl_.getDevice();
                            if (!deviceInfo) {
                                throw new Error('Fail to get device info from connection control');
                            }
                            attr[Device.ATTR_NAME_DEVICE_NAME] = deviceInfo.name;
                            attr[Device.ATTR_NAME_PHYSICAL_TYPE] = deviceInfo.phyType;
                            attr[Device.ATTR_NAME_REMOTE_IP] = deviceInfo.remoteIp;
                            attr[Device.ATTR_NAME_REMOTE_PORT] = deviceInfo.remotePort;
                            attr[Device.ATTR_NAME_LOCAL_IP] = deviceInfo.localIp;
                            if (typeof deviceInfo.info !== 'undefined' && deviceInfo.info !== null) {
                                if (typeof deviceInfo.info.sku_code === 'string') {
                                    attr[Device.ATTR_NAME_SKU_CODE] = deviceInfo.info.sku_code;
                                }
                                if (typeof deviceInfo.info.device_color === 'string') {
                                    attr[Device.ATTR_NAME_DEVICE_COLOR] = deviceInfo.info.device_color;
                                }
                            }
                            attr[Device.ATTR_NAME_BASE_URL] = this.connCtrl_.getBaseUrl();
                            if (options && options.success) {
                                options.success(attr);
                            }
                            break;
                        default:
                            throw new Error('Method is not allowed here: ' + method);
                    }
                    return null;
                };
                Object.defineProperty(DeviceModel.prototype, "idAttribute", {
                    get: function () {
                        return Device.ATTR_NAME_DEVICE_ID;
                    },
                    enumerable: true,
                    configurable: true
                });
                DeviceModel.prototype.init = function (deviceId, deviceName) {
                    var attr = {};
                    if (!deviceId) {
                        throw new Error('Device ID not found');
                    }
                    attr[Device.ATTR_NAME_DEVICE_ID] = deviceId;
                    attr[Device.ATTR_NAME_DEVICE_NAME] = deviceName ? deviceName : null;
                    attr[Device.ATTR_NAME_PHYSICAL_TYPE] = Device.VALUE_PHY_TYPE_NONE;
                    attr[Device.ATTR_NAME_REMOTE_IP] = null;
                    attr[Device.ATTR_NAME_REMOTE_PORT] = null;
                    attr[Device.ATTR_NAME_LOCAL_IP] = null;
                    attr[Device.ATTR_NAME_BASE_URL] = null;
                    attr[Device.ATTR_NAME_CONNECTION_STATE] = Device.VALUE_CONNECTION_STATE_DISCONNECTED;
                    this.set(attr);
                    if (this.deviceSettingModel_) {
                        this.deviceSettingModel_.init();
                    }
                    this.deviceSettingModel_ = null;
                    this.documentCollection_ = null;
                    this.documentCollection_ = null;
                    this.folderDocumentCollection_ = null;
                    this.searchCollection_ = null;
                    this.noteTemplateCollection_ = null;
                    if (this.wifiSettingModel_) {
                        this.wifiSettingModel_.init();
                    }
                    this.wifiSettingModel_ = null;
                    this.deviceStorageModel_ = null;
                    this.deviceFirmwareModel_ = null;
                    this.deviceMacAddressModel_ = null;
                    return this;
                };
                DeviceModel.prototype.connect = function (options) {
                    var _this = this;
                    var model = this;
                    var deviceId = this.get(Device.ATTR_NAME_DEVICE_ID);
                    var successOrg = options ? options.success : null;
                    var errorOrg = options ? options.error : null;
                    if (!deviceId) {
                        throw new Error('Device ID not found');
                    }
                    if (!this.connCtrl_) {
                        throw new Error('Failed to access a instance of connection control.');
                    }
                    var RETRY_CNT = 5;
                    var RETRY_INTERVAL = 500;
                    this.connectRetry(deviceId, RETRY_CNT, RETRY_INTERVAL, function (err) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (errorOrg) {
                                errorOrg(model, null, resOptions);
                            }
                            _this.trigger('connectFailed', err);
                            return;
                        }
                        model.fetch({
                            success: function (model, res, options) {
                                model.set(Device.ATTR_NAME_CONNECTION_STATE, Device.VALUE_CONNECTION_STATE_CONNECTED);
                                if (successOrg) {
                                    successOrg(model, res, options);
                                }
                                _this.trigger('connectSucceed');
                            },
                            error: function (model, res, options) {
                                if (errorOrg) {
                                    errorOrg(model, res, options);
                                }
                                _this.trigger('connectFailed', err);
                            }
                        });
                    });
                    return this;
                };
                DeviceModel.prototype.connectRetry = function (deviceId, retryCnt, retryInterval, callback) {
                    var _this = this;
                    if (!this.connCtrl_) {
                        callback(DPMW.mwe.genError(DPMW.mwe.E_MW_DEVICE_NOT_FOUND, 'Retry failed to access a instance of connection control.'));
                        return;
                    }
                    var remainingCnt = retryCnt - 1;
                    this.connCtrl_.connect(deviceId, function (err) {
                        if (err) {
                            if (remainingCnt > 0) {
                                setTimeout(function () {
                                    _this.connectRetry(deviceId, remainingCnt, retryInterval, callback);
                                }, retryInterval);
                            }
                            else {
                                callback(err);
                            }
                            return;
                        }
                        callback(null);
                    });
                };
                DeviceModel.prototype.auth = function (options) {
                    var _this = this;
                    var successOrig = options ? options.success : null;
                    var errorOrig = options ? options.error : null;
                    if (!this.connCtrl_) {
                        throw new Error('Failed to access a instance of connection control.');
                    }
                    this.connCtrl_.auth(function (err) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (errorOrig) {
                                errorOrig(_this, null, resOptions);
                            }
                            return;
                        }
                        if (successOrig) {
                            successOrig(_this, null, options);
                        }
                    });
                    return this;
                };
                Object.defineProperty(DeviceModel.prototype, "connCtrl", {
                    get: function () {
                        return this.connCtrl_;
                    },
                    enumerable: true,
                    configurable: true
                });
                DeviceModel.prototype.isConnected = function () {
                    if (this.closed_ ||
                        this.get(Device.ATTR_NAME_CONNECTION_STATE) !== Device.VALUE_CONNECTION_STATE_CONNECTED) {
                        return false;
                    }
                    return true;
                };
                Object.defineProperty(DeviceModel.prototype, "deviceSettingModel", {
                    get: function () {
                        if (!this.deviceSettingModel_ && this.isConnected()) {
                            this.deviceSettingModel_ = new Model.DeviceSettingModel(null, { deviceModel: this });
                        }
                        return this.deviceSettingModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(DeviceModel.prototype, "noteTemplateCollection", {
                    get: function () {
                        if (!this.noteTemplateCollection_ && this.isConnected()) {
                            this.noteTemplateCollection_ = new Model.NoteTemplateCollection(this);
                        }
                        return this.noteTemplateCollection_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DeviceModel.prototype, "wifiSettingModel", {
                    get: function () {
                        if (!this.wifiSettingModel_ && this.isConnected()) {
                            this.wifiSettingModel_ = new Model.WiFiSettingModel(null, { deviceModel: this });
                        }
                        return this.wifiSettingModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DeviceModel.prototype, "deviceStorageModel", {
                    get: function () {
                        if (!this.deviceStorageModel_ && this.isConnected()) {
                            this.deviceStorageModel_ = new Device.DeviceStorageModel(null, { deviceModel: this });
                        }
                        return this.deviceStorageModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DeviceModel.prototype, "deviceFirmwareModel", {
                    get: function () {
                        if (!this.deviceFirmwareModel_ && this.isConnected()) {
                            this.deviceFirmwareModel_ = new Device.DeviceFirmwareModel(null, { deviceModel: this });
                        }
                        return this.deviceFirmwareModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DeviceModel.prototype, "deviceMacAddressModel", {
                    get: function () {
                        if (!this.deviceMacAddressModel_ && this.isConnected()) {
                            this.deviceMacAddressModel_ = new Device.DeviceMacAddressModel(null, { deviceModel: this });
                        }
                        return this.deviceMacAddressModel_;
                    },
                    enumerable: true,
                    configurable: true
                });
                DeviceModel.prototype.getDocumentCollection = function () {
                    if (!this.documentCollection_ && this.isConnected()) {
                        this.documentCollection_ = new Model.Content.DocumentCollection(this);
                    }
                    this.documentCollection_.addReference();
                    return this.documentCollection_;
                };
                ;
                DeviceModel.prototype.invalidateDocumentCollection = function () {
                    this.documentCollection_ = null;
                };
                DeviceModel.prototype.getSearchCollection = function () {
                    if (!this.searchCollection_ && this.isConnected()) {
                        this.searchCollection_ = new Model.Content.SearchCollection(this);
                    }
                    this.searchCollection_.addReference();
                    return this.searchCollection_;
                };
                ;
                DeviceModel.prototype.invalidateSearchCollection = function () {
                    this.searchCollection_ = null;
                };
                DeviceModel.prototype.getFolderEntityCollection = function (folderId) {
                    if (typeof folderId !== 'string') {
                        throw new TypeError('folderId must be a string');
                    }
                    var folderEntityCollection = this.folderCollectionMap_.get(folderId);
                    if (typeof folderEntityCollection === 'undefined') {
                        folderEntityCollection = new Model.Content.FolderDocumentCollection(this, folderId);
                        this.folderCollectionMap_.set(folderId, folderEntityCollection);
                    }
                    folderEntityCollection.addReference();
                    return folderEntityCollection;
                };
                DeviceModel.prototype.invalidateFolderEntityCollection = function (folderId) {
                    if (!this.folderCollectionMap_.has(folderId)) {
                        throw new Error('folderId is already invalidated');
                    }
                    this.folderCollectionMap_.delete(folderId);
                };
                DeviceModel.prototype.getEntityModelByPath = function (path) {
                    var model = new Model.EntityModel({
                        entry_path: path
                    }, {
                        deviceModel: this
                    });
                    model.addReference();
                    return model;
                };
                DeviceModel.prototype.getDocumentModel = function (documentId) {
                    var model = new Model.EntityModel({
                        entry_id: documentId,
                        entry_type: 'document'
                    }, {
                        deviceModel: this
                    });
                    model.addReference();
                    return model;
                };
                DeviceModel.prototype.getFolderModel = function (folderId) {
                    var model = new Model.EntityModel({
                        entry_id: folderId,
                        entry_type: 'folder'
                    }, {
                        deviceModel: this
                    });
                    model.addReference();
                    return model;
                };
                DeviceModel.prototype.downloadDocument = function (srcDocumentId, dstFilePath, options) {
                    var model = this;
                    this.fileDownloader_.downloadDocument(srcDocumentId, dstFilePath, function (err, task) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (options && options.error) {
                                options.error(model, null, resOptions);
                            }
                            return;
                        }
                        if (options && options.success) {
                            var resOptions = $.extend(true, options, { task: task });
                            options.success(model, null, resOptions);
                        }
                    });
                };
                DeviceModel.prototype.currentDownloadBytesTransferred = function () {
                    return this.fileDownloader_.getCurrentBytesTransferred();
                };
                DeviceModel.prototype.currentDownloadBytesTotal = function () {
                    return this.fileDownloader_.getCurrentBytesTotal();
                };
                DeviceModel.prototype.waitingDownloadsCount = function () {
                    return this.fileDownloader_.getWaitingTaskCount();
                };
                DeviceModel.prototype.cancelAllDownloadDocument = function (options) {
                    var model = this;
                    this.fileDownloader_.cancelAllTasks(function (err) {
                        if (err) {
                            if (options && options.error) {
                                options.mwError = err;
                                options.error(model, null, options);
                            }
                            return;
                        }
                        if (options && options.success) {
                            options.success(model, null, options);
                        }
                    });
                };
                DeviceModel.prototype.downloadDocumentAsBinary = function (srcDocumentId, options) {
                    var downloader = require('mw-file-transfer').createFileTransfer(this.connCtrl_);
                    downloader.downloadDocumentAsBinary(srcDocumentId, function (buffer, final) {
                        if (options.progress) {
                            options.progress(buffer, final);
                        }
                    }, function (err) {
                        if (err && options && options.error) {
                            options.error(err);
                        }
                    });
                    return downloader;
                };
                DeviceModel.prototype.runUploadTask = function () {
                    if (this.noteTemplateTransfer_.isRunning()
                        || this.filePrinter_.isRunning()
                        || this.fileUploader_.isRunning()
                        || (this.deviceFirmwareModel && this.deviceFirmwareModel.isUploading())) {
                        return;
                    }
                    var syncTask = this.syncTransfer_.getCurrentTask();
                    if (this.syncTransfer_.isRunning() && syncTask
                        && (syncTask.type === this.mft_.TASK_TYPE_UPLOAD_DOCUMENT_BY_PATH
                            || syncTask.type === this.mft_.TASK_TYPE_UPLOAD_DOCUMENT_BY_ID
                            || syncTask.type === this.mft_.TASK_TYPE_UPLOAD_OVERWRITE_DOCUMENT_BY_PATH
                            || syncTask.type === this.mft_.TASK_TYPE_UPLOAD_OVERWRITE_DOCUMENT_BY_ID)) {
                        return;
                    }
                    if (this.noteTemplateTransfer_.getWaitingTaskCount() > 0) {
                        this.noteTemplateTransfer_.runOneTask();
                        return;
                    }
                    if (this.filePrinter_.getWaitingTaskCount() > 0) {
                        this.filePrinter_.runOneTask();
                        return;
                    }
                    if (this.fileUploader_.getWaitingTaskCount() > 0) {
                        this.fileUploader_.runOneTask();
                        return;
                    }
                    if (this.firmwareTransfer_.getWaitingTaskCount() > 0) {
                        this.firmwareTransfer_.runOneTask();
                        return;
                    }
                    if (!this.syncTransfer_.isRunning() && this.syncTransfer_.getWaitingTaskCount() > 0) {
                        this.syncTransfer_.runOneTask();
                        return;
                    }
                };
                DeviceModel.prototype.uploadDocumentById = function (srcFilePath, dstFolderId, dstFileName, options) {
                    var model = this;
                    this.fileUploader_.uploadDocumentById(dstFolderId, srcFilePath, dstFileName, function (err, task) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (options && options.error) {
                                options.error(model, null, resOptions);
                            }
                            return;
                        }
                        if (options && options.success) {
                            var resOptions = $.extend(true, options, { task: task });
                            options.success(model, null, resOptions);
                        }
                        model.deviceStorageModel.fetch();
                    });
                };
                DeviceModel.prototype.uploadDocumentByPath = function (srcFilePath, dstFolderPath, dstFileName, options) {
                    var model = this;
                    this.fileUploader_.uploadDocumentByPath(dstFolderPath, srcFilePath, dstFileName, function (err, task) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (options && options.error) {
                                options.error(model, null, resOptions);
                            }
                            return;
                        }
                        if (options && options.success) {
                            var resOptions = $.extend(true, options, { task: task });
                            options.success(model, null, resOptions);
                        }
                        model.deviceStorageModel.fetch();
                    });
                };
                DeviceModel.prototype.currentUploadBytesTransferred = function () {
                    return this.fileUploader_.getCurrentBytesTransferred();
                };
                DeviceModel.prototype.currentUploadBytesTotal = function () {
                    return this.fileUploader_.getCurrentBytesTotal();
                };
                DeviceModel.prototype.waitingUploadsCount = function () {
                    return this.fileUploader_.getWaitingTaskCount();
                };
                DeviceModel.prototype.cancelAllUploadDocument = function (options) {
                    var model = this;
                    this.fileUploader_.cancelAllTasks(function (err) {
                        if (err) {
                            if (options && options.error) {
                                options.mwError = err;
                                options.error(model, null, options);
                            }
                            return;
                        }
                        if (options && options.success) {
                            options.success(model, null, options);
                        }
                    });
                };
                DeviceModel.prototype.printDocument = function (srcFilePath, dstFileName, options) {
                    var model = this;
                    if (DPMW.appCtrl.currentDevice.deviceFirmwareModel.isUploading()) {
                        var mwerr = DPMW.mwe.genError(DPMW.mwe.E_MW_UO_NOT_ALLOWED, 'firmware uploading.');
                        var resOptions = $.extend(true, options, { mwError: mwerr });
                        if (options && options.error) {
                            options.error(model, null, resOptions);
                        }
                        return;
                    }
                    this.filePrinter_.uploadDocumentByPath('Document/Received/', srcFilePath, dstFileName, function (err, task) {
                        if (err) {
                            var resOptions = $.extend(true, options, { mwError: err });
                            if (options && options.error) {
                                options.error(model, null, resOptions);
                            }
                            return;
                        }
                        if (options && options.success) {
                            var resOptions = $.extend(true, options, { task: task });
                            options.success(model, null, resOptions);
                        }
                        model.deviceStorageModel.fetch();
                    });
                };
                DeviceModel.prototype.currentPrintBytesTransferred = function () {
                    return this.filePrinter_.getCurrentBytesTransferred();
                };
                DeviceModel.prototype.currentPrintBytesTotal = function () {
                    return this.filePrinter_.getCurrentBytesTotal();
                };
                DeviceModel.prototype.waitingPrintsCount = function () {
                    return this.filePrinter_.getWaitingTaskCount();
                };
                DeviceModel.prototype.cancelAllPrintDocument = function (options) {
                    var model = this;
                    this.filePrinter_.cancelAllTasks(function (err) {
                        if (err) {
                            if (options && options.error) {
                                options.mwError = err;
                                options.error(model, null, options);
                            }
                            return;
                        }
                        if (options && options.success) {
                            options.success(model, null, options);
                        }
                    });
                };
                DeviceModel.prototype.getSyncTransfer = function () {
                    return this.syncTransfer_;
                };
                DeviceModel.prototype.getNoteTemplateTransfer = function () {
                    return this.noteTemplateTransfer_;
                };
                DeviceModel.prototype.getFirmwareTransfer = function () {
                    return this.firmwareTransfer_;
                };
                DeviceModel.prototype.createFolder = function (parentFolderId, folderName, options) {
                    var params = {
                        parent_folder_id: parentFolderId,
                        folder_name: folderName,
                    };
                    Model.BackboneSync.callWebApiForDevice(this, 'POST', '/folders', params, [200], options);
                };
                DeviceModel.prototype.copyDocument = function (documentId, parentFolderId, fileName, options) {
                    if (typeof parentFolderId !== 'string') {
                        throw new TypeError('parentFolderId must be set');
                    }
                    if (typeof fileName !== 'string' && fileName !== null) {
                        throw new TypeError('fileName must be set');
                    }
                    var params = {
                        parent_folder_id: parentFolderId
                    };
                    if (fileName) {
                        params.file_name = fileName;
                    }
                    Model.BackboneSync.callWebApiForDevice(this, 'POST', '/documents/' + documentId + '/copy', params, [200], options);
                };
                DeviceModel.prototype.screenCapture = function (dstFilePath, options) {
                    if (typeof dstFilePath !== 'string') {
                        throw new TypeError('dstFilePath must be string');
                    }
                    var validStatuses = [200];
                    var httpMethod = 'GET';
                    var urlPath = '/system/controls/screen_shot';
                    var urlRoot = DPMW.appCtrl.currentDevice.get(Device.ATTR_NAME_BASE_URL);
                    var successOrig = options ? options.success : null;
                    var errorOrig = options ? options.error : null;
                    if (!urlRoot) {
                        if (typeof errorOrig === 'function') {
                            options.mwError = new Error('base url is null and there is a need to discard the invalid model or collection.');
                            errorOrig(this, null, options);
                        }
                        return null;
                    }
                    var self = this;
                    var xhrReq = new XMLHttpRequest();
                    xhrReq.responseType = 'arraybuffer';
                    xhrReq.timeout = Model.BackboneSyncDefs.XHR_TIMEOUT;
                    xhrReq.open(httpMethod, urlRoot + urlPath, true);
                    var callbackHandled = false;
                    xhrReq.ontimeout = function (err) {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR timeout occured.', httpMethod, urlPath, xhrReq.status, null);
                        if (typeof errorOrig === 'function') {
                            errorOrig(self, xhrReq, options);
                        }
                        return;
                    };
                    xhrReq.onabort = function (err) {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR abort occured.', httpMethod, urlPath, xhrReq.status, null);
                        if (typeof errorOrig === 'function') {
                            errorOrig(self, xhrReq, options);
                        }
                        return;
                    };
                    xhrReq.onerror = function (err) {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        if (validStatuses.indexOf(xhrReq.status) < 0) {
                            options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', httpMethod, urlPath, xhrReq.status, null);
                            if (typeof errorOrig === 'function') {
                                errorOrig(self, xhrReq, options);
                            }
                            return;
                        }
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error occured.', httpMethod, urlPath, xhrReq.status, null);
                        if (typeof errorOrig === 'function') {
                            errorOrig(self, xhrReq, options);
                        }
                        return;
                    };
                    xhrReq.onload = function () {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        if (validStatuses.indexOf(xhrReq.status) < 0) {
                            options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', httpMethod, urlPath, xhrReq.status, null);
                            if (typeof errorOrig === 'function') {
                                errorOrig(self, xhrReq, options);
                            }
                            return;
                        }
                        var fs = require('fs');
                        var len = parseInt(xhrReq.getResponseHeader('Content-Length'));
                        var arrayBuf = xhrReq.response;
                        var buf = Buffer.from(arrayBuf);
                        fs.writeFile(dstFilePath, buf, function (err) {
                            if (err) {
                                options.mwError = DPMW.mwe.genError(DPMW.mwe.E_MW_FILE_WRITE_LOCAL_FAILED, 'Fail to create local file for screen capture.');
                                if (typeof errorOrig === 'function') {
                                    errorOrig(self, xhrReq, options);
                                }
                                return;
                            }
                            if (typeof successOrig === 'function') {
                                successOrig(self, xhrReq, options);
                            }
                        });
                    };
                    xhrReq.send();
                };
                DeviceModel.prototype.screenCaptureWithoutSaving = function (options) {
                    var validStatuses = [200];
                    var httpMethod = 'GET';
                    var urlPath = '/system/controls/screen_shot';
                    var urlRoot = DPMW.appCtrl.currentDevice.get(Device.ATTR_NAME_BASE_URL);
                    var successOrig = options ? options.success : null;
                    var errorOrig = options ? options.error : null;
                    if (!urlRoot) {
                        if (typeof errorOrig === 'function') {
                            options.mwError = new Error('base url is null and there is a need to discard the invalid model or collection.');
                            errorOrig(this, null, options);
                        }
                        return null;
                    }
                    var self = this;
                    var xhrReq = new XMLHttpRequest();
                    xhrReq.responseType = 'arraybuffer';
                    xhrReq.timeout = Model.BackboneSyncDefs.XHR_TIMEOUT;
                    xhrReq.open(httpMethod, urlRoot + urlPath, true);
                    var callbackHandled = false;
                    xhrReq.ontimeout = function (err) {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR timeout occured.', httpMethod, urlPath, xhrReq.status, null);
                        if (typeof errorOrig === 'function') {
                            errorOrig(self, xhrReq, options);
                        }
                        return;
                    };
                    xhrReq.onabort = function (err) {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'XHR abort occured.', httpMethod, urlPath, xhrReq.status, null);
                        if (typeof errorOrig === 'function') {
                            errorOrig(self, xhrReq, options);
                        }
                        return;
                    };
                    xhrReq.onerror = function (err) {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        if (validStatuses.indexOf(xhrReq.status) < 0) {
                            options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', httpMethod, urlPath, xhrReq.status, null);
                            if (typeof errorOrig === 'function') {
                                errorOrig(self, xhrReq, options);
                            }
                            return;
                        }
                        options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_ERROR, 'Error occured.', httpMethod, urlPath, xhrReq.status, null);
                        if (typeof errorOrig === 'function') {
                            errorOrig(self, xhrReq, options);
                        }
                        return;
                    };
                    xhrReq.onload = function () {
                        if (callbackHandled) {
                            return;
                        }
                        callbackHandled = true;
                        if (validStatuses.indexOf(xhrReq.status) < 0) {
                            options.mwError = DPMW.mwe.genWebApiError(DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS, 'Wrong status value.', httpMethod, urlPath, xhrReq.status, null);
                            if (typeof errorOrig === 'function') {
                                errorOrig(self, xhrReq, options);
                            }
                            return;
                        }
                        if (typeof successOrig === 'function') {
                            successOrig(self, xhrReq, options);
                        }
                    };
                    xhrReq.send();
                };
                DeviceModel.prototype.queryBaseUrl = function () {
                    return DPMW.appCtrl.currentDevice.get(Device.ATTR_NAME_BASE_URL);
                };
                DeviceModel.prototype.tryToAuth = function (callback) {
                    if (this.connCtrl_) {
                        this.connCtrl_.auth(function (err) {
                            if (!err) {
                                callback(true);
                            }
                            else {
                                callback(false);
                            }
                        });
                    }
                    else {
                        callback(false);
                    }
                };
                DeviceModel.prototype.openDocument = function (documentId, options) {
                    if (typeof documentId !== 'string') {
                        throw new TypeError('documentId must be a string');
                    }
                    Model.BackboneSync.callWebApiForDevice(this, 'PUT', '/viewer/controls/open', { document_id: documentId }, [204], options);
                };
                DeviceModel.prototype.setDateTime = function (dateTime, options) {
                    if (typeof dateTime !== 'string') {
                        throw new TypeError('dateTime must be a string');
                    }
                    Model.BackboneSync.callWebApiForDevice(this, 'PUT', '/system/configs/datetime', { value: dateTime }, [204], options);
                };
                DeviceModel.prototype.onDeviceAppear = function (arg) {
                    if (!this.connCtrl_) {
                        throw new Error('connection control is not found');
                    }
                    if (!arg || !arg.deviceId) {
                        throw new Error('device ID is not found on deviceAppear event');
                    }
                    if (arg.deviceId !== this.id) {
                        throw new Error('device ID is not current ID on deviceAppear event');
                    }
                    if (this.isConnected()) {
                        this.init(this.get(Device.ATTR_NAME_DEVICE_ID), this.get(Device.ATTR_NAME_DEVICE_NAME));
                    }
                    this.connect();
                };
                DeviceModel.prototype.onDeviceDisappear = function (arg) {
                    if (!this.connCtrl_) {
                        throw new Error('connection control is not found');
                    }
                    if (!arg || !arg.deviceId) {
                        throw new Error('device ID is not found on deviceAppear event');
                    }
                    if (arg.deviceId !== this.id) {
                        throw new Error('device ID is not current ID on deviceAppear event');
                    }
                    this.init(this.get(Device.ATTR_NAME_DEVICE_ID), this.get(Device.ATTR_NAME_DEVICE_NAME));
                };
                DeviceModel.prototype.onDeviceConnChanging = function (arg) {
                    if (!this.connCtrl_) {
                        throw new Error('connection control is not found');
                    }
                    if (!arg || !arg.deviceId) {
                        throw new Error('device ID is not found on deviceAppear event');
                    }
                    if (arg.deviceId !== this.id) {
                        throw new Error('device ID is not current ID on deviceAppear event');
                    }
                    this.set(Device.ATTR_NAME_BASE_URL, null);
                };
                DeviceModel.prototype.onDeviceConnChanged = function (arg) {
                    if (!this.connCtrl_) {
                        throw new Error('connection control is not found');
                    }
                    if (!arg || !arg.deviceId) {
                        throw new Error('device ID is not found on deviceAppear event');
                    }
                    if (arg.deviceId !== this.id) {
                        throw new Error('device ID is not current ID on deviceAppear event');
                    }
                    this.set(Device.ATTR_NAME_BASE_URL, this.connCtrl_.getBaseUrl());
                    this.set(Device.ATTR_NAME_PHYSICAL_TYPE, arg.phyType);
                };
                DeviceModel.prototype.onDeviceConnChangeFailed = function (err) {
                    this.init(this.get(Device.ATTR_NAME_DEVICE_ID), this.get(Device.ATTR_NAME_DEVICE_NAME));
                    this.trigger('error', this, null, err);
                };
                DeviceModel.prototype.onError = function (err) {
                    this.init(this.get(Device.ATTR_NAME_DEVICE_ID), this.get(Device.ATTR_NAME_DEVICE_NAME));
                    this.trigger('error', this, null, err);
                };
                DeviceModel.prototype.disconnect = function () {
                    if (!this.connCtrl_) {
                        throw new Error('connection control is not found');
                    }
                    this.init(this.get(Device.ATTR_NAME_DEVICE_ID), this.get(Device.ATTR_NAME_DEVICE_NAME));
                };
                return DeviceModel;
            }(Model.BaseModel));
            Device.DeviceModel = DeviceModel;
        })(Device = Model.Device || (Model.Device = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceModel.js.map