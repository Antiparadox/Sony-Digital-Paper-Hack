var DPMW;
(function (DPMW) {
    var Utils;
    (function (Utils) {
        var LocalStorageItemName;
        (function (LocalStorageItemName) {
            LocalStorageItemName.BT_AUTO_CONNECT = 'btAutoConnect';
            LocalStorageItemName.DEVICE_ID = 'deviceId';
            LocalStorageItemName.AUTO_SYNC = 'autoSync';
            LocalStorageItemName.AUTO_SYNC_INTERVAL = 'autoSyncInterval';
            LocalStorageItemName.LAST_SYNC_EXECUTED_DATE = 'lastSyncExecutedDate';
        })(LocalStorageItemName = Utils.LocalStorageItemName || (Utils.LocalStorageItemName = {}));
        var LocalStorageItemValue;
        (function (LocalStorageItemValue) {
            LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_ON = 'ON';
            LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_OFF = 'OFF';
            LocalStorageItemValue.VALUE_AUTO_SYNC_ON = 'ON';
            LocalStorageItemValue.VALUE_AUTO_SYNC_OFF = 'OFF';
            LocalStorageItemValue.DEFAULT_VALUE_AUTO_SYNC_INTERVAL = 60;
        })(LocalStorageItemValue = Utils.LocalStorageItemValue || (Utils.LocalStorageItemValue = {}));
        function getBluetoothAutoConnectSetting() {
            var bluetoothAutoConnect = localStorage.getItem(LocalStorageItemName.BT_AUTO_CONNECT);
            if (bluetoothAutoConnect === LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_OFF) {
                return LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_OFF;
            }
            else {
                return LocalStorageItemValue.VALUE_BT_AUTO_CONNECT_ON;
            }
        }
        Utils.getBluetoothAutoConnectSetting = getBluetoothAutoConnectSetting;
        function setBluetoothAutoConnectSetting(btAutoConnect) {
            localStorage.setItem(LocalStorageItemName.BT_AUTO_CONNECT, btAutoConnect);
        }
        Utils.setBluetoothAutoConnectSetting = setBluetoothAutoConnectSetting;
        function getAutoSyncSetting() {
            var autoSyncSetting = localStorage.getItem(LocalStorageItemName.AUTO_SYNC);
            if (autoSyncSetting === LocalStorageItemValue.VALUE_AUTO_SYNC_OFF) {
                return LocalStorageItemValue.VALUE_AUTO_SYNC_OFF;
            }
            else {
                return LocalStorageItemValue.VALUE_AUTO_SYNC_ON;
            }
        }
        Utils.getAutoSyncSetting = getAutoSyncSetting;
        function setAutoSyncSetting(autoSync) {
            localStorage.setItem(LocalStorageItemName.AUTO_SYNC, autoSync);
        }
        Utils.setAutoSyncSetting = setAutoSyncSetting;
        function getAutoSyncInterval() {
            var autoSyncInterval = localStorage.getItem(LocalStorageItemName.AUTO_SYNC_INTERVAL);
            if (autoSyncInterval === null) {
                console.log('DEFAULT_VALUE_AUTO_SYNC_INTERVAL returned');
                return LocalStorageItemValue.DEFAULT_VALUE_AUTO_SYNC_INTERVAL;
            }
            else {
                var interval = parseInt(autoSyncInterval, 10);
                if (isNaN(interval)) {
                    throw "AutoSyncInterval must be a number!";
                }
                return interval;
            }
        }
        Utils.getAutoSyncInterval = getAutoSyncInterval;
        function setAutoSyncInterval(interval) {
            if (isNaN(interval) || interval === null || interval === undefined) {
                throw "AutoSyncInterval must be a number!";
            }
            localStorage.setItem(LocalStorageItemName.AUTO_SYNC_INTERVAL, interval.toString());
        }
        Utils.setAutoSyncInterval = setAutoSyncInterval;
    })(Utils = DPMW.Utils || (DPMW.Utils = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=LocalStorageUtils.js.map