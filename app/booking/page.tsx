import { Suspense } from 'react';
import { BookingClient } from '@/components/booking/booking-client';


export const metadata = { title: 'Book an Appointment' };

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20" />}>
      <BookingClient />
    </Suspense>
  );
}
