import common from '~@/util/Common.js';

export default class BluerBox {
  #box;
  #isCreateMode = true;
  #startX;
  #startY;
  #onDrawBox;
  #onStartDrawing;
  #currentResizeHandler; // 리사이즈 핸들러 방향
  #isResizing = false; // 리사이즈 상태 관리

  constructor() {
    // 메서드 바인딩 todo: ?????
    this.#onStartDrawing = this.#onStartDrawingHandler.bind(this);
    this.#onDrawBox = this.#onDrawBoxHandler.bind(this);
  }

  // 블러 박스 생성 시작
  startDrawing() {
    document.addEventListener('mousedown', this.#onStartDrawing);
  }

  // 마우스 이동 중 박스 크기 조정
  drawBox() {
    document.addEventListener('mousemove', this.#onDrawBox);
  }

  // 마우스 업 이벤트 처리
  stopDrawing() {
    document.addEventListener('mouseup', (event) => {
      // 이벤트 리스너 제거
      document.removeEventListener('mousemove', this.#onDrawBox);
      document.removeEventListener('mousedown', this.#onStartDrawing);

      this.#isCreateMode = false;
      this.#addResizeHandles(event);
      this.#box.classList.add('bluer-box');
      common.toggleCrosshairMouseCursor(false);
    });
  }

  #onStartDrawingHandler(event) {
    if (!this.#isCreateMode) return;

    // 박스 초기화
    this.#box = document.createElement('div');
    // todo: ?????
    this.#startX = event.clientX + window.scrollX;
    this.#startY = event.clientY + window.scrollY;

    // 스타일 설정
    this.#box.style.position = 'absolute';
    this.#box.style.left = `${this.#startX}px`;
    this.#box.style.top = `${this.#startY}px`;
    this.#box.classList.add('start-drawing-blur-box');
    document.body.appendChild(this.#box);
  }

  #onDrawBoxHandler(event) {
    if (!this.#isCreateMode || !this.#box) return;

    // 박스 크기 조정
    const currentX = event.pageX;
    const currentY = event.pageY;
    const width = currentX - this.#startX;
    const height = currentY - this.#startY;

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
  }

  #addResizeHandles() {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    positions.forEach((position) => {
      const handle = document.createElement('div');
      this.#box.appendChild(handle);
      handle.classList.add('resize-handler', position);

      // 핸들 위치 설정
      if (position.includes('top')) {
        handle.style.top = '10px';
      }
      if (position.includes('bottom')) {
        handle.style.bottom = '10px';
      }
      if (position.includes('left')) {
        handle.style.left = '10px';
      }
      if (position.includes('right')) {
        handle.style.right = '10px';
      }

      // 핸들 이벤트 추가
      handle.addEventListener('mousedown', (event) => {
        this.#resizeBox(event);
        this.#currentResizeHandler = position;
        event.stopPropagation(); // 부모 요소의 드래그 이벤트 방지
      });
    });
  }

  #resizeBox(event) {
    // 리사이즈 시작
    this.#isResizing = true;
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
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
