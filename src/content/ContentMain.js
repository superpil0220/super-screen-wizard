import "~@/content/assets/ContentStyle.css";
import EventType from "~@/constant/EventType.js";
import {bluerService} from "~@/content/service/BluerService.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === EventType.ON_BLUR_MODE) {
    bluerService.createBluer();
    sendResponse({message: "Create Bluer"});
  } else {
    sendResponse({message: "Types that cannot be processed"});
  }
});