var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var ExternalOutput;
        (function (ExternalOutput) {
            var BaseUrlInquirer = (function () {
                function BaseUrlInquirer(channel) {
                    this.channel = channel;
                    this.disposed = false;
                }
                BaseUrlInquirer.prototype.dispose = function () {
                    var me = this;
                    if (!me.disposed) {
                        me.disposed = true;
                        var ipc = require('electron').ipcRenderer;
                        ipc.removeAllListenrs(me.channel);
                    }
                };
                BaseUrlInquirer.prototype.inquiry = function (id, callback) {
                    var me = this;
                    if (!me.disposed) {
                        var ipc_1 = require('electron').ipcRenderer;
                        var inquiryDetail_1 = {
                            inquirer: id + '-' + Math.random().toString() + '-' + (new Date()).getTime().toString()
                        };
                        var handled = false;
                        var done_1 = function (baseUrl) {
                            if (!handled) {
                                handled = true;
                                ipc_1.removeListener(me.channel, dispatcher_1);
                                clearTimeout(timeoutId_1);
                                callback(baseUrl);
                            }
                        };
                        var dispatcher_1 = function (err, message, answerDetail) {
                            if (message === View.Dialog.IpcMessage.MAIN_TO_CHILD.ANSWER_BASE_URL) {
                                if ((answerDetail) && (answerDetail.inquirer === inquiryDetail_1.inquirer)) {
                                    done_1(answerDetail.baseUrl);
                                }
                            }
                        };
                        var timeoutId_1 = setTimeout(function () {
                            done_1(undefined);
                        }, 1000 * 3);
                        ipc_1.on(me.channel, dispatcher_1);
                        ipc_1.send(me.channel, View.Dialog.IpcMessage.CHILD_TO_MAIN.INQUIRY_BASE_URL, inquiryDetail_1);
                    }
                };
                return BaseUrlInquirer;
            }());
            ExternalOutput.BaseUrlInquirer = BaseUrlInquirer;
        })(ExternalOutput = View.ExternalOutput || (View.ExternalOutput = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=BaseUrlInquirer.js.map