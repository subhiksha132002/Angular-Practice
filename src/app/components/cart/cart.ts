import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartModel, UpdateCartItemModel, PlaceOrderModel } from '../../models/cart'


@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  cartData = signal<CartModel | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  orderPlaced = signal(false);

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5160/api';

  private tempCustomerId = 1;

  constructor() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<CartModel>(`${this.apiUrl}/Carts/${this.tempCustomerId}`).subscribe({
      next: (response) => {
        this.cartData.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        // If cart not found (404), create empty cart
        if (err.status === 404) {
          this.cartData.set({
            CartId: 0,
            CustomerId: this.tempCustomerId,
            CustomerName: '',
            Email: '',
            Items: []
          });
          this.loading.set(false);
        } 
        else {
          this.error.set('Failed to fetch cart items');
          this.loading.set(false);
          console.error(err);
        }
      }
    });
  }

  increaseQuantity(productId: number) {
    const cart = this.cartData();
    if (!cart) return;
    
    const item = cart.Items.find(i => i.ProductId === productId);
    if (!item) return;
    
    const update: UpdateCartItemModel = {
      CustomerId: this.tempCustomerId,
      ProductId: productId,
      Quantity: item.Quantity + 1
    };
    
    this.updateQuantity(update);
  }

  decreaseQuantity(productId: number) {
    const cart = this.cartData();
    if (!cart) return;
    
    const item = cart.Items.find(i => i.ProductId === productId);
    if (!item || item.Quantity <= 1) return;
    
    const update: UpdateCartItemModel = {
      CustomerId: this.tempCustomerId,
      ProductId: productId,
      Quantity: item.Quantity - 1
    };
    
    this.updateQuantity(update);
  }

  private updateQuantity(update: UpdateCartItemModel) {
    this.http.put(`${this.apiUrl}/Carts/UpdateQuantity`, update, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log(response);
        // Update local state
        const cart = this.cartData();
        if (cart) {
          const item = cart.Items.find(i => i.ProductId === update.ProductId);
          if (item) {
            item.Quantity = update.Quantity;
            // Trigger change detection
            this.cartData.set({ ...cart });
          }
        }
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        alert('Failed to update quantity');
      }
    });
  }

  deleteCartItem(cartItemId:number){
    if (!confirm('Are you sure you want to remove this item from cart?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/Carts/${this.tempCustomerId}/Items/${cartItemId}`).subscribe({
      next: (response: any) => {
        console.log(response);
        // Remove item from local state
        const cart = this.cartData();
        if (cart) {
          cart.Items = cart.Items.filter(item => item.CartItemId !== cartItemId);
          this.cartData.set({ ...cart });
        }
        alert('Item removed from cart');
      },
      error: (err) => {
        console.error('Error deleting cart item:', err);
        alert('Failed to remove item from cart');
      }
    });

  }

calculateTotalPrice(): number {
    const cart = this.cartData();
    if (!cart || !cart.Items) return 0;
    
    return cart.Items.reduce((total, item) => {
      return total + (item.Quantity * item.ProductPrice);
    }, 0);
  }
  
  getTotalItems(): number {
    const cart = this.cartData();
    if (!cart || !cart.Items) return 0;
    
    return cart.Items.reduce((total, item) => total + item.Quantity, 0);
  }

  placeOrder() {
    const cart = this.cartData();
    if (!cart || !cart.Items || cart.Items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    const order = new PlaceOrderModel(this.tempCustomerId);
    
    this.http.post(`${this.apiUrl}/Orders/PlaceOrder`, order).subscribe({
      next: (response) => {
        console.log('Order placed:', response);
        alert('Order Placed Successfully');
        this.orderPlaced.set(true);
        
        // Clear cart after successful order
        this.cartData.set({
          CartId: 0,
          CustomerId: this.tempCustomerId,
          CustomerName: '',
          Email: '',
          Items: []
        });

        //this.router.navigate(['/order'], {
          //state: { orderPlaced: true }
        //});
      },
      error: (err) => {
        console.error('Error placing order:', err);
        alert('Failed to place order. Please try again.');
      }
    });
  }


}
