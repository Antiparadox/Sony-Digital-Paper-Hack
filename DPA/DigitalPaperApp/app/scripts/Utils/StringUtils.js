var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var StringUtils = (function () {
            function StringUtils() {
            }
            StringUtils.isEmpty = function (val) {
                return _.isUndefined(val) ||
                    _.isEmpty(val) ||
                    _.isNull(val);
            };
            StringUtils.pad = function (str, len, pad, type) {
                if (len === void 0) { len = 0; }
                if (pad === void 0) { pad = StringUtils.SPACE; }
                if (type === void 0) { type = StringUtils.STR_PAD_RIGHT; }
                if (len + 1 >= str.length) {
                    switch (type) {
                        case StringUtils.STR_PAD_LEFT:
                            str = Array(len + 1 - str.length).join(pad) + str;
                            break;
                        case StringUtils.STR_PAD_BOTH:
                            var padlen = 0;
                            var right = Math.ceil((padlen = len - str.length) / 2);
                            var left = padlen - right;
                            str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                            break;
                        default:
                            str = str + Array(len + 1 - str.length).join(pad);
                            break;
                    }
                }
                return str;
            };
            StringUtils.STR_PAD_LEFT = 1;
            StringUtils.STR_PAD_RIGHT = 2;
            StringUtils.STR_PAD_BOTH = 3;
            StringUtils.SPACE = ' ';
            return StringUtils;
        }());
        Utils.StringUtils = StringUtils;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=StringUtils.js.map