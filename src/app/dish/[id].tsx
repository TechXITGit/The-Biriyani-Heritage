import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { allDishes } from '@/data/menuData';
import { PortionOption } from '@/types/menu';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { VegIndicator } from '@/components/common/VegIndicator';
import { Badge } from '@/components/common/Badge';
import { useCartStore } from '@/store/cartStore';
import { useAppTheme } from '@/store/dietStore';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useAppTheme();

  const dish = allDishes.find((d) => d.id === id) || allDishes[0];
  const [selectedPortion, setSelectedPortion] = useState<PortionOption>('full');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const currentPrice =
    selectedPortion === 'half' && dish.halfPrice
      ? dish.halfPrice
      : dish.fullPrice;

  const totalAmount = currentPrice * quantity;

  const handleAddToCart = () => {
    addToCart(dish, selectedPortion, quantity);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image Container */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: dish.image }}
              style={styles.heroImage}
              contentFit="cover"
            />

            {/* Floating Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.circularBtn}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circularBtn}
                onPress={() => setIsFavorite(!isFavorite)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite ? Colors.spicyRed : Colors.text}
                />
              </TouchableOpacity>
            </View>

            {/* Category Tag pill */}
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{dish.category}</Text>
            </View>
          </View>

          {/* Content Body */}
          <View style={styles.body}>
            {/* Header Row: Veg/Non-Veg & Tags */}
            <View style={styles.badgeRow}>
              <VegIndicator isVeg={dish.isVeg} size={18} />
              {dish.isBestseller && (
                <Badge type="bestseller" text="BESTSELLER" size="md" />
              )}
              {dish.isChefSpecial && (
                <Badge type="chef" text="ROYAL CHEF SPECIAL" size="md" />
              )}
              {dish.isSpicy && <Badge type="spicy" text="SPICY" size="md" />}
            </View>

            {/* Dish Name */}
            <Text style={styles.dishName}>{dish.name}</Text>

            {/* Quick Metrics (Rating, Prep Time, Calories) */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFFFFF" />
                  <Text style={styles.ratingText}>{dish.rating}</Text>
                </View>
                <Text style={styles.metricLabel}>{dish.ratingCount} reviews</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={theme.accentGold}
                />
                <Text style={styles.metricLabel}>{dish.prepTime}</Text>
              </View>

              {dish.calories && (
                <>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={16}
                      color={Colors.spicyRed}
                    />
                    <Text style={styles.metricLabel}>{dish.calories}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Description */}
            <Text style={styles.description}>{dish.description}</Text>

            

            {/* Portion Size Selection (if half & full are available) */}
            {dish.halfPrice && (
              <View style={styles.portionSection}>
                <Text style={styles.sectionHeading}>SELECT PORTION SIZE</Text>
                <View style={styles.portionOptions}>
                  {/* Half Plate */}
                  <TouchableOpacity
                    style={[
                      styles.portionCard,
                      selectedPortion === 'half' && [
                        styles.portionCardActive,
                        { borderColor: theme.primary },
                      ],
                    ]}
                    onPress={() => setSelectedPortion('half')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.portionInfo}>
                      <View style={styles.radioOuter}>
                        {selectedPortion === 'half' && (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: theme.primary },
                            ]}
                          />
                        )}
                      </View>
                      <View>
                        <Text style={styles.portionTitle}>Half Plate</Text>
                        <Text style={styles.portionSubtitle}>
                          Ideal for single indulgence
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.portionPrice,
                        selectedPortion === 'half' && { color: theme.primary },
                      ]}
                    >
                      ₹{dish.halfPrice}
                    </Text>
                  </TouchableOpacity>

                  {/* Full Plate */}
                  <TouchableOpacity
                    style={[
                      styles.portionCard,
                      selectedPortion === 'full' && [
                        styles.portionCardActive,
                        { borderColor: theme.primary },
                      ],
                    ]}
                    onPress={() => setSelectedPortion('full')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.portionInfo}>
                      <View style={styles.radioOuter}>
                        {selectedPortion === 'full' && (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: theme.primary },
                            ]}
                          />
                        )}
                      </View>
                      <View>
                        <Text style={styles.portionTitle}>Full Plate</Text>
                        <Text style={styles.portionSubtitle}>
                          {dish.pieces || 'Full generous handi serving'}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.portionPrice,
                        selectedPortion === 'full' && { color: theme.primary },
                      ]}
                    >
                      ₹{dish.fullPrice}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Key Royal Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <View style={styles.ingredientsSection}>
                <Text style={styles.sectionHeading}>ROYAL INGREDIENTS</Text>
                <View style={styles.ingredientChips}>
                  {dish.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientChip}>
                      <Ionicons
                        name="sparkles"
                        size={11}
                        color={theme.accentGold}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.ingredientChipText}>{ing}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Bar */}
        <View style={styles.bottomBar}>
          {/* Quantity Controls */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={18} color={theme.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={18} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Add to Cart CTA */}
          <TouchableOpacity
            style={[styles.addToCartBtn, { backgroundColor: theme.primary }]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.addToCartText}>
              Add to Royal Feast • ₹{totalAmount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroImageContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
    backgroundColor: '#FAF6F0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  circularBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  categoryPill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(36, 32, 31, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  categoryPillText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  body: {
    padding: Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -20,
    backgroundColor: '#FFFFFF',
    ...Shadows.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dishName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 16,
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.veg.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    fontWeight: Typography.weights.medium,
  },
  metricDivider: {
    width: 1,
    height: 16,
    backgroundColor: Palette.border,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  heritageCard: {
    backgroundColor: Palette.primarySoft,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.primaryLight,
    marginBottom: 20,
  },
  heritageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  heritageTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  heritageText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  portionSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  portionOptions: {
    gap: 10,
  },
  portionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  portionCardActive: {
    backgroundColor: '#FFF8F5',
  },
  portionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Palette.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  portionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  portionSubtitle: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  portionPrice: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  ingredientsSection: {
    marginBottom: 10,
  },
  ingredientChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  ingredientChipText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    fontWeight: Typography.weights.medium,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.lg,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    padding: 10,
  },
  qtyText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    minWidth: 26,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
});
