<script setup>
import Channel from '~@/constant/Channel.js';

async function onBlur() {
  await toContent(Channel.ON_BLUR);
}

async function onScreenCapture() {
  await chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
    console.log('dataUrldataUrl : ', dataUrl);
    if (dataUrl) {
      const filename = `screenshot_${Date.now()}.png`;

      // 다운로드 API 호출
      chrome.downloads.download(
        {
          url: dataUrl,
          filename: filename,
          saveAs: true // 다운로드 대화 상자 표시 여부
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('Download error:', chrome.runtime.lastError.message);
          } else {
            console.log(`Downloaded file with ID: ${downloadId}`);
          }
        }
      );
    } else {
      console.error('Failed to capture the screen.');
    }
  });
}

async function toContent(channelName) {
  closePopup();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(
    tab.id,
    { channel: channelName },
    (response) => {
      console.log('Response Message : ', response);
    }
  );
}

/*
common
 */
function closePopup() {
  window.close();
}
</script>

<template>
  <button @click="onBlur" class="func-button">영역 흐리기</button>
  <button @click="onScreenCapture" class="func-button">화면 캡처</button>
  <!--  <button @click="onFullScreenCapture" class="func-button">-->
  <!--    전체 화면 캡처-->
  <!--  </button>-->
</template>
