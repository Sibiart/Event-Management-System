export interface Artist {
  id: string;
  name: string;
  instrument: string[];
  costPerDay: number;
  description: string;
  experience: string;
  image: string;
  rating: number;
}

export const artists: Artist[] = [
  {
    id: 'a1',
    name: 'Lakshmi Subramaniam',
    instrument: ['Violin', 'Classical Vocals'],
    costPerDay: 12000,
    description: 'Carnatic classical violinist with mesmerizing performances',
    experience: '15 years',
    image: 'https://images.unsplash.com/photo-1762917903361-99e0164dbcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMG11c2ljaWFucyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3Mjc3NDU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
  },
  {
    id: 'a2',
    name: 'Arjun Menon',
    instrument: ['Guitar', 'Keyboard'],
    costPerDay: 10000,
    description: 'Contemporary guitarist for wedding and corporate events',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1762917903361-99e0164dbcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMG11c2ljaWFucyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3Mjc3NDU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
  },
  {
    id: 'a3',
    name: 'Priya Sharma',
    instrument: ['Flute', 'Saxophone'],
    costPerDay: 8000,
    description: 'Soulful flute player with expertise in both Indian and Western music',
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1762917903361-99e0164dbcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMG11c2ljaWFucyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3Mjc3NDU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
  },
  {
    id: 'a4',
    name: 'Kumar Rajesh',
    instrument: ['Tabla', 'Mridangam'],
    costPerDay: 9000,
    description: 'Traditional percussionist with energetic performances',
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1762917903361-99e0164dbcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMG11c2ljaWFucyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3Mjc3NDU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
  },
  {
    id: 'a5',
    name: 'The Melody Band',
    instrument: ['Live Band', 'Multi-instrument'],
    costPerDay: 25000,
    description: 'Complete live band with vocals, guitars, drums, and keyboard',
    experience: '7 years',
    image: 'https://images.unsplash.com/photo-1762917903361-99e0164dbcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMG11c2ljaWFucyUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3Mjc3NDU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
  },
];
