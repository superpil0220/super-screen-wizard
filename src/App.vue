<script setup>
async function onClick() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  await chrome.tabs.sendMessage(
      tab.id,
      {
        type: "superpil",
        payload: {
          message: "say superpil!"
        }
      },
      (response) => {
        console.log("Message Send Response", response);
      }
  );
}
</script>

<template>
  <button @click="onClick">SUPERPIL</button>
</template>