import Receipt from '../../src/models/Receipt.js';
import OutputView from '../../src/views/OutputView.js';

jest.mock('../../src/views/OutputView.js');

describe('models/Receipt', () => {
  let receipt;

  beforeEach(() => {
    receipt = new Receipt();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('printReceipt()', () => {
    it('should generate receiptData correctly and call OutputView.receipt', () => {
      const products = [
        {
          name: '콜라',
          promoQuantity: 3,
          baseQuantity: 2,
          price: 1500,
          buy: 2,
          get: 1,
        },
        {
          name: '사이다',
          promoQuantity: 2,
          baseQuantity: 0,
          price: 1000,
          buy: 1,
          get: 1,
        },
      ];
      const membershipDiscount = 2850;

      receipt.printReceipt(products, membershipDiscount);

      expect(receipt.receiptData).toEqual({
        items: [
          { name: '콜라', quantity: 5, price: 7500 }, // 1500 * 5
          { name: '사이다', quantity: 2, price: 2000 }, // 1000 * 2
        ],
        totalPrice: 9500, // 7500 + 2000
        promotionDiscount: 2500, // 콜라 1 free, 사이다 1 free
        membershipDiscount: 2850,
        finalPrice: 4150, // totalPrice - promotionDiscount - membershipDiscount
        freeItems: [
          { name: '콜라', freeQuantity: 1 },
          { name: '사이다', freeQuantity: 1 },
        ],
      });

      expect(OutputView.receipt).toHaveBeenCalledWith(receipt.receiptData);
    });
  });
});
