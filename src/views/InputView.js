import {
  productsValidator,
  yesOrNoValidator,
} from '../utils/inputValidator.js';
import promptUntilValid from '../utils/promptUntilValid.js';

class InputView {
  static async productsToBuy(stock) {
    return promptUntilValid(
      (input) => productsValidator(input, stock),
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
    );
  }

  static async confirmExcessBaseStock(availableQuantity) {
    return promptUntilValid(
      yesOrNoValidator,
      `기본 상품의 재고가 부족합니다. 남아있는 재고(${availableQuantity}개)만큼이라도 구매하시겠습니까? (Y/N)\n`,
    );
  }

  static async confirmPromo(name, get) {
    return promptUntilValid(
      yesOrNoValidator,
      `현재 ${name}은(는) ${get}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );
  }

  static async confirmBase(name, quantity) {
    return promptUntilValid(
      yesOrNoValidator,
      `현재 ${name} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
    );
  }

  static async askForMembership() {
    return promptUntilValid(
      yesOrNoValidator,
      '멤버십 할인을 받으시겠습니까? (Y/N)\n',
    );
  }
}

export default InputView;
