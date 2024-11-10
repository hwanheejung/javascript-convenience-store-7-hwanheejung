import InputView from '../views/InputView.js';

const calculateQuantities = async (
  name,
  quantity,
  promoStock,
  baseStock,
  buy,
  get,
) => {
  quantity = await confirmPurchaseUpToStock(quantity, promoStock, baseStock);
  if (quantity === 0) return { baseQuantity: 0, promoQuantity: 0 };

  if (!buy && !get) {
    return { baseQuantity: quantity, promoQuantity: 0 };
  }

  if (quantity % (buy + get) === buy) {
    quantity = await confirmPromotionAddition(name, quantity, get, promoStock);
  }
  let defaultBaseQuantity = 0;
  if (quantity > promoStock) defaultBaseQuantity = quantity - promoStock;

  let promoQuantity =
    quantity -
    defaultBaseQuantity -
    ((quantity - defaultBaseQuantity) % (buy + get));

  if (quantity - promoQuantity === 0) {
    return { baseQuantity: 0, promoQuantity };
  }
  const answer = await InputView.confirmBasePurchase(
    name,
    quantity - promoQuantity,
  );
  if (answer === 'Y')
    return { baseQuantity: quantity - promoQuantity, promoQuantity };
  return { baseQuantity: 0, promoQuantity };
};

const confirmPurchaseUpToStock = async (quantity, promoStock, baseStock) => {
  if (quantity > promoStock + baseStock) {
    const answer = await InputView.confirmStockAdjustment(
      promoStock + baseStock,
    );
    if (answer === 'Y') return promoStock + baseStock;
    return 0;
  }
  return quantity;
};

const confirmPromotionAddition = async (name, quantity, get, promoStock) => {
  if (quantity + get <= promoStock) {
    const answer = await InputView.confirmAddGet(name, get);
    if (answer === 'Y') return quantity + get;
  }
  return quantity;
};

export default calculateQuantities;
