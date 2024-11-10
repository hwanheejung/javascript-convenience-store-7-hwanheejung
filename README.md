# 기능 명세서

### 📍 Cashier (controller)

사용자와 상호작용하며 결제와 관련된 흐름을 관리하는 역할.  
Stock과 PromotionList 클래스를 사용해 재고 확인, 결제 금액 계산, 프로모션 적용 등을 담당한다.

> `stock`: Stock 클래스의 인스턴스  
> `promotionList`: Promotion 클래스의 인스턴스

- `start(): void`  
  결제 프로세스 시작

  - 상품 목록을 화면에 출력하고, 사용자로부터 구매할 상품과 수량을 입력받는다.
  - 구매할 상품에 대해 프로모션과 재고를 고려하여 최종 구매 수량을 계산하고, 결과를 출력한다.

- `displayAvailableProducts(): void`

  - 현재 재고 목록을 OutputView를 통해 출력한다.

- `adjustProductQuantities(productsToBuy: Array<{ name: string, quantity: number }>): Promise<Array<{ name: string, promoQuantity: number, baseQuantity: number }>>`

  - 사용자로부터 받은 구매 수량을 프로모션 및 재고에 따라 조정한다.
  - 각 상품에 대해 calculateQuantities 함수를 호출하여 최종 구매 수량을 계산한다.
  - 재고에서 최종 구매 수량을 차감하여 재고 상태를 최신으로 유지한다.

- `askForMembership(): void`
  - 멤버십 할인 여부를 사용자에게 확인받는다.

### 📍 Product (model)

상품의 정보를 저장하고, 관련 데이터를 관리한다.

> `name (string)`: 상품명  
> `price (number)`: 상품 가격  
> `quantity (number)`: 재고 수량  
> `promotion (string|null)`: 프로모션 정보

- `reduceQuantity(quantity: number): void`
  - 주어진 수량만큼 상품의 재고를 감소시킨다.

### 📍 Stock (model)

전체 상품의 재고 관리와 관련된 기능을 제공한다.

> `products (Map<string, Product[]>)`: name을 키로 하여 Product 객체 배열을 값으로 저장하는 Map.

- `loadProducts(): void`

  - 파일(products.md)에서 상품 목록을 읽어와 Product 객체로 변환하여 products Map에 저장.

- `getAllProducts(): Array<Array>`

  - 모든 상품의 정보(이름, 가격, 수량, 프로모션)를 배열 형태로 반환

- `getProductByName(name: string): Product[]`

  - 주어진 name에 해당하는 Product 객체 배열을 반환.

- `getProductQuantity(name: string): { base: number, promotion: number, all: number }`

  - 특정 상품의 기본 재고 수량, 프로모션 재고 수량, 전체 수량을 반환

- `reduceProductQuantity(name: string, promoQuantity: number, baseQuantity: number): void`
  - 특정 상품의 프로모션 수량과 기본 수량을 감소

### 📍 Promotion (model)

개별 프로모션 정보를 관리

> `name`: 프로모션 이름
> `buy`: 프로모션 적용을 위한 최소 구매 수량
> `get`: 프로모션으로 추가로 제공되는 수량
> `startDate`: 프로모션 시작일
> `endDate`: 프로모션 종료일

- `isActive(currentDate = DateTimes.now()): boolean`

  - 현재 날짜가 프로모션 기간 내에 있는지 확인

- `getDetails(): { buy: number, get: number, isActive: boolean }`
  - 프로모션의 조건(buy, get)과 현재 활성 상태를 반환

### 📍 PromotionList (model)

모든 프로모션 정책을 관리

> `promotions (Map<string, string>)`: 상품명별 프로모션 정책을 저장하는 Map

- `loadPromotions(): void`

  - 파일로부터 프로모션 데이터를 불러와 promotions 맵을 초기화

- `getPromotionByName(name: string): Promotion`
  - 주어진 이름의 프로모션 객체를 반환

<br/>
<br/>

# 최종 구매 수량 계산 로직

### 1. 재고 초과 확인 (`handleExcessStock`)

- 조건: `quantity > promoStock + baseStock`
- 설명: 구매하려는 수량이 전체 재고(promoStock+baseStock)보다 큰 경우 재고 부족을 사용자에게 알린다.
- 사용자 행동:
  - `Y`: 재고만큼 구매 (quantity = promoStock + baseStock)
  - `N`: 구매 취소 (quantity = 0)

### 2. 프로모션 미적용 처리

- 조건: 프로모션이 없는 경우 buy, get이 0
- 설명: 프로모션이 없을 경우, 모든 수량을 baseQuantity로 처리하고, promoQuantity는 0으로 처리한다.

### 3. 추가 프로모션 적용 확인 (`handleAdditionalPromotion`)

- 조건: `quantity % (buy + get) === buy`와 `quantity + get <= promoStock`
- 설명: 예를 들어 2+1인데 2개만 가져온 경우이며 동시에 1개를 추가해도 재고 부족이 아닐 경우, 사용자에게 추가 프로모션을 적용할지 확인한다. 또는, 2+1일 때 3개를 가져온 경우, 자동으로 프로모션이 적용된다.
- 사용자 행동:
  - `Y`: 추가 프로모션 적용 (quantity = quantity + get)
  - `N`: 기존 수량으로 유지 (quantity = quantity)

### 4. 재고 부족 시 기본 수량 설정

- 조건: `quantity > promoStock`
- 설명: 프로모션 재고가 부족한 경우, 부족한 부분을 baseQuantity로 충당하기 위해 기본 수량(defaultBaseQuantity)를 설정한다.
- 결과: defaultBaseQuantity = quantity - promoStock / 재고가 충분하면 defaultBaseQuantity = 0

### 5. 최종 promoQuantity, baseQuantity 계산

- 계산식:

```javascript
const promoQuantity =
  quantity -
  defaultBaseQuantity -
  ((quantity - defaultBaseQuantity) % (buy + get));
const baseQuantity = quantity - promoQuantity;
```

- 설명: 프로모션 수량을 계산하고, 남은 수량을 정가로 구매할지 확인한다.
- 사용자 행동:
  - `quantity - promoQuanity === 0`: baseQ = 0 (남은 수량이 없으므로 정가 구매는 없음)
  - `quantity - promoQuantity > 0`: 남은 수량을 정가로 구매할지 확인
    - `Y`: baseQuantity = quantity - promoQuantity
    - `N`: baseQuantity = 0
