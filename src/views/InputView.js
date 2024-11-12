import { PROMPT } from '../constants/messages.js';
import {
  productsValidator,
  yesOrNoValidator,
} from '../utils/inputValidator.js';
import promptUntilValid from '../utils/promptUntilValid.js';

class InputView {
  static async productsToBuy(stock) {
    return promptUntilValid(
      (input) => productsValidator(input, stock),
      PROMPT.ASK_PRODUCTS_TO_BUY,
    );
  }

  static async confirmExcessBaseStock(availableQuantity) {
    return promptUntilValid(
      yesOrNoValidator,
      PROMPT.ASK_BASE_STOCK(availableQuantity),
    );
  }

  static async confirmPromo(name, get) {
    return promptUntilValid(
      yesOrNoValidator,
      PROMPT.ASK_PROMO_ADDITION(name, get),
    );
  }

  static async confirmBase(name, quantity) {
    return promptUntilValid(
      yesOrNoValidator,
      PROMPT.ASK_PROMO_BASE_PURCHASE(name, quantity),
    );
  }

  static async askForMembership() {
    return promptUntilValid(yesOrNoValidator, PROMPT.ASK_MEMBERSHIP);
  }

  static async askForStartAgain() {
    return promptUntilValid(yesOrNoValidator, PROMPT.ASK_START_AGAIN);
  }
}

export default InputView;
