var Config;
(function (Config) {
    var global = global || window;
    var baseUrl = /(.+\/)[^/]*#[^/]+/.exec(location.href);
    if (!baseUrl) {
        baseUrl = /(.+\/)/.exec(location.href);
    }
    var requireConfig = {
        baseUrl: baseUrl[1],
        urlArgs: "bust=" + Date.now(),
        paths: {
            "backbone": "modules/backbone/scripts/backbone",
            "backbone-adopter": "modules/include/backbone-adopter",
            "hogan": "modules/hogan/scripts/hogan",
            "jquery": "modules/jquery/scripts/jquery",
            "jquery.mobile": "modules/jquery/scripts/jquery.mobile",
            "underscore": "modules/underscore/scripts/underscore",
            "cdp.core": "modules/cdp/scripts/cdp.core",
            "cdp.framework.jqm": "modules/cdp/scripts/cdp.framework.jqm",
            "cdp.lazyload": "modules/cdp/scripts/cdp.lazyload",
            "cdp.promise": "modules/cdp/scripts/cdp.promise",
            "cdp.tools": "modules/cdp/scripts/cdp.tools",
            "cdp.ui.jqm": "modules/cdp/scripts/cdp.ui.jqm",
            "cdp.ui.listview": "modules/cdp/scripts/cdp.ui.listview",
        },
        shim: {},
    };
    global.requirejs = requireConfig;
    function jquery() {
        $.support.cors = true;
        $.ajaxSetup({ cache: false });
    }
    Config.jquery = jquery;
    function jquerymobile() {
        $.mobile.allowCrossDomainPages = true;
        $.mobile.defaultPageTransition = "none";
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        $.mobile.loader.prototype.options.disabled = true;
        $.mobile.loader.prototype.options.text = '';
        $.mobile.loader.prototype.options.html = '';
    }
    Config.jquerymobile = jquerymobile;
    Config.i18next = {
        modulePath: "modules/i18next/scripts",
        options: {
            fallbackLng: "en",
            ns: "messages",
            defaultNS: "messages",
            backend: {
                loadPath: "res/locales/{{ns}}.{{lng}}.json",
            },
            detection: {
                order: ["cookie", "navigator"],
                caches: false,
            },
            cache: {
                enable: false,
            },
            interpolation: {
                escapeValue: false
            }
        },
    };
    Config.autoDomainAssign = true;
    Config.namespace = "DPMW";
    Config.DEBUG = (function () {
        return !!("%% buildsetting %%");
    })();
    Config.USE_STUB = (function () {
        return false;
    })();
})(Config || (Config = {}));
//# sourceMappingURL=config.js.map