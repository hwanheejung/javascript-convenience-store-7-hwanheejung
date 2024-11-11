export const PROMPT = Object.freeze({
  WELCOME: '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다. \n',
  ASK_PRODUCTS_TO_BUY:
    '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  ASK_BASE_STOCK: (availableQuantity) =>
    `기본 상품의 재고가 부족합니다. 남아있는 재고(${availableQuantity}개)만큼이라도 구매하시겠습니까? (Y/N)\n`,
  ASK_PROMO_ADDITION: (name, get) =>
    `현재 ${name}은(는) ${get}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
  ASK_PROMO_BASE_PURCHASE: (name, quantity) =>
    `현재 ${name} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
  ASK_MEMBERSHIP: '멤버십 할인을 받으시겠습니까? (Y/N)\n',
  ASK_START_AGAIN: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
  GOODBYE: '감사합니다. 이용해주셔서 감사합니다.',
});

export const ERROR = Object.freeze({
  INVALID_YN: '[ERROR] Y 또는 N을 입력해 주세요.',
  INVALID_PRODUCT_FORMAT:
    '[ERROR] 올바른 형식으로 입력해 주세요. (예: [사이다-2],[감자칩-1])',
  EXCEEDS_STOCK_QUANTITY: `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`,
  PRODUCT_NOT_FOUND: (name) =>
    `[ERROR] ${name}은(는) 존재하지 않는 상품입니다.`,
});
