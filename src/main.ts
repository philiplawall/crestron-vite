console.log("0");
// import * as CrComLib from "@crestron/ch5-crcomlib";
import * as CrComLib from "ch5-crcomlib-lite";
console.log("1");
import * as WebXPanel from "@crestron/ch5-webxpanel";
console.log("2");
import { createApp } from "vue";
console.log("3");
import { createPinia } from "pinia";
console.log("4");
import { CrestronPiniaPlugin } from "./stores/plugins/crestron";
console.log("5");

declare global {
  interface Window {
    CrComLib: any;
    bridgeReceiveIntegerFromNative: any;
    bridgeReceiveBooleanFromNative: any;
    bridgeReceiveStringFromNative: any;
    bridgeReceiveObjectFromNative: any;
  }
}

window.CrComLib = CrComLib;
console.log("6");
window.bridgeReceiveIntegerFromNative = CrComLib.bridgeReceiveIntegerFromNative;
console.log("7");
window.bridgeReceiveBooleanFromNative = CrComLib.bridgeReceiveBooleanFromNative;
console.log("8");
window.bridgeReceiveStringFromNative = CrComLib.bridgeReceiveStringFromNative;
console.log("9");
window.bridgeReceiveObjectFromNative = CrComLib.bridgeReceiveObjectFromNative;
console.log("10");

import App from "./App.vue";
console.log("11");

import "./assets/main.css";
console.log("12");
// import eruda from "eruda";
// eruda.init();

const configuration = {
  host: "192.168.1.16",
  ipId: "4",
  roomId: "test",
};

if (!CrComLib.isCrestronTouchscreen()) {
  console.log(`WebXPanel version: ${WebXPanel.getVersion()}`);
  console.log(`WebXPanel build date: ${WebXPanel.getBuildDate()}`);
  console.log(configuration);

  WebXPanel.default.addEventListener(
    WebXPanel.WebXPanelEvents.CONNECT_WS,
    ({}) => {
      console.log(`Connected to Websocket`);
    }
  );

  WebXPanel.default.addEventListener(
    WebXPanel.WebXPanelEvents.DISCONNECT_WS,
    ({}) => {
      console.log(`Disconnected from Websocket`);
    }
  );

  WebXPanel.default.addEventListener(
    WebXPanel.WebXPanelEvents.ERROR_WS,
    ({ detail }) => {
      console.log(`Error on websocket, detail: ${detail}`);
    }
  );

  WebXPanel.default.addEventListener(
    WebXPanel.WebXPanelEvents.CONNECT_CIP,
    ({ detail }) => {
      const { url, ipId, roomId } = detail;
      console.log(`Connected to ${url}, 0x${ipId.toString(16)}, ${roomId}`);
    }
  );

  WebXPanel.default.addEventListener(
    WebXPanel.WebXPanelEvents.DISCONNECT_CIP,
    ({ detail }) => {
      const { reason } = detail;
      console.log(`Disconnected from CIP. Reason: ${reason}`);
    }
  );

  WebXPanel.default.addEventListener(
    WebXPanel.WebXPanelEvents.LICENSE_WS,
    ({ detail }) => {
      updateDialogLicenseInfo(detail);
    }
  );

  function updateDialogLicenseInfo(detail: any) {
    const controlSystemSupportsLicense = detail.controlSystemSupportsLicense; // boolean
    const licenseApplied = detail.licenseApplied; // optional boolean
    const licenseDaysRemaining = detail.licenseDaysRemaining; // optional number
    const licenseHasExpiry = detail.licenseHasExpiry; // optional boolean
    const trialPeriod = detail.trialPeriod; // optional boolean
    const trialPeriodDaysRemaining = detail.trialPeriodDaysRemaining; // optional number
    const resourceAvailable = detail.resourceAvailable; // boolean

    if (!controlSystemSupportsLicense) {
      console.log("Control system does not support Mobility license");
    } else if (!resourceAvailable) {
      console.log("Mobility license is required (expired or never applied)");
    } else if (licenseApplied) {
      if (!licenseHasExpiry) {
        console.log("Mobility license is valid");
      } else {
        // Display warning
        console.log(
          `Mobility license expires in ${licenseDaysRemaining} day(s)`
        );
      }
    } else if (trialPeriod) {
      console.log(
        ` Trial period expires in ${trialPeriodDaysRemaining} day(s)`
      );
    }
  }

  if (WebXPanel.isActive) {
    WebXPanel.default.initialize(configuration);
  }
}

console.log(
  `CrComLib.IsCrestronTouchscreen(): ${CrComLib.isCrestronTouchscreen()}`
);

// CrComLib.subscribeState("b", "33", (value) => {
//   console.log(`toggle(33) selected(${value})`);
// });

const pinia = createPinia();
pinia.use(CrestronPiniaPlugin);

const app = createApp(App);

app.use(pinia);
app.mount("#app");
