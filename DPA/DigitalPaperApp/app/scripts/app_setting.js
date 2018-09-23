var DPMW;
(function (DPMW_1) {
    var global = CDP.global;
    function onStart(initFlg) {
        var router = CDP.Framework.Router;
        router.register('', '/templates/setting.html', true);
        router.start();
    }
    define('scripts/app_setting', [
        'hogan',
        'cdp.ui.jqm',
    ], function () {
        var DPMW = global.DPMW;
        CDP.lazyLoad('lazy');
        return { main: onStart };
    });
})(DPMW || (DPMW = {}));
//# sourceMappingURL=app_setting.js.map