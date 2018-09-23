var DPMW;
(function (DPMW_1) {
    var global = CDP.global;
    function onStart(initFlg) {
        var router = CDP.Framework.Router;
        router.register('', '/templates/software_update.html', true);
        router.start();
    }
    define('scripts/app_software_update', [
        'hogan',
        'cdp.ui.jqm',
    ], function () {
        var DPMW = global.DPMW;
        CDP.lazyLoad('lazy');
        return { main: onStart };
    });
})(DPMW || (DPMW = {}));
//# sourceMappingURL=app_software_update.js.map