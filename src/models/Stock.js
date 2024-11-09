import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './Product.js';

class Stock {
  products;

  constructor() {
    this.products = new Map();
  }

  loadProducts() {
    const productLines = this.#readProductsFromFile();

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
    return this.products.filter((product) => product.name === name);
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

  #readProductsFromFile() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, '../../public/products.md');

    return fs
      .readFileSync(filePath, 'utf-8')
      .toString()
      .trim()
      .split('\n')
      .slice(1);
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
