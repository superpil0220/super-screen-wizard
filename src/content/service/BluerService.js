let isBlurModeActive = false; // 블러 모드 활성화 여부
let startX, startY, blurBox;
let blurBoxes = [];
let isDragging = false; // 드래그 상태
let isResizing = false; // 크기 조절 상태
let currentHandle = null; // 현재 드래그 중인 핸들

// 사각형 생성 핸들 추가
function addResizeHandles(element) {
  const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];
  positions.forEach((position) => {
    const handle = document.createElement("div");
    handle.classList.add("resize-handle", position);
    element.appendChild(handle);

    // 핸들 위치 설정
    if (position.includes("top")) {
      handle.style.top = "-5px";
    }
    if (position.includes("bottom")) {
      handle.style.bottom = "-5px";
    }
    if (position.includes("left")) {
      handle.style.left = "-5px";
    }
    if (position.includes("right")) {
      handle.style.right = "-5px";
    }

    // 핸들 이벤트 추가
    handle.addEventListener("mousedown", (event) => {
      isResizing = true;
      currentHandle = position;
      resizeBox(event);
      event.stopPropagation(); // 부모 요소의 드래그 이벤트 방지
    });
  });
}

// 크기 조절 동작
function resizeBox(event) {
  // if (!isResizing || !blurBox) {
  //   return;
  // }

  const rect = blurBox.getBoundingClientRect();
  const parentRect = blurBox.parentElement.getBoundingClientRect();

  if (currentHandle === "top-left") {
    const newWidth = rect.right - event.clientX;
    const newHeight = rect.bottom - event.clientY;
    blurBox.style.width = `${newWidth}px`;
    blurBox.style.height = `${newHeight}px`;
    blurBox.style.left = `${event.clientX - parentRect.left}px`;
    blurBox.style.top = `${event.clientY - parentRect.top}px`;
  } else if (currentHandle === "top-right") {
    const newWidth = event.clientX - rect.left;
    const newHeight = rect.bottom - event.clientY;
    blurBox.style.width = `${newWidth}px`;
    blurBox.style.height = `${newHeight}px`;
    blurBox.style.top = `${event.clientY - parentRect.top}px`;
  } else if (currentHandle === "bottom-left") {
    const newWidth = rect.right - event.clientX;
    const newHeight = event.clientY - rect.top;
    blurBox.style.width = `${newWidth}px`;
    blurBox.style.height = `${newHeight}px`;
    blurBox.style.left = `${event.clientX - parentRect.left}px`;
  } else if (currentHandle === "bottom-right") {
    const newWidth = event.clientX - rect.left;
    const newHeight = event.clientY - rect.top;
    blurBox.style.width = `${newWidth}px`;
    blurBox.style.height = `${newHeight}px`;
  }
}

// 블러 박스 생성
function startDrawing(event) {
  if (!isBlurModeActive) {
    return;
  }

  // 드래그 시작 좌표 설정
  // isDragging = true;
  startX = event.pageX;
  startY = event.pageY;

  // 블러 박스 생성
  blurBox = document.createElement("div");
  blurBox.classList.add("blur-box");
  document.body.classList.add("blur-mode-cursor")

  blurBox.style.position = "absolute";
  blurBox.style.left = `${startX}px`;
  blurBox.style.top = `${startY}px`;
  blurBox.style.width = "0px";
  blurBox.style.height = "0px";
  blurBox.style.border = "1px solid #000";
  blurBox.style.background = "rgba(255, 255, 255, 0.5)";
  blurBox.style.backdropFilter = "blur(5px)";
  blurBox.style.zIndex = "10000";

  document.body.appendChild(blurBox);
}

function drawBox(event) {
  // if (isDragging && blurBox) {
  if (isBlurModeActive) {
    const currentX = event.pageX;
    const currentY = event.pageY;

    const width = currentX - startX;
    const height = currentY - startY;

    if (width >= 0) {
      blurBox.style.width = `${width}px`;
    } else {
      blurBox.style.width = `${-width}px`;
      blurBox.style.left = `${currentX}px`;
    }

    if (height >= 0) {
      blurBox.style.height = `${height}px`;
    } else {
      blurBox.style.height = `${-height}px`;
      blurBox.style.top = `${currentY}px`;
    }

  }
}

function stopDrawing(event) {
  isBlurModeActive = false
  if (!isBlurModeActive) {
    // isDragging = false;
    // if (blurBox) {
    addResizeHandles(blurBox); // 크기 조절 핸들 추가
    blurBoxes.push(blurBox); // 박스 저장
    blurBox = null;
    // }
  }

  isResizing = false;
  currentHandle = null;
}

export const bluerService = {
  createBluer: () => {
    isBlurModeActive = true;
    document.addEventListener("mousedown", startDrawing);
    document.addEventListener("mouseup", stopDrawing);
    document.addEventListener("mousemove", drawBox);
  },
};
