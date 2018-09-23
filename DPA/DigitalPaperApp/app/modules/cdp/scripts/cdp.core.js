/*!
 * cdp.core.js 1.2.0-dev
 *
 * Date: 2016-05-11T14:00:12+0900
 */

((function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root);
    } else {
        // Browser globals
        factory(root);
    }
})(((this || 0).self || global), function (root) {

    var TAG = "[CDP] ";

    // "CDP" global exports.
    var CDP = root.CDP || (root.CDP = {});

    /**
     * \~english
     * @class Patch
     * @brief This class applies patch codes to 3rd party libraries for they works good with the others.
     *
     * \~japanese
     * @class Patch
     * @brief 外部ライブラリに Patch を当てるクラス
     */
    var Patch = (function () {
        function Patch() {
        }

        /**
         * \~english
         * Apply patch.
         *
         * \~japanese
         * パッチの適用
         */
        function _apply() {
            if (null == root.console || null == root.console.error) {
                _consolePatch();
            }

            if (typeof MSApp === "object") {
                _nodePatch();
            }
        }

        function _consolePatch() {
            root.console = {
                count: function () {
                },
                groupEnd: function () {
                },
                time: function () {
                },
                timeEnd: function () {
                },
                trace: function () {
                },
                group: function () {
                },
                dirxml: function () {
                },
                debug: function () {
                },
                groupCollapsed: function () {
                },
                select: function () {
                },
                info: function () {
                },
                profile: function () {
                },
                assert: function () {
                },
                msIsIndependentlyComposed: function () {
                },
                clear: function () {
                },
                dir: function () {
                },
                warn: function () {
                },
                error: function () {
                },
                log: function () {
                },
                profileEnd: function () {
                }
            };
        }

        function _nodePatch() {
            var originalAppendChild = Node.prototype.appendChild;
            Node.prototype.appendChild = function (node) {
                var _this = this;
                return MSApp.execUnsafeLocalFunction(function () {
                    return originalAppendChild.call(_this, node);
                });
            };

            var originalInsertBefore = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function (newElement, referenceElement) {
                var _this = this;
                return MSApp.execUnsafeLocalFunction(function () {
                    return originalInsertBefore.call(_this, newElement, referenceElement);
                });
            };
        }

        Patch.apply = _apply;

        return Patch;
    })();

    /**
     * \~english
     * Get web root.
     *
     * \~japanese
     * web root を取得
     */
    var _webRoot = (function () {
        var dir = /.+\/(.+)\/[^/]*#[^/]+/.exec(location.href);
        if (!dir) {
            dir = /.+\/(.+)\//.exec(location.href);
        }
        return dir[0];
    })();

    /**
     * \~english
     * Initialization function of environment.
     *
     * @param options {CoreInitOptions} [in] init options.
     *
     * \~japanese
     * Framework の初期化関数
     * v1.2.0+ より options のコールバックに変更
     *
     * @param options {CoreInitOptions} [in] 初期化オプション.
     */
    function _init(options) {
        setTimeout(function () {
            try {
                Patch.apply();
                if (options && typeof options.success === 'function') {
                    options.success();
                }
            } catch (error) {
                var msg = (error && error.message) ? error.message : "initialize failed.";
                console.error(TAG + msg);
                if (options && typeof options.fail === 'function') {
                    options.fail(error);
                }
            }
        });
    }

    CDP.global = root;
    CDP.initialize = _init;
    CDP.webRoot = _webRoot;

    return CDP;
}));
