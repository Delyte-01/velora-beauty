import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-hair',
    slug: 'hair',
    name: 'Hair Attachments & Extensions',
    description:
      'Premium braiding attachments, extensions, and bundles for every protective style.',
    image:
      'https://images.pexels.com/photos/14730876/pexels-photo-14730876.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    productCount: 12,
  },
  {
    id: 'cat-wigs',
    slug: 'wigs',
    name: 'Wigs & Hairpieces',
    description:
      'Ready-to-wear wigs, lace fronts, and hairpieces in a range of textures and lengths.',
    image:
      'https://images.pexels.com/photos/6923241/pexels-photo-6923241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    productCount: 4,
  },
  {
    id: 'cat-fragrance',
    slug: 'fragrance',
    name: 'Fragrances & Perfumes',
    description:
      'Eau de parfum, body mists, and signature scents for every occasion.',
    image:
      'https://images.pexels.com/photos/21008941/pexels-photo-21008941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    productCount: 6,
  },
  {
    id: 'cat-skincare',
    slug: 'skincare',
    name: 'Skincare',
    description:
      'Cleansers, serums, moisturizers, and treatments for healthy, glowing skin.',
    image:
      'https://images.pexels.com/photos/8101534/pexels-photo-8101534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    productCount: 6,
  },
  {
    id: 'cat-makeup',
    slug: 'makeup',
    name: 'Makeup & Cosmetics',
    description:
      'Lipsticks, foundations, palettes, and cosmetics for a flawless finish.',
    image:
      'https://images.pexels.com/photos/4022309/pexels-photo-4022309.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    productCount: 6,
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    name: 'Beauty Accessories',
    description:
      'Brushes, sponges, tools, and essentials to complete your beauty kit.',
    image:
      'https://images.pexels.com/photos/1472098/pexels-photo-1472098.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    productCount: 6,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
