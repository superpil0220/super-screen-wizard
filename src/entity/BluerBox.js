import common from '~@/util/Common.js';

/*
[V] 드래그 시 배경 넣기
[V] 위치이동
[] 옵션 커스텀(블러정도, 블러 색상, 크기조절)
[] 사이즈 조절 이상한거 잡기
[] 꾸미기
 */
export default class BluerBox {
  #box;
  #boxStartX;
  #boxStartY;
  #isCreateMode = true;
  #currentResizeHandler; // 리사이즈 핸들러 방향
  #isResizing = false; // 리사이즈 상태 관리
  #background;

  constructor() {}

  on = () => {
    common.toggleCrosshairMouseCursor(true);
    this.#toggleBackground(true);
    document.addEventListener('mousedown', this.#startDrawing);
    document.addEventListener('mousemove', this.#drawing);
    document.addEventListener('mouseup', this.#stopDrawing);
  };

  /*
  그리기
   */
  #startDrawing = (event) => {
    if (!this.#isCreateMode) return;

    this.#box = document.createElement('div');
    this.#boxStartX = event.clientX + window.scrollX;
    this.#boxStartY = event.clientY + window.scrollY;

    // 스타일 설정
    this.#box.style.position = 'absolute';
    this.#box.style.left = `${this.#boxStartX}px`;
    this.#box.style.top = `${this.#boxStartY}px`;
    this.#box.classList.add('start-drawing-blur-box');
    document.body.appendChild(this.#box);
  };

  #drawing = (event) => {
    if (!this.#isCreateMode || !this.#box) return;

    // 박스 크기 조정
    const currentX = event.pageX;
    const currentY = event.pageY;
    const width = currentX - this.#boxStartX;
    const height = currentY - this.#boxStartY;

    if (width >= 0) {
      this.#box.style.width = `${width}px`;
    } else {
      this.#box.style.width = `${-width}px`;
      this.#box.style.left = `${currentX}px`;
    }

    if (height >= 0) {
      this.#box.style.height = `${height}px`;
    } else {
      this.#box.style.height = `${-height}px`;
      this.#box.style.top = `${currentY}px`;
    }
  };

  #stopDrawing = (event) => {
    this.#toggleBackground(false);
    this.#isCreateMode = false;
    this.#box.classList.add('bluer-box');
    common.toggleCrosshairMouseCursor(false);
    this.#addResize(event);
    this.#addRePosition();

    // 이벤트 리스너 제거
    document.removeEventListener('mousemove', this.#drawing);
    document.removeEventListener('mousedown', this.#startDrawing);
    // document.removeEventListener('mouseup', this.#stopDrawing);
  };

  /*
  위치 이동
   */
  #addRePosition = () => {
    let startX, startY;

    const startRePosition = (event) => {
      startX = event.clientX - this.#box.offsetLeft;
      startY = event.clientY - this.#box.offsetTop;
      this.#box.addEventListener('mousemove', onRePosition);
      this.#box.addEventListener('mouseup', stopRePosition);
      event.preventDefault();
    };

    const onRePosition = (event) => {
      const newX = event.clientX - startX;
      const newY = event.clientY - startY;
      this.#box.style.left = `${newX}px`;
      this.#box.style.top = `${newY}px`;
    };

    const stopRePosition = () => {
      this.#box.removeEventListener('mousemove', onRePosition);
      this.#box.removeEventListener('mouseup', stopRePosition);
    };

    this.#box.addEventListener('mousedown', startRePosition);
  };

  /*
  사이즈 조절
   */
  #addResize = () => {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    positions.forEach((position) => {
      const handle = document.createElement('div');
      this.#box.appendChild(handle);
      handle.classList.add('resize-handler', position);

      // 핸들 위치 설정
      if (position.includes('top')) {
        handle.style.top = '15px';
      }
      if (position.includes('bottom')) {
        handle.style.bottom = '15px';
      }
      if (position.includes('left')) {
        handle.style.left = '15px';
      }
      if (position.includes('right')) {
        handle.style.right = '15px';
      }

      // 핸들 이벤트 추가
      handle.addEventListener('mousedown', (event) => {
        this.#resizeBox(event);
        this.#currentResizeHandler = position;
        event.stopPropagation(); // 부모 요소의 드래그 이벤트 방지
      });
    });
  };

  #resizeBox = (event) => {
    // 리사이즈 시작
    this.#isResizing = true;
    this.#toggleBackground(true);
    const initialX = event.clientX;
    const initialY = event.clientY;
    const rect = this.#box.getBoundingClientRect();

    const onMouseMove = (moveEvent) => {
      if (!this.#isResizing) return;

      const deltaX = moveEvent.clientX - initialX;
      const deltaY = moveEvent.clientY - initialY;

      if (this.#currentResizeHandler === 'top-left') {
        this.#box.style.width = `${rect.width - deltaX}px`;
        this.#box.style.height = `${rect.height - deltaY}px`;
        this.#box.style.left = `${rect.left + deltaX}px`;
        this.#box.style.top = `${rect.top + deltaY}px`;
      } else if (this.#currentResizeHandler === 'top-right') {
        this.#box.style.width = `${rect.width + deltaX}px`;
        this.#box.style.height = `${rect.height - deltaY}px`;
        this.#box.style.top = `${rect.top + deltaY}px`;
      } else if (this.#currentResizeHandler === 'bottom-left') {
        this.#box.style.width = `${rect.width - deltaX}px`;
        this.#box.style.height = `${rect.height + deltaY}px`;
        this.#box.style.left = `${rect.left + deltaX}px`;
      } else if (this.#currentResizeHandler === 'bottom-right') {
        this.#box.style.width = `${rect.width + deltaX}px`;
        this.#box.style.height = `${rect.height + deltaY}px`;
      }
    };

    // todo: 정리 필요
    const onMouseUp = () => {
      // 리사이즈 종료
      this.#isResizing = false;
      this.#toggleBackground(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /*
  블러박스 하단에 배경(다른 태그 우선순위 때문에 원활한 블러 처리가 힘들어서 배경 생성)
   */
  #toggleBackground = (isOn) => {
    if (isOn) {
      this.#background = document.createElement('div');
      this.#background.classList.add('bluer-background');
      document.body.appendChild(this.#background);
    } else {
      this.#background.remove();
    }
  };

  /*
  팝업에 메시지 보내기
   */
  #sendMessageToPopup = () => {
    chrome.runtime.sendMessage({
      type: 'greeting',
      message: 'Hello from Content Script!'
    });
  };
}
