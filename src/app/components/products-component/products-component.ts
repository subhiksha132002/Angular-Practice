import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-component',
  templateUrl: './products-component.html',
  styleUrls: ['./products-component.css']
})
export class ProductsComponent implements OnInit {

  products = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private http = inject(HttpClient);
  router = inject(Router);
  quantityMap: { [ProductId: number]: number } = {};

  constructor() { }

  ngOnInit() {
    this.loadProducts();
  }


  loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any>("http://localhost:5160/api/Products").subscribe({
      next: (response) => {

        if (Array.isArray(response)) {
          this.products.set(response);
          this.loading.set(false);

          this.products().forEach(product => {
            this.quantityMap[product.productId] = 1;
          });
        } else {
          this.error.set('Invalid response format. Expected an array of products.');
          this.loading.set(false); // Set loading to false even in case of an error
        }
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

      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
        alert('Failed to add product to cart');
      }
    });
  }


}
