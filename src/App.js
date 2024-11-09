import Cashier from './controllers/CashierController.js';

class App {
  constructor() {
    this.cashier = new Cashier();
  }
  async run() {
    this.cashier.start();
  }
}

export default App;
