import Cashier from './controllers/CashierController.js';
import PromotionList from './models/PromotionList.js';
import Stock from './models/Stock.js';

class App {
  constructor() {
    this.stock = new Stock();
    this.promotionList = new PromotionList();
  }

  async run() {
    this.stock.loadProducts();
    this.promotionList.loadPromotions();

    const cashier = new Cashier(this.stock, this.promotionList);
    cashier.start();
  }
}

export default App;
