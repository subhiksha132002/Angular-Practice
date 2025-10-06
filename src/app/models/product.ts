export class ProductModel {
  ProductId: number;
  ProductName: string;
  ProductPrice: number;
  ProductDescription: string;
  ImageUrl: string;
  StockQuantity: number;

  constructor() {
    this.ProductId = 0;
    this.ProductName = "";
    this.ProductPrice = 0;
    this.ProductDescription = "";
    this.ImageUrl = "";
    this.StockQuantity = 0;
  }
}