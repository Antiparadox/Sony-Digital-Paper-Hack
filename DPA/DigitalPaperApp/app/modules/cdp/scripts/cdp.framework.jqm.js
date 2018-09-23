/*!
 * cdp.framework.jqm.js 1.2.0-dev
 *
 * Date: 2016-05-26T10:00:09+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.core", "cdp.promise", "backbone"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.Framework = CDP.Framework || {};
    /* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * platform 判定オブジェクト
         * [参考] https://w3g.jp/blog/tools/js_browser_sniffing
         */
        Framework.Platform = (function () {
            var ua = navigator.userAgent.toLowerCase();
            var majorVersion = function (browser) {
                var version = ua.match(new RegExp("(" + browser + ")( |/)([0-9]+)"));
                if (!version || version.length < 4) {
                    return 0;
                }
                return parseInt(version[3], 10);
            };
            return {
                ltIE6: typeof window.addEventListener === "undefined" && typeof document.documentElement.style.maxHeight === "undefined",
                ltIE7: typeof window.addEventListener === "undefined" && typeof document.querySelectorAll === "undefined",
                ltIE8: typeof window.addEventListener === "undefined" && typeof document.getElementsByClassName === "undefined",
                ltIE9: document.uniqueID && typeof window.matchMedia === "undefined",
                gtIE10: document.uniqueID && window.matchMedia,
                Trident: document.uniqueID,
                Gecko: "MozAppearance" in document.documentElement.style,
                Presto: CDP.global.opera,
                Blink: CDP.global.chrome,
                Webkit: typeof CDP.global.chrome === "undefined" && "WebkitAppearance" in document.documentElement.style,
                Touch: typeof CDP.global.ontouchstart !== "undefined",
                Mobile: typeof CDP.global.orientation !== "undefined",
                ltAd4_4: typeof CDP.global.orientation !== "undefined" && (typeof CDP.global.EventSource === "undefined" || 30 > majorVersion("chrome")),
                Pointer: CDP.global.navigator.pointerEnabled,
                MSPoniter: CDP.global.navigator.msPointerEnabled,
                Android: (ua.indexOf("android") !== -1),
                iOS: (ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1 || ua.indexOf("ipod") !== -1),
            };
        })();
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));



/* tslint:disable:typedef */
var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * vclick patch
         */
        var _vclickPatch = function () {
            var jquery_on = $.fn.on, jquery_off = $.fn.off;
            var custom_on = function (types, selector, data, fn, /*INTERNAL*/ one) {
                if (typeof types === "string") {
                    types = types.replace(/vclick/g, "click");
                }
                return _.bind(jquery_on, this)(types, selector, data, fn, one);
            };
            var custom_off = function (types, selector, fn) {
                if (typeof types === "string") {
                    types = types.replace(/vclick/g, "click");
                }
                return _.bind(jquery_off, this)(types, selector, fn);
            };
            // replace functions.
            $.fn.on = custom_on;
            $.fn.off = custom_off;
        };
        //___________________________________________________________________________________________________________________//
        /**
         * @class Patch
         * @brief patch class for jqm framework.
         *       [review] vclick のパッチを当てることがわかるとよい
         */
        var Patch = (function () {
            function Patch() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * Apply patch.
             *
             * \~japanese
             * パッチの適用
             */
            Patch.apply = function () {
                if (!Patch.isSupportedVclick()) {
                    _vclickPatch();
                    Patch.s_vclickEvent = "click";
                }
            };
            /**
             * \~english
             * if "vclick" event is unsupported, returns false. ex: Android 4.4 (Kitkat)
             *
             * \~japanese
             * "vclick" event が非サポートである platform (KitKat) は false を返す。
             * jQM の version up により、解決される場合は無効かする。
             */
            Patch.isSupportedVclick = function () {
                // for Android 4.4+ (Kitkat ～)
                if (Framework.Platform.Android && !Framework.Platform.ltAd4_4) {
                    return false;
                }
                return true;
            };
            Patch.s_vclickEvent = "vclick";
            return Patch;
        }());
        Framework.Patch = Patch;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * @enum Orientation
         */
        (function (Orientation) {
            Orientation[Orientation["PORTRAIT"] = 0] = "PORTRAIT";
            Orientation[Orientation["LANDSCAPE"] = 1] = "LANDSCAPE";
        })(Framework.Orientation || (Framework.Orientation = {}));
        var Orientation = Framework.Orientation;
        /**
         * \~english
         * Get Orientation enum code
         *
         * @return {Number} Orientation Code.
         *
         * \~japanese
         * Orientation の取得
         *
         * @return {Number} Orientation Code.
         */
        function getOrientation() {
            var $window = $(window);
            return ($window.width() < $window.height()) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
        }
        Framework.getOrientation = getOrientation;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));











