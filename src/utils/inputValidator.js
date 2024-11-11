import { Console } from '@woowacourse/mission-utils';

export const yesOrNoValidator = (input) => {
  if (input === 'Y' || input === 'N') return input;
  Console.print('[ERROR] Y 또는 N을 입력해 주세요.');
  return null;
};

export const excessStockValidator = (input, availableQuantity) => {
  if (Number(input) <= availableQuantity) return input;
  Console.print(
    '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
  );
  return null;
};

export const productsValidator = (input, stock) => {
  const products = input.trim().split(',');
  const validFormat = /^\[.+-\d+\]$/;

  // 각 상품의 입력 형식과 재고 확인
  for (let product of products) {
    Console.print(product);
    if (!validFormat.test(product)) {
      Console.print(
        '[ERROR] 올바른 형식으로 입력해 주세요. (예: [사이다-2],[감자칩-1])',
      );
      return null;
    }

    const [name, quantity] = product
      .replace('[', '')
      .replace(']', '')
      .split('-');
    const { all: availableQuantity } = stock.getProductQuantity(name);

    if (availableQuantity === undefined) {
      Console.print(`[ERROR] ${name}은(는) 존재하지 않는 상품입니다.`);
      return null;
    }

    if (Number(quantity) > availableQuantity) {
      Console.print(
        `[ERROR] ${name}의 재고 수량(${availableQuantity}개)를 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`,
      );
      return null;
    }
  }
  return products;
};
