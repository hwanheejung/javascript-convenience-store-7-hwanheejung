import InputView from '../views/InputView.js';

const calculateQuantities = async (
  name,
  quantity,
  promoStock,
  baseStock,
  buy,
  get,
) => {
  if (quantity === 0) return { baseQuantity: 0, promoQuantity: 0 };
  if (!buy && !get) return { baseQuantity: quantity, promoQuantity: 0 };
  quantity = await handleAdditionalPromotion(
    name,
    quantity,
    buy,
    get,
    promoStock,
  );
  const promoQuantity = calculatePromoQuantity(quantity, promoStock, buy, get);
  const baseQuantity = await calculateBaseQuantity(
    quantity,
    name,
    promoQuantity,
    promoStock,
    baseStock,
  );

  return { baseQuantity, promoQuantity };
};

const calculatePromoQuantity = (quantity, promoStock, buy, get) => {
  let defaultBaseQuantity = 0;
  if (quantity > promoStock) defaultBaseQuantity = quantity - promoStock;

  const promoQuantity =
    quantity -
    defaultBaseQuantity -
    ((quantity - defaultBaseQuantity) % (buy + get));

  return promoQuantity;
};

const calculateBaseQuantity = async (
  quantity,
  name,
  promoQuantity,
  promoStock,
  baseStock,
) => {
  let baseQuantity = quantity - promoQuantity;
  if (baseQuantity === 0) return 0;
  if (quantity <= promoStock) return baseQuantity;
  const answer = await InputView.confirmBase(name, baseQuantity);
  if (answer !== 'Y') return 0;
  if (baseQuantity > baseStock) {
    const excessAnswer = await InputView.confirmExcessBaseStock(baseStock);
    if (excessAnswer === 'Y') return baseStock;
    return 0;
  }
  return baseQuantity;
};

const handleAdditionalPromotion = async (
  name,
  quantity,
  buy,
  get,
  promoStock,
) => {
  const isPromotionAvailable =
    quantity % (buy + get) === buy && quantity + get <= promoStock;
  if (isPromotionAvailable) {
    const answer = await InputView.confirmPromo(name, get);
    if (answer === 'Y') return quantity + get;
  }
  return quantity;
};

export default calculateQuantities;
