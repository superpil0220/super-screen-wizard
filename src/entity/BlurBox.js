import common from '~@/util/Common.js';

/*
[V] 블러 박스 삭제
[V] 설정 버튼에 아이콘 넣기
[V] 색상 안맞음, 색상 변경 시 블러 처리 안됨
[V] 설정 아이템 항목 리팩토링
[] 설정 on 하면 사이즈 핸들러 나타나게
[] 사이즈 조절 이상한거 잡기

[] 화면 스크린샷
[] 화면 전체 스크린샷
 */
export default class BlurBox {
  #box;
  #boxStartX;
  #boxStartY;
  #isCreateMode = true;
  #currentResizeHandler;
  #isResizing = false;
  #background;
  // 블러 박스 설정
  #setting = {
    isOn: false,
    box: null,
    item: {
      blur: 5,
      color: 'rgba(224, 222, 222, 0.2)',
      borderRadius: 0
    }
  };

  constructor() {}

  on = () => {
    common.toggleCrosshairMouseCursor(true);
    this.#toggleBackground(true);
    document.addEventListener('mousedown', this.#startDrawing);
    document.addEventListener('mousemove', this.#drawing);
    document.addEventListener('mouseup', this.#stopDrawing);
  };

  // 그리기
  #startDrawing = (event) => {
    if (!this.#isCreateMode) return;

    this.#box = document.createElement('div');
    this.#boxStartX = event.clientX + window.scrollX;
    this.#boxStartY = event.clientY + window.scrollY;

    // 기본 스타일 설정
    this.#box.style.left = `${this.#boxStartX}px`;
    this.#box.style.top = `${this.#boxStartY}px`;
    this.#box.style.backdropFilter = `blur(${this.#setting.item.blur}px)`;
    this.#box.classList.add('start-drawing-blur-box');
    document.body.appendChild(this.#box);
  };

  #drawing = (event) => {
    if (!this.#isCreateMode || !this.#box) return;
    // 기본 색상 설정
    this.#box.style.backgroundColor = this.#setting.item.color;
    this.#box.style.borderRadius = this.#setting.item.borderRadius;

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
    this.#addResize(event);
    this.#addRePosition();
    this.#addSettingButton();
    common.toggleCrosshairMouseCursor(false);

    // 이벤트 리스너 제거
    document.removeEventListener('mousemove', this.#drawing);
    document.removeEventListener('mousedown', this.#startDrawing);
    document.removeEventListener('mouseup', this.#stopDrawing);
  };

  // 위치 이동
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

  // 사이즈 조절
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

  // 블러박스 하단에 배경(다른 태그 우선순위 때문에 원활한 블러 처리가 힘들어서 배경 생성)
  #toggleBackground = (isOn) => {
    if (isOn) {
      this.#background = document.createElement('div');
      this.#background.classList.add('bluer-background');
      document.body.appendChild(this.#background);
    } else {
      this.#background.remove();
    }
  };

  // 블러 박스 설정 버튼 추가 및 핸들링
  #addSettingButton = () => {
    const settingButton = document.createElement('button');
    settingButton.classList.add('bluer-box-setting-button');
    this.#box.appendChild(settingButton);
    settingButton.addEventListener('click', this.#handleSettingBox);
  };

  #handleSettingBox = () => {
    this.#setting.box ? this.#toggleSettingBox() : this.#createSettingBox();
  };

  #toggleSettingBox = () => {
    this.#setting.isOn ? this.#offSettingBox() : this.#onSettingBox();
  };

  #offSettingBox = () => {
    this.#setting.box.classList.remove('bluer-setting-box-on');
    this.#box.classList.remove('on-setting-bluer-box');
    this.#setting.box.classList.add('bluer-setting-box-off');
    this.#setting.isOn = false;
  };

  #onSettingBox = () => {
    this.#setting.box.classList.remove('bluer-setting-box-off');
    this.#box.classList.add('on-setting-bluer-box');
    this.#setting.box.classList.add('bluer-setting-box-on');
    this.#setting.isOn = true;
  };

  // 블러 박스 설정 항목 생성 및 핸들링 설정
  #createSettingBox = () => {
    this.#setting.box = document.createElement('div');
    this.#setting.box.classList.add('bluer-setting-box-on');
    this.#box.classList.add('on-setting-bluer-box');
    this.#setting.isOn = true;

    // 설정 항목
    [
      (labelName, labelValue, inputTag) => {
        labelName.innerText = `투명도 `;
        labelValue.innerText = `${this.#setting.item.blur}px`;
        inputTag.type = 'range';
        inputTag.min = 0;
        inputTag.max = 50;
        inputTag.step = 1;
        inputTag.value = this.#setting.item.blur;
        inputTag.classList.add('bluer-setting-box-label-input');

        inputTag.addEventListener('input', (event) => {
          const newValue = parseFloat(event.target.value);
          this.#setting.item.blur = newValue;
          this.#box.style.backdropFilter = `blur(${newValue}px)`;
          labelValue.innerText = `${newValue}px`;
        });
      },
      (labelName, labelValue, inputTag) => {
        labelName.innerText = `모서리 `;
        labelValue.innerText = `${this.#setting.item.borderRadius}%`;
        inputTag.type = 'range';
        inputTag.min = 0;
        inputTag.max = 100;
        inputTag.step = 0.5;
        inputTag.value = this.#setting.item.borderRadius;
        inputTag.classList.add('bluer-setting-box-label-input');

        inputTag.addEventListener('input', (event) => {
          const newValue = parseFloat(event.target.value);
          this.#setting.item.borderRadius = newValue;
          this.#box.style.borderRadius = `${newValue}%`;
          labelValue.innerText = `${newValue}%`;
        });
      },
      (labelName, labelValue, inputTag) => {
        labelName.innerText = `색상 `;
        labelValue.innerText = `${this.#setting.item.color}`;
        inputTag.type = 'color';
        inputTag.value = common.rgbaToHex(this.#setting.item.color);
        inputTag.classList.add('bluer-setting-box-label-input');

        inputTag.addEventListener('input', (event) => {
          const hexValue = event.target.value;
          const alpha = common.getAlphaFromRgba(this.#setting.item.color);
          const rgbaValue = common.hexToRgba(hexValue, alpha);
          this.#setting.item.color = rgbaValue;
          this.#box.style.backgroundColor = rgbaValue;
          labelValue.innerText = `${rgbaValue}`;
        });
      }
    ].forEach((func) => {
      const item = this.#createSettingItem(func);
      this.#setting.box.appendChild(item);
    });

    // 설정 박스 버튼
    const buttonBox = document.createElement('div');
    buttonBox.classList.add('blur-setting-box-button-box');
    [
      {
        className: 'blur-box-done-button',
        title: '확인',
        handler: () => {
          this.#offSettingBox();
        }
      },
      {
        className: 'blur-box-delete-button',
        title: '삭제',
        handler: () => {
          this.#box.remove();
          this.#setting.box.remove();
        }
      }
    ].forEach((item) => {
      const button = document.createElement('button');
      button.classList.add('blur-setting-buttons');
      button.classList.add(item.className);
      button.innerText = item.title;
      button.addEventListener('click', item.handler);
      buttonBox.appendChild(button);
    });

    this.#setting.box.appendChild(buttonBox);
    document.body.appendChild(this.#setting.box);
  };

  // 블러 설정 항목 생성
  #createSettingItem = (onSet) => {
    // 라벨, 값 태그 생성
    const container = document.createElement('div');
    container.classList.add('bluer-setting-box-list');

    const labelBox = document.createElement('p');
    labelBox.classList.add('bluer-setting-box-label-box');

    const labelName = document.createElement('span');
    labelName.classList.add('bluer-setting-box-label-name');
    labelBox.appendChild(labelName);

    const labelValue = document.createElement('span');
    labelName.classList.add('setting-box-label-value');
    labelBox.appendChild(labelValue);
    container.appendChild(labelBox);

    // 인풋태그 생성
    const inputTag = document.createElement('input');
    container.appendChild(inputTag);

    onSet(labelName, labelValue, inputTag);
    return container;
  };
}
