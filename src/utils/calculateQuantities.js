import InputView from '../views/InputView.js';

const calculateQuantities = async (
  name,
  quantity,
  promoStock,
  baseStock,
  buy,
  get,
) => {
  quantity = await handleExcessStock(quantity, promoStock, baseStock);
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

const calculateBaseQuantity = async (quantity, name, promoQuantity) => {
  if (quantity - promoQuantity === 0) return 0;
  const answer = await InputView.confirmBase(name, quantity - promoQuantity);
  if (answer === 'Y') return quantity - promoQuantity;
  return 0;
};

const handleExcessStock = async (quantity, promoStock, baseStock) => {
  const availableQuantity = promoStock + baseStock;
  if (quantity > availableQuantity) {
    const validQuantity = await InputView.confirmStock(availableQuantity);
    return validQuantity;
  }
  return quantity;
  // if (quantity > promoStock + baseStock) {
  //   const answer = await InputView.confirmStock(promoStock + baseStock);
  //   if (answer === 'Y') return promoStock + baseStock;
  //   return 0;
  // }
  // return quantity;
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
