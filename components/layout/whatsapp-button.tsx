'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  message: string;
  label?: string;
  className?: string;
  variant?: 'solid' | 'outline';
}

export function WhatsAppButton({
  message,
  label = 'Order via WhatsApp',
  className,
  variant = 'outline',
}: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
        variant === 'solid'
          ? 'bg-[#25D366] text-white hover:bg-[#1da851]'
          : 'border border-border bg-card text-foreground hover:bg-muted',
        className
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
