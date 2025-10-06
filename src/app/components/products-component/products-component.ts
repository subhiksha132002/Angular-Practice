import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductModel } from '../../models/product';
import {AddCartItem} from '../../models/cart'

@Component({
  selector: 'app-products-component',
  templateUrl: './products-component.html',
  styleUrls: ['./products-component.css']
})
export class ProductsComponent implements OnInit {

  products = signal<ProductModel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private http = inject(HttpClient);
  router = inject(Router);

  private apiUrl = 'http://localhost:5160/api';

  private tempCustomerId = 1;

  constructor() { }

  ngOnInit() {
    this.loadProducts();
  }


  loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    console.log('Attempting to fetch products from:', `${this.apiUrl}/Products`);

    this.http.get<ProductModel[]>(`${this.apiUrl}/Products`).subscribe({
      next: (response) => {
        console.log('Products response:', response);
        if (Array.isArray(response)) {
          this.products.set(response);
          this.loading.set(false);
          console.log('Products loaded successfully:', this.products());
        } else {
          this.error.set('Invalid response format. Expected an array of products.');
          this.loading.set(false); // Set loading to false even in case of an error
          console.error('Invalid response format:', response);
        }
      },
      error: (err) => {
        this.error.set('Failed to fetch products');
        this.loading.set(false);
        console.error(err);
        console.error('Error fetching products:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
      }
    });
  }

  addToCart(product: ProductModel) {
    const cartItem: AddCartItem = {
      CustomerId: this.tempCustomerId,
      ProductId: product.ProductId,
      Quantity: 1
    };

    console.log('Adding to cart:', cartItem);

    this.http.post<any>(`${this.apiUrl}/Carts/AddItemToCart`, cartItem).subscribe({
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
