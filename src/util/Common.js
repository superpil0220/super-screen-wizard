const common = {
  toggleCrosshairMouseCursor(isOn) {
    if (isOn) {
      document.body.classList.add('blur-mode-cursor');
    } else {
      document.body.classList.remove('blur-mode-cursor');
    }
  }
};

export default common;
