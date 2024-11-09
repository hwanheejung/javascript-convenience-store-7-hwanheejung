import Stock from '../models/Stock.js';

class Cashier {
  constructor() {
    this.Stock = new Stock();
  }

  start() {
    this.Stock.loadProducts();
  }

  displayProducts() {}
}

export default Cashier;
