var DPMW;
(function (DPMW_1) {
    var global = CDP.global;
    function onStart(initFlg) {
        var router = CDP.Framework.Router;
        router.register('', '/templates/explorer_baseview.html', true);
        router.start();
    }
    define('scripts/app_explorer', [
        'hogan',
        'cdp.ui.jqm',
        'backbone-adopter'
    ], function () {
        var DPMW = global.DPMW;
        CDP.lazyLoad('lazy');
        return { main: onStart };
    });
})(DPMW || (DPMW = {}));
//# sourceMappingURL=app_explorer.js.map