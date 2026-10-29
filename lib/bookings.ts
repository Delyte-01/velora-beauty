import { getStorageItem, setStorageItem } from './storage';
import type { Booking } from '@/types';

const BOOKINGS_KEY = 'velora_bookings';

export function generateBookingReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `VBK-${stamp}${rand}`;
}

export function getBookings(): Booking[] {
  return getStorageItem<Booking[]>(BOOKINGS_KEY, []);
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.unshift(booking);
  setStorageItem(BOOKINGS_KEY, bookings);
}

export function getBookingByReference(ref: string): Booking | undefined {
  return getBookings().find((b) => b.reference === ref);
}

export function getRecentBookings(limit: number): Booking[] {
  return getBookings().slice(0, limit);
}
