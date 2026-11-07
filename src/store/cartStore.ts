import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Dish, PortionOption } from '@/types/menu';

interface CartState {
  items: CartItem[];
  appliedCoupon: string | null;
  couponDiscount: number;
  deliveryInstruction: string;
  setDeliveryInstruction: (instruction: string) => void;
  addToCart: (dish: Dish, portion?: PortionOption, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  decrementItem: (dishId: string, portion?: PortionOption) => void;
  incrementItem: (dishId: string, portion?: PortionOption) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getItemCount: () => number;
  getDishQuantity: (dishId: string, portion?: PortionOption) => number;
  getItemTotal: () => number;
  getDeliveryCharge: () => number;
  getTaxes: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponDiscount: 0,
      deliveryInstruction: '',

      setDeliveryInstruction: (instruction: string) => {
        set({ deliveryInstruction: instruction });
      },

      addToCart: (dish: Dish, portion: PortionOption = 'full', qty = 1) => {
        const portionKey = portion;
        const unitPrice =
          portion === 'half' && dish.halfPrice ? dish.halfPrice : dish.fullPrice;
        const itemId = `${dish.id}_${portionKey}`;

        const existingItem = get().items.find((i) => i.id === itemId);

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          const newItem: CartItem = {
            id: itemId,
            dish,
            portion: portionKey,
            quantity: qty,
            unitPrice,
          };
          set({ items: [...get().items, newItem] });
        }
      },

      removeFromCart: (itemId: string) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      incrementItem: (dishId: string, portion: PortionOption = 'full') => {
        const itemId = `${dishId}_${portion}`;
        const item = get().items.find((i) => i.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity + 1);
        }
      },

      decrementItem: (dishId: string, portion: PortionOption = 'full') => {
        const itemId = `${dishId}_${portion}`;
        const item = get().items.find((i) => i.id === itemId);
        if (item) {
          if (item.quantity <= 1) {
            get().removeFromCart(itemId);
          } else {
            get().updateQuantity(itemId, item.quantity - 1);
          }
        }
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, couponDiscount: 0 });
      },

      applyCoupon: (code: string) => {
        const subtotal = get().getItemTotal();
        const upperCode = code.trim().toUpperCase();

        if (upperCode === 'ROYAL50') {
          if (subtotal >= 249) {
            const disc = Math.min(100, Math.round(subtotal * 0.5));
            set({ appliedCoupon: 'ROYAL50', couponDiscount: disc });
            return true;
          }
        } else if (upperCode === 'DUMFEAST') {
          if (subtotal >= 599) {
            set({ appliedCoupon: 'DUMFEAST', couponDiscount: 150 });
            return true;
          }
        } else if (upperCode === 'FREESHIP') {
          set({ appliedCoupon: 'FREESHIP', couponDiscount: 35 });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, couponDiscount: 0 });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getDishQuantity: (dishId: string, portion?: PortionOption) => {
        if (portion) {
          const item = get().items.find((i) => i.id === `${dishId}_${portion}`);
          return item ? item.quantity : 0;
        }
        return get()
          .items.filter((i) => i.dish.id === dishId)
          .reduce((sum, i) => sum + i.quantity, 0);
      },

      getItemTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        );
      },

      getDeliveryCharge: () => {
        const subtotal = get().getItemTotal();
        if (subtotal === 0) return 0;
        if (get().appliedCoupon === 'FREESHIP') return 0;
        if (subtotal >= 499) return 0;
        return 35;
      },

      getTaxes: () => {
        const subtotal = get().getItemTotal();
        // 5% standard restaurant GST
        return Math.round(subtotal * 0.05);
      },

      getGrandTotal: () => {
        const subtotal = get().getItemTotal();
        if (subtotal === 0) return 0;
        const delivery = get().getDeliveryCharge();
        const taxes = get().getTaxes();
        const discount = get().couponDiscount;
        return Math.max(0, subtotal + delivery + taxes - discount);
      },
    }),
    {
      name: 'biryani-heritage-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
