import { Console } from '@woowacourse/mission-utils';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import Checkout from './CheckoutController.js';

class Cashier {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
    this.checkout = new Checkout(stock, promotionList);
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
      quantity = await this.checkStockAndAdjustQuantity(name, quantity);
      quantity = await this.checkPromotionAndAdjustQuantity(name, quantity);
      adjustedProducts.push({ name, quantity });
    }

    return adjustedProducts;
  }

  async checkStockAndAdjustQuantity(name, quantity) {
    const availableQuantity = this.stock.getProductQuantity(name);

    if (quantity > availableQuantity) {
      const ans = await Console.readLineAsync(
        `재고가 부족합니다. 남아있는 재고(${availableQuantity}개)만큼이라도 구매하시겠습니까? (Y/N)`,
      );
      if (ans === 'Y') return availableQuantity;
      if (ans === 'N') return 0;
    }

    return quantity;
  }

  async checkPromotionAndAdjustQuantity(name, quantity) {
    const promotionProduct = this.stock.getProductsByName(name)?.promotion;
    if (promotionProduct) {
      const promotion = this.promotionList.getPromotionByName(
        promotionProduct.promotion,
      );

      if (quantity === promotion.buy) {
        const ans = await Console.readLineAsync(
          `현재 ${name}은(는) ${promotion.get}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
        );
        if (ans === 'Y') return quantity + promotion.get;
        if (ans === 'N') return quantity;
      }
    }

    return quantity;
  }

  askForMembership() {}
}

export default Cashier;
