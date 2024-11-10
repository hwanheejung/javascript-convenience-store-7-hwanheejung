import { Console } from '@woowacourse/mission-utils';
import calculateQuantities from '../utils/calculateQuantities.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import Receipt from './ReceiptController.js';
import calculateMembership from '../utils/calculateMembership.js';

class Cashier {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
    this.receipt = new Receipt();
  }

  async start() {
    this.displayAvailableProducts();
    const productsToBuy = await InputView.productsToBuy();
    const adjustedProducts = await this.adjustProductQuantities(productsToBuy);
    const membershipDiscount =
      await this.getMembershipDiscount(adjustedProducts);

    this.receipt.generateReceiptData(adjustedProducts, membershipDiscount);
    // this.receipt.printReceipt();
  }

  displayAvailableProducts() {
    const products = this.stock.getAllProducts();
    OutputView.availableProducts(products);
  }

  /**
   *
   * @param {Array<{ name: string, quantity: number }>} productsToBuy
   * @returns {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number, buy: number, get: number }>}
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
      const price = product['base'].price;
      adjustedProducts.push({
        name,
        promoQuantity,
        baseQuantity,
        price,
        buy,
        get,
      });

      this.stock.reduceProductQuantity(name, promoQuantity, baseQuantity);
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

  /**
   *
   * @param {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number }>}products
   * @returns {number}
   */
  async getMembershipDiscount(products) {
    let membershipDiscount = 0;
    const amount = products.reduce(
      (acc, { price, promoQuantity, baseQuantity }) =>
        acc + price * (promoQuantity + baseQuantity),
      0,
    );

    const answer = await InputView.askForMembership();
    if (answer === 'Y') {
      membershipDiscount = calculateMembership(amount);
    }
    return membershipDiscount;
  }
}

export default Cashier;
