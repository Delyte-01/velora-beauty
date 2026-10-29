import type { BeautyService } from '@/types';

export const services: BeautyService[] = [
  {
    id: 'svc-1',
    slug: 'wig-installation',
    name: 'Wig Installation',
    description:
      'A professional wig install including lace melting, styling, and a natural finish. Bring your own wig or choose from our in-store selection.',
    duration: '90 minutes',
    price: 15000,
    image:
      'https://images.pexels.com/photos/6923241/pexels-photo-6923241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Hair',
  },
  {
    id: 'svc-2',
    slug: 'hair-styling',
    name: 'Hair Styling',
    description:
      'Custom hair styling for any occasion — from sleek buns to glamorous curls and braided updos. Consult your stylist on the day for your preferred look.',
    duration: '60 minutes',
    price: 8000,
    image:
      'https://images.pexels.com/photos/14730875/pexels-photo-14730875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Hair',
  },
  {
    id: 'svc-3',
    slug: 'makeup-session',
    name: 'Makeup Session',
    description:
      'A full face of glam makeup with premium products. Perfect for events, photoshoots, or a confidence-boosting refresh. Lashes included.',
    duration: '75 minutes',
    price: 12000,
    image:
      'https://images.pexels.com/photos/7256152/pexels-photo-7256152.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Makeup',
  },
  {
    id: 'svc-4',
    slug: 'skincare-consultation',
    name: 'Skincare Consultation',
    description:
      'A one-on-one skin assessment with our beauty specialist. Walk away with a personalised routine tailored to your skin type and concerns.',
    duration: '45 minutes',
    price: 6000,
    image:
      'https://images.pexels.com/photos/8101534/pexels-photo-8101534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Skincare',
  },
  {
    id: 'svc-5',
    slug: 'bridal-beauty-session',
    name: 'Bridal Beauty Session',
    description:
      'Complete bridal hair and makeup for your big day. Includes a pre-trial consultation and on-the-day service. Book well in advance.',
    duration: '3 hours',
    price: 45000,
    image:
      'https://images.pexels.com/photos/2535913/pexels-photo-2535913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'Bridal',
  },
];

export function getServiceBySlug(slug: string): BeautyService | undefined {
  return services.find((s) => s.slug === slug);
}

export const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];
