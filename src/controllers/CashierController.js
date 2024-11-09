import { Console } from '@woowacourse/mission-utils';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import Checkout from './CheckoutController.js';
import CashierService from '../services/CashierService.js';

class Cashier {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
    this.checkout = new Checkout(stock, promotionList);

    this.service = new CashierService(stock, promotionList);
  }

  async start() {
    this.displayAvailableProducts();
    const productsToBuy = await this.askForProducts();
    const adjustedProducts = await this.handlePromotions(productsToBuy);
    Console.print(adjustedProducts);
    // this.checkout.addProductsToBuy(adjustedProducts);
    // this.askForMembership();
  }

  displayAvailableProducts() {
    const products = this.stock.getAllProducts();
    OutputView.availableProducts(products);
  }

  async askForProducts() {
    const productsToBuy = await InputView.productsToBuy();
    return productsToBuy;
  }

  async handlePromotions(productsToBuy) {
    const adjustedProducts = [];

    for (const product of productsToBuy) {
      let { name, quantity } = product;
      quantity = await this.service.adjustQuantityForStock(name, quantity);
      quantity = await this.service.adjustQuantityForPromotion(name, quantity);
      adjustedProducts.push({ name, quantity });
    }

    return adjustedProducts;
  }

  askForMembership() {}
}

export default Cashier;
