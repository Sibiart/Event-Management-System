export interface Venue {
  id: string;
  name: string;
  capacity: number;
  costPerDay: number;
  description: string;
  amenities: string[];
  image: string;
  location: string;
}

export const venues: Venue[] = [
  {
    id: 'v1',
    name: 'SK Mahal',
    capacity: 500,
    costPerDay: 50000,
    description: 'Luxurious banquet hall perfect for grand weddings and celebrations',
    amenities: ['AC', 'Parking', 'Stage', 'Sound System', 'Catering Kitchen'],
    image: 'https://images.unsplash.com/photo-1761110787206-2cc164e4913c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwdmVudWUlMjBiYW5xdWV0JTIwaGFsbHxlbnwxfHx8fDE3NzI3NzQ1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Anna Nagar, Chennai',
  },
  {
    id: 'v2',
    name: 'Lakshmi Mahal',
    capacity: 300,
    costPerDay: 35000,
    description: 'Elegant venue with traditional architecture and modern amenities',
    amenities: ['AC', 'Parking', 'Dining Area', 'Bridal Suite', 'Generator'],
    image: 'https://images.unsplash.com/photo-1769018508631-fe4ebf3fba3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbnQlMjB2ZW51ZSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjczNjUyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'T Nagar, Chennai',
  },
  {
    id: 'v3',
    name: 'Royal Mahal',
    capacity: 800,
    costPerDay: 75000,
    description: 'Grand ballroom with crystal chandeliers and premium facilities',
    amenities: ['Central AC', 'Valet Parking', 'LED Stage', 'Professional Lighting', 'VIP Lounge'],
    image: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMGJhbGxyb29tJTIwZXZlbnQlMjBzcGFjZXxlbnwxfHx8fDE3NzI3NzQ1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Nungambakkam, Chennai',
  },
  {
    id: 'v4',
    name: 'Garden Paradise',
    capacity: 400,
    costPerDay: 45000,
    description: 'Beautiful outdoor venue with lush gardens and natural ambiance',
    amenities: ['Garden Setup', 'Outdoor Lighting', 'Parking', 'Gazebo', 'Rain Cover'],
    image: 'https://images.unsplash.com/photo-1762216444919-043cf813e4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwd2VkZGluZyUyMHZlbnVlJTIwZ2FyZGVufGVufDF8fHx8MTc3Mjc3NDU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'ECR, Chennai',
  },
  {
    id: 'v5',
    name: 'SM Convention Center',
    capacity: 600,
    costPerDay: 60000,
    description: 'Modern conference hall ideal for corporate events and large gatherings',
    amenities: ['Projector', 'WiFi', 'AC', 'Podium', 'Conference Setup', 'Parking'],
    image: 'https://images.unsplash.com/photo-1759477274012-263d469f0e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwaGFsbCUyMHZlbnVlfGVufDF8fHx8MTc3Mjc3NDU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'OMR, Chennai',
  },
];
