import BlurBox from '~@/entity/BlurBox.js';

export const blurService = {
  createSingleBluerBox: () => {
    const bluerBox = new BlurBox();
    bluerBox.on();
  }
};
