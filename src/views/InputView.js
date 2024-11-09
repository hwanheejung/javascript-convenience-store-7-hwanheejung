import { Console } from '@woowacourse/mission-utils';

class InputView {
  static async productsToBuy() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
    );

    const products = input.trim().split(',');

    return products.map((product) => {
      const [name, quantity] = product
        .replace('[', '')
        .replace(']', '')
        .split('-');
      return { name, quantity: Number(quantity) };
    });
  }
}

export default InputView;
