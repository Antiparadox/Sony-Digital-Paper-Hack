var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var Path = require('path');
        var FS_READDIR_EXCLUDE_NAMES = ['.', '..'];
        var PathUtils = (function () {
            function PathUtils() {
            }
            PathUtils.addSeparator = function (path) {
                if ((path) && (path.length > 0)) {
                    if (path[path.length - 1] !== PathUtils.SEPARATOR) {
                        return path + PathUtils.SEPARATOR;
                    }
                }
                return path;
            };
            PathUtils.removeSeparator = function (path) {
                if ((path) && (path.length > 1)) {
                    if (path[path.length - 1] === PathUtils.SEPARATOR) {
                        return path.substr(0, path.length - 1);
                    }
                }
                return path;
            };
            PathUtils.canonicalize = function (path) {
                if ((path) && (path.length > 0)) {
                    if (process.platform === 'win32') {
                        return PathUtils.removeSeparator(Path.normalize(path).replace(/\\/g, PathUtils.SEPARATOR));
                    }
                    else {
                        return PathUtils.removeSeparator(Path.normalize(path));
                    }
                }
                return path;
            };
            PathUtils.canonicalizeForRemoteFolderPath = function (path) {
                if (path) {
                    return PathUtils.removeSeparator(path.replace(/\/+/g, PathUtils.SEPARATOR));
                }
                return path;
            };
            PathUtils.normalizeReaddirResult = function (files) {
                for (var i = 0; i < FS_READDIR_EXCLUDE_NAMES.length; i++) {
                    var excludeIndex = files.indexOf(FS_READDIR_EXCLUDE_NAMES[i]);
                    if (excludeIndex >= 0) {
                        files.splice(excludeIndex, 1);
                    }
                }
                return files;
            };
            PathUtils.SEPARATOR = '/';
            return PathUtils;
        }());
        Utils.PathUtils = PathUtils;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=PathUtils.js.map