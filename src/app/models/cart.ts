export class AddCartItem {
  CustomerId: number;
  ProductId: number;
  Quantity: number;

  constructor() {
    this.CustomerId = 0;
    this.ProductId = 0;
    this.Quantity = 1;
  }
}

export class CartItem {
  ProductId: number;
  ProductName: string;
  Quantity: number;

  constructor() {
    this.ProductId = 0;
    this.ProductName = "";
    this.Quantity = 0;
  }
}

export class Cart {
  CartId: number;
  CustomerId: number;
  CustomerName: string;
  Email: string;
  Items: CartItem[];

  constructor() {
    this.CartId = 0;
    this.CustomerId = 0;
    this.CustomerName = "";
    this.Email = "";
    this.Items = [];
  }
}