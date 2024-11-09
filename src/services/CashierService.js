import InputView from '../views/InputView.js';

class CashierService {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
  }

  async adjustQuantityForStock(name, quantity) {
    const availableQuantity = this.stock.getProductQuantity(name);
    if (quantity > availableQuantity) {
      const input = await InputView.confirmStockAdjustment(availableQuantity);
      return input === 'Y' ? availableQuantity : 0;
    }
    return quantity;
  }

  async adjustQuantityForPromotion(name, quantity) {
    const promotionProduct = this.stock.getProductsByName(name)?.promotion;
    if (promotionProduct) {
      const promotion = this.promotionList.getPromotionByName(
        promotionProduct.promotion,
      );
      if (quantity === promotion.buy) {
        const input = await InputView.confirmPromotionAddition(
          name,
          promotion.get,
        );
        return input === 'Y' ? quantity + promotion.get : quantity;
      }
    }
    return quantity;
  }
}

export default CashierService;
