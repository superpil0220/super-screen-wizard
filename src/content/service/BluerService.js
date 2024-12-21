import BluerBox from '~@/entity/BluerBox.js';

export const bluerService = {
  createSingleBluerBox: () => {
    const bluerBox = new BluerBox();
    bluerBox.on();
  }
};
