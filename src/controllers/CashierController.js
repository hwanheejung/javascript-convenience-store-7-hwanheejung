import calculateMembership from '../utils/calculateMembership.js';
import calculateQuantities from '../utils/calculateQuantities.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import Receipt from './ReceiptController.js';

class Cashier {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
    this.receipt = new Receipt();
  }

  async start() {
    await this.#processPurchase();
    OutputView.goodBye();
  }

  async #processPurchase() {
    this.displayAvailableProducts();
    const productsToBuy = await this.#collectProductsToBuy();
    const adjustedProducts = await this.#adjustProductQuantities(productsToBuy);
    const membershipDiscount =
      await this.#calculateMembershipDiscount(adjustedProducts);

    this.#printReceipt(adjustedProducts, membershipDiscount);

    if (await this.#confirmRestart()) await this.#processPurchase();
  }

  displayAvailableProducts() {
    const products = this.stock.getAllProducts();
    OutputView.availableProducts(products);
  }

  async #collectProductsToBuy() {
    const input = await InputView.productsToBuy(this.stock);
    return input.map((product) => {
      const [name, quantity] = product
        .replace('[', '')
        .replace(']', '')
        .split('-');
      return { name, quantity: Number(quantity) };
    });
  }

  async #adjustProductQuantities(productsToBuy) {
    const adjustedProducts = [];

    for (const { name, quantity } of productsToBuy) {
      const adjustedProduct = await this.#getAdjustedProduct(name, quantity);
      adjustedProducts.push(adjustedProduct);
      this.stock.reduceProductQuantity(
        name,
        adjustedProduct.promoQuantity,
        adjustedProduct.baseQuantity,
      );
    }

    return adjustedProducts;
  }

  async #getAdjustedProduct(name, quantity) {
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

    return { name, promoQuantity, baseQuantity, price, buy, get };
  }

  #getProductBuyGet(product) {
    const promotionName = product['promotion']?.promotion;
    if (!promotionName) return { buy: 0, get: 0 };

    const promotion = this.promotionList.getPromotionByName(promotionName);
    const promotionDetails = promotion?.getDetails();

    return {
      buy: promotionDetails?.buy || 0,
      get: promotionDetails?.get || 0,
    };
  }

  async #calculateMembershipDiscount(products) {
    const amount = this.#calculateTotalAmount(products);
    const answer = await InputView.askForMembership();
    return answer === 'Y' ? calculateMembership(amount) : 0;
  }

  #calculateTotalAmount(products) {
    return products.reduce(
      (acc, { price, promoQuantity, baseQuantity }) =>
        acc + price * (promoQuantity + baseQuantity),
      0,
    );
  }

  #printReceipt(adjustedProducts, membershipDiscount) {
    this.receipt.printReceipt(adjustedProducts, membershipDiscount);
  }

  async #confirmRestart() {
    const answer = await InputView.askForStartAgain();
    return answer !== 'N';
  }
}

export default Cashier;
