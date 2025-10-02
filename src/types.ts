export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  discount: number;
}

export interface GroupDiscount {
  id: string;
  name: string;
  percentage: number;
  productIds: string[];
}

export interface Payment {
  id: string;
  type: string;
  amount: number;
}

export interface Command {
  execute: () => void;
  undo: () => void;
  description: string;
}

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Double Double', price: 5.95 },
  { id: '2', name: 'Cheeseburger', price: 4.15 },
  { id: '3', name: 'Hamburger', price: 3.65 },
  { id: '4', name: 'French Fries', price: 2.40 },
  { id: '5', name: 'Shakes', price: 3.05 },
];

export const DEFAULT_TAX_RATE = 8.5;
export const DEFAULT_GROUP_DISCOUNT = 10;