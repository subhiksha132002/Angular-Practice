import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-component',
  templateUrl: './products-component.html',
  styleUrls: ['./products-component.css']
})
export class ProductsComponent {

  products = signal<any[]>([]); 
  loading = signal(true); 
  error = signal<string | null>(null); 

  private http = inject(HttpClient); 
  router = inject(Router); 
  quantityMap: { [productId: number]: number } = {}; 

  constructor() {
    this.loadProducts();
  }

  
  loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any>("https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts").subscribe({
      next: (response) => {
        this.products.set(response.data); 
        this.loading.set(false);

        
        this.products().forEach(product => {
          this.quantityMap[product.productId] = 1; 
        });
      },
      error: (err) => {
        this.error.set('Failed to fetch products');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  
  increaseQuantity(productId: number) {
    if (this.quantityMap[productId] < 99) { 
      this.quantityMap[productId]++;
    }
  }

  
  decreaseQuantity(productId: number) {
    if (this.quantityMap[productId] > 1) { 
      this.quantityMap[productId]--;
    }
  }

  
  addToCart(product: any) {
    const cartItem = {
      CartId: 0,  
      CustId: 0,  
      ProductId: product.productId,  
      Quantity: this.quantityMap[product.productId], 
      AddedDate: new Date().toISOString()  
    };

    this.http.post<any>("https://freeapi.miniprojectideas.com/api/amazon/AddToCart", cartItem).subscribe({
      next: (response) => {
        alert('Product added to cart');
        console.log(response);  
        this.router.navigate(['/cart']);  
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
        alert('Failed to add product to cart');
      }
    });
  }


}
