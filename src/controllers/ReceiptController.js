import OutputView from '../views/OutputView.js';

class Receipt {
  /**
   * @constructor
   * @property {Array<{ name: string, quantity: number, price: number }>} items - 구매한 상품의 이름, 수량, 금액 정보를 담은 배열
   * @property {number} totalPrice - 구매한 상품의 총 금액
   * @property {number} promotionDiscount - 프로모션에 따른 할인 금액
   * @property {number} membershipDiscount - 멤버십 할인 금액
   * @property {number} finalPrice - 최종 결제 금액 (총 금액 - 프로모션 할인 - 멤버십 할인)
   * @property {Array<{ name: string, freeQuantity: number }>} freeItems - 증정된 상품의 이름과 수량을 담은 배열
   */
  constructor() {
    this.receiptData = {
      items: [],
      totalPrice: 0,
      promotionDiscount: 0,
      membershipDiscount: 0,
      finalPrice: 0,
      freeItems: [],
    };
  }

  printReceipt(products, membershipDiscount) {
    this.#generateReceiptData(products, membershipDiscount);
    OutputView.receipt(this.receiptData);
  }

  /**
   * 영수증 데이터를 생성한다.
   * @param {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number, buy: number, get: number }>} products - 구매한 상품 리스트
   * @param {number} membershipDiscount - 멤버십 할인 금액
   */
  #generateReceiptData(products, membershipDiscount) {
    const items = this.#generateItems(products);
    const freeItems = this.#generateFreeItems(products);
    const totalPrice = this.#calculateTotalPrice(items);
    const promotionDiscount = this.#calculatePromotionDiscount(products);
    const finalPrice = this.#calculateFinalPrice(
      totalPrice,
      promotionDiscount,
      membershipDiscount,
    );

    this.receiptData = {
      items,
      totalPrice,
      promotionDiscount,
      membershipDiscount,
      finalPrice,
      freeItems,
    };
  }

  #generateItems(products) {
    return products.map(({ name, promoQuantity, baseQuantity, price }) => ({
      name,
      quantity: promoQuantity + baseQuantity,
      price: (promoQuantity + baseQuantity) * price,
    }));
  }

  #calculateTotalPrice(products) {
    return products.reduce((acc, { price }) => acc + price, 0);
  }
  #calculatePromotionDiscount(products) {
    return products.reduce((acc, { price, promoQuantity, buy, get }) => {
      const freeQuantity = this.#calculateFreeItemsQuantity(
        promoQuantity,
        buy,
        get,
      );
      return acc + price * freeQuantity;
    }, 0);
  }

  #calculateFinalPrice(totalPrice, promotionDiscount, membershipDiscount) {
    return totalPrice - promotionDiscount - membershipDiscount;
  }
  #generateFreeItems(products) {
    return products
      .filter(({ promoQuantity }) => promoQuantity > 0)
      .map(({ name, promoQuantity, buy, get }) => {
        const freeQuantity = this.#calculateFreeItemsQuantity(
          promoQuantity,
          buy,
          get,
        );
        return { name, freeQuantity };
      });
  }
  #calculateFreeItemsQuantity(promoQuantity, buy, get) {
    if (promoQuantity === 0 || buy + get === 0) {
      return 0;
    }
    return Math.floor(promoQuantity / (buy + get));
  }
}

export default Receipt;
