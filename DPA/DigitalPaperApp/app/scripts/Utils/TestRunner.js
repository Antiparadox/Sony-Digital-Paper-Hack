var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var horizontal = true;
        var testRunnerPrepared = false;
        var activeTestSpecs = [
            '../scripts/View/Explorer/test/Sandbox.js',
            '../scripts/View/Explorer/test/SandboxManual.js',
            '../scripts/View/Explorer/test/ViewType.js',
            '../scripts/View/Explorer/test/ViewTypeManual.js'
        ];
        function prepareTestRunner(targetSelector) {
            if (testRunnerPrepared) {
                return;
            }
            $('head').append('<link rel="stylesheet" href="../modules/jasmine/jasmine.css" type="text/css" />');
            jasmineRequire = require('../app/modules/jasmine/jasmine');
            require('../app/modules/jasmine/jasmine-html');
            require('../app/modules/jasmine/boot');
            var $el = $(targetSelector);
            if (horizontal) {
                $el.css('height', '50%');
                $el.parent().append('<div id="jasmine-area" style="position: absolute; top: 50%; height: 50%; width: 100%; overflow-y: scroll;"></div>');
            }
            else {
                $el.css('width', '50%');
                $el.parent().append('<div id="jasmine-area" style="position: absolute; left: 50%; width: 50%; height: 100%; overflow-y: scroll;"></div>');
            }
            jasmineHtmlReporter.initialize();
            testRunnerPrepared = true;
        }
        Utils.prepareTestRunner = prepareTestRunner;
        function loadTestSpec(specPath) {
            $('head').append('<script type="text/javascript" src="' + specPath + '"></script>');
        }
        Utils.loadTestSpec = loadTestSpec;
        function runTest() {
            var env = jasmine.getEnv();
            env.execute();
        }
        Utils.runTest = runTest;
        if (process.env.DEBUG) {
            $(window).keydown(function (ev) {
                if (ev.ctrlKey && ev.keyCode === 84) {
                    prepareTestRunner('#main-section');
                    for (var i = 0; i < activeTestSpecs.length; i++) {
                        var testSpec = activeTestSpecs[i];
                        loadTestSpec(testSpec);
                    }
                    runTest();
                }
                if (ev.ctrlKey && ev.keyCode === 82) {
                    location.reload();
                }
            });
        }
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=TestRunner.js.map