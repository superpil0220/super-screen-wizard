document
.getElementById('activate')
.addEventListener('click', async () => {
  // 현재 활성 탭 정보 가져오기
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  if (!tab || !tab.id) {
    alert("크롬 탭을 찾을 수 없습니다.")
    return;
  }

  // 컨텐츠 스크립트 실행
  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['content.js'],
  });
});

// document
// .getElementById('capture')
// .addEventListener('click', async () => {
//   try {
//     const image = await chrome.tabs.captureVisibleTab(null, {format: 'png'});
//
//     // Blob으로 변환
//     const blob = await (await fetch(image)).blob();
//
//     // 파일 다운로드
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'blurred_screenshot.png';
//     link.click();
//   } catch (error) {
//     console.error('Error capturing screen:', error);
//   }
// });
