import { RestaurantInfo } from '@/types/menu';

export const restaurantInfo: RestaurantInfo = {
  name: 'The Biryani Heritage',
  tagline: 'Royal Mughlai & Awadhi Dum Pukht Delicacies',
  story:
    'Born in the royal culinary heart of Lucknow, The Biryani Heritage preserves centuries-old royal Awadhi and Hyderabadi recipes. Our Master Ustads slow-cook fragrant aged basmati rice, tender hand-cut meats, saffron and stone-ground spices in traditional dough-sealed handis (Dum Pukht) for over two hours. Every grain is steeped in royal aromatics and nostalgia.',
  address: 'Power House Chauraha, opposite Shakuntalam Hotel, Sector G, LDA Colony',
  area: 'Sector G, LDA Colony',
  city: 'Lucknow',
  pincode: '226012',
  phone: '+919919121513',
  phoneDisplay: '+91 99191 21513',
  email: 'heritagethebiryani@gmail.com',
  openingHours: 'Mon - Sun: 6:00 AM - 11:30 PM',
  rating: 4.8,
  reviewsCount: 1420,
  socials: {
    facebook: 'https://www.facebook.com/p/The-Biryani-Heritage-61578599369790/',
    instagram: 'https://www.instagram.com/thebiryaniheritage',
    whatsapp: 'https://wa.me/919919121513?text=Hello%2C%20I%20would%20like%20to%20order%20from%20The%20Biryani%20Heritage',
  },
};

export const deliveryZones = [
  { id: '1', name: 'LDA Colony, Sector G', time: '20-25 mins', minOrder: 150 },
  { id: '2', name: 'Ashiyana, Sector H & L', time: '30 mins', minOrder: 200 },
  { id: '3', name: 'Alambagh & VIP Road', time: '30-35 mins', minOrder: 250 },
  { id: '4', name: 'Transport Nagar & Kanpur Rd', time: '30-40 mins', minOrder: 250 },
  { id: '5', name: 'Krishna Nagar', time: '25-35 mins', minOrder: 200 },
  { id: '6', name: 'Hazratganj & Central Lucknow', time: '35-45 mins', minOrder: 350 },
];
