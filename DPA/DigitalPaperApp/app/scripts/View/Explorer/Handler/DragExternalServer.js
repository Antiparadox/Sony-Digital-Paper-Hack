var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var STARTPORTNUMBER = 8081;
                var ENDPORTNUMBER = 65535;
                var DRAGANDDROPPATH = '/draganddrop/';
                var PORTCONFLICT = 'EADDRINUSE';
                var HOST = 'http://localhost:';
                var DragExternalServer = (function (_super) {
                    __extends(DragExternalServer, _super);
                    function DragExternalServer() {
                        _super.apply(this, arguments);
                        this.LISTENER_ID = (function () {
                            var uuid = require('uuid');
                            return uuid();
                        })();
                        this.transferTasks_ = null;
                        this.currentPortNumber = Number(process.env.MW_EXTERNALSERVER_PORT_HTTP_FIRST);
                        this.lastPortNumber = Number(process.env.MW_EXTERNALSERVER_PORT_HTTP_LAST);
                        this.connectTimeout = Number(process.env.MW_EXTERNALSERVER_CONNECT_TIMEOUT);
                        this.urlInfos = {};
                        this.downloadURLGeneratedCount = 0;
                    }
                    DragExternalServer.prototype.start = function (options) {
                        this.currentPortNumber = Number(process.env.MW_EXTERNALSERVER_PORT_HTTP_FIRST);
                        this.transferTasks_ = {};
                        var http = require('http');
                        this.server = http.createServer(this.handleRequest.bind(this));
                        this.listen(this.server, this.currentPortNumber, options);
                        this.downloadListener();
                    };
                    DragExternalServer.prototype.issueDownloadUrl = function (entryId) {
                        if (typeof entryId !== 'string' || entryId === '') {
                            throw new Error('entryId must be non-empty string');
                        }
                        ++this.downloadURLGeneratedCount;
                        var downloadUrl = HOST + this.currentPortNumber + DRAGANDDROPPATH + this.downloadURLGeneratedCount;
                        this.urlInfos[downloadUrl] = entryId;
                        return downloadUrl;
                    };
                    DragExternalServer.prototype.cancelDownloadUrl = function (downloadUrl) {
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (downloadUrl in this.urlInfos) {
                            delete this.urlInfos[downloadUrl];
                        }
                    };
                    DragExternalServer.prototype.getStatuses = function () {
                        var transferProgress = [];
                        for (var downloadUrl in this.transferTasks_) {
                            var downloader = this.transferTasks_[downloadUrl][0];
                            transferProgress.push({
                                transfered: downloader.getCurrentBytesTransferred(),
                                total: downloader.getCurrentBytesTotal(),
                                entryId: this.transferTasks_[downloadUrl][1],
                                downloadUrl: downloadUrl,
                            });
                        }
                        return transferProgress;
                    };
                    DragExternalServer.prototype.end = function () {
                        this.server.close(this.serverCloseHandler.bind(this));
                    };
                    DragExternalServer.prototype.cancelAllDownloadTasks = function (options) {
                        var promiseArray = [];
                        for (var downloadUrl in this.transferTasks_) {
                            var downloader = this.transferTasks_[downloadUrl][0];
                            promiseArray.push(this.cancelTask(downloader));
                        }
                        Promise.all(promiseArray).then(function (values) {
                            if (typeof values === 'undefined') {
                                throw new Error('resolve values does not passed');
                            }
                            for (var i = 0; i < values.length; i++) {
                                if (values[i] !== true) {
                                    if (options && options.error) {
                                        options.error(values[i]);
                                    }
                                    return;
                                }
                            }
                            if (options && options.success) {
                                options.success();
                            }
                        });
                    };
                    DragExternalServer.prototype.downloadListener = function () {
                        var _this = this;
                        var currentWindow = require('electron').remote.getCurrentWindow();
                        currentWindow.webContents.session.on('will-download', function (event, item, webContents) {
                            try {
                                var downloadUrl = item.getURL();
                                if (!_this.transferTasks_.hasOwnProperty(downloadUrl)) {
                                    return;
                                }
                                item.on('updated', function (event, state) {
                                    if (state === 'interrupted') {
                                        _this.downloadItemErrorHandler(downloadUrl);
                                    }
                                });
                                item.once('done', function (event, state) {
                                    if (state === 'completed') {
                                        if (_this.transferTasks_.hasOwnProperty(downloadUrl)) {
                                            var eventParam = {
                                                entryId: _this.transferTasks_[downloadUrl][1],
                                                downloadUrl: downloadUrl };
                                            delete _this.transferTasks_[downloadUrl];
                                            _this.trigger('downloadSuccess', eventParam);
                                        }
                                    }
                                    else {
                                        _this.downloadItemErrorHandler(downloadUrl);
                                    }
                                });
                            }
                            catch (error) {
                                console.error(error);
                            }
                        });
                    };
                    DragExternalServer.prototype.downloadItemErrorHandler = function (downloadUrl) {
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (this.transferTasks_.hasOwnProperty(downloadUrl)) {
                            var eventParam = {
                                entryId: this.transferTasks_[downloadUrl][1],
                                downloadUrl: downloadUrl };
                            var downloader = this.transferTasks_[downloadUrl][0];
                            delete this.transferTasks_[downloadUrl];
                            var err = DPMW.mwe.genError(DPMW.mwe.E_MW_EXTERNAL_DOWNLOAD_INTERRUPTED, 'Explorer or Finder failed to download the file');
                            this.trigger('downloadError', err, eventParam);
                            downloader.cancelAllTasks(function () {
                            });
                        }
                    };
                    DragExternalServer.prototype.cancelTask = function (downloader) {
                        return new Promise(function (resolve, reject) {
                            downloader.cancelAllTasks(function (error) {
                                if (error) {
                                    console.error('cancelAllTasks failed', error);
                                    resolve(error);
                                    return;
                                }
                                resolve(true);
                            });
                        });
                    };
                    DragExternalServer.prototype.serverCloseHandler = function (err) {
                        if (typeof err !== 'undefined') {
                            console.log('server is already closed', err);
                        }
                        else {
                            console.log('server is closed successfully');
                        }
                        this.currentPortNumber = Number(process.env.MW_EXTERNALSERVER_PORT_HTTP_FIRST);
                        this.urlInfos = {};
                        this.downloadURLGeneratedCount = 0;
                        this.transferTasks_ = null;
                    };
                    DragExternalServer.prototype.listen = function (server, port, options) {
                        var self = this;
                        if (typeof server === 'undefined') {
                            throw new Error('Serverobject does not passed');
                        }
                        if (typeof port !== 'number' || port < 0 || port > this.lastPortNumber) {
                            throw new Error('port is wrong');
                        }
                        var safeSuccessCallback = (options && options.success) ? options.success : function () { };
                        var safeErrorCallback = (options && options.error) ? options.error : function (err) { };
                        server.on('listening', function () {
                            var checkListener = function () {
                                var xhttp = new XMLHttpRequest();
                                xhttp.onreadystatechange = function () {
                                    if (this.readyState === 4) {
                                        if ((this.status === 200) && (this.responseText === self.LISTENER_ID)) {
                                            console.log('Listening on port ' + server.address().port.toString());
                                            self.currentPortNumber = server.address().port;
                                            safeSuccessCallback();
                                        }
                                        else {
                                            safeErrorCallback(undefined);
                                        }
                                    }
                                };
                                xhttp.open('GET', 'http://localhost:' + server.address().port.toString() + '/identify', true);
                                xhttp.send();
                            };
                            var net = require('net');
                            var address = server.address().address;
                            var client = net.createConnection(port, address, function () {
                                client.end();
                                client.destroy();
                                checkListener();
                            });
                            var time = Number(process.env.MW_EXTERNALSERVER_CONNECT_TIMEOUT);
                            client.setTimeout(time);
                            client.on('timeout', function () {
                                console.log('timeout(firewall?):', port);
                                client.end();
                                client.destroy();
                                server.close();
                                port++;
                                if (port > self.lastPortNumber) {
                                    var error = DPMW.mwe.genError(DPMW.mwe.E_MW_PORTFWDR_PORT_UNAVAILABLE, 'All ports are used!');
                                    safeErrorCallback(error);
                                    return;
                                }
                                server.listen(port, address);
                            });
                        });
                        server.on('error', function (err) {
                            if (typeof err === 'undefined') {
                                throw new Error('Server error object does not passed');
                            }
                            if (err.code !== 'EADDRINUSE' && err.code !== 'EACCES') {
                                console.log('http server error:' + err);
                                return;
                            }
                            console.log(err.code + ":", port);
                            port++;
                            if (port > self.lastPortNumber) {
                                var error = DPMW.mwe.genError(DPMW.mwe.E_MW_PORTFWDR_PORT_UNAVAILABLE, 'All ports are used!');
                                safeErrorCallback(error);
                                console.log(error);
                                return;
                            }
                            server.listen(port, 'localhost');
                        });
                        server.listen(port, 'localhost');
                    };
                    DragExternalServer.prototype.handleRequest = function (request, response) {
                        if (request.url === '/identify') {
                            response.writeHead(200, {
                                'Content-Type': 'text/plain'
                            });
                            response.write(this.LISTENER_ID);
                            response.end();
                            return;
                        }
                        var entryId = this.filterRequest(request);
                        if (typeof entryId === 'string' && entryId !== '') {
                            var url = request.url;
                            var downloadUrl = HOST + this.currentPortNumber + url;
                            response.writeHead(200, { 'Content-Type': 'application/pdf' });
                            var eventParam = {
                                entryId: entryId,
                                downloadUrl: downloadUrl };
                            this.trigger('downloadStart', eventParam);
                            var downloader = DPMW.appCtrl.currentDevice.downloadDocumentAsBinary(entryId, {
                                progress: this.progressHandler.bind(this, response, downloadUrl),
                                error: this.downloadErrorHandler.bind(this, response, downloadUrl)
                            });
                            this.transferTasks_[downloadUrl] = [downloader, entryId];
                        }
                        else {
                            request.connection.destroy();
                        }
                    };
                    DragExternalServer.prototype.progressHandler = function (response, downloadUrl, buffer, last) {
                        if (typeof response === 'undefined') {
                            throw new Error('a response should not be undefined.');
                        }
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (typeof buffer !== 'object') {
                            throw new Error('buffer should be Unit8Array');
                        }
                        if (typeof last !== 'boolean') {
                            throw new Error('last should be boolean');
                        }
                        if (last) {
                            response.end(buffer);
                            if (this.transferTasks_.hasOwnProperty(downloadUrl)) {
                                var eventParam = {
                                    entryId: this.transferTasks_[downloadUrl][1],
                                    downloadUrl: downloadUrl };
                                delete this.transferTasks_[downloadUrl];
                            }
                            this.trigger('downloadSuccess', eventParam);
                        }
                        else {
                            response.write(buffer);
                        }
                    };
                    DragExternalServer.prototype.downloadErrorHandler = function (response, downloadUrl, err) {
                        if (typeof response === 'undefined') {
                            throw new Error('a response should not be undefined.');
                        }
                        if (typeof downloadUrl !== 'string' || downloadUrl === '') {
                            throw new Error('downloadUrl must be non-empty string');
                        }
                        if (typeof err === 'undefined') {
                            throw new Error('error object does not passed');
                        }
                        if (this.transferTasks_.hasOwnProperty(downloadUrl)) {
                            var eventParam = {
                                entryId: this.transferTasks_[downloadUrl][1],
                                downloadUrl: downloadUrl };
                            delete this.transferTasks_[downloadUrl];
                            this.trigger('downloadError', err, eventParam);
                        }
                        var errCode = err.mwCode;
                        if (errCode === DPMW.mwe.E_MW_DEVICE_NOT_FOUND) {
                            response.writeHead(504, { 'Content-Type': 'application/pdf' });
                        }
                        else if (errCode === DPMW.mwe.E_MW_WEBAPI_ERROR
                            || errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_STATUS || errCode === DPMW.mwe.E_MW_WEBAPI_UNEXPECTED_VALUE) {
                            response.writeHead(502, { 'Content-Type': 'application/pdf' });
                        }
                        else if (errCode === DPMW.mwe.E_MW_CANCELLED || errCode === DPMW.mwe.E_MW_FILE_REMOTE_MODIFIED) {
                            response.writeHead(503, { 'Content-Type': 'application/pdf' });
                        }
                        else {
                            response.writeHead(500, { 'Content-Type': 'application/pdf' });
                        }
                        response.end();
                    };
                    DragExternalServer.prototype.filterRequest = function (request) {
                        if (typeof request === 'undefined') {
                            throw new Error('a request should not be undefined in filterRequest function.');
                        }
                        var remoteAddress = request.connection.remoteAddress;
                        if (remoteAddress === '::1' || remoteAddress === '::ffff:127.0.0.1' || remoteAddress === '127.0.0.1') {
                            if (!request.url.match('^' + DRAGANDDROPPATH)) {
                                return null;
                            }
                            var url = request.url;
                            var downloadUrl = HOST + this.currentPortNumber + url;
                            var entryId = this.urlInfos[downloadUrl];
                            if (!entryId) {
                                return null;
                            }
                            else {
                                this.cancelDownloadUrl(downloadUrl);
                                return entryId;
                            }
                        }
                        return null;
                    };
                    return DragExternalServer;
                }(Backbone.EventsAdopter));
                Handler.DragExternalServer = DragExternalServer;
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DragExternalServer.js.map