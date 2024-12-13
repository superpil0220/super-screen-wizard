// let startX, startY, endX, endY;
// let selectionBox = null;
//
// // todo: 마우스 드래그 해서 선택 영역 가져오는 코드 따로 빼기
//
// document.addEventListener('mousedown', (e) => {
//   startX = e.pageX;
//   startY = e.pageY;
//
//   selectionBox = document.createElement('div');
//   selectionBox.style.position = 'absolute';
//   selectionBox.style.border = '2px dashed #000';
//   selectionBox.style.zIndex = '100000';
//   selectionBox.style.background = 'rgba(0, 0, 0, 0.2)';
//   selectionBox.style.left = `${startX}px`;
//   selectionBox.style.top = `${startY}px`;
//   document.body.appendChild(selectionBox);
// });
//
// document.addEventListener('mousemove', (e) => {
//   if (!selectionBox) {
//     return;
//   }
//
//   endX = e.pageX;
//   endY = e.pageY;
//
//   selectionBox.style.width = `${Math.abs(endX - startX)}px`;
//   selectionBox.style.height = `${Math.abs(endY - startY)}px`;
//   selectionBox.style.left = `${Math.min(startX, endX)}px`;
//   selectionBox.style.top = `${Math.min(startY, endY)}px`;
// });
//
// document.addEventListener('mouseup', () => {
//   if (!selectionBox) {
//     return;
//   }
//
//   const rect = selectionBox.getBoundingClientRect();
//
//   // 블러 적용
//   const blurDiv = document.createElement('div');
//   blurDiv.style.position = 'absolute';
//   blurDiv.style.left = `${rect.left}px`;
//   blurDiv.style.top = `${rect.top}px`;
//   blurDiv.style.width = `${rect.width}px`;
//   blurDiv.style.height = `${rect.height}px`;
//   blurDiv.style.backdropFilter = 'blur(10px)';
//   blurDiv.style.pointerEvents = 'none';
//   blurDiv.style.zIndex = '100000';
//   document.body.appendChild(blurDiv);
//
//   // 기존 박스 제거
//   selectionBox.remove();
//   selectionBox = null;
// });

let selectionBox = null;
let isDragging = false;
let isResizing = false;
let startX, startY, startWidth, startHeight;
let resizeHandle = null;

// 마우스 다운 이벤트 (박스 생성 또는 드래그 시작)
document.addEventListener('mousedown', (e) => {
  const target = e.target;

  // 박스를 새로 생성
  if (!selectionBox) {
    startX = e.pageX;
    startY = e.pageY;

    selectionBox = document.createElement('div');
    selectionBox.style.position = 'absolute';
    selectionBox.style.border = '2px dashed #000';
    selectionBox.style.background = 'rgba(0, 0, 0, 0.2)';
    selectionBox.style.backdropFilter = 'blur(10px)';
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.zIndex = '9999';

    // 크기 조절 핸들 추가
    resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.background = '#fff';
    resizeHandle.style.border = '1px solid #000';
    resizeHandle.style.right = '-5px';
    resizeHandle.style.bottom = '-5px';
    resizeHandle.style.cursor = 'nwse-resize';
    selectionBox.appendChild(resizeHandle);

    document.body.appendChild(selectionBox);
    isResizing = false;
    isDragging = false;
  }

  // 크기 조절 시작
  if (target === resizeHandle) {
    isResizing = true;
    startWidth = selectionBox.offsetWidth;
    startHeight = selectionBox.offsetHeight;
    startX = e.pageX;
    startY = e.pageY;
  }

  // 박스 드래그 시작
  else if (target === selectionBox) {
    isDragging = true;
    startX = e.pageX;
    startY = e.pageY;
    startWidth = parseInt(selectionBox.style.left, 10);
    startHeight = parseInt(selectionBox.style.top, 10);
  }
});

// 마우스 이동 이벤트 (박스 드래그 또는 크기 조절)
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.pageX - startX;
    const deltaY = e.pageY - startY;

    selectionBox.style.left = `${startWidth + deltaX}px`;
    selectionBox.style.top = `${startHeight + deltaY}px`;
  }

  if (isResizing) {
    const deltaX = e.pageX - startX;
    const deltaY = e.pageY - startY;

    selectionBox.style.width = `${startWidth + deltaX}px`;
    selectionBox.style.height = `${startHeight + deltaY}px`;
  }
});

// 마우스 업 이벤트 (드래그 또는 크기 조절 종료)
document.addEventListener('mouseup', () => {
  isDragging = false;
  isResizing = false;
});

// 박스가 드래그와 클릭을 방해하지 않도록 설정
selectionBox && (selectionBox.style.pointerEvents = 'auto');
