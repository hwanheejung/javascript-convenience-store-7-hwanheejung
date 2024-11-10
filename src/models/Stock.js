import Product from './Product.js';
import getDataFromFile from '../utils/getDataFromFile.js';

class Stock {
  products;

  constructor() {
    this.products = new Map();
  }

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

  getProductsByName(name) {
    return this.products.get(name);
  }

  getProductQuantity(name) {
    const productInfo = this.getProductsByName(name);
    let [base, promotion] = [0, 0];

    if (productInfo.base) base = productInfo.base.quantity;
    if (productInfo.promotion) promotion = productInfo.promotion.quantity;

    return { base, promotion, all: base + promotion };
  }

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
