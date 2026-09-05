export interface DJ {
  id: string;
  name: string;
  genre: string[];
  costPerDay: number;
  description: string;
  experience: string;
  image: string;
  rating: number;
}

export const djs: DJ[] = [
  {
    id: 'dj1',
    name: 'DJ Ravi',
    genre: ['EDM', 'Bollywood', 'Hip-Hop'],
    costPerDay: 20000,
    description: 'High-energy performances with latest equipment and mixing skills',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1772187728844-50391039b23b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBwYXJ0eSUyMG11c2ljfGVufDF8fHx8MTc3Mjc3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
  },
  {
    id: 'dj2',
    name: 'DJ Aarav',
    genre: ['Bollywood', 'Retro', 'Tamil Hits'],
    costPerDay: 18000,
    description: 'Specialist in Bollywood and regional music with crowd engagement',
    experience: '6 years',
    image: 'https://images.unsplash.com/photo-1772187728844-50391039b23b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBwYXJ0eSUyMG11c2ljfGVufDF8fHx8MTc3Mjc3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
  },
  {
    id: 'dj3',
    name: 'DJ Neha',
    genre: ['House', 'Techno', 'Commercial'],
    costPerDay: 25000,
    description: 'International style DJ with premium sound system',
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1772187728844-50391039b23b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBwYXJ0eSUyMG11c2ljfGVufDF8fHx8MTc3Mjc3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
  },
  {
    id: 'dj4',
    name: 'DJ Karthik',
    genre: ['Wedding Mix', 'Folk Fusion', 'Carnatic Fusion'],
    costPerDay: 15000,
    description: 'Traditional meets modern with unique fusion sets',
    experience: '5 years',
    image: 'https://images.unsplash.com/photo-1772187728844-50391039b23b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBwYXJ0eSUyMG11c2ljfGVufDF8fHx8MTc3Mjc3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
  },
];