/* tslint:disable:max-line-length no-string-literal */
var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        ///////////////////////////////////////////////////////////////////////
        // closure methods
        /**
         * \~english
         * Convert path to URL.
         * If the path starts from "/", the function translate the path as child folder of "web root".
         * Otherwise, it interprets as relative path from current page.
         * [Note] This behavior go along with jQM, NOT with require.toUrl().
         *
         * @param path {String} [in] path string
         *
         * \~japanese
         * path を URL に変換
         * "/" から始まるものは web root から、それ以外は現在のページから絶対パスURLに変換する。
         * jQM の挙動にあわせており、require.toUrl() と異なるので注意。
         *
         * @param path {String} [in] パスを指定。
         */
        function toUrl(path) {
            if (null != path[0] && "/" === path[0]) {
                return CDP.webRoot + path.slice(1);
            }
            else {
                return $.mobile.path.makeUrlAbsolute(path, getCurrentDocumentUrl());
            }
        }
        Framework.toUrl = toUrl;
        /**
         * \~english
         * Get current document url.
         *
         * @private
         *
         * \~japanese
         * 現在表示しているドキュメントの URL を取得
         *
         * @private
         */
        function getCurrentDocumentUrl() {
            var $activePage = $("body").pagecontainer("getActivePage");
            if (null == $activePage) {
                return $.mobile.path.documentBase.hrefNoHash;
            }
            var url = $.mobile.activePage.closest(".ui-page").jqmData("url"), base = $.mobile.path.documentBase.hrefNoHash;
            if (!url || !$.mobile.path.isPath(url)) {
                url = base;
            }
            return $.mobile.path.makeUrlAbsolute(url, base);
        }
        /**
         * \~english
         * Default "before route change" handler.
         *
         * @private
         *
         * \~japanese
         * 既定の "before route change" ハンドラ
         *
         * @private
         */
        var _beforeRouteChange = function () {
            return $.Deferred().resolve().promise();
        };
        // default "before route change" hanndler
        var _defaultBeforeRouteChange = _beforeRouteChange;
        /**
         * \~english
         * Setup "before route change" handler.
         *
         * @param  {Function} handler function.
         * @return {Function} old handler function.
         *
         * \~japanese
         * "before route change" ハンドラ設定
         *
         * @param  {Function} handler 指定.
         * @return {Function} 以前の handler.
         */
        function setBeforeRouteChangeHandler(handler) {
            if (null == handler) {
                return _beforeRouteChange;
            }
            else {
                var oldHandler = _beforeRouteChange;
                _beforeRouteChange = handler;
                return oldHandler;
            }
        }
        Framework.setBeforeRouteChangeHandler = setBeforeRouteChangeHandler;
        //___________________________________________________________________________________________________________________//
        /**
         * \~english
         * @class Router
         * @brief Router class for adjusting jQueryMobile functions and Backbone.Router functions.
         *        Even if Backbone.Router does not start routing, natigate() method works good with jQM framework.
         *
         * \~japanese
         * @class Router
         * @brief jQueryMobile と Backbone.Router を調停する Router クラス
         *        ルーティングを開始していない場合にも、navigate() は jQM フレームワークを使用して機能する。
         */
        var Router = (function () {
            function Router() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * for initialize Router. this function is called in framework.
             *
             * @return {Boolean} true: succeeded / false: failed.
             *
             * \~japanese
             * 初期化
             * この関数はフレームワーク内部で使用される。
             *
             * @param  options {Object} [in] オプション
             * @return {Boolean} 成否
             */
            Router.initialize = function (options) {
                var $body = $("body");
                if (!!Router.s_router) {
                    console.warn("logic error. initialize call twice.");
                    return false;
                }
                Router.s_initOptions = $.extend({}, Router.s_defaultInitOptions, options);
                // Backbone.Router が、route を解決できなかった場合にも通知を捕捉するためのコールバックを設定
                Router.s_loadUrl = _.bind(Backbone.history.loadUrl, Backbone.history);
                Backbone.history.loadUrl = Router.customLoadUrl;
                Router.s_router = new Backbone.Router();
                Router.s_router.on("route", Router.onRouteSucceeded);
                // Backbone.Router を使用している場合、$.mobile.back() の挙動をブラウザの[戻る]に統一
                if (!$.mobile.hashListeningEnabled) {
                    Router.s_back = _.bind($.mobile.back, $.mobile);
                    $.mobile.back = Router.customJqmBack;
                }
                // changePage をサポート
                if (null == $.mobile.changePage) {
                    $.mobile.changePage = function (to, options) {
                        $body.pagecontainer("change", to, options);
                    };
                }
                Router.bindEvents();
                // Framework のイベントハンドラを更新
                Framework.setupEventHandlers();
                return true;
            };
            /**
             * \~english
             * Register to Router.
             *
             * @param route    {String}   [in] route string, it can be regular expression.
             * @param page     {String}   [in] page template path.
             * @param top      {Boolean}  [in] set "true" if application's top view. (optional)
             * @param callback {Function} [in] callback for custom page transition. If you don't want to trigger jQM.changePage(), return true by this callback. (optional)
             * @return {Router} Router instance.
             *
             * \~japanese
             * 登録
             *
             * @param route    {String}   [in] ルーティング文字列 / 正規表現
             * @param page     {String}   [in] page template path. イベント名にも使用される
             * @param top      {Boolean}  [in] Top ページの場合は true を指定 (任意)
             * @param callback {Function} [in] 遷移を自身で管理する場合に指定し、戻り値を true に設定すると changePage をコールしない (任意)
             * @return {Router} インスタンス。ただし method chain をしたい場合は、any cast が必要。
             */
            Router.register = function (route, page, top, callback) {
                if (top === void 0) { top = false; }
                // Backbone.Router への登録は history の停止が必要
                var restart = Router.stop();
                var name = route + page;
                var context = {
                    route: route,
                    regexp: Router.s_router._routeToRegExp(route),
                    page: page,
                    top: top,
                    callback: callback || function () { return false; }
                };
                if (Router.pushContext(name, context)) {
                    Router.s_router.route(route, name, function () { });
                }
                if (restart) {
                    // 再開時は再読み込みしない。
                    Router.start({ silent: true });
                }
                return Router;
            };
            /**
             * \~english
             * Start listening hash change.
             * It should be called after register().
             *
             * @param options {Object} [in] options object for Backbone.History.
             *
             * \~japanese
             * 履歴監視の開始
             * 登録完了後に呼び出す。
             *
             * @param options {Object} [in] Backbone.History にわたるオプション
             */
            Router.start = function (options) {
                if ($.mobile.hashListeningEnabled) {
                    console.log("setting error. confict: $.mobile.hashListeningEnabled = true, cannot start.");
                    return false;
                }
                return Backbone.history.start(options);
            };
            /**
             * \~english
             * Stop listening hash change.
             *
             * @return {Boolean} previous status.
             *
             * \~japanese
             * 履歴監視の終了
             *
             * @return {Boolean} 以前の開始状態を返却
             */
            Router.stop = function () {
                var prevState = Backbone.History.started;
                Backbone.history.stop();
                return prevState;
            };
            /**
             * \~english
             * Check routing status.
             *
             * @return {Boolean} true: routing / false: not routing
             *
             * \~japanese
             * ルーティングを開始しているか判定
             *
             * @return {Boolean} true: 有効 / false: 無効
             */
            Router.isRouting = function () {
                return Backbone.History.started;
            };
            /**
             * \~english
             * URL navigation.
             *
             * @param url        {String}          [in] set a navigate URL. (relative path / absolute path / fragment)
             * @param transition {String}          [in] set a transition string (optional)
             * @param reverse    {Boolean}         [in] set a direction string for transition. true:reverse / false:nomal (optional)
             * @param options    {NavigateOptions} [in] set a options object for Backbone.Router.navigate(). (optional)
             *
             * \~japanese
             * URL遷移
             *
             * @param url        {String}          [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
             * @param transition {String}          [in] transition に使用する effect を指定 (任意)
             * @param reverse    {Boolean}         [in] transition に使用する direction を指定 true:reverse/false:通常 (任意)
             * @param options    {NavigateOptions} [in] Backbone.Router.navigate() に渡されるオプション (任意)
             */
            Router.navigate = function (url, transition, reverse, options) {
                if (!!Router.s_lastNavigateInfo.inNavigation) {
                    // すでに Navigation 中であれば抑止
                    console.log("Router.navigate() called in navigation proc.");
                    return;
                }
                else if (Router.initFirstPageIfNeeded(url)) {
                    return;
                }
                var navOptions = $.extend({}, Router.s_defaultNavigateOptions, options);
                // ページ遷移開始通知. Sub Flow にてすでにコールされている場合は既定の何もしないコールバックを使用する.
                var notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
                Router.s_lastNavigateInfo = {
                    url: url,
                    transition: transition,
                    reverse: reverse,
                    backDestination: navOptions.backDestination,
                    noHashChange: navOptions.noHashChange,
                    intent: navOptions.intent || {},
                    positiveNavigate: true,
                    calledBeforeRouteChange: true,
                    inNavigation: true,
                };
                // ページ遷移開始通知
                notifyBeforeRouteChange()
                    .fail(function () {
                    // beforeRouteChange() が失敗した場合、致命的な不具合となるため、error 記録のみにして先に進む。
                    console.error("before route change call, failed.");
                })
                    .always(function () {
                    if (Router.isRouting() && !Router.s_lastNavigateInfo.noHashChange) {
                        if (navOptions.subFlow) {
                            switch (navOptions.subFlow.operation) {
                                case "begin":
                                    Router.beginSubFlow(navOptions.subFlow);
                                    break;
                                case "end":
                                    Router.endSubFlow(navOptions);
                                    return; // navigation は呼ばない
                                default:
                                    console.warn("unknown subFlow.operation. operation: " + navOptions.subFlow.operation);
                                    break;
                            }
                        }
                        Router.s_router.navigate(url, navOptions);
                    }
                    else {
                        (function () {
                            var fragment = Backbone.history.getFragment(url);
                            var context;
                            if (Router.s_lastNavigateInfo.noHashChange) {
                                // noHashChange が指定されたとき
                                context = _.find(Router.s_rootContexts, function (context) {
                                    return context.regexp.test(fragment);
                                });
                            }
                            else {
                                // Backbone.Router が有効でないとき
                                context = _.findWhere(Router.s_rootContexts, { route: fragment });
                            }
                            if (context) {
                                url = context.page;
                            }
                        })();
                        Router.changePage(url);
                    }
                });
            };
            /**
             * \~english
             * Back to previous history.
             * It's same as browser back button's behaviour.
             * [Note] If set the jQM: data-rel="back", work as well.
             *
             * \~japanese
             * 履歴を戻る
             * ブラウザの戻るボタンと同じ挙動。
             * jQM: data-rel="back" を指定しても同じであることに注意。
             */
            Router.back = function () {
                if (!!Router.s_lastNavigateInfo.inNavigation) {
                    // すでに Navigation 中であれば抑止
                    console.log("Router.back() called in navigation proc.");
                    return;
                }
                else if (Router.isTopPage()) {
                    // Top ページに指定されていれば終了
                    var app = navigator.app || {};
                    if (!!app.exitApp) {
                        app.exitApp(); // note: never exit on iOS 
                        return;
                    }
                }
                Router.s_lastNavigateInfo = {
                    inNavigation: true,
                    calledBeforeRouteChange: true,
                };
                // ページ遷移開始通知
                _beforeRouteChange()
                    .then(function () {
                    $.mobile.back();
                })
                    .fail(function () {
                    console.error("before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
            };
            /**
             * \~english
             * Store Intent object.
             *
             * \~japanese
             * Intent を格納
             */
            Router.pushIntent = function (intent) {
                Router.s_lastIntent = $.extend({}, Router.s_lastIntent, intent);
            };
            /**
             * \~english
             * Get Intent object.
             *
             * \~japanese
             * Intent を取得
             */
            Router.popIntent = function () {
                var intent = Router.s_lastIntent;
                Router.s_lastIntent = {};
                return intent;
            };
            /**
             * \~english
             * Get query parameters.
             *
             * \~japanese
             * query parameter に指定された引数の取得
             * ページ遷移中にのみアクセス可能 (pagebeforecreate ～ pagechange)
             */
            Router.getQueryParameters = function () {
                if (Router.s_lastNavigateInfo.intent && Router.s_lastNavigateInfo.intent.params) {
                    return Router.s_lastNavigateInfo.intent.params["queryParams"];
                }
                else {
                    return null;
                }
            };
            /**
             * \~english
             * Check in sub flow.
             *
             * \~japanese
             * sub flow 内であるか判定
             */
            Router.isInSubFlow = function () {
                var stack = Router.getJqmHistory().stack;
                var has = _.some(stack, function (value) {
                    return !!value[Router.SUBFLOW_PARAM];
                });
                return has;
            };
            /**
             * \~english
             * Check from hash changed navigation.
             *
             * \~japanese
             * Hash 変更によって Navigate が起こったか判定
             * "pagechange" が発生するまでに判定可能
             */
            Router.fromHashChanged = function () {
                // positiveNavigate = false は含めない
                return Router.s_lastNavigateInfo.inNavigation && (null == Router.s_lastNavigateInfo.positiveNavigate);
            };
            Router.registerPageStack = function (pageStack, withNavigate, options) {
                var newStacks = [];
                var failed = false;
                pageStack = (pageStack instanceof Array) ? pageStack : [pageStack];
                withNavigate = (null == withNavigate) ? false : withNavigate;
                (function () {
                    var makeStack = function (info) {
                        var url;
                        var stack;
                        var fragment = Backbone.history.getFragment(info.route);
                        var context = _.find(Router.s_rootContexts, function (context) {
                            return context.regexp.test(fragment);
                        });
                        if (!context) {
                            console.warn("route is not registered. route: " + info.route);
                            return null;
                        }
                        else {
                            url = Router.pathToJqmDataUrl(context.page);
                        }
                        stack = {
                            route: info.route,
                            pageUrl: url,
                            title: info.title,
                            transition: info.transition,
                            url: url,
                        };
                        return stack;
                    };
                    for (var i = 0, n = pageStack.length; i < n; i++) {
                        var stack = makeStack(pageStack[i]);
                        if (!stack) {
                            failed = true;
                            break;
                        }
                        else {
                            newStacks.push(stack);
                        }
                    }
                })();
                if (failed) {
                    return false;
                }
                (function () {
                    // Router の停止
                    var restart = Router.stop();
                    var silentLength = newStacks.length - 1;
                    var finalIndex = newStacks.length - 1;
                    Router.getJqmHistory().clearForward();
                    for (var i = 0, n = silentLength; i < n; i++) {
                        location.hash = newStacks[i].route;
                        Router.getJqmHistory().stack.push(newStacks[i]);
                        Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                    }
                    // final stack with navigate
                    if (withNavigate) {
                        restart = false;
                        Router.start({ silent: true });
                        Router.navigate(newStacks[finalIndex].route, newStacks[finalIndex].transition, false, options);
                    }
                    else {
                        location.hash = newStacks[finalIndex].route;
                        Router.getJqmHistory().stack.push(newStacks[finalIndex]);
                        Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                    }
                    // Router の再開
                    if (restart) {
                        Router.start({ silent: true });
                    }
                })();
                return true;
            };
            ///////////////////////////////////////////////////////////////////////
            // private static methods
            /**
             * \~english
             * Override: Backbone.History.loadUrl().
             *
             * @private
             *
             * \~japanese
             * Backbone.History.loadUrl() のオーバーライド
             *
             * @private
             */
            Router.customLoadUrl = function (fragment) {
                var handled = Router.s_loadUrl(fragment);
                if (!handled) {
                    Router.onRouteFailed(fragment);
                }
                return handled;
            };
            /**
             * \~english
             * Override: $.mobile.back().
             *
             * fail safe processing.
             *  If using Backbone's Router,
             *  this class unuses history object of jQuery Mobile 1.4,
             *  and standardize as browser back button's behaviour. (jQM 1.3 comparable)
             *
             * @private
             *
             * \~japanese
             * $.mobile.back() のオーバーライド
             *
             * [TBD] fail safe 処理
             *  Backbone の Router を使用している場合、
             *  jQuery Mobile 1.4 以降の内部の History 管理は使用せずに
             *  1.3 相当のブラウザの[戻る]の挙動に統一する。
             *
             * @private
             */
            Router.customJqmBack = function () {
                if (Router.isRouting()) {
                    history.back();
                }
                else {
                    // jQM 既定処理
                    Router.s_back();
                }
            };
            /**
             * \~english
             * Bind events.
             *
             * @private
             *
             * \~japanese
             * イベントバインド
             *
             * @private
             */
            Router.bindEvents = function () {
                $(document)
                    .one("pagechange", function () {
                    if (Router.s_initOptions.anchorVclick) {
                        // anchor vclick
                        $(document).on("vclick", "[href]", function (event) {
                            Router.onAnchorVclicked(event);
                        });
                    }
                })
                    .on("pagebeforeshow", function (event) {
                    // "data-back-dst" を page に設定
                    if (null != Router.s_lastNavigateInfo.backDestination) {
                        var active = Router.getJqmHistory().getActive();
                        active[Router.BACK_DESTINATION_URL] = Router.s_lastNavigateInfo.backDestination;
                    }
                })
                    .on("pageshow", function (event) {
                    var active = Router.getJqmHistory().getActive();
                    if (active[Router.SUBFLOW_PARAM]) {
                        delete active[Router.SUBFLOW_PARAM];
                    }
                })
                    .on("pagechange pagecontainerloadfailed", function (event) {
                    Router.s_lastNavigateInfo = {};
                });
                // back key assign
                CDP.setBackButtonHandler(Router.back);
            };
            /**
             * \~english
             * Store the RootContext.
             *
             * @private
             * @param name    {String}       [in] name of route
             * @param context {RouteContext} [in] context object
             * @return true: succeeded / false: already registered
             *
             * \~japanese
             * RootContext の格納
             *
             * @private
             * @param name    {String}       [in] route 名
             * @param context {RouteContext} [in] context オブジェクト
             * @return true: 登録成功 / false: すでに登録されている
             */
            Router.pushContext = function (name, context) {
                if (!!Router.s_rootContexts[name]) {
                    console.log("logic error. route is already registered. name: " + name);
                    return false;
                }
                Router.s_rootContexts[name] = context;
                return true;
            };
            /**
             * \~english
             * Check if $.mobile.initializePage() is called or not, and call it if needed.
             *
             * @private
             * @param url {String}  [in] set a navigate URL. (relative path / absolute path / fragment)
             *
             * \~japanese
             * $.mobile.initializePage() が呼ばれているか確認し、必要なら初期化する。
             *
             * @private
             * @param url {String} [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
             */
            Router.initFirstPageIfNeeded = function (url) {
                if (!$.mobile.autoInitializePage) {
                    $(document).one("pagebeforechange", function (event, data) {
                        data.toPage = Framework.toUrl(url);
                    });
                    $.mobile.initializePage();
                    $.mobile.autoInitializePage = true;
                    return true;
                }
                return false;
            };
            /**
             * \~english
             * Check for current page is top.
             *
             * @private
             * @return true: top page / false: not top page
             *
             * \~japanese
             * 現在のページが top に指定されているか判定
             *
             * @private
             * @return true: top 指定 / false: top ではない
             */
            Router.isTopPage = function () {
                var fragment = Backbone.history.getFragment($.mobile.path.parseUrl(location.href).hash);
                var context = _.find(Router.s_rootContexts, function (context) {
                    return context.regexp.test(fragment);
                });
                return (null == context) ? false : context.top;
            };
            /**
             * \~english
             * Called when anchor received "vclick" event.
             *
             * @private
             * @return true: need default processing / false: need custom processing
             *
             * \~japanese
             * anchor が vclick されたときにコールされる
             *
             * @private
             * @return true: default 処理 / false: カスタム処理
             */
            Router.onAnchorVclicked = function (event) {
                if (Router.isJustBeforeVclicked()) {
                    event.preventDefault();
                    return false;
                }
                return Router.followAnchor(event);
            };
            /**
             * \~english
             * Anchor processing.
             *
             * @private
             *
             * \~japanese
             * anchor 処理
             *
             * @private
             */
            Router.followAnchor = function (event) {
                var $target = $(event.currentTarget);
                var url = $target.jqmData("href") || $target.attr("href");
                var transition = $target.jqmData("transition");
                var direction = $target.jqmData("direction");
                var backDst = $target.attr(Router.DATA_BACK_DESTINATION);
                var noHashChange = $target.attr(Router.DATA_NO_HASH_CHANGE) ?
                    $target.attr(Router.DATA_NO_HASH_CHANGE) === "true" : false;
                var noHrefHandle = $target.attr(Router.DATA_NO_VCLICK_HANDLE) ?
                    $target.attr(Router.DATA_NO_VCLICK_HANDLE) === "true" : false;
                /*
                 * - 明示的にハンドルしない指定がある場合
                 * - jQM のフラグメントの場合
                 * 既定の処理を行う
                 */
                if (noHrefHandle || Router.needDefaultOperation(url)) {
                    return true;
                }
                // custom behavier
                event.preventDefault();
                if (Router.isBackButtonClicked(event)) {
                    Router.back();
                }
                else {
                    Router.navigate(url, transition, !!direction, { noHashChange: noHashChange, backDestination: backDst });
                }
                return false;
            };
            /**
             * \~english
             * Check default processing needed.
             *
             * @private
             * @param  url {String} [in] url string
             * @return true: need default processing / false: need not
             *
             * \~japanese
             * 既定の処理を行わせるか判定
             *
             * @private
             * @param  url {String} [in] url 文字列
             * @return true: 既定の処理が必要 / false: 不要
             */
            Router.needDefaultOperation = function (url) {
                if (!url || ("#" === url)) {
                    return true;
                }
                else if ("#" === url[0]) {
                    return !Router.canResolveRoute(url);
                }
                else {
                    return false;
                }
            };
            /**
             * \~english
             * Check status of Backbone.Router if they can resolve route.
             *
             * @private
             * @param  url {String} [in] url 文字列
             * @return true: can resolve / false: can not
             *
             * \~japanese
             * Backbone.Router が route を解決可能か判定
             *
             * @private
             * @param  url {String} [in] url 文字列
             * @return true: 解決可能 / false: 解決不可
             */
            Router.canResolveRoute = function (url) {
                var fragment = Backbone.history.getFragment(url);
                return _.any(Backbone.history.handlers, function (handler) {
                    if (handler.route.test(fragment)) {
                        return true;
                    }
                });
            };
            /**
             * \~english
             * Check "vclick" fired at the last minute.
             *
             * @private
             *
             * \~japanese
             * 直前に vclick が呼ばれたか判定
             *
             * @private
             */
            Router.isJustBeforeVclicked = function () {
                var isBefore = (Date.now() - Router.s_lastClickedTime) < Router.DELAY_TIME * 2;
                Router.s_lastClickedTime = Date.now();
                return isBefore;
            };
            /**
             * \~english
             * Check back button clicked.
             *
             * @private
             *
             * \~japanese
             * Back Button がクリックされたか判定
             *
             * @private
             */
            Router.isBackButtonClicked = function (event) {
                if ($(event.currentTarget).jqmData("rel") === "back") {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * \~english
             * It called on succeed routing triggered by changing hash.
             *
             * @private
             * @param name {String} [in] name of route
             * @param args {Array}  [in] array of paramter
             *
             * \~japanese
             * ハッシュ値が変更され、ルーティングが成功したときにコールされる
             *
             * @private
             * @param name {String} [in] route 名。page の値が渡る。
             * @param args {Array}  [in] パラメータ配列。
             */
            Router.onRouteSucceeded = function (name) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var context = Router.s_rootContexts[name];
                if (!!context) {
                    var intent = { params: { queryParams: args } };
                    Router.s_lastNavigateInfo.inNavigation = true;
                    if (null != Router.s_lastNavigateInfo.intent) {
                        intent.params = $.extend({}, intent.params, Router.s_lastNavigateInfo.intent.params || {});
                    }
                    Router.s_lastNavigateInfo.intent = $.extend({}, Router.s_lastNavigateInfo.intent, intent);
                    var handled = context.callback(args);
                    if (!handled) {
                        Router.changePage(context.page);
                    }
                }
            };
            /**
             * \~english
             * It called on failed routing triggered by changing hash.
             *
             * @private
             * @param name {String} [in] name of route
             * @param args {Array}  [in] array of paramter
             *
             * \~japanese
             * ハッシュ値が変更され、ルーティングが失敗したときにコールされる
             *
             * @private
             * @param name {String} [in] route 名。page の値が渡る。
             * @param args {Array}  [in] パラメータ配列。
             */
            Router.onRouteFailed = function (fragment) {
                Router.s_lastNavigateInfo.inNavigation = true;
                if (null == fragment) {
                    fragment = Backbone.history.getFragment();
                }
                // route が解決できなかったものを管理下に
                if (Router.s_lastNavigateInfo.positiveNavigate) {
                    var context = Router.s_rootContexts[fragment];
                    if (null == context) {
                        context = {
                            route: fragment,
                            regexp: Router.s_router._routeToRegExp(fragment),
                            page: Router.s_lastNavigateInfo.url,
                            top: false,
                            callback: null,
                        };
                        Router.pushContext(fragment, context);
                    }
                }
                // fragment から path を解決
                var path = fragment;
                if (null != Router.s_rootContexts[fragment]) {
                    path = Router.s_rootContexts[fragment].page;
                }
                Router.changePage(path);
            };
            /**
             * \~english
             * This function just calls jQuery Mobile's navigation method.
             *
             * @private
             * @param path {String} [in] to page path
             *
             * \~japanese
             * jQuery Mobile によるページ遷移指定
             *
             * @private
             * @param path {String} [in] 遷移先パスを指定
             */
            Router.changePage = function (path) {
                var notifyBeforeRouteChange;
                // data-rel="back", ブラウザボタン, H/W Back Key が押下されたとき
                if (!Router.s_lastNavigateInfo.positiveNavigate) {
                    if (Router.s_lastNavigateInfo.inAdditionalBack) {
                        Router.s_lastNavigateInfo.inAdditionalBack = false;
                    }
                    else {
                        Router.decideDirection(path);
                        // 指定先に戻るか判定
                        var additional = Router.detectAdditionalBackDistance();
                        if (0 < additional) {
                            // 2回目以降の hash change には反応させない.
                            Router.s_lastNavigateInfo.inAdditionalBack = true;
                            Router.getJqmHistory().activeIndex -= additional;
                            history.go(-additional);
                            return;
                        }
                    }
                    // 遷移先が subflow 開始点である場合、param を削除
                    var subFlowInfo = Router.detectSubFlowBaseInfo();
                    if (subFlowInfo.isCurrent) {
                        delete subFlowInfo.stack[Router.SUBFLOW_PARAM];
                    }
                }
                // ページ遷移開始通知. すでにコールされている場合は既定の何もしないコールバックを使用する.
                notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
                notifyBeforeRouteChange()
                    .then(function () {
                    // 付加情報
                    if (Router.s_lastNavigateInfo.intent) {
                        Router.pushIntent(Router.s_lastNavigateInfo.intent);
                    }
                    Router.treatUrlHistory();
                    $.mobile.changePage(Framework.toUrl(path), {
                        showLoadMsg: false,
                        allowSamePageTransition: true,
                        transition: Router.s_lastNavigateInfo.transition || "none",
                        reverse: Router.s_lastNavigateInfo.reverse,
                        fromHashChange: !Router.s_lastNavigateInfo.positiveNavigate,
                        changeHash: !Router.s_lastNavigateInfo.noHashChange,
                    });
                })
                    .fail(function () {
                    console.error("before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
            };
            /**
             * \~english
             * Decide direction parameter.
             * It's as same as jQM internal implement. (imperfection)
             *
             * @private
             * @param path {String} [in] to page path
             *
             * \~japanese
             * direction の判定
             * jQM の内部実装と等価 (不完全)
             *
             * @private
             * @param path {String} [in] 遷移先パスを指定
             */
            Router.decideDirection = function (path) {
                Router.s_lastNavigateInfo.transition = Router.getJqmHistory().getActive().transition;
                var url = $.mobile.path.convertUrlToDataUrl(Framework.toUrl(path));
                Router.getJqmHistory().direct({
                    url: url,
                    present: function (newPage, direction) {
                        switch (direction) {
                            case "back":
                                Router.s_lastNavigateInfo.reverse = true;
                                break;
                            case "forward":
                                Router.s_lastNavigateInfo.transition = newPage.transition;
                                break;
                            default:
                                console.log("unknown direction: " + direction);
                                break;
                        }
                    },
                    missing: function () {
                        // 初期ページ URL は判定できない。正常系。
                        if (1 === Router.getJqmHistory().activeIndex) {
                            Router.getJqmHistory().previousIndex = 1;
                            Router.getJqmHistory().activeIndex = 0;
                            Router.s_lastNavigateInfo.reverse = true;
                        }
                        else if (0 !== Router.getJqmHistory().activeIndex) {
                            console.log("unknown direction.");
                        }
                    }
                });
            };
            /**
             * \~english
             * Return additional back distance count when back destination set.
             * (const function)
             *
             * @private
             * @return {Number} count of additiona back distance.
             *
             * \~japanese
             * 戻り先が指定されているとき、追加の Back 数を返します。
             * (この関数は Router の状態を変更しません。)
             *
             * @private
             * @return {String} 追加で Back に必要な距離.
             */
            Router.detectAdditionalBackDistance = function () {
                var stack = Router.getJqmHistory().stack;
                var historyActiveIndex = Router.getJqmHistory().activeIndex; // decideDirection() の Router.getJqmHistory().direct() によって、history の activeIndex はすでに変わっている
                var previousIndex = Router.getJqmHistory().previousIndex; // [戻る]が押下された場合、必ず有効な値が入る
                var i, backDst, distance, fragment, context, jqmDataUrl;
                // check "back operation".
                if (!Router.s_lastNavigateInfo.reverse || null == previousIndex) {
                    return 0;
                }
                // "backDst exists".
                backDst = stack[previousIndex][Router.BACK_DESTINATION_URL];
                if ((null == backDst)) {
                    return 0;
                }
                fragment = Backbone.history.getFragment(backDst);
                // 初期ページ
                if ("" === fragment) {
                    return historyActiveIndex;
                }
                // rootContext から path を逆引き
                context = _.find(Router.s_rootContexts, function (context) {
                    return context.regexp.test(fragment);
                });
                if (null == context) {
                    console.warn("back destination is not registered. back-dst: " + backDst);
                    return 0;
                }
                // dataUrl を元に jQM History を検索
                jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                for (i = historyActiveIndex, distance = 0; 0 <= i; i--, distance++) {
                    if (jqmDataUrl === stack[i].pageUrl) {
                        break;
                    }
                }
                if (i < 0) {
                    console.warn("back destination does not exist in history. back-dst: " + backDst);
                    return 0;
                }
                return distance;
            };
            /**
             * \~english
             * Begin sub flow
             * Attach SubFlowParam to jqm history stack object.
             *
             * @param subFlowParam {SubFlowParam} [in] Sub Flow parameter
             *
             * \~japanese
             * Sub Flow の開始
             * SubFlowParam を jqm history stack にアタッチ
             *
             * @param subFlowParam {SubFlowParam} [in] Sub Flow パラメータ
             */
            Router.beginSubFlow = function (subFlowParam) {
                var active = Router.getJqmHistory().getActive();
                var param = subFlowParam;
                if (subFlowParam.destBase) {
                    (function () {
                        var distance = 0;
                        var fragment = Backbone.history.getFragment(subFlowParam.destBase);
                        var context = _.find(Router.s_rootContexts, function (context) {
                            return context.regexp.test(fragment);
                        });
                        if (null == context) {
                            console.warn("base destination is not registered. destBase: " + subFlowParam.destBase);
                            return;
                        }
                        // dataUrl を元に jQM History を検索
                        var jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                        var stack = Router.getJqmHistory().stack;
                        for (var i = Router.getJqmHistory().activeIndex; 0 <= i; i--, distance++) {
                            if (jqmDataUrl === stack[i].pageUrl) {
                                param.additionalDistance = distance;
                                break;
                            }
                        }
                    })();
                }
                else {
                    param.destBase = location.hash;
                    param.additionalDistance = 0;
                }
                active[Router.SUBFLOW_PARAM] = param;
            };
            /**
             * \~english
             * End sub flow
             * navigate and delete SubFlowParam from jqm history stack object.
             *
             * @param navOptions {NavigateOptions} [in] Sub Flow parameter
             *
             * \~japanese
             * Sub Flow の終了
             * 遷移と SubFlowParam を jqm history stack から削除
             *
             * @param navOptions {NavigateOptions} [in] Sub Flow パラメータ
             */
            Router.endSubFlow = function (options) {
                var navOptions = $.extend(true, {}, options);
                var baseInfo = Router.detectSubFlowBaseInfo();
                // "end" 時に更新されたものを上書き
                var param = $.extend({}, baseInfo.subFlowParam, navOptions.subFlow);
                var distance = baseInfo.distance;
                var stack = baseInfo.stack;
                var NAVIGATE_INTERVAL = 100;
                var MAX_RETRY_COUNT = 10;
                var retry = 0;
                // hash 変更が完了した後に navigate を実行
                var _navigate = function () {
                    if (MAX_RETRY_COUNT <= retry) {
                        console.error("reached navigate max retry count.");
                        Router.s_lastNavigateInfo = {};
                    }
                    else if (param.destBase !== location.hash) {
                        retry++;
                        setTimeout(_navigate, NAVIGATE_INTERVAL);
                    }
                    else {
                        Router.s_lastNavigateInfo.inNavigation = false;
                        Router.registerPageStack(param.destStacks, true, navOptions);
                    }
                };
                if (stack) {
                    delete stack[Router.SUBFLOW_PARAM];
                    Router.getJqmHistory().activeIndex -= distance;
                    Router.getJqmHistory().clearForward();
                    if (param.destStacks) {
                        Router.stop();
                        history.go(-distance);
                        delete navOptions.subFlow; // subFlow プロパティの破棄
                        setTimeout(_navigate, 0);
                    }
                    else {
                        Router.s_lastNavigateInfo.positiveNavigate = false;
                        history.go(-distance);
                    }
                }
                else {
                    console.warn("subFlow begin status does not exist in history.");
                    Router.s_lastNavigateInfo = {};
                }
            };
            /**
             * \~english
             * Return destination Sub Flow information.
             * (const function)
             *
             * @private
             * @return {Object} sub flow info.
             *
             * \~japanese
             * Sub Flow 情報を返却
             * (この関数は Router の状態を変更しません。)
             *
             * @private
             * @return {Object} Sub Flow 情報.
             */
            Router.detectSubFlowBaseInfo = function () {
                var stack = Router.getJqmHistory().stack;
                var historyActiveIndex = Router.getJqmHistory().activeIndex;
                var i, distance;
                var param = {};
                var target;
                param.additionalDistance = 0;
                for (i = historyActiveIndex, distance = 0; 0 <= i; i--, distance++) {
                    if (stack[i][Router.SUBFLOW_PARAM]) {
                        target = stack[i];
                        param = stack[i][Router.SUBFLOW_PARAM];
                        break;
                    }
                }
                return {
                    stack: target,
                    subFlowParam: param,
                    distance: distance + param.additionalDistance,
                    isCurrent: (function () {
                        if (target && 0 === distance) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    })(),
                };
            };
            /**
             * \~english
             * Convert path to jQM dataUrl.
             *
             * @private
             * @return {String} jQM data url.
             *
             * \~japanese
             * パスを jQM dataUrl に変換
             *
             * @private
             * @return {String} jQM data url.
             */
            Router.pathToJqmDataUrl = function (path) {
                var url = Framework.toUrl(path);
                var dataUrl = $.mobile.path.convertUrlToDataUrl(url);
                return dataUrl;
            };
            /**
             * \~english
             * Update jQM urlHistory by window.history object.
             * To be natural browsing history behavior, application needs to update jQM urlHistory
             * when clicking back or next button of browser. (imperfection for decideDirection())
             *
             * @private
             *
             * \~japanese
             * ブラウザの履歴に基づき jQM urlHistory を更新
             * [戻る]/[進む]が押下された後、ページ遷移されるとき、jQM urlHistory を更新する。(decideDirection() により不完全)
             *
             * @private
             */
            Router.treatUrlHistory = function () {
                if (Router.s_lastNavigateInfo.positiveNavigate || history.length < Router.getJqmHistory().stack.length) {
                    Router.getJqmHistory().clearForward();
                }
            };
            /**
             * \~english
             * Get jQM's history object
             * version 1.4:
             *   $.mobile.navigate.history
             * version 1.3:
             *   $.mobile.urlHistory
             *
             * @private
             *
             * \~japanese
             * jQM の History オブジェクトの取得
             * version 1.4:
             *   $.mobile.navigate.history
             * version 1.3:
             *   $.mobile.urlHistory
             *
             * @private
             */
            Router.getJqmHistory = function () {
                return $.mobile.navigate.history;
            };
            Router.s_initOptions = {};
            Router.s_router = null;
            Router.s_rootContexts = {};
            Router.s_lastNavigateInfo = {};
            Router.s_lastClickedTime = null;
            Router.s_lastIntent = {};
            Router.s_loadUrl = null;
            Router.s_back = null;
            Router.DELAY_TIME = 200; // TBD: 暫定値
            Router.DATA_BACK_DESTINATION = "data-back-dst";
            Router.DATA_NO_HASH_CHANGE = "data-no-hash-change";
            Router.DATA_NO_VCLICK_HANDLE = "data-no-vclick-handle";
            Router.BACK_DESTINATION_URL = "backDstUrl";
            Router.SUBFLOW_PARAM = "subFlowParam";
            Router.s_defaultInitOptions = {
                anchorVclick: true,
            };
            Router.s_defaultNavigateOptions = {
                trigger: true,
                replace: false,
                intent: null,
            };
            return Router;
        }());
        Framework.Router = Router;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));








/* tslint:disable:max-line-length forin */
var CDP;
(function (CDP) {
    /**
     * \~english
     * The function returned JQueryPromise waits until PhoneGap is ready.
     * [Note] emulate when PC enviroment.
     *
     * \~japanese
     * PhoneGap が有効になるまで待機
     * PC 環境ではエミュレートされる。
     */
    function waitForDeviceReady() {
        var df = $.Deferred();
        if (!CDP.Framework.Platform.Mobile) {
            setTimeout(function () {
                df.resolve();
            }, 100);
        }
        else {
            if (null == CDP.global.cordova || null == CDP.global.cordova.exec) {
                $(document).one("deviceready", function () {
                    df.resolve();
                });
            }
            else {
                df.resolve();
            }
        }
        return df.promise();
    }
    CDP.waitForDeviceReady = waitForDeviceReady;
    var _defaultBackButtonHandler = null;
    /**
     * \~english
     * Setup H/W Back key handler.
     *
     * @param  {Function} handler function.
     * @return {Function} old handler function.
     *
     * \~japanese
     *
     * @param  {Function} handler 指定.
     * @return {Function} 以前の handler.
     */
    function setBackButtonHandler(handler) {
        var oldHandler = _defaultBackButtonHandler;
        _defaultBackButtonHandler = handler;
        return oldHandler;
    }
    CDP.setBackButtonHandler = setBackButtonHandler;
    // back key handler implement.
    (function () {
        waitForDeviceReady().done(function () {
            $(document).on("backbutton", function (event) {
                if (_defaultBackButtonHandler) {
                    _defaultBackButtonHandler(event);
                }
            });
        });
    })();
    //___________________________________________________________________________________________________________________//
    var Framework;
    (function (Framework) {
        var TAG = "[CDP.Framework] ";
        var _initializedState = {
            done: false,
            calling: false,
        };
        var _activePage = null;
        var _orientationListenerHolder = {};
        var _lastOrientation = null;
        /**
         * \~english
         * Initialization function of Framework.
         *
         * \~japanese
         * Framework の初期化関数
         *
         * @param options {FrameworkOptions} [in] options object.
         */
        function initialize(options) {
            var df = $.Deferred();
            var config = getConfig(options);
            if (_initializedState.calling) {
                console.warn(TAG + "cdp.framework.jqm is already initialized, ignored.");
                return df.resolve();
            }
            _initializedState.calling = true;
            // CDP 環境の初期化
            // 現状は、console オブジェクトの保証と jQuery の WinRT 対応。
            CDP.initialize({
                success: function () {
                    // Framework 用の Patch 適用
                    if (config.applyPatch) {
                        Framework.Patch.apply();
                    }
                    // jQuery の共通設定
                    config.jquery();
                    // AMD でない環境では初期化はここまで。
                    if (!isAMD()) {
                        console.warn(TAG + "need to init for 'jquery.mobile', 'i18Next' and 'CDP.Framework.Router' manually, because cdp.framework depends on require.js.");
                        _initializedState.done = true;
                        return df.resolve();
                    }
                    // jQuery Mobile の初期化
                    $(document).on("mobileinit", function () {
                        // config の反映
                        config.jquerymobile();
                        // i18next の初期化
                        i18nextInitialize(config)
                            .always(function (info) {
                            // i18next の初期化時のエラーは無視する. info が array の場合、エラー情報が格納されている.
                            $(document)
                                .one("pagebeforechange", function (event, data) {
                                data.options.showLoadMsg = false;
                            })
                                .on("pagebeforecreate", function (event) {
                                // i18nextライブラリによるhtml fragmentの翻訳処理
                                $(event.target).localize();
                            });
                            // Router の初期化
                            if (Framework.Router.initialize({ anchorVclick: config.anchorVclick, })) {
                                _initializedState.done = true;
                                df.resolve();
                            }
                            else {
                                console.error(TAG + "error. CDP.Framework.Router.initialize() failed.");
                                _initializedState.calling = false;
                                df.reject();
                            }
                        });
                    });
                    // jQuery Mobile のロード
                    require(["jquery.mobile"]);
                },
                fail: function (error) {
                    console.error(TAG + "error. CDP.initialize() failed.");
                    _initializedState.calling = false;
                    df.reject();
                },
            });
            return df.promise();
        }
        Framework.initialize = initialize;
        /**
         * \~english
         * Check for initialization status.
         *
         * \~japanese
         * 初期化済みか判定
         *
         * @return {Boolean} true: 初期化済み / false: 未初期化
         */
        function isInitialized() {
            return _initializedState.done;
        }
        Framework.isInitialized = isInitialized;
        /**
         * \~english
         * Register IOrientationChangedListener to framework.
         *
         * @param key      {String}                      [in] ID key
         * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
         *
         * \~japanese
         * IOrientationChangedListener を Framework に登録
         *
         * @param key      {String}                      [in] ID key
         * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
         */
        function registerOrientationChangedListener(key, listener) {
            _orientationListenerHolder[key] = listener;
        }
        Framework.registerOrientationChangedListener = registerOrientationChangedListener;
        /**
         * \~english
         * Unregister IOrientationChangedListener from framework.
         *
         * @param key {String} [in] ID key
         *
         * \~japanese
         * IOrientationChangedListener を Framework から登録解除
         *
         * @param key {String} [in] ID key
         */
        function unregisterOrientationChangedListener(key) {
            delete _orientationListenerHolder[key];
        }
        Framework.unregisterOrientationChangedListener = unregisterOrientationChangedListener;
        /**
         * \~english
         * Setup event handlers when after router initialized.
         *
         * @private
         *
         * \~japanese
         * イベントハンドラの設定. Router 初期化後に Framework がコールする.
         *
         * @private
         */
        function setupEventHandlers() {
            (function () {
                var oldBackButtonHandler = CDP.setBackButtonHandler(null);
                var baseBackButtonHandler = function (event) {
                    if (_activePage && _activePage.onHardwareBackButton(event)) {
                        // クライアント側でハンドリング済みと指定された場合、既定の処理を行わない
                        return;
                    }
                    else {
                        oldBackButtonHandler(event);
                    }
                };
                CDP.setBackButtonHandler(baseBackButtonHandler);
            })();
            (function () {
                var oldRouteChangeHandler = CDP.Framework.setBeforeRouteChangeHandler(null);
                var baseRouteChangeHandler = function () {
                    if (_activePage) {
                        return _activePage.onBeforeRouteChange();
                    }
                    else {
                        return oldRouteChangeHandler();
                    }
                };
                CDP.Framework.setBeforeRouteChangeHandler(baseRouteChangeHandler);
            })();
        }
        Framework.setupEventHandlers = setupEventHandlers;
        /**
         * \~english
         * Setup active IPage instance.
         *
         * @private
         * @param page {IPage} [in] IPage instance.
         *
         * \~japanese
         * active Page の設定. Framework がコールする.
         *
         * @private
         * @param page {IPage} [in] IPage instance.
         */
        function setActivePage(page) {
            _activePage = page;
            if (_activePage) {
                _lastOrientation = Framework.getOrientation();
            }
        }
        Framework.setActivePage = setActivePage;
        /**
         * \~english
         * Reterns framework default click event string.
         *
         * @private
         *
         * \~japanese
         * Framework が既定に使用するクリックイベント文字列を取得
         *
         * @private
         * @return {String} "vclick" / "click"
         */
        function getDefaultClickEvent() {
            return Framework.Patch.s_vclickEvent;
        }
        Framework.getDefaultClickEvent = getDefaultClickEvent;
        /**
         * \~english
         * Get Config object.
         *
         * @private
         * @return {FrameworkOptions} Config object.
         *
         * \~japanese
         * Config object の取得
         *
         * @private
         * @return {FrameworkOptions} Config object.
         */
        function getConfig(options) {
            var defConfig = {
                // for fail safe, default settings.
                jquery: function () {
                    $.support.cors = true;
                    $.ajaxSetup({ cache: false });
                },
                jquerymobile: function () {
                    $.mobile.allowCrossDomainPages = true;
                    $.mobile.defaultPageTransition = "none";
                    $.mobile.hashListeningEnabled = false;
                    $.mobile.pushStateEnabled = false;
                },
                i18next: {},
                applyPatch: true,
                anchorVclick: true,
            };
            return $.extend({}, defConfig, CDP.global.Config, options);
        }
        /**
         * \~english
         * Check for AMD is available.
         *
         * \~japanese
         * AMD が使用可能か判定
         *
         * @private
         * @return {Boolean} true: AMD 対応環境 / false: AMD 非対応
         */
        function isAMD() {
            return (typeof define === "function" && define.amd);
        }
        /**
         * \~english
         * get string resource for fallback.
         *
         * \~japanese
         * Fallback 用ローカライズリソースの取得
         *
         * @private
         * @return {Object}
         */
        function getLocaleFallbackResource(path) {
            var json;
            $.ajax({
                url: Framework.toUrl(path),
                method: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    json = data;
                },
                error: function (data, status) {
                    console.log(TAG + "ajax request failed. status: " + status);
                }
            });
            return json;
        }
        /**
         * \~english
         * initialize i18next.
         *
         * \~japanese
         * i18next の初期化
         *
         * @private
         * @return {jQueryPromise}
         */
        function i18nextInitialize(config) {
            var df = $.Deferred();
            var i18nSettings = config.i18next;
            var modulePath = (function (path) {
                if (path) {
                    return (path.substr(-1) !== "/") ? path + "/" : path;
                }
                else {
                    return "";
                }
            })(i18nSettings.modulePath);
            var i18nOptions = (function (resources) {
                if (resources) {
                    for (var lng in resources) {
                        if (resources.hasOwnProperty(lng)) {
                            for (var ns in resources[lng]) {
                                if (resources[lng].hasOwnProperty(ns)) {
                                    resources[lng][ns] = getLocaleFallbackResource(resources[lng][ns]);
                                }
                            }
                        }
                    }
                    i18nSettings.options.resources = resources;
                    return i18nSettings.options;
                }
                else {
                    return i18nSettings.options;
                }
            })(i18nSettings.fallbackResources);
            if (modulePath) {
                requirejs.config({
                    paths: {
                        "i18next": modulePath + "i18next",
                        "i18nextXHRBackend": modulePath + "i18nextXHRBackend",
                        "i18nextLocalStorageCache": modulePath + "i18nextLocalStorageCache",
                        "i18nextSprintfPostProcessor": modulePath + "i18nextSprintfPostProcessor",
                        "i18nextBrowserLanguageDetector": modulePath + "i18nextBrowserLanguageDetector",
                        "jqueryI18next": modulePath + "jquery-i18next",
                    }
                });
            }
            require(["jqueryI18next"], function ($18Next) {
                require([
                    "i18next",
                    "i18nextXHRBackend",
                    "i18nextLocalStorageCache",
                    "i18nextSprintfPostProcessor",
                    "i18nextBrowserLanguageDetector",
                ], function (i18next, Backend, Cache, PostProcessor, LanguageDetector) {
                    i18next
                        .use(Backend)
                        .use(Cache)
                        .use(PostProcessor)
                        .use(LanguageDetector)
                        .init(i18nOptions, function (error, t) {
                        $18Next.init(i18next, $, {
                            tName: "t",
                            i18nName: "i18n",
                            handleName: "localize",
                            selectorAttr: "data-i18n",
                            targetAttr: "i18n-target",
                            optionsAttr: "i18n-options",
                            useOptionsAttr: false,
                            parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                        });
                        df.resolve();
                    });
                });
            });
            return df.promise();
        }
        ///////////////////////////////////////////////////////////////////////
        // closure methods
        // resize handler
        $(window).on("resize", function (event) {
            var newOrientation = Framework.getOrientation();
            if (_lastOrientation !== newOrientation) {
                for (var key in _orientationListenerHolder) {
                    _orientationListenerHolder[key].onOrientationChanged(newOrientation);
                }
                if (_activePage) {
                    _activePage.onOrientationChanged(newOrientation);
                }
                _lastOrientation = newOrientation;
            }
        });
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));



var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * \~english
         * @class Page
         * @brief Base class of all page unit.
         *
         * \~japanese
         * @class Page
         * @brief すべてのページの基本となる既定クラス
         */
        var Page = (function () {
            //////////////////////////////////////////
            // public methods
            /**
             * \~english
             * constructor
             *
             * @param _url    {String}               [in] page's URL
             * @param _id     {String}               [in] page's ID
             * @param options {PageConstructOptions} [in] options
             *
             * \~japanese
             * constructor
             *
             * @param _url    {String}               [in] ページ URL
             * @param _id     {String}               [in] ページ ID
             * @param options {PageConstructOptions} [in] オプション
             */
            function Page(_url, _id, options) {
                this._url = _url;
                this._id = _id;
                //////////////////////////////////////////
                // data member
                this._owner = null;
                this._$page = null;
                this._$header = null;
                this._$footer = null;
                this._intent = null;
                this._initialized = false;
                this.setup(options);
            }
            Object.defineProperty(Page.prototype, "active", {
                //////////////////////////////////////////
                // public accessor 
                get: function () { return !!this._$page && this._$page.hasClass("ui-page-active"); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "url", {
                get: function () { return this._url; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "id", {
                get: function () { return this._id; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "$page", {
                get: function () { return this._$page; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "$header", {
                get: function () { return this._$header; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "$footer", {
                get: function () { return this._$footer; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "intent", {
                get: function () { return this._intent; },
                set: function (newIntent) { this._intent = newIntent; this._intent._update = true; },
                enumerable: true,
                configurable: true
            });
            //////////////////////////////////////////
            // public Event Handler
            // Orientation の変更を受信
            Page.prototype.onOrientationChanged = function (newOrientation) {
                if (this._owner) {
                    this._owner.onOrientationChanged(newOrientation);
                }
            };
            // H/W Back Button ハンドラ
            Page.prototype.onHardwareBackButton = function (event) {
                if (this._owner) {
                    return this._owner.onHardwareBackButton(event);
                }
                else {
                    return false;
                }
            };
            // Router "before route change" ハンドラ
            Page.prototype.onBeforeRouteChange = function () {
                if (this._owner) {
                    return this._owner.onBeforeRouteChange();
                }
                else {
                    return $.Deferred().resolve().promise();
                }
            };
            // 汎用コマンドを受信
            Page.prototype.onCommand = function (event, kind) {
                if (this._owner) {
                    this._owner.onCommand(event, kind);
                }
            };
            // 最初の OnPageInit() のときにのみコールされる
            Page.prototype.onInitialize = function (event) {
                if (this._owner) {
                    this._owner.onInitialize(event);
                }
            };
            // jQM event: "pagebeforecreate" に対応
            Page.prototype.onPageBeforeCreate = function (event) {
                if (this._owner) {
                    this._owner.onPageBeforeCreate(event);
                }
            };
            // jQM event: "pagecreate" (旧:"pageinit") に対応
            Page.prototype.onPageInit = function (event) {
                if (this._owner) {
                    this._owner.onPageInit(event);
                }
            };
            // jQM event: "pagebeforeshow" に対応
            Page.prototype.onPageBeforeShow = function (event, data) {
                if (this._owner) {
                    this._owner.onPageBeforeShow(event, data);
                }
            };
            // jQM event: "pagecontainershow" (旧:"pageshow") に対応
            Page.prototype.onPageShow = function (event, data) {
                if (this._owner) {
                    this._owner.onPageShow(event, data);
                }
            };
            // jQM event: "pagebeforehide" に対応
            Page.prototype.onPageBeforeHide = function (event, data) {
                if (this._owner) {
                    this._owner.onPageBeforeHide(event, data);
                }
            };
            // jQM event: "pagecontainerhide" (旧:"pagehide") に対応
            Page.prototype.onPageHide = function (event, data) {
                if (this._owner) {
                    this._owner.onPageHide(event, data);
                }
            };
            // jQM event: "pageremove" に対応
            Page.prototype.onPageRemove = function (event) {
                if (this._owner) {
                    this._owner.onPageRemove(event);
                }
            };
            //////////////////////////////////////////
            // private methods
            // mixin 用疑似コンストラクタ
            Page.prototype.setup = function (options) {
                var _this = this;
                // mixin destination 用の再初期化
                this._initialized = false;
                this._intent = null;
                // イベントバインド
                var selector = "#" + this._id;
                $(document)
                    .off("pagebeforecreate", selector)
                    .on("pagebeforecreate", selector, function (event) {
                    _this._$page = $(selector).first();
                    _this._$header = _this._$page.children(":jqmData(role=header)").first();
                    _this._$footer = _this._$page.children(":jqmData(role=footer)").first();
                    _this._$page
                        .on("pagecreate", function (event) {
                        _this.pageInit(event);
                    })
                        .on("pagebeforeshow", function (event, data) {
                        _this.pageBeforeShow(event, data);
                    })
                        .on("pageshow", function (event, data) {
                        _this.pageShow(event, data);
                    })
                        .on("pagebeforehide", function (event, data) {
                        _this.pageBeforeHide(event, data);
                    })
                        .on("pagehide", function (event, data) {
                        _this.pageHide(event, data);
                    })
                        .on("pageremove", function (event) {
                        _this.pageRemove(event);
                    });
                    _this.pageBeforeCreate(event);
                });
                options = options || {};
                // owner 設定
                this._owner = options.owner;
                // intent 設定
                this._keepIntent = options.keepIntent;
                // Router へ登録
                if (null == options.route) {
                    options.route = this._id;
                }
                Framework.Router.register(options.route, this._url, options.top, options.callback);
            };
            Page.prototype.pageBeforeCreate = function (event) {
                this.onPageBeforeCreate(event);
            };
            Page.prototype.pageInit = function (event) {
                if (!this._initialized) {
                    this.onInitialize(event);
                    this._initialized = true;
                }
                this.onPageInit(event);
            };
            Page.prototype.pageBeforeShow = function (event, data) {
                Framework.setActivePage(this);
                this._intent = Framework.Router.popIntent();
                this.onPageBeforeShow(event, data);
            };
            Page.prototype.pageShow = function (event, data) {
                this.onPageShow(event, data);
            };
            Page.prototype.pageBeforeHide = function (event, data) {
                this.onPageBeforeHide(event, data);
                if (null != this._intent && (this._keepIntent || this._intent._update)) {
                    delete this._intent._update;
                    Framework.Router.pushIntent(this._intent);
                }
                else if (Framework.Router.fromHashChanged() && Framework.Router.isInSubFlow()) {
                    Framework.Router.pushIntent(this._intent);
                }
                this._intent = null;
                Framework.setActivePage(null);
            };
            Page.prototype.pageHide = function (event, data) {
                this.onPageHide(event, data);
            };
            Page.prototype.pageRemove = function (event) {
                this.onPageRemove(event);
                this._$page.off();
                this._$page = null;
                this._$header.off();
                this._$header = null;
                this._$footer.off();
                this._$footer = null;
            };
            return Page;
        }());
        Framework.Page = Page;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));

    return CDP.Framework;
}));
