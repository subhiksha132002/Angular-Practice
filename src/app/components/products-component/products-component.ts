import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-component',
  templateUrl: './products-component.html',
  styleUrls: ['./products-component.css']
})
export class ProductsComponent {

  products = signal<any[]>([]); // Store products
  loading = signal(true); // Store loading state
  error = signal<string | null>(null); // Store error message

  private http = inject(HttpClient); // HttpClient for making API calls
  router = inject(Router); // Router for navigation (e.g., redirecting after adding to cart)

  constructor() {
    this.loadProducts();
  }

  // Load products from the API
  loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any>("https://freeapi.miniprojectideas.com/api/amazon/GetAllProducts").subscribe({
      next: (response) => {
        this.products.set(response.data); // Store product data in the signal
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to fetch products');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  increaseQuantity(product: any) {
    if (product.quantity < product.maxQuantity) {
      product.quantity++; // Increase quantity
      this.products.set([...this.products(), ...[]]);  // Update the signal to trigger reactivity
    }
  }

  // Decrease quantity for a product
  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--; // Decrease quantity
      this.products.set([...this.products(), ...[]]);  // Update the signal to trigger reactivity
    }
  }

  // Add product to the cart
  addToCart(product: any) {
    const cartItem = {
      CartId: 0,  // CartId would be generated or managed by the cart system
      CustId: 0,  // Customer Id would be passed based on logged-in user
      ProductId: product.productId,  // Unique Product ID
      Quantity: product.quantity,  // Quantity selected
      AddedDate: new Date().toISOString()  // Current timestamp
    };

    // Call API to add the product to the cart (assuming there is an API for this)
    this.http.post<any>('https://yourapi.com/api/cart/add', cartItem).subscribe({
      next: (response) => {
        // Handle successful addition to cart, maybe show a confirmation message
        alert('Product added to cart');
        console.log(response);  // You can log the response or navigate to the cart
        this.router.navigate(['/cart']);  // Navigate to the cart page if needed
      },
      error: (err) => {
        // Handle error in adding to cart
        console.error('Error adding product to cart:', err);
        alert('Failed to add product to cart');
      }
    });
  }

  // Track function for *ngFor to improve performance
  trackProduct(index: number, product: any) {
    return product.productId; // Ensure the product is tracked by its unique ID
  }
}
