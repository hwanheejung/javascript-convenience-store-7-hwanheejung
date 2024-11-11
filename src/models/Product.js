class Product {
  /** @type {string} */ name;
  /** @type {number} */ price;
  /** @type {number} */ quantity;
  /** @type {string|null} */ promotion;

  /**
   * @param {string} name - 상품명
   * @param {number} price - 상품 가격
   * @param {number} quantity - 재고 수량
   * @param {string|null} [promotion=null] - 프로모션 정보
   */
  constructor(name, price, quantity, promotion = null) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.promotion = promotion;
  }

  /**
   * 주어진 수량만큼 상품 재고를 감소시킨다
   * @param {number} quantity - 감소시킬 수량
   * @returns {void}
   */
  reduceQuantity(quantity) {
    this.quantity -= quantity;
  }
}

export default Product;
