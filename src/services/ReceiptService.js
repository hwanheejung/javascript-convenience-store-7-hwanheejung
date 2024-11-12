class ReceiptService {
  /**
   * 영수증 데이터를 생성한다.
   * @param {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number, buy: number, get: number }>} products - 구매한 상품 리스트
   * @param {number} membershipDiscount - 멤버십 할인 금액
   * @returns {{ items: Array, totalPrice: number, promotionDiscount: number, membershipDiscount: number, finalPrice: number, freeItems: Array }}
   */
  generateReceiptData(products, membershipDiscount) {
    const items = this.#generateItems(products);
    const freeItems = this.#generateFreeItems(products);
    const totalPrice = this.#calculateTotalPrice(items);
    const promotionDiscount = this.#calculatePromotionDiscount(products);
    const finalPrice = this.#calculateFinalPrice(
      totalPrice,
      promotionDiscount,
      membershipDiscount,
    );

    return {
      items,
      totalPrice,
      promotionDiscount,
      membershipDiscount,
      finalPrice,
      freeItems,
    };
  }

  #generateItems(products) {
    return products.map(this.#generateItemData);
  }

  #generateItemData({ name, promoQuantity, baseQuantity, price }) {
    const totalQuantity = promoQuantity + baseQuantity;
    return {
      name,
      quantity: totalQuantity,
      price: totalQuantity * price,
    };
  }

  #calculateTotalPrice(items) {
    return items.reduce((acc, { price }) => acc + price, 0);
  }

  #calculatePromotionDiscount(products) {
    return products.reduce((acc, { price, promoQuantity, buy, get }) => {
      const freeQuantity = this.#calculateFreeQuantity(promoQuantity, buy, get);
      return acc + price * freeQuantity;
    }, 0);
  }

  #calculateFinalPrice(totalPrice, promotionDiscount, membershipDiscount) {
    return totalPrice - promotionDiscount - membershipDiscount;
  }

  #generateFreeItems(products) {
    return products
      .filter(({ promoQuantity }) => promoQuantity > 0)
      .map(({ name, promoQuantity, buy, get }) => ({
        name,
        freeQuantity: this.#calculateFreeQuantity(promoQuantity, buy, get),
      }));
  }

  #calculateFreeQuantity(promoQuantity, buy, get) {
    if (promoQuantity === 0 || buy + get === 0) return 0;
    return Math.floor(promoQuantity / (buy + get));
  }
}

export default ReceiptService;
