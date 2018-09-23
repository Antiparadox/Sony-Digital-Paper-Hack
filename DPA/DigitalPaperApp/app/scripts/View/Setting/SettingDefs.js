var DPMW;
(function (DPMW) {
    var View;
    (function (View) {
        var Setting;
        (function (Setting) {
            var ValToI18;
            (function (ValToI18) {
                ValToI18.TimeZone = {
                    'Etc/GMT+12': 'config.generalSettings.timezone.m12',
                    'Etc/GMT+11': 'config.generalSettings.timezone.m11',
                    'Pacific/Honolulu': 'config.generalSettings.timezone.m10',
                    'America/Anchorage': 'config.generalSettings.timezone.m9',
                    'America/Los_Angeles': 'config.generalSettings.timezone.m8',
                    'America/Denver': 'config.generalSettings.timezone.m7',
                    'America/Chicago': 'config.generalSettings.timezone.m6',
                    'America/New_York': 'config.generalSettings.timezone.m5',
                    'America/Halifax': 'config.generalSettings.timezone.m4',
                    'Etc/GMT+3': 'config.generalSettings.timezone.m3',
                    'Etc/GMT+2': 'config.generalSettings.timezone.m2',
                    'Etc/GMT+1': 'config.generalSettings.timezone.m1',
                    'UTC': 'config.generalSettings.timezone.utc',
                    'Europe/Amsterdam': 'config.generalSettings.timezone.p1',
                    'Europe/Helsinki': 'config.generalSettings.timezone.p2',
                    'Etc/GMT-3': 'config.generalSettings.timezone.p3',
                    'Etc/GMT-4': 'config.generalSettings.timezone.p4',
                    'Etc/GMT-5': 'config.generalSettings.timezone.p5',
                    'Etc/GMT-6': 'config.generalSettings.timezone.p6',
                    'Etc/GMT-7': 'config.generalSettings.timezone.p7',
                    'Etc/GMT-8': 'config.generalSettings.timezone.p8',
                    'Asia/Tokyo': 'config.generalSettings.timezone.p9',
                    'Etc/GMT-10': 'config.generalSettings.timezone.p10',
                    'Etc/GMT-11': 'config.generalSettings.timezone.p11',
                };
                ValToI18.DateFormat = {
                    'yyyy/M/d': 'config.generalSettings.formatDate.ymd',
                    'M/d/yyyy': 'config.generalSettings.formatDate.mdy',
                };
                ValToI18.TimeFormat = {
                    '12hour': 'config.generalSettings.formatTime.hour12',
                    '24hour': 'config.generalSettings.formatTime.hour24',
                };
                ValToI18.TimeoutToStandby = {
                    'never': 'config.generalSettings.autosleep.none',
                    '5': 'config.generalSettings.autosleep.m5',
                    '10': 'config.generalSettings.autosleep.m10',
                    '30': 'config.generalSettings.autosleep.m30',
                    '60': 'config.generalSettings.autosleep.m60',
                };
            })(ValToI18 = Setting.ValToI18 || (Setting.ValToI18 = {}));
        })(Setting = View.Setting || (View.Setting = {}));
    })(View = DPMW.View || (DPMW.View = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=SettingDefs.js.map