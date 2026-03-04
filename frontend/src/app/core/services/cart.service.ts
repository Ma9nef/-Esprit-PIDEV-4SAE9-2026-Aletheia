import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartProduct {
  id: number;
  title: string;
  description: string;
  author?: string;
  type: string;
  price: number;
  fileUrl?: string;
  coverImageUrl?: string;
  available: boolean;
  stockQuantity: number;
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  checkedOut: boolean;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  priceAtPurchase: number;
  quantity: number;
  fileUrl?: string;
  coverImageUrl?: string;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl = '/api/cart';
  private ordersUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.cartUrl}?userId=${userId}`);
  }

  addToCart(userId: number, productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.cartUrl}/items?userId=${userId}&productId=${productId}&quantity=${quantity}`,
      {}
    );
  }

  removeItem(userId: number, cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(
      `${this.cartUrl}/items/${cartItemId}?userId=${userId}`
    );
  }

  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartUrl}/clear?userId=${userId}`);
  }

  checkout(userId: number): Observable<Order> {
    return this.http.post<Order>(
      `${this.ordersUrl}/checkout?userId=${userId}`,
      {}
    );
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.ordersUrl}?userId=${userId}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`);
  }
}

