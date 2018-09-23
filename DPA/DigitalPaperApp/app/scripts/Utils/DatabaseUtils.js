var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var DatabaseUtils = (function () {
            function DatabaseUtils() {
            }
            DatabaseUtils.escape = function (s) {
                return s.replace(/'/g, "''");
            };
            DatabaseUtils.unescape = function (s) {
                return s.replace(/''/g, "'");
            };
            DatabaseUtils.singleQuotes = function (s) {
                return "'" + s + "'";
            };
            return DatabaseUtils;
        }());
        Utils.DatabaseUtils = DatabaseUtils;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DatabaseUtils.js.map