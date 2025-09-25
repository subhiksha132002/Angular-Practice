import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  products = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  orderPlaced = signal(false);

  private http = inject(HttpClient);

  constructor() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any>("https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems").subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.loading.set(false);
  },
  error: (err) => {
        this.error.set('Failed to fetch products');
this.loading.set(false);
console.error(err);
      }
    });
}

calculateTotalPrice() {
    return this.products().reduce((total, product) => {
      return total + (product.quantity * product.productPrice);
    }, 0);
  }

placeOrder(){
  alert("Order Placed Successfully");

  this.orderPlaced.set(true);  

  this.products.set([]); 
}


}
