import { Console } from '@woowacourse/mission-utils';

export const yesOrNoValidator = (input) => {
  if (input === 'Y' || input === 'N') return input;
  Console.print('[ERROR] Y 또는 N을 입력해 주세요.');
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
    Console.print(
      '[ERROR] 올바른 형식으로 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    return false;
  }
  return true;
};

const validateExistence = (name, stock) => {
  const { all: availableQuantity } = stock.getProductQuantity(name);
  if (availableQuantity === undefined) {
    Console.print(`[ERROR] ${name}은(는) 존재하지 않는 상품입니다.`);
    return false;
  }
  return true;
};

const validateQuantity = (quantity, availableQuantity) => {
  if (Number(quantity) > availableQuantity) {
    Console.print(
      `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`,
    );
    return false;
  }
  return true;
};
