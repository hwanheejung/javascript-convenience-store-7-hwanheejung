import { Console } from '@woowacourse/mission-utils';
import { ERROR } from '../constants/messages.js';

export const yesOrNoValidator = (input) => {
  if (input === 'Y' || input === 'N') return input;
  Console.print(ERROR.INVALID_YN);
  return null;
};

export const productsValidator = (input, stock) => {
  const products = input.trim().split(',');

  for (let product of products) {
    if (!validateFormat(product)) return null;

    const [name, quantity] = product
      .replace('[', '')
      .replace(']', '')
      .split('-');
    if (!validateExistence(name, stock)) return null;

    const { all: availableQuantity } = stock.getProductQuantity(name);
    if (!validateQuantity(quantity, availableQuantity)) return null;
  }

  return products;
};

const validateFormat = (product) => {
  const validFormat = /^\[.+-\d+\]$/;
  if (!validFormat.test(product)) {
    Console.print(ERROR.INVALID_PRODUCT_FORMAT);
    return false;
  }
  return true;
};

const validateExistence = (name, stock) => {
  const { all: availableQuantity } = stock.getProductQuantity(name);
  if (availableQuantity === undefined) {
    Console.print(ERROR.PRODUCT_NOT_FOUND(name));
    return false;
  }
  return true;
};

const validateQuantity = (quantity, availableQuantity) => {
  if (Number(quantity) > availableQuantity) {
    Console.print(ERROR.EXCEEDS_STOCK_QUANTITY);
    return false;
  }
  return true;
};
