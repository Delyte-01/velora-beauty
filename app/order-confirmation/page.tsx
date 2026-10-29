import { Suspense } from 'react';
import { OrderConfirmationClient } from '@/components/checkout/order-confirmation-client';


export const metadata = { title: 'Order Confirmation' };

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-20" />}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
