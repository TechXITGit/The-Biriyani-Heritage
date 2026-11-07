import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette, Colors } from '@/constants/theme';

interface DietState {
  isVegOnly: boolean;
  setVegOnly: (val: boolean) => void;
  toggleVegOnly: () => void;
}

export const useDietStore = create<DietState>()(
  persist(
    (set, get) => ({
      // By default: false (shows Non-Veg / All dishes as requested)
      isVegOnly: false,

      setVegOnly: (val: boolean) => {
        set({ isVegOnly: val });
        if (Platform.OS !== 'web') {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          } catch {}
        }
      },

      toggleVegOnly: () => {
        const nextVal = !get().isVegOnly;
        set({ isVegOnly: nextVal });
        if (Platform.OS !== 'web') {
          try {
            Haptics.impactAsync(
              nextVal
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light
            ).catch(() => {});
          } catch {}
        }
      },
    }),
    {
      name: 'biryani-heritage-diet-mode',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(name);
          }
          return AsyncStorage.getItem(name);
        },
        setItem: async (name: string, value: string) => {
          if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(name, value);
            return;
          }
          return AsyncStorage.setItem(name, value);
        },
        removeItem: async (name: string) => {
          if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(name);
            return;
          }
          return AsyncStorage.removeItem(name);
        },
      })),
    }
  )
);

/**
 * Hook to retrieve active theme tokens based on Veg / Non-Veg mode
 * When isVegOnly is true -> returns fresh, vibrant Royal Emerald Green theme (#0E7E38)
 * When isVegOnly is false -> returns authentic Royal Burgundy / Maroon theme (#51001F)
 */
export const useAppTheme = () => {
  const isVegOnly = useDietStore((state) => state.isVegOnly);

  if (isVegOnly) {
    return {
      isVegOnly: true,
      themeName: 'veg' as const,
      headerBg: Palette.veg.primary, // #0E7E38 Vibrant Lucknow Royal Emerald Green
      headerSubtext: '#E8F8ED',
      headerTitle: '#FFFFFF',
      primary: Palette.veg.primary, // #0E7E38 Emerald Green
      primaryDark: Palette.veg.primaryDark, // #0A5D28
      primaryLight: Palette.veg.primaryLight, // #E8F5E9
      primarySoft: Palette.veg.primarySoft,
      charcoal: Palette.charcoal, // #363744
      textPrimary: Palette.textPrimary, // #292832
      textSecondary: Palette.textSecondary, // #85838B
      accent: Palette.veg.accent, // #1B9E4B
      accentGold: Palette.gold, // #D9A441
      background: Palette.veg.background, // #F0F8F2 Light fresh mint cream
      card: Palette.cardBg, // #FFFFFF
      border: Palette.veg.border, // #CCE5D3
      divider: '#E0EFE5',
      pillActive: Palette.veg.primary,
      pillActiveText: '#FFFFFF',
      tabActive: Palette.veg.primary,
      tabInactive: Palette.charcoal,
      tabInactiveLabel: Palette.textSecondary,
      badgeBg: Palette.veg.primary,
      floatingBarBg: Palette.veg.primary,
      floatingBarCta: Palette.veg.primaryDark,
      heroOverlay: 'rgba(14, 126, 56, 0.85)',
    };
  }

  return {
    isVegOnly: false,
    themeName: 'non-veg' as const,
    headerBg: Palette.primary, // #E36B9A Dusty Rose Pink (Primary Brand Header)
    headerSubtext: '#FCE8F0',
    headerTitle: '#FFFFFF',
    primary: Palette.primary, // #E36B9A Dusty Rose Pink
    primaryDark: Palette.primaryDark, // #B94D79
    primaryLight: Palette.primaryLight, // #F5B4CC
    primarySoft: Palette.primarySoft, // #FCE8F0
    charcoal: Palette.charcoal, // #363744
    darkBg: Palette.darkBg, // #292A35
    textPrimary: Palette.textPrimary, // #292832
    textSecondary: Palette.textSecondary, // #85838B
    accent: Palette.primary, // #E36B9A
    accentGold: Palette.gold, // #D9A441
    background: Palette.mainBg, // #FFF8F5 Soft Warm Background
    card: Palette.cardBg, // #FFFFFF Pure White Card
    border: Palette.border, // #F0E5E9 Clean Soft Border
    divider: Palette.divider, // #F3E9ED Light Divider
    pillActive: Palette.primary, // #E36B9A
    pillActiveText: '#FFFFFF',
    tabActive: Palette.primary, // #E36B9A
    tabInactive: Palette.charcoal, // #363744
    tabInactiveLabel: Palette.textSecondary, // #85838B
    badgeBg: Palette.primary,
    floatingBarBg: Palette.charcoal, // #363744 Dark Charcoal
    floatingBarCta: Palette.primary, // #E36B9A
    heroOverlay: 'rgba(41, 42, 53, 0.78)',
  };
};
