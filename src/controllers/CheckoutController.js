import { Console } from '@woowacourse/mission-utils';

class Checkout {
  constructor(stock, promotionList) {
    this.productsToBuy = [];
    this.promotedProducts = [];

    this.stock = stock;
    this.promotionList = promotionList;
  }

  /**
   *
   * @param {Array<{ name: string, quantity: number }>} products
   */
  addProductsToBuy(products) {}
}

export default Checkout;
