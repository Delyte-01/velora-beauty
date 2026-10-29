import { siteConfig } from '@/config/site';
import type { CartItem } from '@/types';

export function whatsappLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export function productEnquiryMessage(
  productName: string,
  productUrl: string,
  selectedVariants: Record<string, string>,
  quantity: number
): string {
  const variantLines = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const variantBlock = variantLines ? `\nVariants:\n${variantLines}` : '';
  return `Hello VELORA BEAUTY, I would like to ask about this product:

${productName}
Quantity: ${quantity}${variantBlock}

View it here: ${productUrl}`;
}

export function cartOrderMessage(
  items: CartItem[],
  subtotal: number,
  delivery: number,
  total: number
): string {
  const lines = items.map(
    (i) =>
      `• ${i.name}${formatVariantLine(i.selectedVariants)} x${i.quantity} — ₦${(
        i.price * i.quantity
      ).toLocaleString('en-NG')}`
  );
  return `Hello VELORA BEAUTY, I would like to place an order:

${lines.join('\n')}

Subtotal: ₦${subtotal.toLocaleString('en-NG')}
Estimated delivery: ₦${delivery.toLocaleString('en-NG')}
Total: ₦${total.toLocaleString('en-NG')}

Please confirm availability and next steps. Thank you!`;
}

function formatVariantLine(selectedVariants: Record<string, string>): string {
  const entries = Object.entries(selectedVariants);
  if (!entries.length) return '';
  return ` (${entries.map(([k, v]) => `${k}: ${v}`).join(', ')})`;
}
