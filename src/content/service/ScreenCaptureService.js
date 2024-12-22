function dataURLToBlob(dataUrl) {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

export const screenCaptureService = {
  onScreenCapture: () => {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
      if (dataUrl) {
        // 이미지를 다운로드할 수 있도록 URL 생성
        const blob = dataURLToBlob(dataUrl);
        const url = URL.createObjectURL(blob);

        const now = new Date();
        // 이미지 다운로드
        chrome.downloads.download({
          url: url,
          filename: `screenshot_${now}.png`
        });
      }
    });
  },
  onFullScreenCapture: () => {}
};
