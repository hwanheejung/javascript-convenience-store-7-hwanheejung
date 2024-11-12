import ReceiptService from '../services/ReceiptService.js';
import OutputView from '../views/OutputView.js';

class Receipt {
  constructor() {
    this.service = new ReceiptService();
    this.receiptData = {};
  }

  /**
   * 영수증을 출력한다.
   * @param {Array} products - 구매한 상품 리스트
   * @param {number} membershipDiscount - 멤버십 할인 금액
   */
  printReceipt(products, membershipDiscount) {
    this.receiptData = this.service.generateReceiptData(
      products,
      membershipDiscount,
    );
    OutputView.receipt(this.receiptData);
  }
}

export default Receipt;
