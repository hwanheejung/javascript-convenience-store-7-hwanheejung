import Product from './Product.js';
import getDataFromFile from '../utils/getDataFromFile.js';

class Stock {
  /**  @type {Map<string, { base: Product|null, promotion: Product|null }>} */ products;

  constructor() {
    this.products = new Map();
  }

  /**
   * 파일에서 상품 정보를 불러와 products 맵을 초기화한다.
   * @returns {void}
   */
  loadProducts() {
    const productLines = getDataFromFile('../../public/products.md');

    productLines.forEach((line) => {
      const product = this.#parseProductLine(line);

      if (!this.products.has(product.name)) {
        this.products.set(product.name, { base: null, promotion: null });
      }

      const productInfo = this.products.get(product.name);
      if (product.promotion) {
        productInfo.promotion = product;
      } else {
        productInfo.base = product;
      }
    });

    this.#fillEmptyBaseQuantities();
  }

  /**
   * 모든 상품의 정보를 배열 형태로 반환한다.
   * @returns {Array<Array<string|number|null>>} 상품 정보 배열
   */
  getAllProducts() {
    const flattenedProducts = [];
    const addProductToFlattened = (name, product) => {
      if (product) {
        flattenedProducts.push([
          name,
          product.price,
          product.quantity,
          product.promotion,
        ]);
      }
    };

    this.products.forEach((productInfo, name) => {
      const { base, promotion } = productInfo;

      addProductToFlattened(name, promotion);
      addProductToFlattened(name, base);
    });
    return flattenedProducts;
  }

  /**
   * 특정 상품의 기본 및 프로모션 재고 정보를 반환한다.
   * @param {string} name - 상품명
   * @returns {{ base: Product|null, promotion: Product|null }} 기본 및 프로모션 재고 정보
   */
  getProductsByName(name) {
    return this.products.get(name);
  }

  /**
   * 특정 상품의 기본 재고, 프로모션 재고, 전체 수량을 반환한다.
   * @param {string} name - 상품명
   * @returns {{ base: number, promotion: number, all: number }} 재고 정보
   */
  getProductQuantity(name) {
    const productInfo = this.getProductsByName(name);
    let [base, promotion] = [0, 0];

    if (productInfo.base) base = productInfo.base.quantity;
    if (productInfo.promotion) promotion = productInfo.promotion.quantity;

    return { base, promotion, all: base + promotion };
  }

  /**
   * 특정 상품의 기본 및 프로모션 수량을 감소시킨다.
   * @param {string} name - 상품명
   * @param {number} promoQuantity - 프로모션 수량 감소분
   * @param {number} baseQuantity - 기본 수량 감소분
   * @returns {void}
   */
  reduceProductQuantity(name, promoQuantity, baseQuantity) {
    const productInfo = this.getProductsByName(name);

    if (productInfo['promotion'])
      productInfo['promotion'].reduceQuantity(promoQuantity);
    if (productInfo['base']) productInfo['base'].reduceQuantity(baseQuantity);
  }

  #fillEmptyBaseQuantities() {
    this.products.forEach((productInfo) => {
      if (productInfo.promotion && !productInfo.base) {
        productInfo.base = new Product(
          productInfo.promotion.name,
          productInfo.promotion.price,
          0,
          null,
        );
      }
    });
  }

  #parseProductLine(line) {
    const [name, price, quantity, promotion] = line.split(',');
    return new Product(
      name,
      parseInt(price, 10),
      parseInt(quantity, 10),
      promotion === 'null' ? null : promotion,
    );
  }
}

export default Stock;
