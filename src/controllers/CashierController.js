import Stock from '../models/Stock.js';
import OutputView from '../views/OutputView.js';

class Cashier {
  constructor() {
    this.Stock = new Stock();
  }

  start() {
    this.Stock.loadProducts();
    this.displayAvailableProducts();
  }

  displayAvailableProducts() {
    const products = this.Stock.getAllProducts();
    OutputView.availableProducts(products);
  }
}

export default Cashier;
