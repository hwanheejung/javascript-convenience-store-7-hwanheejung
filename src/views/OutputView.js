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

  static receipt(membershipDiscount, products) {
    // const products = [
    //   { name: '사이다', price: 1000, baseQuantity: 2, promoQuantity: 1 },
    // ];

    // ==============W 편의점================
    // 상품명		수량	금액
    // 콜라		3 	3,000
    // 에너지바 		5 	10,000
    // =============증	정===============
    // 콜라		1
    // ====================================
    // 총구매액		8	13,000
    // 행사할인			-1,000
    // 멤버십할인			-3,000
    // 내실돈			 9,000
    Console.print('==============W 편의점================');
  }
}

export default OutputView;
