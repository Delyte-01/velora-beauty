import { getStorageItem, setStorageItem } from './storage';
import type { Order } from '@/types';

const ORDERS_KEY = 'velora_orders';

export function generateOrderReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `VBR-${stamp}${rand}`;
}

export function getOrders(): Order[] {
  return getStorageItem<Order[]>(ORDERS_KEY, []);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  setStorageItem(ORDERS_KEY, orders);
}

export function getOrderByReference(ref: string): Order | undefined {
  return getOrders().find((o) => o.reference === ref);
}

export function getOrdersByCount(limit: number): Order[] {
  return getOrders().slice(0, limit);
}
