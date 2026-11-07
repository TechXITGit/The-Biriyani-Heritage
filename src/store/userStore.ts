import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeliveryAddress } from '@/types/menu';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

interface UserState {
  profile: UserProfile;
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<DeliveryAddress>) => void;
  setCurrentLocationAddress: (data: {
    area: string;
    addressLine: string;
    city: string;
    pincode: string;
    landmark?: string;
    label?: 'Home' | 'Office' | 'Other';
  }) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  getSelectedAddress: () => DeliveryAddress | undefined;
}

const defaultAddresses: DeliveryAddress[] = [
  {
    id: 'addr-1',
    name: 'Royal Patron',
    phone: '+91 99191 21513',
    label: 'Home',
    addressLine: 'Flat 402, Nawabi Enclave, Sector G',
    area: 'LDA Colony',
    city: 'Lucknow',
    landmark: 'Opposite Power House Chauraha',
    pincode: '226012',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Royal Patron',
    phone: '+91 99191 21513',
    label: 'Office',
    addressLine: 'Plot 18, Commercial Block, Sector H',
    area: 'Ashiyana',
    city: 'Lucknow',
    landmark: 'Near Bangla Bazar',
    pincode: '226012',
    isDefault: false,
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Aamir Nawab',
        phone: '+91 99191 21513',
        email: 'patron@biryaniheritage.com',
      },
      addresses: defaultAddresses,
      selectedAddressId: 'addr-1',

      updateProfile: (updates) => {
        set({ profile: { ...get().profile, ...updates } });
      },

      addAddress: (newAddr) => {
        const id = `addr-${Date.now()}`;
        const address: DeliveryAddress = { ...newAddr, id };
        if (address.isDefault) {
          const updated = get().addresses.map((a) => ({ ...a, isDefault: false }));
          set({ addresses: [...updated, address], selectedAddressId: id });
        } else {
          set({ addresses: [...get().addresses, address] });
        }
      },

      updateAddress: (id, updates) => {
        const updated = get().addresses.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        );
        set({ addresses: updated });
      },

      setCurrentLocationAddress: (data) => {
        const existingLive = get().addresses.find((a) => a.id === 'addr-live');
        const liveAddr: DeliveryAddress = {
          id: 'addr-live',
          name: get().profile.name || 'Current Location',
          phone: get().profile.phone || '+91 99191 21513',
          label: data.label || (existingLive?.label || 'Home'),
          addressLine: data.addressLine,
          area: data.area,
          city: data.city || 'Lucknow',
          landmark: data.landmark || 'Current Location (GPS)',
          pincode: data.pincode || '226012',
          isDefault: true,
        };

        const otherAddrs = get().addresses.filter((a) => a.id !== 'addr-live');
        set({
          addresses: [liveAddr, ...otherAddrs],
          selectedAddressId: 'addr-live',
        });
      },

      removeAddress: (id: string) => {
        const remaining = get().addresses.filter((a) => a.id !== id);
        const newSelected =
          get().selectedAddressId === id
            ? remaining[0]?.id || ''
            : get().selectedAddressId;
        set({ addresses: remaining, selectedAddressId: newSelected });
      },

      selectAddress: (id: string) => {
        set({ selectedAddressId: id });
      },

      getSelectedAddress: () => {
        const addr = get().addresses.find((a) => a.id === get().selectedAddressId);
        return addr || get().addresses[0];
      },
    }),
    {
      name: 'biryani-heritage-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
