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

### 📍 Receipt (model)

영수증 데이터를 생성하고 출력하는 역할

> `service (ReceiptService)`: 영수증 데이터 생성을 담당하는 서비스 클래스 인스턴스
> `receiptData (Object)`: 생성된 영수증 데이터를 저장하는 객체

- `printReceipt(products: Array, membershipDiscount: number): void`

  - ReceiptService의 generateReceiptData 메서드를 호출하여 products와 membershipDiscount를 바탕으로 영수증 데이터를 생성하고 receiptData에 저장한다.
  - 생성된 receiptData를 OutputView를 통해 출력하여 영수증 정보를 사용자에게 보여준다.

<br/>
<br/>

# 최종 구매 수량 계산 로직

### 1. 수량이 0인지 확인:

- quantity가 0이면 { baseQuantity: 0, promoQuantity: 0 }을 반환

### 2. 프로모션 조건 확인:

- buy와 get 조건이 없는 경우 { baseQuantity: quantity, promoQuantity: 0 }을 반환
- 즉, 프로모션 없이 기본 수량으로만 계산한다

### 3. 추가 프로모션 처리 (handleAdditionalPromotion):

- handleAdditionalPromotion 함수를 통해 추가 프로모션이 가능한지 확인하고, 추가 수량을 결정한다.
- 사용자가 프로모션을 적용하기로 선택하면, quantity에 get 수량이 추가된다.

### 4. 프로모션 수량 계산 (calculatePromoQuantity):

- calculatePromoQuantity 함수를 사용하여 최종 프로모션 수량을 계산한다.
- quantity와 promoStock, buy, get 조건을 기반으로 프로모션 상품 수량을 계산하여 promoQuantity를 얻는다.

### 5. 기본 수량 계산 (calculateBaseQuantity):

- calculateBaseQuantity 함수: 최종적인 기본 수량을 결정하는 함수
- promoQuantity를 제외한 나머지 수량이 기본 수량 (baseQuantity)이 됨.
  - 사용자 확인 절차:
    - 만약 기본 수량이 promoStock보다 크다면, InputView.confirmBase로 사용자에게 확인을 요청하여 'Y' 응답 시에만 기본 수량을 유지
    - 또한 기본 수량이 baseStock보다 많은 경우, InputView.confirmExcessBaseStock을 호출해 추가 수량을 허용할지 사용자에게 물어보고, 'Y' 응답 시 baseStock으로 제한

### 6. 결과 반환:

- 최종적으로 { baseQuantity, promoQuantity } 객체를 반환하여 기본 수량과 프로모션 수량을 함께 제공
