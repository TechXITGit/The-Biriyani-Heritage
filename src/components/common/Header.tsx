import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Palette, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useDietStore, useAppTheme } from '@/store/dietStore';
import { SearchBar } from '@/components/common/SearchBar';
import { VegToggle } from '@/components/common/VegToggle';

interface HeaderProps {
  onLocationPress?: () => void;
  showSearchRow?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLocationPress,
  showSearchRow = false,
}) => {
  const router = useRouter();
  const isVegOnly = useDietStore((state) => state.isVegOnly);
  const theme = useAppTheme();
  const cartCount = useCartStore((state) => state.getItemCount());
  const selectedAddress = useUserStore((state) => state.getSelectedAddress());

  const locationTitle = selectedAddress
    ? `${selectedAddress.label} • ${selectedAddress.area}`
    : 'LDA Colony, Sector G';

  const locationSubtitle = selectedAddress
    ? selectedAddress.addressLine
    : 'Opp. Shakuntalam Hotel, Lucknow';

  return (
    <View
      style={[
        styles.safeContainer,
        {
          backgroundColor: theme.primary,
          borderBottomColor: theme.primaryDark,
        },
      ]}
    >
      {/* Top Location and Actions Row */}
      <View style={styles.topRow}>
        {/* Brand Logo & Location */}
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onLocationPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.locationIconWrap,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                },
              ]}
            >
              <Ionicons
                name="location"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.locationTextWrap}>
              <View style={styles.locationTitleRow}>
                <Text
                  style={[
                    styles.locationTitle,
                    { color: '#FFFFFF' },
                  ]}
                  numberOfLines={1}
                >
                  {locationTitle}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <Text
                style={[
                  styles.locationSubtitle,
                  {
                    color: isVegOnly ? '#E8F8ED' : '#FCE8F0',
                  },
                ]}
                numberOfLines={1}
              >
                {locationSubtitle}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Right Actions: ETA, Cart Button */}
        <View style={styles.actionsRow}>
          {/* Cart Icon with Live Badge */}
          <TouchableOpacity
            style={[
              styles.iconCircle,
              {
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
            ]}
            onPress={() => router.push({ pathname: '/cart', params: { tab: 'current' } } as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="bag-handle"
              size={18}
              color={theme.primary}
            />
            {cartCount > 0 && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isVegOnly
                      ? Palette.veg.primaryDark
                      : Palette.charcoal,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional Integrated Search & Veg Toggle Row */}
      {showSearchRow && (
        <View style={styles.searchRow}>
          <View style={styles.searchBarFlex}>
            <SearchBar isClickableOnly />
          </View>
          <VegToggle />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 14,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    borderBottomWidth: 1,
    ...Shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    marginRight: 2,
    letterSpacing: 0.2,
  },
  locationSubtitle: {
    fontSize: Typography.sizes.xs,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 4,
    borderWidth: 1,
  },
  etaText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    ...Shadows.sm,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: Typography.weights.extraBold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  searchBarFlex: {
    flex: 1,
  },
});
