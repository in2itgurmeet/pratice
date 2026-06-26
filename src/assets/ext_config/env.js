(function (window) {
  window["env"] = window["env"] || {};

  // Environment variables
  // window['env']["_WEBGATEWAY_BASIC_URL_"]= "http://10.0.1.33:8766/";
  window["env"]["_WEBGATEWAY_BASIC_URL_"] = "http://172.31.252.3:30001/";
  // window["env"]["_WEBGATEWAY_BASIC_URL_"] = "http://10.111.1.43:30001/";
  //  window['env']["_WEBGATEWAY_BASIC_URL_"]= "http://10.0.1.104:8769/bff/";

  // window['env']["_BASIC_URL_"]= "http://10.0.1.104:8769/tenant",
  // (window["env"]["_BASIC_URL_"] = "http://10.0.1.33:8766/"),
  // (window["env"]["_BASIC_URL_"] = "http://10.0.1.208:8766/"),
  ((window["env"]["_BASIC_URL_"] = "http://172.31.252.3:30001/"),
    (window["env"]["DEVICE_STREAMING_URL_"] = "ws://172.31.252.162:30001/"),
    (window["env"]["IDASHBOARD_BASIC_URL_"] = "http://172.31.252.3:30104/"),
    (window["env"]["IDASHBOARD_API_BASIC_URL_"] = "http://172.31.252.3:30103/"),
    (window["env"]["WORKSTATION_BASIC_URL_"] = "http://172.31.252.143:30061/"),
    (window["env"]["INSIGHTS_BASIC_URL_"] = "http://172.31.252.143:30093/"),
    (window["env"]["TELEMETRY_BASIC_URL_"] = "http://172.31.252.143:30179/"),
    (window["env"]["TRAFFIC_ENGINEERING_BASIC_URL_"] = "http://172.31.252.143:30109/"),
    (window["env"]["_WEBGATEWAY_TOPOLOGY_BASIC_URL_"] = "http://172.31.252.143:30169/"),
    // (window["env"]["_BASIC_URL_"] = "http://10.111.1.43:30001/"),
    // window['env']["_BASIC_URL_"]= "http://172.16.10.115:49205/",
    (window["env"]["_AUTH_GATEWAY_URL"] = "http://localhost:4200/#/auth/login"),
    (window["env"]["_AUTH_PRODUCT_SERVICES_URL"] = "http://172.27.63.29:4200/logingateway/#/services/products"),
    (window["env"]["gateWayAuthorization"] = false));
})(this);
