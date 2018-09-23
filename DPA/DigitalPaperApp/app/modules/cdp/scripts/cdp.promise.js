/*!
 * cdp.promise.js 1.0.0-dev
 *
 * Date: 2016-05-25T19:44:34+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], function ($) {
            return factory(root.CDP || (root.CDP = {}), $);
        });
    }
    else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"));
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
    }
}(((this || 0).self || global), function (CDP, $) {
    
var CDP;
(function (CDP) {
    var TAG = "[CDP.Promise] ";
    /**
     * Promise オブジェクトの作成
     * jQueryDeferred オブジェクトから、Tools.Promise オブジェクトを作成する
     *
     * @param df       {JQueryDeferred}    [in] jQueryDeferred instance を指定
     * @param options? {Object | Function} [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @return {IPromise} Tools.IPromise オブジェクト
     */
    function makePromise(df, options) {
        var extendOptions;
        var cancel;
        if ("function" === typeof options) {
            cancel = options;
        }
        else {
            extendOptions = options;
            cancel = function () { };
        }
        var _abort = function (info) {
            var detail = info ? info : { message: "abort" };
            if (null != this.dependency) {
                if (this.dependency.abort) {
                    this.dependency.abort(detail);
                }
                else {
                    console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                }
                if (this.callReject && "pending" === this.state()) {
                    cancel(detail);
                    df.reject(detail);
                }
            }
            else if ("pending" === this.state()) {
                cancel(detail);
                df.reject(detail);
            }
        };
        var _dependOn = function (promise) {
            var _this = this;
            if (promise.abort) {
                this.dependency = promise;
                promise
                    .always(function () {
                    _this.dependency = null;
                });
            }
            else {
                console.error(TAG + "[set] dependency object doesn't have 'abort()' method.");
            }
            return promise;
        };
        var target = $.extend({}, {
            dependency: null,
            callReject: false,
        }, extendOptions);
        var promise = df.promise(target);
        if (null == promise.abort) {
            promise.abort = _abort.bind(promise);
        }
        if (null == promise.dependOn) {
            promise.dependOn = _dependOn.bind(promise);
        }
        return promise;
    }
    CDP.makePromise = makePromise;
    function wait() {
        var deferreds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deferreds[_i - 0] = arguments[_i];
        }
        // 投入法が可変引数だった場合は配列に修正する
        var _deferreds = [].concat.apply([], deferreds);
        // 実際の作業
        var df = $.Deferred();
        var results = [];
        var initialized = false;
        var isFinished = function () {
            if (!initialized) {
                return false;
            }
            else {
                return !results.some(function (element) {
                    return "pending" === element.status;
                });
            }
        };
        _deferreds.forEach(function (deferred, index) {
            results.push({
                status: "pending",
                args: null,
            });
            deferred
                .then(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                results[index].status = "resolved";
                results[index].args = args;
            }, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                results[index].status = "rejected";
                results[index].args = args;
            })
                .always(function () {
                if (isFinished()) {
                    df.resolve(results);
                }
            });
        });
        initialized = true;
        if (isFinished()) {
            df.resolve(results);
        }
        return df.promise();
    }
    CDP.wait = wait;
    /**
     * @class PromiseManager
     * @brief 複数の DataProvider.Promise を管理するクラス
     */
    var PromiseManager = (function () {
        function PromiseManager() {
            this._pool = [];
            this._id = 0;
        }
        PromiseManager.prototype.add = function (promise) {
            var _this = this;
            if (promise == null) {
                return null;
            }
            // abort() を持っていない場合はエラー
            if (!promise.abort) {
                console.error(TAG + "[add] promise object doesn't have 'abort()' method.");
                return promise;
            }
            var cookie = {
                promise: promise,
                id: this._id++,
            };
            this._pool.push(cookie);
            promise
                .always(function () {
                _this._pool = _this._pool.filter(function (element) {
                    if (element.id !== cookie.id) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            });
            return promise;
        };
        /**
         * 管理対象の Promise に対して abort を発行
         * キャンセル処理に対するキャンセルは不可
         *
         * @return {jQueryPromise}
         */
        PromiseManager.prototype.cancel = function (info) {
            var promises = this.promises();
            promises.forEach(function (element) {
                if (element.abort) {
                    element.abort(info);
                }
            });
            return wait.apply(null, promises);
        };
        /**
         * 管理対象の Promise を配列で返す
         *
         * @return {Promise[]}
         */
        PromiseManager.prototype.promises = function () {
            return this._pool.map(function (element) {
                return element.promise;
            });
        };
        return PromiseManager;
    }());
    CDP.PromiseManager = PromiseManager;
})(CDP || (CDP = {}));

    return CDP;
}));
