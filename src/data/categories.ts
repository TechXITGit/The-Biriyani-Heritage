import { CategoryId } from '@/types/menu';

export interface CategoryItem {
  id: CategoryId;
  name: string;
  icon: string;
  subtitle: string;
  image: string;
}

export const categories: CategoryItem[] = [
  {
    id: 'all',
    name: 'All',
    icon: 'silverware-fork-knife',
    subtitle: 'Royal Feast',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/showcase/thali.png',
  },
  {
    id: 'biryani',
    name: 'Biryani',
    icon: 'pot-steam',
    subtitle: 'Dum Pukht',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/showcase/biryani.png',
  },
  {
    id: 'kebabs',
    name: 'Kebabs',
    icon: 'fire',
    subtitle: 'Melt-in-mouth',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/showcase/kebabs.png',
  },
  {
    id: 'curries',
    name: 'Curries',
    icon: 'bowl-mix',
    subtitle: 'Slow simmered',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/butter_chicken.png',
  },
  {
    id: 'tikkas',
    name: 'Tikkas',
    icon: 'skewer',
    subtitle: 'Clay tandoor',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/showcase/tandoori.png',
  },
  {
    id: 'veg',
    name: 'Veg',
    icon: 'leaf',
    subtitle: 'Shahi Nazakat',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/Awadhichicken.png',
  },
  {
    id: 'non-veg',
    name: 'Non-Veg',
    icon: 'food-drumstick',
    subtitle: 'Royal Meats',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/Awadhimutton.png',
  },
  {
    id: 'rolls-breads',
    name: 'Rolls & Breads',
    icon: 'bread-slice',
    subtitle: 'Crisp & Flaky',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/showcase/breads.png',
  },
  {
    id: 'combos',
    name: 'Combos',
    icon: 'food-takeout-box',
    subtitle: 'Special Deals',
    image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/Combo1.jpg',
  },
];
