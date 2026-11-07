import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';

interface OfferCardProps {
  code: string;
  title: string;
  description: string;
  minOrder: string;
  onApply?: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  code,
  title,
  description,
  minOrder,
  onApply,
}) => {
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const isApplied = appliedCoupon === code;

  const handleToggle = () => {
    if (isApplied) {
      removeCoupon();
    } else {
      const success = applyCoupon(code);
      if (onApply) onApply();
    }
  };
   
  return (
    <View style={[styles.card, isApplied && styles.cardApplied]}>
      <View style={styles.leftBorder} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.codeWrap}>
            <MaterialCommunityIcons
              name="ticket-percent-outline"
              size={14}
              color={Palette.primary}
            />
            <Text style={styles.codeText}>{code}</Text>
          </View>
          <TouchableOpacity
            style={[styles.applyBtn, isApplied && styles.appliedBtn]}
            onPress={handleToggle}
            activeOpacity={0.8}
          >
            <Text style={[styles.applyBtnText, isApplied && styles.appliedBtnText]}>
              {isApplied ? 'APPLIED' : 'APPLY'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
        <Text style={styles.minOrder}>{minOrder}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#F0E5E9',
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
    ...Shadows.sm,
  },
  cardApplied: {
    borderColor: Palette.primary,
    backgroundColor: '#FCE8F0',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Palette.primary,
  },
  content: {
    padding: 12,
    paddingLeft: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  codeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE8F0',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    gap: 4,
  },
  codeText: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  applyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: Palette.primary,
  },
  appliedBtn: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  applyBtnText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Palette.primary,
  },
  appliedBtnText: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  desc: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginBottom: 4,
  },
  minOrder: {
    fontSize: 9.5,
    color: Palette.textSecondary,
    fontWeight: Typography.weights.medium,
  },
});
