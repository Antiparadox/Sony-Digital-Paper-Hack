var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            var Handler;
            (function (Handler) {
                var TransferCounter = (function () {
                    function TransferCounter() {
                        this.done_ = 0;
                        this.total_ = 0;
                        this.isRunning_ = false;
                        this.isCancelled_ = false;
                    }
                    TransferCounter.prototype.clear = function () {
                        this.done_ = 0;
                        this.total_ = 0;
                        this.isCancelled_ = false;
                    };
                    TransferCounter.prototype.addTask = function () {
                        var isFristTask = !(this.isRunning_);
                        if (isFristTask) {
                            this.clear();
                            this.isRunning_ = true;
                        }
                        this.total_++;
                        return isFristTask;
                    };
                    TransferCounter.prototype.getDoneCount = function () {
                        return this.done_;
                    };
                    TransferCounter.prototype.getTotalCount = function () {
                        return this.total_;
                    };
                    TransferCounter.prototype.isRunning = function () {
                        return this.isRunning_;
                    };
                    TransferCounter.prototype.isCancelled = function () {
                        return this.isCancelled_;
                    };
                    TransferCounter.prototype.isFinished = function () {
                        return (this.done_ === this.total_);
                    };
                    TransferCounter.prototype.setTaskSucceeded = function () {
                        this.done_++;
                    };
                    TransferCounter.prototype.setTaskFailed = function (err) {
                        this.done_++;
                        if (err && err.mwCode && err.mwCode === DPMW.mwe.E_MW_CANCELLED) {
                            this.isCancelled_ = true;
                        }
                    };
                    TransferCounter.prototype.setAllTaskFinished = function () {
                        this.isRunning_ = false;
                        this.clear();
                    };
                    return TransferCounter;
                }());
                Handler.TransferCounter = TransferCounter;
            })(Handler = Explorer.Handler || (Explorer.Handler = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=TransferCounter.js.map