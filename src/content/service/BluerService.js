import BluerBox from '~@/entity/BluerBox.js';
import common from '~@/util/Common.js';

export const bluerService = {
  createSingleBluerBox: () => {
    common.toggleCrosshairMouseCursor(true);
    const aBox = new BluerBox();
    aBox.startDrawing();
    aBox.drawBox();
    aBox.stopDrawing();
  }
};
