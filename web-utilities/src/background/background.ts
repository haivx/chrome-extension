import { setStoredCities, setStoredOptions } from "../utils/storage";

console.log("background js running");

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([]);
  setStoredOptions({
    homeCity: "Ha noi",
    tempScale: "metric",
    hasAuthoOverlay: false,
  });
  // await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
