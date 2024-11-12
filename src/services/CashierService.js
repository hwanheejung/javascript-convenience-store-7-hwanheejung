import calculateMembership from '../utils/calculateMembership.js';
import calculateQuantities from '../utils/calculateQuantities.js';

class CashierService {
  constructor(stock, promotionList) {
    this.stock = stock;
    this.promotionList = promotionList;
  }

  async getAdjustedProducts(productsToBuy) {
    const adjustedProducts = [];

    for (const { name, quantity } of productsToBuy) {
      const adjustedProduct = await this.getAdjustedProduct(name, quantity);
      adjustedProducts.push(adjustedProduct);
      this.stock.reduceProductQuantity(
        name,
        adjustedProduct.promoQuantity,
        adjustedProduct.baseQuantity,
      );
    }

    return adjustedProducts;
  }

  async getAdjustedProduct(name, quantity) {
    const product = this.stock.getProductsByName(name);
    const { base: baseStock, promotion: promoStock } =
      this.stock.getProductQuantity(name);
    const { buy, get } = this.getProductBuyGet(product);
    const { promoQuantity, baseQuantity } = await calculateQuantities(
      name,
      quantity,
      promoStock,
      baseStock,
      buy,
      get,
    );
    const price = product['base'].price;

    return { name, promoQuantity, baseQuantity, price, buy, get };
  }

  getProductBuyGet(product) {
    const promotionName = product['promotion']?.promotion;
    if (!promotionName) return { buy: 0, get: 0 };

    const promotion = this.promotionList.getPromotionByName(promotionName);
    const promotionDetails = promotion?.getDetails();

    return {
      buy: promotionDetails?.buy || 0,
      get: promotionDetails?.get || 0,
    };
  }

  async calculateMembershipDiscount(products) {
    const amount = this.calculateTotalAmount(products);
    return calculateMembership(amount);
  }

  calculateTotalAmount(products) {
    return products.reduce(
      (acc, { price, promoQuantity, baseQuantity }) =>
        acc + price * (promoQuantity + baseQuantity),
      0,
    );
  }
}

export default CashierService;
