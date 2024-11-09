import { Console } from '@woowacourse/mission-utils';
import { PROMPT } from '../constants/messages.js';

class OutputView {
  static availableProducts(products) {
    Console.print(PROMPT.WELCOME);

    products.forEach((product) => {
      const [name, price, quantity, promotion] = product;
      const quantityText = quantity > 0 ? `${quantity}개` : '재고 없음';
      const promotionText = promotion ? promotion : '';

      Console.print(`- ${name} ${price}원 ${quantityText} ${promotionText}`);
    });
  }
}

export default OutputView;
