import Cashier from './controllers/CashierController.js';
import PromotionList from './models/PromotionList.js';
import Stock from './models/Stock.js';

class App {
  /** @type {Stock} */ stock;
  /** @type {PromotionList} */ promotionList;

  constructor() {
    this.stock = new Stock();
    this.promotionList = new PromotionList();
  }

  async run() {
    this.stock.loadProducts();
    this.promotionList.loadPromotions();

    const cashier = new Cashier(this.stock, this.promotionList);
    await cashier.start();
  }
}

export default App;
