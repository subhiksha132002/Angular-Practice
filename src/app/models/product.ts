export class ProductModel {
  ProductId: number;
  ProductSku: string;
  ProductName: string;
  ProductPrice: number;
  ProductShortName: string;
  ProductDescription: string;
  CreatedDate: string;
  DeliveryTimeSpan: string;
  CategoryId: number;
  ProductImageUrl: string;

  constructor(){
    this.ProductId = 0;
  this.ProductSku = "";
  this.ProductName = "";
  this.ProductPrice = 0;
  this.ProductShortName =  "";
  this.ProductDescription =  "";
  this.CreatedDate =  "";
  this.DeliveryTimeSpan= "";
  this.CategoryId= 0;
  this.ProductImageUrl= "";
  }
}

export interface APIResponse{
    message:string;
    result: boolean;
    data:any;
}