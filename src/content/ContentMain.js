import '~@/content/assets/ContentStyle.css';
import channel from '~@/constant/Channel.js';
import { blurService } from '~@/content/service/BlurService.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.channel === channel.ON_BLUR) {
    blurService.createSingleBluerBox();
    sendResponse({ message: 'On Blur' });
  } else {
    sendResponse({ message: 'Types that cannot be processed' });
  }
});
