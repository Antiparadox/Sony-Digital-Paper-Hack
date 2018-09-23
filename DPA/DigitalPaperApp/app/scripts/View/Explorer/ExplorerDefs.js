var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Explorer;
        (function (Explorer) {
            Explorer.VIEW_TYPE_DOCUMENTS = 0;
            Explorer.VIEW_TYPE_FOLDER = 1;
            Explorer.VIEW_TYPE_SEARCH_DOCUMENTS = 2;
            Explorer.VIEW_TYPE_SEARCH_FOLDER = 3;
            Explorer.VIEW_TYPE_MIN = 0;
            Explorer.VIEW_TYPE_MAX = 3;
            Explorer.SYNC_FOLDER_MAX = 20;
            var CopyState;
            (function (CopyState) {
                CopyState.COPY_SUCCEED = 1;
                CopyState.COPY_FAILED = 2;
                CopyState.COPY_NAME_OVERLAY = 3;
            })(CopyState = Explorer.CopyState || (Explorer.CopyState = {}));
            var Progress;
            (function (Progress) {
                Progress.PROGRESS_START = 1;
                Progress.PROGRESS_END = 3;
            })(Progress = Explorer.Progress || (Explorer.Progress = {}));
            var ErrorCode;
            (function (ErrorCode) {
                ErrorCode.ERROR_DEVICE_NOT_FOUND = 1;
                ErrorCode.ERROR_FILE_NOT_FOUND = 2;
                ErrorCode.ERROR_DIRECTORY_NOT_FOUND = 3;
            })(ErrorCode = Explorer.ErrorCode || (Explorer.ErrorCode = {}));
        })(Explorer = View.Explorer || (View.Explorer = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=ExplorerDefs.js.map