export interface Vendor {
  id: string;
  name: string;
  type: 'catering' | 'decoration' | 'photography';
  costPerDay: number;
  description: string;
  services: string[];
  image: string;
  rating: number;
}

export const vendors: Vendor[] = [
  {
    id: 'vd1',
    name: 'Delicious Caterers',
    type: 'catering',
    costPerDay: 500,
    description: 'Premium catering service with multi-cuisine options',
    services: ['Breakfast', 'Lunch', 'Dinner', 'Live Counters', 'Welcome Drinks'],
    image: 'https://images.unsplash.com/photo-1771154139725-f2b0b4891430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBidWZmZXQlMjBzZXJ2aWNlfGVufDF8fHx8MTc3Mjc3NDU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
  },
  {
    id: 'vd2',
    name: 'Royal Feast Catering',
    type: 'catering',
    costPerDay: 600,
    description: 'Specializing in traditional South Indian and North Indian cuisine',
    services: ['Vegetarian', 'Non-Vegetarian', 'Desserts', 'Beverages', 'Custom Menu'],
    image: 'https://images.unsplash.com/photo-1771154139725-f2b0b4891430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBidWZmZXQlMjBzZXJ2aWNlfGVufDF8fHx8MTc3Mjc3NDU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
  },
  {
    id: 'vd3',
    name: 'Elegant Decorators',
    type: 'decoration',
    costPerDay: 25000,
    description: 'Creative decoration with flowers, lights, and theme setups',
    services: ['Floral Arrangements', 'Stage Decoration', 'Lighting', 'Backdrops', 'Table Settings'],
    image: 'https://images.unsplash.com/photo-1771846360155-d1f71e0fb2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGRlY29yYXRpb24lMjBmbG93ZXJzJTIwYmFsbG9vbnN8ZW58MXx8fHwxNzcyNzc0NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
  },
  {
    id: 'vd4',
    name: 'Dream Decorations',
    type: 'decoration',
    costPerDay: 30000,
    description: 'Luxury event decoration with international themes',
    services: ['Theme Decor', 'Entrance Arch', 'Centerpieces', 'Draping', 'Prop Rentals'],
    image: 'https://images.unsplash.com/photo-1766933161362-ccf4050529a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5JTIwbGlnaHRzJTIwZGVjb3JhdGlvbnN8ZW58MXx8fHwxNzcyNzc0NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
  },
  {
    id: 'vd5',
    name: 'Memories Photography',
    type: 'photography',
    costPerDay: 15000,
    description: 'Professional photography and videography services',
    services: ['Wedding Photography', 'Candid Shots', 'Videography', 'Drone Coverage', 'Photo Album'],
    image: 'https://images.unsplash.com/photo-1769230385107-bc6eaa7a123e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBjYW1lcmElMjB3ZWRkaW5nfGVufDF8fHx8MTc3Mjc3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
  },
  {
    id: 'vd6',
    name: 'Capture Moments Studio',
    type: 'photography',
    costPerDay: 20000,
    description: 'Cinematic wedding films and traditional photography',
    services: ['Pre-wedding', 'Wedding Day', 'Reception', 'Editing', 'Highlight Reel'],
    image: 'https://images.unsplash.com/photo-1769230385107-bc6eaa7a123e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBjYW1lcmElMjB3ZWRkaW5nfGVufDF8fHx8MTc3Mjc3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
  },
];
