var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var DeviceSetting;
        (function (DeviceSetting) {
            var TimeZoneDefs;
            (function (TimeZoneDefs) {
                TimeZoneDefs.ATTR_NAME_TIMEZONE = 'time_zone';
                TimeZoneDefs.VALUE_ETC_GMT_PLUS_12 = 'Etc/GMT+12';
                TimeZoneDefs.VALUE_ETC_GMT_PLUS_11 = 'Etc/GMT+11';
                TimeZoneDefs.VALUE_PACIFIC_HONOLULU = 'Pacific/Honolulu';
                TimeZoneDefs.VALUE_AMERICA_ANCHORAGE = 'America/Anchorage';
                TimeZoneDefs.VALUE_AMERICA_LOSANGELS = 'America/Los_Angeles';
                TimeZoneDefs.VALUE_AMERICA_DENVER = 'America/Denver';
                TimeZoneDefs.VALUE_AMERICA_CHICAGO = 'America/Chicago';
                TimeZoneDefs.VALUE_AMERICA_NEWYORK = 'America/New_York';
                TimeZoneDefs.VALUE_AMERICA_HALIFAX = 'America/Halifax';
                TimeZoneDefs.VALUE_ETC_GMT_PLUS_3 = 'Etc/GMT+3';
                TimeZoneDefs.VALUE_ETC_GMT_PLUS_2 = 'Etc/GMT+2';
                TimeZoneDefs.VALUE_ETC_GMT_PLUS_1 = 'Etc/GMT+1';
                TimeZoneDefs.VALUE_UTC = 'UTC';
                TimeZoneDefs.VALUE_EUROPE_AMSTERDAM = 'Europe/Amsterdam';
                TimeZoneDefs.VALUE_EUROPE_HELSINKI = 'Europe/Helsinki';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_3 = 'Etc/GMT-3';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_4 = 'Etc/GMT-4';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_5 = 'Etc/GMT-5';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_6 = 'Etc/GMT-6';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_7 = 'Etc/GMT-7';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_8 = 'Etc/GMT-8';
                TimeZoneDefs.VALUE_ASIA_TOKYO = 'Asia/Tokyo';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_10 = 'Etc/GMT-10';
                TimeZoneDefs.VALUE_ETC_GMT_MINUS_11 = 'Etc/GMT-11';
            })(TimeZoneDefs = DeviceSetting.TimeZoneDefs || (DeviceSetting.TimeZoneDefs = {}));
            var DateFormatDefs;
            (function (DateFormatDefs) {
                DateFormatDefs.ATTR_NAME_DATE_FORMAT = 'date_format';
                DateFormatDefs.VALUE_YYYY_M_D = 'yyyy/M/d';
                DateFormatDefs.VALUE_M_D_YYYY = 'M/d/yyyy';
            })(DateFormatDefs = DeviceSetting.DateFormatDefs || (DeviceSetting.DateFormatDefs = {}));
            var TimeFormatDefs;
            (function (TimeFormatDefs) {
                TimeFormatDefs.ATTR_NAME_TIME_FORMAT = 'time_format';
                TimeFormatDefs.VALUE_12_HOUR = '12hour';
                TimeFormatDefs.VALUE_24_HOUR = '24hour';
            })(TimeFormatDefs = DeviceSetting.TimeFormatDefs || (DeviceSetting.TimeFormatDefs = {}));
            var InitializedFlagDefs;
            (function (InitializedFlagDefs) {
                InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG = 'initialized_flag';
                InitializedFlagDefs.VALUE_INITIALIZED = 'initialized';
                InitializedFlagDefs.VALUE_NONE = 'none';
            })(InitializedFlagDefs = DeviceSetting.InitializedFlagDefs || (DeviceSetting.InitializedFlagDefs = {}));
            var TimeoutToStandbyDefs;
            (function (TimeoutToStandbyDefs) {
                TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY = 'timeout_to_standby';
                TimeoutToStandbyDefs.VALUE_NEVER = 'never';
                TimeoutToStandbyDefs.VALUE_5_MINUTES = '5';
                TimeoutToStandbyDefs.VALUE_10_MINUTES = '10';
                TimeoutToStandbyDefs.VALUE_30_MINUTES = '30';
                TimeoutToStandbyDefs.VALUE_60_MINUTES = '60';
            })(TimeoutToStandbyDefs = DeviceSetting.TimeoutToStandbyDefs || (DeviceSetting.TimeoutToStandbyDefs = {}));
            var OwnerDefs;
            (function (OwnerDefs) {
                OwnerDefs.ATTR_NAME_OWNER = 'owner';
            })(OwnerDefs = DeviceSetting.OwnerDefs || (DeviceSetting.OwnerDefs = {}));
        })(DeviceSetting = Model.DeviceSetting || (Model.DeviceSetting = {}));
        var DeviceSettingDefs;
        (function (DeviceSettingDefs) {
            DeviceSettingDefs.ATTR_NAME_TIMEZONE = DeviceSetting.TimeZoneDefs.ATTR_NAME_TIMEZONE;
            DeviceSettingDefs.ATTR_NAME_DATE_FORMAT = DeviceSetting.DateFormatDefs.ATTR_NAME_DATE_FORMAT;
            DeviceSettingDefs.ATTR_NAME_TIME_FORMAT = DeviceSetting.TimeFormatDefs.ATTR_NAME_TIME_FORMAT;
            DeviceSettingDefs.ATTR_NAME_INITIALIZED_FLAG = DeviceSetting.InitializedFlagDefs.ATTR_NAME_INITIALIZED_FLAG;
            DeviceSettingDefs.ATTR_NAME_TIMEOUT_TO_STANBY = DeviceSetting.TimeoutToStandbyDefs.ATTR_NAME_TIMEOUT_TO_STANBY;
            DeviceSettingDefs.ATTR_NAME_OWNER = DeviceSetting.OwnerDefs.ATTR_NAME_OWNER;
        })(DeviceSettingDefs = Model.DeviceSettingDefs || (Model.DeviceSettingDefs = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=DeviceSettingDefs.js.map