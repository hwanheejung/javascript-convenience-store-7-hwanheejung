import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './Product.js';

class Stock {
  constructor() {
    this.products = new Map();
  }

  loadProducts() {
    const filePath = this.#getFilePath();
    const productLines = fs
      .readFileSync(filePath, 'utf-8')
      .toString()
      .trim()
      .split('\n')
      .slice(1);

    productLines.forEach((line) => {
      const product = this.#parseProductLine(line);

      if (!this.products.has(product.name)) {
        this.products.set(product.name, []);
      }
      this.products.get(product.name).push(product);
    });

    Console.print(this.products);
  }

  #getFilePath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, '../../public/products.md');
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
