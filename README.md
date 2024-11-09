# 기능 명세서

### 📍 Product (model)

상품의 정보를 저장하고, 관련 데이터를 관리한다.

> `name (string)`: 상품명  
> `price (number)`: 상품 가격  
> `quantity (number)`: 재고 수량  
> `promotion (string|null)`: 프로모션 정보

### 📍 Stock (model)

상품 목록을 관리한다.

> `products (Map<string, Product[]>)`: name을 키로 하여 Product 객체 배열을 값으로 저장하는 Map.

- `loadProducts(): void`  
  파일(products.md)에서 상품 목록을 읽어와 Product 객체로 변환하여 products Map에 저장.

- `getProductByName(name: string): Product[]`  
  주어진 name에 해당하는 Product 객체 배열을 반환.

- `displayAvailableProducts(): void`
  현재 재고 상태와 프로모션 정보를 출력.

- `checkProductQuantity(name: string, amount: number): boolean`  
  특정 상품의 재고가 주어진 수량을 충족하는지 확인.

- `updateProductQuantity(name: string, amount: number, add: boolean): void`  
  특정 상품의 재고 수량을 amount만큼 추가하거나 차감.

### 📍 Cashier (controller)

사용자와 상호작용하며 결제와 관련된 흐름을 관리하는 역할.  
Stock과 Checkout 클래스를 사용해 재고 확인, 결제 금액 계산, 할인 적용 등을 담당한다.

> `stock (Stock)`: Stock 클래스의 인스턴스  
> `checkout (Checkout)`: Checkout 클래스의 인스턴스

- `start(): void`  
  결제 프로세스를 시작하며, 상품 목록 출력 및 사용자 입력을 통해 구매할 상품을 선택.
- `promptForProducts(): Product[]`  
  사용자에게 구매할 상품과 수량을 입력받아 Product 객체 배열로 반환.
- `handlePromotions(products: Product[]): void`  
  선택된 상품에 프로모션 적용 여부를 확인하고, 추가 수량 요청 및 프로모션 없는 구매 여부를 확인.
- `promptForMembership(): boolean`  
  멤버십 할인 적용 여부를 사용자에게 확인.
- `displayReceipt(): void`  
  Checkout에서 계산된 영수증을 출력.
- `askContinueShopping(): boolean`  
  추가 구매 여부를 사용자에게 확인.

### 📍 Checkout (controller)

선택된 상품에 대해 결제 금액을 계산하고, 프로모션 및 멤버십 할인을 적용하여 최종 결제 금액을 산출하는 역할을 수행한다.

> `productsToBuy (Product[])`: 구매할 상품 목록
> `promotedProducts (Product[])`: 프로모션이 적용된 상품 목록
> `isMember (boolean)`: 멤버십 할인 여부

- `addProductsToBuy(products: Product[]): void`  
  사용자가 선택한 상품 목록을 결제에 추가.
- `applyPromotions(): void`  
  productsToBuy 목록에서 프로모션 조건을 충족하는 상품에 대해 혜택을 적용.
- `applyMembershipDiscount(): void`  
  멤버십 할인을 적용하여 총 결제 금액에서 추가 할인.
- `calculateFinalAmount(): number`  
  최종 결제 금액을 계산하여 반환.
- `generateReceipt(): string`
  총구매액, 행사할인, 멤버십할인, 내실돈을 포함한 영수증을 생성하여 반환.
