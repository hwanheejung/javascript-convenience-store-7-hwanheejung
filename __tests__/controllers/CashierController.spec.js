import Cashier from '../../src/controllers/CashierController.js';
import PromotionList from '../../src/models/PromotionList.js';
import Receipt from '../../src/models/Receipt.js';
import Stock from '../../src/models/Stock.js';
import CashierService from '../../src/services/CashierService.js';
import InputView from '../../src/views/InputView.js';
import OutputView from '../../src/views/OutputView.js';

jest.mock('../../src/services/CashierService.js');
jest.mock('../../src/views/InputView.js');
jest.mock('../../src/views/OutputView.js');
jest.mock('../../src/services/ReceiptService.js');
jest.mock('../../src/models/Receipt.js');

describe('Cashier', () => {
  let stockMock, promotionListMock, cashier, serviceMock, receiptMock;

  beforeEach(() => {
    stockMock = new Stock();
    promotionListMock = new PromotionList();
    serviceMock = new CashierService(stockMock, promotionListMock);
    receiptMock = new Receipt();
    cashier = new Cashier(stockMock, promotionListMock);
    cashier.service = serviceMock;
    cashier.receipt = receiptMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('displayAvailableProducts', () => {
    it('should display available products from stock', () => {
      const products = [{ name: '콜라', price: 1500, quantity: 20 }];
      jest.spyOn(stockMock, 'getAllProducts').mockReturnValue(products);

      cashier.displayAvailableProducts();
      expect(stockMock.getAllProducts).toHaveBeenCalled();
      expect(OutputView.availableProducts).toHaveBeenCalledWith(products);
    });
  });

  describe('collectProductsToBuy', () => {
    it('should collect and format products to buy', async () => {
      InputView.productsToBuy.mockResolvedValue(['[콜라-2]', '[사이다-3]']);
      const products = await cashier.collectProductsToBuy();

      expect(InputView.productsToBuy).toHaveBeenCalledWith(stockMock);
      expect(products).toEqual([
        { name: '콜라', quantity: 2 },
        { name: '사이다', quantity: 3 },
      ]);
    });
  });

  describe('calculateMembershipDiscount', () => {
    it('shuold return calculated value when user input is Y', async () => {
      const adjustedProducts = [
        { name: '콜라', promoQuantity: 2, baseQuantity: 1, price: 1500 },
      ];
      InputView.askForMembership.mockResolvedValue('Y');
      serviceMock.calculateMembershipDiscount.mockResolvedValue(500);

      const discount =
        await cashier.calculateMembershipDiscount(adjustedProducts);

      expect(InputView.askForMembership).toHaveBeenCalled();
      expect(serviceMock.calculateMembershipDiscount).toHaveBeenCalledWith(
        adjustedProducts,
      );
      expect(discount).toBe(500);
    });

    it('should return 0 when user input is N', async () => {
      const adjustedProducts = [
        { name: '콜라', promoQuantity: 2, baseQuantity: 1, price: 1500 },
      ];
      InputView.askForMembership.mockResolvedValue('N');

      const discount =
        await cashier.calculateMembershipDiscount(adjustedProducts);

      expect(InputView.askForMembership).toHaveBeenCalled();
      expect(discount).toBe(0);
    });
  });

  describe('printReceipt', () => {
    it('should call Receipt.printReceipt', () => {
      const adjustedProducts = [
        { name: '콜라', promoQuantity: 2, baseQuantity: 1, price: 1500 },
      ];
      const membershipDiscount = 500;

      cashier.printReceipt(adjustedProducts, membershipDiscount);

      expect(receiptMock.printReceipt).toHaveBeenCalledWith(
        adjustedProducts,
        membershipDiscount,
      );
    });
  });

  describe('confirmRestart', () => {
    it('when user input is N', async () => {
      InputView.askForStartAgain.mockResolvedValue('N');
      const result = await cashier.confirmRestart();

      expect(InputView.askForStartAgain).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('when user input is Y', async () => {
      InputView.askForStartAgain.mockResolvedValue('Y');
      const result = await cashier.confirmRestart();

      expect(InputView.askForStartAgain).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
