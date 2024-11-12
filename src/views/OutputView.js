import { Console } from '@woowacourse/mission-utils';
import { PROMPT } from '../constants/messages.js';
import commaizeNumber from '../utils/commaizeNumber.js';

class OutputView {
  static availableProducts(products) {
    Console.print(PROMPT.WELCOME);

    products.forEach((product) => {
      const [name, price, quantity, promotion] = product;

      let quantityText = '재고 없음';
      if (quantity > 0) quantityText = `${quantity}개`;

      let promotionText = '';
      if (promotion) promotionText = promotion;

      Console.print(
        `- ${name} ${commaizeNumber(price)}원 ${quantityText} ${promotionText}`,
      );
    });
  }

  static receipt(receiptData) {
    Console.print('==============W 편의점================');
    Console.print('상품명\t\t수량\t금액');
    this.printItems(receiptData.items);
    this.printFreeItems(receiptData.freeItems);
    Console.print('====================================');
    this.printSummary(receiptData);
  }

  static printItems(items) {
    items.forEach(({ name, quantity, price }) => {
      Console.print(`${name}\t\t${quantity}\t${commaizeNumber(price)}원`);
    });
  }

  static printFreeItems(freeItems) {
    Console.print('=============증\t정===============');
    freeItems.forEach(({ name, freeQuantity }) => {
      Console.print(`${name}\t\t${freeQuantity}`);
    });
  }

  static printSummary(receiptData) {
    Console.print(`총구매액\t\t${commaizeNumber(receiptData.totalPrice)}원`);
    Console.print(
      `행사할인\t\t-${commaizeNumber(receiptData.promotionDiscount)}원`,
    );
    Console.print(
      `멤버십할인\t\t-${commaizeNumber(receiptData.membershipDiscount)}원`,
    );
    Console.print(`내실돈\t\t${commaizeNumber(receiptData.finalPrice)}원`);
  }

  static goodBye() {
    Console.print(PROMPT.GOODBYE);
  }
}

export default OutputView;
