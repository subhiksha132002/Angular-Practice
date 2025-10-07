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
  CartItemId:number;
  ProductId: number;
  ProductName: string;
  ProductPrice: number;
  ImageUrl: string;
  Quantity: number;

  constructor() {
    this.CartItemId = 0;
    this.ProductId = 0;
    this.ProductName = "";
    this.ProductPrice = 0;
    this.ImageUrl = "";
    this.Quantity = 0;
  }
}

export class CartModel {
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

export class UpdateCartItemModel {
  CustomerId: number;
  ProductId: number;
  Quantity: number;

  constructor() {
    this.CustomerId = 0;
    this.ProductId = 0;
    this.Quantity = 0;
  }
}

export class PlaceOrderModel {
  CustomerId: number;

  constructor(customerId: number) {
    this.CustomerId = customerId;
  }
}
