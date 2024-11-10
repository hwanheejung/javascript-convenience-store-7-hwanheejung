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

  static receipt(receiptData) {
    Console.print('==============W 편의점================');
    Console.print('상품명\t\t수량\t금액');

    // 구매 항목 출력
    receiptData.items.forEach(({ name, quantity, price }) => {
      Console.print(`${name}\t\t${quantity}\t${price.toLocaleString()}원`);
    });

    // 증정 항목 출력
    Console.print('=============증\t정===============');
    receiptData.freeItems.forEach(({ name, freeQuantity }) => {
      Console.print(`${name}\t\t${freeQuantity}`);
    });
    Console.print('====================================');

    // 요약 정보 출력
    Console.print(`총구매액\t\t${receiptData.totalPrice.toLocaleString()}원`);
    Console.print(
      `행사할인\t\t-${receiptData.promotionDiscount.toLocaleString()}원`,
    );
    Console.print(
      `멤버십할인\t\t-${receiptData.membershipDiscount.toLocaleString()}원`,
    );
    Console.print(`내실돈\t\t${receiptData.finalPrice.toLocaleString()}원`);
  }
}

export default OutputView;
