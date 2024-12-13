let startX, startY, endX, endY;
let selectionBox = null;

// todo: 마우스 드래그 해서 선택 영역 가져오는 코드 따로 빼기

document.addEventListener('mousedown', (e) => {
  startX = e.pageX;
  startY = e.pageY;

  selectionBox = document.createElement('div');
  selectionBox.style.position = 'absolute';
  selectionBox.style.border = '2px dashed #000';
  selectionBox.style.zIndex = '100000';
  selectionBox.style.background = 'rgba(0, 0, 0, 0.2)';
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  document.body.appendChild(selectionBox);
});

document.addEventListener('mousemove', (e) => {
  if (!selectionBox) {
    return;
  }

  endX = e.pageX;
  endY = e.pageY;

  selectionBox.style.width = `${Math.abs(endX - startX)}px`;
  selectionBox.style.height = `${Math.abs(endY - startY)}px`;
  selectionBox.style.left = `${Math.min(startX, endX)}px`;
  selectionBox.style.top = `${Math.min(startY, endY)}px`;
});

document.addEventListener('mouseup', () => {
  if (!selectionBox) {
    return;
  }

  const rect = selectionBox.getBoundingClientRect();

  // 블러 적용
  const blurDiv = document.createElement('div');
  blurDiv.style.position = 'absolute';
  blurDiv.style.left = `${rect.left}px`;
  blurDiv.style.top = `${rect.top}px`;
  blurDiv.style.width = `${rect.width}px`;
  blurDiv.style.height = `${rect.height}px`;
  blurDiv.style.backdropFilter = 'blur(10px)';
  blurDiv.style.pointerEvents = 'none';
  blurDiv.style.zIndex = '100000';
  document.body.appendChild(blurDiv);

  // 기존 박스 제거
  selectionBox.remove();
  selectionBox = null;

  // superScreenWizard
});