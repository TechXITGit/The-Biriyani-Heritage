import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Dish } from '@/types/menu';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { VegIndicator } from '@/components/common/VegIndicator';
import { Badge } from '@/components/common/Badge';
import { useCartStore } from '@/store/cartStore';
import { useAppTheme } from '@/store/dietStore';
import { PortionModal } from '@/components/common/PortionModal';

interface FoodCardHorizontalProps {
  dish: Dish;
}

export const FoodCardHorizontal: React.FC<FoodCardHorizontalProps> = ({ dish }) => {
  const router = useRouter();
  const theme = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const quantity = useCartStore((state) => state.getDishQuantity(dish.id));

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    if (dish.halfPrice) {
      setModalVisible(true);
    } else {
      addToCart(dish, 'full', 1);
    }
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/dish/[id]',
      params: { id: dish.id },
    } as any);
  };

  const basePrice = dish.halfPrice ? dish.halfPrice : dish.fullPrice;

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.88}
      >
        {/* Left Information */}
        <View style={styles.leftInfo}>
          {/* Top row: veg indicator & tags */}
          <View style={styles.tagRow}>
            <VegIndicator isVeg={dish.isVeg} size={15} />
            {dish.isBestseller && (
              <Badge type="bestseller" text="Bestseller" size="sm" />
            )}
            {dish.isChefSpecial && (
              <Badge type="chef" text="Chef's Pick" size="sm" />
            )}
            {dish.isSpicy && <Badge type="spicy" text="Spicy" size="sm" />}
          </View>

          {/* Dish Name */}
          <Text style={styles.name}>{dish.name}</Text>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.primary }]}>₹{basePrice}</Text>
            {dish.halfPrice && (
              <Text style={styles.portionHint}>
                (Half: ₹{dish.halfPrice} • Full: ₹{dish.fullPrice})
              </Text>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.starWrap}>
              <Ionicons name="star" size={11} color="#FFFFFF" />
              <Text style={styles.ratingText}>{dish.rating}</Text>
            </View>
            <Text style={styles.ratingCount}>({dish.ratingCount} ratings)</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.prepTime}>{dish.prepTime}</Text>
          </View>
        </View>

        {/* Right Image & Floating Add Button */}
        <View style={styles.rightImageWrap}>
          <Image
            source={{ uri: dish.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          {/* Overlay Add Button */}
          <View style={styles.btnPositioner}>
            {quantity === 0 ? (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  {
                    borderColor: theme.primary,
                    backgroundColor: theme.isVegOnly ? '#E8F5E9' : '#FFFFFF',
                  },
                ]}
                onPress={handleAddPress}
                activeOpacity={0.85}
              >
                <Text style={[styles.addText, { color: theme.primary }]}>ADD</Text>
                {dish.halfPrice && (
                  <Text style={[styles.addPlus, { color: theme.primary }]}>+</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={[styles.qtyContainer, { backgroundColor: theme.primary }]}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    decrementItem(dish.id, 'full');
                  }}
                >
                  <Ionicons name="remove" size={15} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    incrementItem(dish.id, 'full');
                  }}
                >
                  <Ionicons name="add" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            {dish.halfPrice && quantity === 0 && (
              <Text style={styles.customizableText}>Customisable</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <PortionModal
        visible={modalVisible}
        dish={dish}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E5E9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  leftInfo: {
    flex: 1,
    marginRight: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  portionHint: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  starWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E6F37',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  ratingCount: {
    fontSize: 10,
    color: Palette.textSecondary,
  },
  dot: {
    color: Palette.textSecondary,
    fontSize: 8,
  },
  prepTime: {
    fontSize: 10,
    color: Palette.textSecondary,
  },
  desc: {
    fontSize: Typography.sizes.xs,
    color: Palette.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  rightImageWrap: {
    width: 124,
    height: 124,
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: 124,
    height: 114,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#FAF4EC',
  },
  btnPositioner: {
    position: 'absolute',
    bottom: -6,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 14, // 14px button radius
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    ...Shadows.md,
  },
  addText: {
    fontSize: 13,
    fontWeight: Typography.weights.extraBold,
    letterSpacing: 0.5,
  },
  addPlus: {
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 2,
    paddingVertical: 3,
    ...Shadows.md,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: Typography.weights.bold,
    minWidth: 18,
    textAlign: 'center',
  },
  customizableText: {
    fontSize: 9,
    color: Palette.textSecondary,
    marginTop: 2,
  },
});
