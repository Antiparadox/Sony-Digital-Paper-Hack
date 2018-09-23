var DPMW;
(function (DPMW) {
    var Model;
    (function (Model) {
        var WiFiSettingDefs;
        (function (WiFiSettingDefs) {
            WiFiSettingDefs.PARSE_NAME_VALUE = "value";
            WiFiSettingDefs.ATTR_NAME_WIFI_CONFIG = "wifi_config";
            WiFiSettingDefs.VALUE_WIFI_CONFIG_ON = 'on';
            WiFiSettingDefs.VALUE_WIFI_CONFIG_OFF = 'off';
            WiFiSettingDefs.DEFAULT_FETCH_INTERVAL_TIME = 10000;
        })(WiFiSettingDefs = Model.WiFiSettingDefs || (Model.WiFiSettingDefs = {}));
        var WiFiAPConfigDefs;
        (function (WiFiAPConfigDefs) {
            WiFiAPConfigDefs.PARSE_NAME_APLIST = "aplist";
            WiFiAPConfigDefs.ATTR_NAME_SSID = "ssid";
            WiFiAPConfigDefs.ATTR_NAME_SECURITY = "security";
            WiFiAPConfigDefs.ATTR_NAME_PASSWD = "passwd";
            WiFiAPConfigDefs.ATTR_NAME_DHCP = "dhcp";
            WiFiAPConfigDefs.ATTR_NAME_STATIC_ADDRESS = "static_address";
            WiFiAPConfigDefs.ATTR_NAME_GATEWAY = "gateway";
            WiFiAPConfigDefs.ATTR_NAME_NETWORK_MASK = "network_mask";
            WiFiAPConfigDefs.ATTR_NAME_DNS_1 = "dns1";
            WiFiAPConfigDefs.ATTR_NAME_DNS_2 = "dns2";
            WiFiAPConfigDefs.ATTR_NAME_PROXY = "proxy";
            WiFiAPConfigDefs.ATTR_NAME_PROXY_HOST = "proxy_host";
            WiFiAPConfigDefs.ATTR_NAME_PROXY_PORT = "proxy_port";
            WiFiAPConfigDefs.ATTR_NAME_EAP = "eap";
            WiFiAPConfigDefs.ATTR_NAME_EAP_PHASE2 = "eap_phase2";
            WiFiAPConfigDefs.ATTR_NAME_EAP_ID = "eap_id";
            WiFiAPConfigDefs.ATTR_NAME_EAP_ANID = "eap_anid";
            WiFiAPConfigDefs.ATTR_NAME_EAP_CACERT = "eap_cacert";
            WiFiAPConfigDefs.ATTR_NAME_EAP_CERT = "eap_cert";
            WiFiAPConfigDefs.VALUE_SECURITY_NONSEC = 'nonsec';
            WiFiAPConfigDefs.VALUE_SECURITY_PSK = 'psk';
            WiFiAPConfigDefs.VALUE_SECURITY_EAP = 'eap';
            WiFiAPConfigDefs.VALUE_EAP_PEAP = 'peap';
            WiFiAPConfigDefs.VALUE_EAP_TLS = 'tls';
            WiFiAPConfigDefs.VALUE_EAP_PHASE2_NONE = 'none';
            WiFiAPConfigDefs.VALUE_EAP_PHASE2_GTC = 'gtc';
            WiFiAPConfigDefs.VALUE_EAP_PHASE2_PAP = 'pap';
            WiFiAPConfigDefs.VALUE_EAP_PHASE2_MSCHAP = 'mschap';
            WiFiAPConfigDefs.VALUE_EAP_PHASE2_MSCHAPV2 = 'mschapv2';
        })(WiFiAPConfigDefs = Model.WiFiAPConfigDefs || (Model.WiFiAPConfigDefs = {}));
        var WiFiAPStatusDefs;
        (function (WiFiAPStatusDefs) {
            WiFiAPStatusDefs.PARSE_NAME_APLIST = "aplist";
            WiFiAPStatusDefs.ATTR_NAME_SSID = "ssid";
            WiFiAPStatusDefs.ATTR_NAME_SECURITY = "security";
            WiFiAPStatusDefs.ATTR_NAME_STATE = "state";
            WiFiAPStatusDefs.ATTR_NAME_FREQUENCY_BAND = "frequency_band";
            WiFiAPStatusDefs.ATTR_NAME_RSSI_LEVEL = "rssi_level";
            WiFiAPStatusDefs.VALUE_SECURITY_NONSEC = 'nonsec';
            WiFiAPStatusDefs.VALUE_SECURITY_PSK = 'psk';
            WiFiAPStatusDefs.VALUE_SECURITY_EAP = 'eap';
            WiFiAPStatusDefs.VALUE_STATE_NONE = 'none';
            WiFiAPStatusDefs.VALUE_STATE_CONNECTING = 'connecting';
            WiFiAPStatusDefs.VALUE_STATE_CONNECTED = 'connected';
            WiFiAPStatusDefs.VALUE_STATE_SAVED = 'saved';
            WiFiAPStatusDefs.VALUE_STATE_DISAVLED = 'disabled';
            WiFiAPStatusDefs.VALUE_EAP_FREQUENCY_BAND_2_4_GHZ = '2.4ghz';
            WiFiAPStatusDefs.VALUE_EAP_FREQUENCY_BAND_5_GHZ = '5ghz';
        })(WiFiAPStatusDefs = Model.WiFiAPStatusDefs || (Model.WiFiAPStatusDefs = {}));
        var WiFiCertCADefs;
        (function (WiFiCertCADefs) {
            WiFiCertCADefs.PARSE_NAME_CERT = "cert";
            WiFiCertCADefs.ATTR_NAME_NAME = "name";
            WiFiCertCADefs.UPLOAD_VALUE_NAME_FILE = "file";
            WiFiCertCADefs.UPLOAD_VALUE_NAME_FILENAME = "filename";
            WiFiCertCADefs.UPLOAD_VALUE_NAME_NAME = "name";
        })(WiFiCertCADefs = Model.WiFiCertCADefs || (Model.WiFiCertCADefs = {}));
        var WiFiCertClientDefs;
        (function (WiFiCertClientDefs) {
            WiFiCertClientDefs.PARSE_NAME_CERT = "cert";
            WiFiCertClientDefs.ATTR_NAME_NAME = "name";
            WiFiCertClientDefs.UPLOAD_VALUE_NAME_FILE = "file";
            WiFiCertClientDefs.UPLOAD_VALUE_NAME_FILENAME = "filename";
            WiFiCertClientDefs.UPLOAD_VALUE_NAME_NAME = "name";
            WiFiCertClientDefs.UPLOAD_VALUE_NAME_PASSWORD = "password";
        })(WiFiCertClientDefs = Model.WiFiCertClientDefs || (Model.WiFiCertClientDefs = {}));
        var WiFiWpsStartPinDefs;
        (function (WiFiWpsStartPinDefs) {
            WiFiWpsStartPinDefs.ATTR_NAME_VALUE = "value";
        })(WiFiWpsStartPinDefs = Model.WiFiWpsStartPinDefs || (Model.WiFiWpsStartPinDefs = {}));
        var WiFiAPWpsDefs;
        (function (WiFiAPWpsDefs) {
            WiFiAPWpsDefs.PARSE_NAME_VALUE = "value";
            WiFiAPWpsDefs.ATTR_NAME_STATE = "state";
            WiFiAPWpsDefs.STATE_VALUE_NONE = "none";
            WiFiAPWpsDefs.STATE_VALUE_IN_PROGRESS = "in_progress";
            WiFiAPWpsDefs.STATE_VALUE_SUCCESS = "success";
            WiFiAPWpsDefs.STATE_VALUE_OVERLAP_ERROR = "overlap_error";
            WiFiAPWpsDefs.STATE_VALUE_WEP_PROHIBITED = "wep_prohibited";
            WiFiAPWpsDefs.STATE_VALUE_TKIP_ONLY_PROHIBITED = "tkip_only_prohibited";
            WiFiAPWpsDefs.STATE_VALUE_TIMED_OUT = "timed_out";
        })(WiFiAPWpsDefs = Model.WiFiAPWpsDefs || (Model.WiFiAPWpsDefs = {}));
    })(Model = DPMW.Model || (DPMW.Model = {}));
})(DPMW || (DPMW = {}));
//# sourceMappingURL=WiFiSettingDefs.js.map