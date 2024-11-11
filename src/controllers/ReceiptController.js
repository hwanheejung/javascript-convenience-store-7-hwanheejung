import OutputView from '../views/OutputView.js';

class Receipt {
  /** @type {Array<{ name: string, quantity: number, price: number }>} */
  items = [];

  /** @type {number} */
  totalPrice = 0;

  /** @type {number} */
  promotionDiscount = 0;

  /** @type {number} */
  membershipDiscount = 0;

  /** @type {number} */
  finalPrice = 0;

  /** @type {Array<{ name: string, freeQuantity: number }>} */
  freeItems = [];

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

  /**
   * 영수증을 출력한다.
   * @param {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number, buy: number, get: number }>} products - 구매한 상품 리스트
   * @param {number} membershipDiscount - 멤버십 할인 금액
   */
  printReceipt(products, membershipDiscount) {
    this.#generateReceiptData(products, membershipDiscount);
    OutputView.receipt(this.receiptData);
  }

  /**
   * 영수증 데이터를 생성한다.
   * @param {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number, buy: number, get: number }>} products - 구매한 상품 리스트
   * @param {number} membershipDiscount - 멤버십 할인 금액
   * @private
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

  /**
   * 상품 항목 리스트를 생성한다.
   * @param {Array<{ name: string, promoQuantity: number, baseQuantity: number, price: number }>} products - 구매한 상품 리스트
   * @returns {Array<{ name: string, quantity: number, price: number }>}
   * @private
   */
  #generateItems(products) {
    return products.map(this.#generateItemData);
  }

  /**
   * 개별 상품 데이터를 생성한다.
   * @param {Object} product - 상품 객체
   * @param {string} product.name - 상품명
   * @param {number} product.promoQuantity - 프로모션 수량
   * @param {number} product.baseQuantity - 기본 수량
   * @param {number} product.price - 상품 가격
   * @returns {{ name: string, quantity: number, price: number }}
   * @private
   */
  #generateItemData({ name, promoQuantity, baseQuantity, price }) {
    const totalQuantity = promoQuantity + baseQuantity;
    return {
      name,
      quantity: totalQuantity,
      price: totalQuantity * price,
    };
  }

  /**
   * 총 구매 금액을 계산한다.
   * @param {Array<{ price: number }>} items - 구매한 상품의 가격 리스트
   * @returns {number} 총 구매 금액
   * @private
   */
  #calculateTotalPrice(items) {
    return items.reduce((acc, { price }) => acc + price, 0);
  }

  /**
   * 프로모션 할인을 계산한다.
   * @param {Array<{ price: number, promoQuantity: number, buy: number, get: number }>} products - 구매한 상품 리스트
   * @returns {number} 프로모션 할인 금액
   * @private
   */
  #calculatePromotionDiscount(products) {
    return products.reduce((acc, { price, promoQuantity, buy, get }) => {
      const freeQuantity = this.#calculateFreeQuantity(promoQuantity, buy, get);
      return acc + price * freeQuantity;
    }, 0);
  }

  /**
   * 최종 결제 금액을 계산한다.
   * @param {number} totalPrice - 총 구매 금액
   * @param {number} promotionDiscount - 프로모션 할인 금액
   * @param {number} membershipDiscount - 멤버십 할인 금액
   * @returns {number} 최종 결제 금액
   * @private
   */
  #calculateFinalPrice(totalPrice, promotionDiscount, membershipDiscount) {
    return totalPrice - promotionDiscount - membershipDiscount;
  }

  /**
   * 증정 상품 리스트를 생성한다.
   * @param {Array<{ name: string, promoQuantity: number, buy: number, get: number }>} products - 구매한 상품 리스트
   * @returns {Array<{ name: string, freeQuantity: number }>} 증정된 상품의 이름과 수량을 담은 배열
   * @private
   */
  #generateFreeItems(products) {
    return products
      .filter(({ promoQuantity }) => promoQuantity > 0)
      .map(({ name, promoQuantity, buy, get }) => ({
        name,
        freeQuantity: this.#calculateFreeQuantity(promoQuantity, buy, get),
      }));
  }

  /**
   * 증정 수량을 계산한다.
   * @param {number} promoQuantity - 프로모션 수량
   * @param {number} buy - 구매 기준 수량
   * @param {number} get - 증정 수량
   * @returns {number} 증정 수량
   * @private
   */
  #calculateFreeQuantity(promoQuantity, buy, get) {
    if (promoQuantity === 0 || buy + get === 0) return 0;
    return Math.floor(promoQuantity / (buy + get));
  }
}

export default Receipt;
