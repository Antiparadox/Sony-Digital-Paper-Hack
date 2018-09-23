var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var SoftwareUpdate;
        (function (SoftwareUpdate) {
            var UPDATE_TYPE;
            (function (UPDATE_TYPE) {
                UPDATE_TYPE.APP = 'app';
                UPDATE_TYPE.DEVICE = 'device';
            })(UPDATE_TYPE = SoftwareUpdate.UPDATE_TYPE || (SoftwareUpdate.UPDATE_TYPE = {}));
            var PROGRESS_TYPE;
            (function (PROGRESS_TYPE) {
                PROGRESS_TYPE.DOWNLOAD = 'download';
                PROGRESS_TYPE.TRANSFER = 'transfer';
            })(PROGRESS_TYPE = SoftwareUpdate.PROGRESS_TYPE || (SoftwareUpdate.PROGRESS_TYPE = {}));
        })(SoftwareUpdate = View.SoftwareUpdate || (View.SoftwareUpdate = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SoftwareUpdateDefs.js.map