/*!
 * cdp.lazyload.js 1.2.0-dev
 *
 * Date: 2016-05-11T14:21:38+0900
 */

((function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], function ($) {
            return factory($, root.Config || {}, root.CDP || (root.CDP = {}));
        });
    } else {
        // Browser globals
        factory(root.jQuery || root.$, root.Config || {}, root.CDP || (root.CDP = {}));
    }
})(this, function ($, Config, CDP) {

    var TAG = "[CDP] ";

    /**
     * \~english
     * Get file extension by file name.
     *
     * @private
     * @param  file {String} [in] file path / file name
     * @return {String} file extension
     *
     * \~japanese
     * ファイル名から拡張子を取得
     *
     * @private
     * @param  file {String} [in] file path / file name
     * @return {String} file extension
     */
    function _getExtension(file) {
        var ret;
        if (file) {
            var fileTypes = file.split(".");
            var len = fileTypes.length;
            if (0 === len) {
                return ret;
            }
            ret = fileTypes[len - 1];
            return ret;
        }
    }

    /**
     * \~english
     * Get script elements.
     *
     * @private
     * @param  file {jQuery} [in] type lazy elements
     * @return {jQuery} script elements
     *
     * \~japanese
     * script element の取得
     *
     * @private
     * @param  file {jQuery} [in] type lazy elements
     * @return {jQuery} script elements
     */
    function _getScriptElements($typeLazy) {
        var scripts;
        var src = $typeLazy.attr("src");
        if (!src) {
            src = $typeLazy.data("src");
        }
        if ("js" === _getExtension(src).toLowerCase()) {
            return $typeLazy;
        } else {
            if (requirejs && typeof requirejs.toUrl === "function") {
                src = requirejs.toUrl(src);
            }
            $.ajax({
                url: src,
                method: "GET",
                async: false,
                dataType: "html",
                success: function (data){
                    scripts = data;
                },
                error: function (data, status) {
                    console.error(TAG + "lazyLoad() ajax request failed. [status: " + status + "][src: " + src + "]");
                }
            });
            return $(scripts).find("script");
        }
    }

    /**
     * \~english
     * Load script and append to head with "sourceURL".
     *
     * @param $script {JQuery} [in] script's jQuery object
     *
     * \~japanese
     * "sourceURL" コメントと共に、script を同期読み込み
     * jQuery.append() の Hack。 eval() でスクリプトを有効化している。
     * Developer Tool の Source Tree 上に表示するため、sourceURL が無ければ埋め込む
     *
     * @param $script {JQuery} [in] script の jQuery object
     */
    function _appendSync($script) {
        var _src = $script.attr("src");
        if (!_src) {
            _src = $script.data("src");
        }

        var _url = function ($elem) {
            var ret = _src;
            if (requirejs && typeof requirejs.toUrl === "function") {
                ret = requirejs.toUrl(ret);
                $elem.attr("src", ret);
            }
            return ret;
        }($script);


        var toLocation = function (url) {
            // 明示的に autoDomainAssign = false が指定されているときは、_src を返す
            if (false === Config.autoDomainAssign) {
                return _src;
            } else {
                var ret = url.split("?");

                if (!ret || 0 === ret.length) {
                    return url;
                } else {
                    return ret[0];
                }
            }
        };

        var code;

        $.ajax({
            url: _url,
            method: "GET",
            async: false,
            dataType: "text",
            success: function (data) {
                code = data;
            },
            error: function (data, status) {
                console.error(TAG + "lazyLoad() ajax request failed. [status: " + status + "][src: " + _url + "]");
            }
        });
        if (code) {
            // sourceURL が指定されていなければ追加
            if (!code.match(/\/\/@ sourceURL=[\s\S]*?\n/g) && !code.match(/\/\/# sourceURL=[\s\S]*?\n/g)) {
                code = code + "\n//# " + "sourceURL=" + toLocation(_url);
            }

            // script を有効化
            $.globalEval(code);

            // <head> に <script> として追加
            $script.attr("type", "false");
            document.head.appendChild($script[0]);
            $script.removeAttr("type");
        }
    }

    /**
     * \~english
     * Script lazy loading.
     *
     * @param type {String} [in] script tag's type
     *
     * \~japanese
     * 遅延スクリプトロード
     *
     * @param type {String} [in] script タグに指定されたタイプを指定
     */
    function _lazyLoad(type) {
        $("script[type='" + type + "']")
            .each(function () {
                _getScriptElements($(this).remove())
                    .each(function () {
                        _appendSync($(this));
                    });
            });
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
    function _isAMD() {
        return (typeof define === "function" && define.amd);
    }

    CDP.lazyLoad = _lazyLoad;
    CDP.isAMD = _isAMD;

    return CDP;
}));
