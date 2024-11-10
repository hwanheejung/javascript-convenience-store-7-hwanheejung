import { Console } from '@woowacourse/mission-utils';
import calculateQuantities from '../utils/calculateQuantities.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class Cashier {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
  }

  async start() {
    this.displayAvailableProducts();
    const productsToBuy = await InputView.productsToBuy();
    const adjustedProducts = await this.adjustProductQuantities(productsToBuy);

    Console.print(adjustedProducts);

    // this.askForMembership();
  }

  displayAvailableProducts() {
    const products = this.stock.getAllProducts();
    OutputView.availableProducts(products);
  }

  /**
   *
   * @param {Array<{ name: string, quantity: number }>} productsToBuy
   * @returns {Array<{ name: string, promoQuantity: number, baseQuantity: number }>}
   */
  async adjustProductQuantities(productsToBuy) {
    const adjustedProducts = [];

    for (const { name, quantity } of productsToBuy) {
      const product = this.stock.getProductsByName(name);
      const { base: baseStock, promotion: promoStock } =
        this.stock.getProductQuantity(name);

      const { buy, get } = this.#getProductBuyGet(product);

      const { promoQuantity, baseQuantity } = await calculateQuantities(
        name,
        quantity,
        promoStock,
        baseStock,
        buy,
        get,
      );
      adjustedProducts.push({ name, promoQuantity, baseQuantity });
      // this.stock.reduceProductQuantity(name, promoQuantity, baseQuantity);
    }

    return adjustedProducts;
  }

  #getProductBuyGet(product) {
    let [buy, get] = [0, 0];
    const promotionName = product['promotion']?.promotion;

    if (promotionName) {
      const promotion = this.promotionList.getPromotionByName(promotionName);
      const promotionDetails = promotion?.getDetails();
      buy = promotionDetails?.buy || 0;
      get = promotionDetails?.get || 0;
    }

    return { buy, get };
  }

  askForMembership() {}
}

export default Cashier;
