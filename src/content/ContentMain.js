// import "~@/content/assets/ContentStyle.css";
// import EventType from "~@/constant/EventType.js";
//
// let isBlurModeActive = false;
// let startX, startY, blurBox;
// let blurBoxes = [];
// let offsetX = 0; // 마우스와 요소 간의 X축 거리
// let offsetY = 0; // 마우스와 요소 간의 Y축 거리
//
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === EventType.ON_BLUR_MODE) {
//     sendResponse({message: 'hello from content'});
//     console.log("blurBoxes  ::: ", blurBoxes);
//     // demo1(); todo: 정리하기
//     isBlurModeActive = true;
//     document.body.classList.add('blur-mode-cursor');
//     /*
//     mousedown 이벤트로 시작 지점 기록.
//     mousemove 이벤트로 현재 위치를 계산해 사각형 크기 설정.
//     mouseup 이벤트로 블러 처리 완료.
//      */
//     document.addEventListener("mousedown", startDrawing);
//     document.addEventListener("mousemove", drawBox);
//     document.addEventListener("mouseup", stopDrawing);
//
//   } else {
//     console.log("다른 요청: ", request.payload);
//   }
//   return true; // 비동기 응답 처리를 위해 true 반환
// });
//
// function startDrawing(event) {
//   if (!isBlurModeActive) {
//     return;
//   }
//   startX = event.pageX;
//   startY = event.pageY;
//
//   blurBox = document.createElement("div");
//   blurBox.style.position = "absolute";
//   blurBox.style.border = "1px solid #000";
//   blurBox.style.background = "rgba(255, 255, 255, 0.5)";
//   blurBox.style.backdropFilter = "blur(5px)";
//   blurBox.style.zIndex = "10000";
//   blurBox.style.left = `${startX}px`;
//   blurBox.style.top = `${startY}px`;
//
//   document.body.appendChild(blurBox);
// }
//
// function drawBox(event) {
//   if (!isBlurModeActive || !blurBox) {
//     return;
//   }
//
//   const width = event.pageX - startX;
//   const height = event.pageY - startY;
//
//   blurBox.style.width = `${Math.abs(width)}px`;
//   blurBox.style.height = `${Math.abs(height)}px`;
//
//   if (width < 0) {
//     blurBox.style.left = `${event.pageX}px`;
//   }
//   if (height < 0) {
//     blurBox.style.top = `${event.pageY}px`;
//   }
// }
//
// function stopDrawing(event) {
//   if (!isBlurModeActive) {
//     return;
//   }
//
//   blurBoxes.push(blurBox);
//   document.body.style.cursor = "default";
//   isBlurModeActive = false;
//
//   document.body.classList.remove('blur-mode-cursor');
//   document.removeEventListener("mousemove", drawBox);
// }

import "~@/content/assets/ContentStyle.css";
import EventType from "~@/constant/EventType.js";
import {bluerService} from "~@/content/service/BluerService.js";

let isBlurModeActive = false;
let startX, startY, blurBox;
let blurBoxes = [];
let offsetX = 0; // 마우스와 요소 간의 X축 거리
let offsetY = 0; // 마우스와 요소 간의 Y축 거리
let isDragging = false; // 드래그 상태
const aboxSuperpil = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === EventType.ON_BLUR_MODE) {
    console.log("3");
    console.log("2");
    console.log("1");

    sendResponse({message: "hello from content"});
    console.log("blurBoxes  ::: ", blurBoxes);

    aboxSuperpil.push(1818)

    console.log("blurBoxes  ::: ", aboxSuperpil);

    bluerService.createBluer();
    console.log("blurBoxes  ::: ", aboxSuperpil);

    console.log(1);

    isBlurModeActive = true;
    document.body.classList.add("blur-mode-cursor");

    // 마우스 이벤트 추가
    document.addEventListener("mousedown", startDrawing);
    document.addEventListener("mousemove", drawBox);
    document.addEventListener("mouseup", stopDrawing);
  } else {
    sendResponse({message: "Types that cannot be processed"});
  }
});

function startDrawing(event) {
  if (!isBlurModeActive) {
    // 블러 상자 드래그 감지
    const targetBox = event.target;
    if (targetBox.classList && targetBox.classList.contains("blur-box")) {
      isDragging = true;
      blurBox = targetBox;

      // 클릭 위치와 요소의 현재 위치의 차이 기록
      offsetX = event.clientX - blurBox.getBoundingClientRect().left;
      offsetY = event.clientY - blurBox.getBoundingClientRect().top;
    }
    return;
  }

  // 새 블러 박스 생성
  startX = event.pageX;
  startY = event.pageY;

  blurBox = document.createElement("div");
  blurBox.classList.add("blur-box");
  blurBox.style.position = "absolute";
  blurBox.style.border = "1px solid #000";
  blurBox.style.background = "rgba(255, 255, 255, 0.5)";
  blurBox.style.backdropFilter = "blur(5px)";
  blurBox.style.zIndex = "10000";
  blurBox.style.left = `${startX}px`;
  blurBox.style.top = `${startY}px`;

  document.body.appendChild(blurBox);
}

function drawBox(event) {
  if (isDragging && blurBox) {
    // 드래그 중: 요소 위치 업데이트
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    blurBox.style.left = `${x}px`;
    blurBox.style.top = `${y}px`;
    return;
  }

  // 블러 박스 그리기
  if (!isBlurModeActive || !blurBox) {
    return;
  }

  const width = event.pageX - startX;
  const height = event.pageY - startY;

  blurBox.style.width = `${Math.abs(width)}px`;
  blurBox.style.height = `${Math.abs(height)}px`;

  if (width < 0) {
    blurBox.style.left = `${event.pageX}px`;
  }
  if (height < 0) {
    blurBox.style.top = `${event.pageY}px`;
  }
}

function stopDrawing(event) {
  if (isDragging) {
    isDragging = false; // 드래그 상태 종료
    return;
  }

  if (!isBlurModeActive) {
    return;
  }

  blurBoxes.push(blurBox);
  isBlurModeActive = false;

  document.body.classList.remove("blur-mode-cursor");
}
