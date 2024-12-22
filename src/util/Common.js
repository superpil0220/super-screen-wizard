const common = {
  toggleCrosshairMouseCursor(isOn) {
    if (isOn) {
      document.body.classList.add('blur-mode-cursor');
    } else {
      document.body.classList.remove('blur-mode-cursor');
    }
  },
  getAlphaFromRgba(rgba) {
    return rgba.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/)[4];
  },
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${!alpha ? 1 : alpha})`;
  },
  rgbaToHex(rgba) {
    const match = rgba.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (!match) return '#000000';
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
};

export default common;
