import { Platform } from 'react-native';

/**
 * BIRYANI HERITAGE - EXACT COLOUR SYSTEM
 * Inspired by modern, premium food-ordering aesthetic (Dusty Rose Pink, Dark Charcoal, Warm Background, Pure White surfaces)
 */
export const Palette = {
  // PRIMARY
  primary: '#E36B9A', // Dusty Rose Pink (Primary Brand)
  primaryDark: '#B94D79', // Pressed state & deep accents
  primaryLight: '#F5B4CC', // Hover, soft borders
  primarySoft: '#FCE8F0', // Soft backgrounds, chip fills, subtle highlights

  // SECONDARY
  charcoal: '#363744', // Dark charcoal contrasting colour
  darkBg: '#292A35', // Dark background
  textPrimary: '#292832', // Text Primary
  textSecondary: '#85838B', // Text Secondary

  // BACKGROUND
  mainBg: '#FFF8F5', // Soft, warm background
  cardBg: '#FFFFFF', // Pure white card surfaces
  card: '#FFFFFF', // Pure white card surfaces
  background: {
    main: '#FFF8F5',
    card: '#FFFFFF',
  },
  border: '#F0E5E9', // Clean soft border
  divider: '#F3E9ED', // Light divider

  // TEXT
  text: {
    primary: '#292832',
    secondary: '#85838B',
    charcoal: '#363744',
  },

  // VEGETARIAN THEME (Preserved EXACTLY)
  veg: {
    primary: '#0E7E38',
    primaryDark: '#0A5D28',
    primaryLight: '#E8F5E9',
    primarySoft: '#E8F8ED',
    indicator: '#1B7A38',
    indicatorBg: '#E8F5E9',
    border: '#CCE5D3',
    background: '#F0F8F2',
    accent: '#1B7A38',
  },

  // NON-VEGETARIAN INDICATOR
  nonVeg: {
    indicator: '#BA1A1A',
    indicatorBg: '#FFEBEE',
  },

  // ACCENTS & RATINGS
  gold: '#D9A441',
  goldLight: '#F5C86C',
  goldSoft: '#FCF3DC',
  ratingGold: '#F59E0B',
  spicyRed: '#E53935',
  successGreen: '#2E7D32',
} as const;

/**
 * BrandColors - Mapped to the new design system with full backwards compatibility
 */
export const BrandColors = {
  // Primary Pink Brand
  primary: Palette.primary,
  primaryDark: Palette.primaryDark,
  primaryLight: Palette.primaryLight,
  primarySoft: Palette.primarySoft,

  // Backwards compatibility aliases
  burgundy: Palette.charcoal, // Charcoal contrasting headers
  royalMaroon: Palette.primary, // #E36B9A
  maroonDark: Palette.primaryDark, // #B94D79
  saffronGold: Palette.primary, // Primary brand highlights
  goldLight: Palette.primaryLight,
  goldSoft: Palette.primarySoft,
  goldDark: Palette.primaryDark,
  warmCream: Palette.primarySoft,
  creamDark: Palette.border,

  // Charcoal & Neutrals
  charcoal: Palette.charcoal,
  charcoalLight: Palette.textSecondary,
  darkBg: Palette.darkBg,

  // UI Semantic Colors
  background: Palette.mainBg, // #FFF8F5
  card: Palette.cardBg, // #FFFFFF
  cardMughlai: Palette.cardBg,
  text: Palette.textPrimary, // #292832
  textMuted: Palette.textSecondary, // #85838B
  textLight: Palette.textSecondary,
  textInverse: '#FFFFFF',
  border: Palette.border, // #F0E5E9
  borderLight: Palette.border,
  divider: Palette.divider, // #F3E9ED

  // Food Indicators (Strictly Preserved)
  vegGreen: Palette.veg.indicator, // #1B7A38
  vegGreenBg: Palette.veg.indicatorBg, // #E8F5E9
  nonVegRed: Palette.nonVeg.indicator, // #BA1A1A
  nonVegRedBg: Palette.nonVeg.indicatorBg, // #FFEBEE

  // Status & Highlights
  bestsellerGold: Palette.primary,
  bestsellerBg: Palette.primarySoft,
  spicyRed: Palette.spicyRed,
  success: Palette.successGreen,
  ratingGold: Palette.ratingGold,
  shadowColor: Palette.charcoal,

  // Tab & Header
  tabActive: Palette.primary, // #E36B9A
  tabInactive: Palette.charcoal, // #363744
  tabInactiveLabel: Palette.textSecondary, // #85838B
  tabBarBg: '#FFFFFF',
  headerBg: '#FFFFFF',
} as const;

export const Colors = {
  ...BrandColors,
  light: {
    text: Palette.textPrimary,
    background: Palette.mainBg,
    backgroundElement: Palette.cardBg,
    backgroundSelected: Palette.primarySoft,
    textSecondary: Palette.textSecondary,
  },
  dark: {
    text: '#FFFFFF',
    background: Palette.darkBg,
    backgroundElement: Palette.charcoal,
    backgroundSelected: Palette.primaryDark,
    textSecondary: Palette.textSecondary,
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'sans-serif',
    serif: 'Georgia, serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
});

export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  fontFamilySerif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  fontFamilySans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 28,
    display: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 90, android: 96 }) ?? 90;
export const MaxContentWidth = 800;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  button: 14, // 14px as required for buttons
  capsule: 30, // 30px for floating bottom navigation
  pill: 9999,
};

/**
 * Reusable Button Style Tokens
 */
export const ButtonStyles = {
  primary: {
    backgroundColor: Palette.primary,
    pressedColor: Palette.primaryDark,
    textColor: '#FFFFFF',
    borderRadius: 14,
  },
  secondary: {
    backgroundColor: Palette.charcoal,
    pressedColor: Palette.darkBg,
    textColor: '#FFFFFF',
    borderRadius: 14,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: Palette.primary,
    borderWidth: 1.5,
    textColor: Palette.primary,
    borderRadius: 14,
  },
};

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#363744',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {
      boxShadow: '0 2px 4px rgba(54, 55, 68, 0.05)',
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#363744',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    android: { elevation: 4 },
    default: {
      boxShadow: '0 4px 10px rgba(54, 55, 68, 0.08)',
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#363744',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {
      boxShadow: '0 8px 20px rgba(54, 55, 68, 0.12)',
    },
  }),
  pinkGlow: Platform.select({
    ios: {
      shadowColor: Palette.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {
      boxShadow: '0 4px 12px rgba(227, 107, 154, 0.25)',
    },
  }),
  goldGlow: Platform.select({
    ios: {
      shadowColor: Palette.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {
      boxShadow: '0 4px 12px rgba(227, 107, 154, 0.25)',
    },
  }),
};
