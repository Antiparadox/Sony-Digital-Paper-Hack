var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var AppDataStoreDefs;
        (function (AppDataStoreDefs) {
            var Settigns;
            (function (Settigns) {
                Settigns.DB_FILE_NAME = 'sqlite3.db';
            })(Settigns = AppDataStoreDefs.Settigns || (AppDataStoreDefs.Settigns = {}));
            var State;
            (function (State) {
                State.STOPPED = 0;
                State.STOPPING = 1;
                State.STARTED = 2;
                State.STARTING = 3;
                State.COMPACTING = 4;
                State.RESETTING = 5;
                State.CLEARING = 6;
                State.CHECKING = 7;
            })(State = AppDataStoreDefs.State || (AppDataStoreDefs.State = {}));
        })(AppDataStoreDefs = Model.AppDataStoreDefs || (Model.AppDataStoreDefs = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=AppDataStoreDefs.js.map