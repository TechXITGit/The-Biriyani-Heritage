export interface BannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  ctaText: string;
  categoryTarget?: string;
  bgColor: string;
  accentColor: string;
}

export const heroBanners: BannerItem[] = [
  {
    id: 'hero-1',
    badge: 'ROYAL HERITAGE',
    title: 'Experience The Royal Taste of Biryani',
    subtitle: 'Authentic flavours. Royal recipes. Unforgettable experiences.',
    tagline: 'Slow-cooked in dough-sealed handis (Dum Pukht) over charcoal.',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/showcase/biryani.png',
    ctaText: 'Explore Menu',
    categoryTarget: 'biryani',
    bgColor: '#292A35', // Dark Background
    accentColor: '#E36B9A', // Dusty Rose Pink
  },
  {
    id: 'hero-2',
    badge: 'MON & THU SPECIAL',
    title: 'Awadhi Biryani + Chilled Coke',
    subtitle: 'Special celebratory combo deal starting at just ₹99 / ₹170.',
    tagline: 'Served piping hot with burani raita and spicy salan.',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/Combo1.jpg',
    ctaText: 'Grab Combo',
    categoryTarget: 'combos',
    bgColor: '#363744', // Dark Charcoal
    accentColor: '#F5B4CC', // Primary Light Pink
  },
  {
    id: 'hero-3',
    badge: 'AWADHI MASTERPIECE',
    title: 'Melt-in-Mouth Galauti Kebabs',
    subtitle: '160 secret spices hand-pounded for Nawab Asaf-ud-Daula.',
    tagline: 'Pure desi ghee pan-seared to silk-soft perfection.',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/galawati_kebab.png',
    ctaText: 'Taste Royalty',
    categoryTarget: 'kebabs',
    bgColor: '#B94D79', // Primary Dark Rose
    accentColor: '#FCE8F0', // Primary Soft
  },
];

export const specialOffers = [
  {
    id: 'offer-1',
    code: 'ROYAL50',
    title: '50% OFF up to ₹100',
    description: 'On your first order from Biryani Heritage',
    minOrder: 'Valid on orders above ₹249',
    bgColor: '#FFFFFF',
    borderColor: '#F0E5E9',
    accentColor: '#E36B9A',
  },
  {
    id: 'offer-2',
    code: 'DUMFEAST',
    title: 'FLAT ₹150 OFF',
    description: 'On all Handi Biryanis & Platters',
    minOrder: 'Valid on orders above ₹599',
    bgColor: '#FFFFFF',
    borderColor: '#F0E5E9',
    accentColor: '#363744',
  },
  {
    id: 'offer-3',
    code: 'FREESHIP',
    title: 'FREE EXPRESS DELIVERY',
    description: 'Zero delivery fee delivered piping hot in 30 mins',
    minOrder: 'Valid across Lucknow city',
    bgColor: '#FFFFFF',
    borderColor: '#CCE5D3',
    accentColor: '#1B7A38',
  },
];
