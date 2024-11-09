class Product {
  constructor(name, price, quantity, promotion = null) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.promotion = promotion;
  }
}

export default Product;
