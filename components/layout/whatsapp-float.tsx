'use client';

import { whatsappLink } from '@/lib/whatsapp';
import { siteConfig } from '@/config/site';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloat() {
  const link = whatsappLink(
    `Hello ${siteConfig.name}, I have a question about your products.`
  );
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
