export const siteConfig = {
  name: 'VELORA BEAUTY',
  tagline: 'Your beauty, your signature.',
  description:
    'Carefully selected hair, fragrance, skincare, and beauty essentials delivered with care across Nigeria.',
  announcement: 'Your beauty essentials, delivered with care.',
  email: 'hello@velorabeauty.ng',
  phone: '+234 801 234 5678',
  whatsappNumber: '2348012345678',
  address: '12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    tiktok: 'https://tiktok.com',
  },
  deliveryFee: 2500,
  freeDeliveryThreshold: 50000,
  states: [
    'Lagos',
    'Abuja FCT',
    'Rivers',
    'Kano',
    'Oyo',
    'Kaduna',
    'Enugu',
    'Delta',
    'Edo',
    'Ogun',
    'Anambra',
    'Cross River',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
