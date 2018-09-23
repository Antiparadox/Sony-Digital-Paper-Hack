var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Dialog;
        (function (Dialog) {
            var DialogSyncResult = (function (_super) {
                __extends(DialogSyncResult, _super);
                function DialogSyncResult(dialogName) {
                    var _this = this;
                    _super.call(this, dialogName);
                    this.syncResult = new View.Dialog.DialogInfo.DialogSyncResultInfo();
                    var templateStr = $('#sync-template').text();
                    this.template_ = Hogan.compile(templateStr);
                    this.$localListview_ = $('#local-result-list');
                    this.$remoteListview_ = $('#remote-result-list');
                    $('.resizer').mousedown(function (e) { _this.onResizerMouseDown(e); });
                    $('.resizer').click(function (e) { return false; });
                    $(window).mouseup(function (e) {
                        _this.onResizerMouseUp(e);
                    });
                    $(window).mousemove(function (e) {
                        _this.onResizerMouseMove(e);
                    });
                    $('#local-result-list-sroll').scroll(function () {
                        $("#local-result-title-sroll").scrollLeft($("#local-result-list-sroll").scrollLeft());
                    });
                    $('#remote-result-list-sroll').scroll(function () {
                        $("#remote-result-title-sroll").scrollLeft($("#remote-result-list-sroll").scrollLeft());
                    });
                }
                DialogSyncResult.prototype.onResizerMouseDown = function (event) {
                    if (event.which !== 1) {
                        return;
                    }
                    var resultDivId = $(event.currentTarget).attr('result-div-id');
                    var resultType = $(event.currentTarget).attr('result-type');
                    var $title = $(event.currentTarget).prev();
                    var $path = $('#' + resultDivId).find('.' + resultType);
                    this.resizeInfo = {
                        startX: event.pageX,
                        resultDivId: resultDivId,
                        titleEl: $title,
                        titleWidth: $title.width(),
                        pathEl: $path,
                        pathWidth: $path.width()
                    };
                    event.preventDefault();
                };
                DialogSyncResult.prototype.onResizerMouseUp = function (e) {
                    if (this.resizeInfo) {
                        this.resizeInfo = null;
                        event.preventDefault();
                    }
                };
                DialogSyncResult.prototype.onResizerMouseMove = function (event) {
                    if (!this.resizeInfo) {
                        return;
                    }
                    var op = this.resizeInfo;
                    var difference = (event.pageX - op.startX);
                    if (difference === 0) {
                        return;
                    }
                    if ((this.resizeInfo.titleWidth + difference) < 158) {
                        return;
                    }
                    this.resizeInfo.pathEl.width(this.resizeInfo.pathWidth + difference);
                    this.resizeInfo.titleEl.width(this.resizeInfo.titleWidth + difference);
                };
                DialogSyncResult.prototype.setInitValue = function (info) {
                    this.syncResult = info;
                    var remoteResultArray = this.syncResult.remoteResultArray;
                    var root = $.i18n.t('content.navi.root');
                    var sigh = ' > ';
                    for (var i = 0; i < remoteResultArray.length; i++) {
                        var targetObj = remoteResultArray[i];
                        var orgPath = targetObj.path;
                        orgPath = orgPath.replace(/^Document/, root);
                        orgPath = orgPath.replace(/\//g, sigh);
                        targetObj.path = orgPath;
                    }
                    this.$localListview_.html(this.template_.render({
                        aplist: JSON.parse(JSON.stringify(this.syncResult.localResultArray))
                    }));
                    this.$remoteListview_.html(this.template_.render({
                        aplist: JSON.parse(JSON.stringify(remoteResultArray))
                    }));
                };
                return DialogSyncResult;
            }(DPMW.View.Dialog.DialogBase));
            Dialog.DialogSyncResult = DialogSyncResult;
            var dialogSyncResult = new DialogSyncResult(Dialog.DialogName.DIALOG_SYNC_RESULT);
        })(Dialog = View.Dialog || (View.Dialog = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DialogSyncResult.js.map