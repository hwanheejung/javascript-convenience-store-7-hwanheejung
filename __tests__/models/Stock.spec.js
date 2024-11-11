import Product from '../../src/models/Product.js';
import Stock from '../../src/models/Stock.js';

describe('models/Stock', () => {
  let stock;

  beforeEach(() => {
    stock = new Stock();
    stock.loadProducts();
  });

  describe('getProductsByName()', () => {
    it('should return the base and promotion product info', () => {
      const productInfo = stock.getProductsByName('사이다');

      expect(productInfo).toEqual({
        base: expect.any(Product),
        promotion: expect.any(Product),
      });
      expect(productInfo['base'].name).toBe('사이다');
      expect(productInfo['base'].price).toBe(1000);
      expect(productInfo['base'].quantity).toBe(7);
      expect(productInfo['promotion'].quantity).toBe(8);
      expect(productInfo['promotion'].name).toBe('사이다');
      expect(productInfo['promotion'].promotion).toBe('탄산2+1');
    });

    it('should return undefined for a non-existent product', () => {
      const productInfo = stock.getProductsByName('없는상품');
      expect(productInfo).toBeUndefined();
    });
  });

  describe('getProductQuantity()', () => {
    it('should return the correct quantities', () => {
      const quantities = stock.getProductQuantity('사이다');

      expect(quantities).toEqual({
        base: 7,
        promotion: 8,
        all: 15,
      });
    });

    it('should return zero for all quantities if the product does not exist', () => {
      const quantities = stock.getProductQuantity('없는상품');

      expect(quantities).toEqual({
        base: 0,
        promotion: 0,
        all: 0,
      });
    });
  });

  describe('reduceProductQuantity()', () => {
    it('should reduce the base quantity of a product correctly', () => {
      stock.reduceProductQuantity('콜라', 0, 10);
      const quantities = stock.getProductQuantity('콜라');

      expect(quantities.base).toBe(0);
    });

    it('should reduce the promotion quantity of a product correctly', () => {
      stock.reduceProductQuantity('사이다', 5, 0);
      const quantities = stock.getProductQuantity('사이다');

      expect(quantities.promotion).toBe(3);
    });

    it('should handle reductions in both base and promotion quantities', () => {
      stock.reduceProductQuantity('컵라면', 1, 5);
      const quantities = stock.getProductQuantity('컵라면');

      expect(quantities).toEqual({
        base: 5,
        promotion: 0,
        all: 5,
      });
    });
  });
});
