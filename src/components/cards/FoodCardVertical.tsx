import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
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

interface FoodCardVerticalProps {
  dish: Dish;
  width?: number;
}

export const FoodCardVertical: React.FC<FoodCardVerticalProps> = ({ dish, width = 168 }) => {
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

  const displayPrice = dish.halfPrice ? dish.halfPrice : dish.fullPrice;

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { width }]}
        onPress={handleCardPress}
        activeOpacity={0.9}
      >
        {/* Image Container with Badges */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: dish.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          {/* Rating tag overlay */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#FFFFFF" style={{ marginRight: 2 }} />
            <Text style={styles.ratingText}>{dish.rating}</Text>
          </View>

          {/* Special tag (Bestseller / Chef's) */}
          {dish.isBestseller && (
            <View style={styles.bestsellerTag}>
              <MaterialCommunityIcons name="crown" size={10} color="#FFFFFF" />
              <Text style={styles.bestsellerText}>ROYAL</Text>
            </View>
          )}

          {/* Prep time */}
          <View style={styles.prepTimeBadge}>
            <Text style={styles.prepTimeText}>{dish.prepTime}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.content}>
          {/* Veg / Non-Veg & Name */}
          <View style={styles.nameRow}>
            <VegIndicator isVeg={dish.isVeg} size={13} />
            <Text style={styles.name} numberOfLines={2}>
              {dish.name}
            </Text>
          </View>

          {/* Price & Add Action */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>₹{displayPrice}</Text>
            </View>

            {quantity === 0 ? (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  {
                    borderColor: theme.primary,
                    backgroundColor: theme.isVegOnly ? '#E8F5E9' : Palette.primarySoft,
                  },
                ]}
                onPress={handleAddPress}
                activeOpacity={0.8}
              >
                <Text style={[styles.addText, { color: theme.primary }]}>ADD</Text>
                {dish.halfPrice && (
                  <Text style={[styles.customText, { color: theme.primary }]}>+</Text>
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
                  <Ionicons name="remove" size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    incrementItem(dish.id, 'full');
                  }}
                >
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#F0E5E9',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#FAF4EC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 32, 31, 0.78)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  bestsellerTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  bestsellerText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  prepTimeBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  prepTimeText: {
    fontSize: 9,
    color: Palette.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  content: {
    padding: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 8,
    minHeight: 34,
  },
  name: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
    flex: 1,
  },
  description: {
    fontSize: 11,
    color: Palette.textSecondary,
    lineHeight: 14,
    marginBottom: 6,
  },
  portionText: {
    fontSize: 10,
    color: Palette.textSecondary,
    fontWeight: Typography.weights.semibold,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3E9ED',
  },
  priceLabel: {
    fontSize: 9,
    color: Palette.textSecondary,
  },
  price: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
  },
  addButton: {
    backgroundColor: '#FCE8F0',
    borderWidth: 1.2,
    borderColor: Palette.primary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    ...Shadows.sm,
  },
  addText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Palette.primary,
    letterSpacing: 0.4,
  },
  customText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Palette.primary,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 14,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  qtyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    minWidth: 16,
    textAlign: 'center',
  },
});
