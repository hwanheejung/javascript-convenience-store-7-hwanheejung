import CashierService from '../services/CashierService.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import Receipt from './ReceiptController.js';

class Cashier {
  /** @type {Stock} */ stock;
  /** @type {PromotionList} */ promotionList;
  /** @type {Receipt} */ receipt;
  /** @type {CashierService} */ service;

  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
    this.receipt = new Receipt();
    this.service = new CashierService(stock, promotionList);
  }

  async start() {
    await this.#processPurchase();
    OutputView.goodBye();
  }

  async #processPurchase() {
    this.displayAvailableProducts();
    const productsToBuy = await this.collectProductsToBuy();
    const adjustedProducts =
      await this.service.getAdjustedProducts(productsToBuy);
    const membershipDiscount =
      await this.calculateMembershipDiscount(adjustedProducts);

    this.printReceipt(adjustedProducts, membershipDiscount);

    if (await this.confirmRestart()) await this.#processPurchase();
  }

  displayAvailableProducts() {
    const products = this.stock.getAllProducts();
    OutputView.availableProducts(products);
  }

  async collectProductsToBuy() {
    const input = await InputView.productsToBuy(this.stock);
    return input.map((product) => {
      const [name, quantity] = product
        .replace('[', '')
        .replace(']', '')
        .split('-');
      return { name, quantity: Number(quantity) };
    });
  }

  async calculateMembershipDiscount(adjustedProducts) {
    const amount =
      await this.service.calculateMembershipDiscount(adjustedProducts);
    const answer = await InputView.askForMembership();
    if (answer === 'Y') return amount;
    return 0;
  }

  printReceipt(adjustedProducts, membershipDiscount) {
    this.receipt.printReceipt(adjustedProducts, membershipDiscount);
  }

  async confirmRestart() {
    const answer = await InputView.askForStartAgain();
    return answer !== 'N';
  }
}

export default Cashier;
