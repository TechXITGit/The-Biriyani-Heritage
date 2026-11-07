import { CartItem, DeliveryAddress, Order, OrderStage } from '@/types/menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  createOrder: (data: {
    items: CartItem[];
    itemTotal: number;
    deliveryCharge: number;
    tax: number;
    discount: number;
    totalAmount: number;
    deliveryAddress: DeliveryAddress;
    paymentMethod: 'Cash on Delivery' | 'UPI / Online' | 'Credit/Debit Card';
    deliveryInstruction?: string;
  }) => Order;
  getOrder: (id: string) => Order | undefined;
  updateOrderStage: (id: string, stage: OrderStage) => void;
  setActiveOrder: (id: string | null) => void;
}

const initialOrders: Order[] = [
  {
    id: 'ord-1029',
    orderNumber: 'BH-8924',
    date: 'Today, 1:15 PM',
    items: [
      {
        id: 'biryani-nv-1_full',
        dish: {
          id: 'biryani-nv-1',
          name: 'Awadhi Mutton Biryani',
          category: 'Biryani',
          isVeg: false,
          description: 'Fragrant basmati rice cooked with tender mutton in sealed handi.',
          fullPrice: 420,
          halfPrice: 220,
          pieces: '1 Plate',
          rating: 4.9,
          ratingCount: 540,
          image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/Awadhimutton.png',
          prepTime: '30 mins',
        },
        portion: 'full',
        quantity: 1,
        unitPrice: 420,
      },
      {
        id: 'kebab-nv-1_full',
        dish: {
          id: 'kebab-nv-1',
          name: 'Mutton Galauti Kebab',
          category: 'Kebabs',
          isVeg: false,
          description: 'Melt-in-mouth Awadhi kebabs pan seared in pure ghee.',
          fullPrice: 280,
          halfPrice: 150,
          pieces: '4 Pieces',
          rating: 4.9,
          ratingCount: 980,
          image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/galawati_kebab.png',
          prepTime: '15-20 mins',
        },
        portion: 'full',
        quantity: 1,
        unitPrice: 280,
      },
      {
        id: 'bread-3_full',
        dish: {
          id: 'bread-3',
          name: 'Rumali Roti',
          category: 'Rolls & Breads',
          isVeg: true,
          description: 'Paper-thin, ultra-soft flatbread baked on ulta tawa.',
          fullPrice: 30,
          pieces: '1 Piece',
          rating: 4.8,
          ratingCount: 780,
          image: 'https://clinquant-shortbread-e4c92f.netlify.app/images/menu/Rumali.png',
          prepTime: '5 mins',
        },
        portion: 'full',
        quantity: 2,
        unitPrice: 30,
      },
    ],
    itemTotal: 760,
    deliveryCharge: 0,
    tax: 38,
    discount: 50,
    totalAmount: 748,
    deliveryAddress: {
      id: 'addr-1',
      name: 'Aamir Nawab',
      phone: '+91 99191 21513',
      label: 'Home',
      addressLine: 'Flat 402, Nawabi Enclave, Sector G',
      area: 'LDA Colony',
      city: 'Lucknow',
      landmark: 'Opposite Power House Chauraha',
      pincode: '226012',
      isDefault: true,
    },
    paymentMethod: 'UPI / Online',
    paymentStatus: 'Paid',
    currentStage: 'Out for Delivery',
    estimatedDeliveryTime: '2:00 PM (In 15 mins)',
    deliveryPartner: {
      name: 'Rashid Khan (Royal Courier)',
      phone: '+91 98390 44122',
      vehicleNumber: 'UP 32 BK 7821',
    },
    timeline: [
      {
        stage: 'Order Placed',
        description: 'Received by The Biryani Heritage kitchen',
        time: '1:15 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        stage: 'Order Confirmed',
        description: 'Kitchen has accepted and started the handi prep',
        time: '1:18 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        stage: 'Preparing Your Food',
        description: 'Dum Pukht slow steam & fresh coal grilling in progress',
        time: '1:22 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        stage: 'Out for Delivery',
        description: 'Delivery partner Rashid is on his way in thermal box',
        time: '1:42 PM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        stage: 'Delivered',
        description: 'Royal feast handed over with royal accompaniments',
        time: 'Estimated 2:00 PM',
        isCompleted: false,
        isCurrent: false,
      },
    ],
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: initialOrders,
      activeOrderId: 'ord-1029',

      createOrder: (data) => {
        const orderId = `ord-${Date.now()}`;
        const orderNumber = `BH-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newOrder: Order = {
          id: orderId,
          orderNumber,
          date: `Today, ${timeStr}`,
          items: data.items,
          itemTotal: data.itemTotal,
          deliveryCharge: data.deliveryCharge,
          tax: data.tax,
          discount: data.discount,
          totalAmount: data.totalAmount,
          deliveryAddress: data.deliveryAddress,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
          deliveryInstruction: data.deliveryInstruction,
          currentStage: 'Order Placed',
          estimatedDeliveryTime: '30-35 mins',
          deliveryPartner: {
            name: 'Kashif Ali (Heritage Express)',
            phone: '+91 99191 21513',
            vehicleNumber: 'UP 32 DH 1944',
          },
          timeline: [
            {
              stage: 'Order Placed',
              description: 'Received by The Biryani Heritage kitchen',
              time: timeStr,
              isCompleted: true,
              isCurrent: true,
            },
            {
              stage: 'Order Confirmed',
              description: 'Kitchen has accepted your order',
              time: 'Pending',
              isCompleted: false,
              isCurrent: false,
            },
            {
              stage: 'Preparing Your Food',
              description: 'Fresh Dum Pukht slow-cooking in progress',
              time: 'Pending',
              isCompleted: false,
              isCurrent: false,
            },
            {
              stage: 'Out for Delivery',
              description: 'Assigned to delivery valet in insulated bag',
              time: 'Pending',
              isCompleted: false,
              isCurrent: false,
            },
            {
              stage: 'Delivered',
              description: 'Delivered piping hot to your doorstep',
              time: 'Pending',
              isCompleted: false,
              isCurrent: false,
            },
          ],
        };

        set({
          orders: [newOrder, ...get().orders],
          activeOrderId: orderId,
        });

        return newOrder;
      },

      getOrder: (id) => {
        return get().orders.find((o) => o.id === id);
      },

      updateOrderStage: (id, stage) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return;

        const stageOrder: OrderStage[] = [
          'Order Placed',
          'Order Confirmed',
          'Preparing Your Food',
          'Out for Delivery',
          'Delivered',
        ];

        const targetIdx = stageOrder.indexOf(stage);

        const updatedTimeline = order.timeline.map((step, idx) => ({
          ...step,
          isCompleted: idx < targetIdx,
          isCurrent: idx === targetIdx,
        }));

        set({
          orders: get().orders.map((o) =>
            o.id === id
              ? {
                ...o,
                currentStage: stage,
                timeline: updatedTimeline,
              }
              : o
          ),
        });
      },

      setActiveOrder: (id) => {
        set({ activeOrderId: id });
      },
    }),
    {
      name: 'biryani-heritage-orders',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
