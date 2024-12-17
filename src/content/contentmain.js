import demo1 from "~@/script/bluer/demo1.js";
import "~@/assets/contentstyle.css";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request:", request);
  if (request.type === 'superpil') {
    console.log("받음: ", request.payload);
    sendResponse({message: 'hello from content'});
  } else {
    console.log("다른 요청: ", request.payload);
  }
  demo1();
  return true; // 비동기 응답 처리를 위해 true 반환
});

/*
css는 파일 이름 변경
 */