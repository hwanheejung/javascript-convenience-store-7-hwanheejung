import Product from '../../src/models/Product';

describe('models/Product', () => {
  describe('reductQuantity()', () => {
    it.each([
      [100, 10, 90],
      [50, 50, 0],
    ])(
      `should reduce the quantity correctly from %i by %i to %i`,
      (initialQuantity, amountToReduce, expectedQuantity) => {
        const product = new Product('콜라', 1500, initialQuantity);
        product.reduceQuantity(amountToReduce);
        expect(product.quantity).toBe(expectedQuantity);
      },
    );

    it('should handle consecutive reductions correctly', () => {
      const product = new Product('콜라', 1500, 100);

      product.reduceQuantity(20);
      product.reduceQuantity(30);

      expect(product.quantity).toBe(50);
    });
  });
});
