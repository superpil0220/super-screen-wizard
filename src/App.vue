<script setup>
import EventType from '~@/constant/EventType.js';

/*
onBlur
 */
async function onBlur() {
  closePopup();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(
    tab.id,
    { type: EventType.ON_BLUR_MODE },
    (response) => {
      console.log('Message Send Response', response);
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
  <button @click="onBlur" class="func-button">화면 캡처</button>
  <button @click="onBlur" class="func-button">전체 화면 캡처</button>
</template>
