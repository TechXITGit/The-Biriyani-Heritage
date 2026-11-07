import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { allDishes } from '@/data/menuData';
import { FoodCardHorizontal } from '@/components/cards/FoodCardHorizontal';
import { VegToggle } from '@/components/common/VegToggle';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useDietStore, useAppTheme } from '@/store/dietStore';

const popularSearches = [
  'Awadhi Dum Biryani',
  'Galauti Kebab',
  'Butter Chicken',
  'Rumali Roti',
  'Chicken Tikka',
  'Mutton Korma',
  'Paneer Butter Masala',
  'Biryani Combo',
];

export default function SearchScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const isVegOnly = useDietStore((state) => state.isVegOnly);

  const [query, setQuery] = useState('');
  const [filterBudget, setFilterBudget] = useState(false); // under 200

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartGrandTotal = useCartStore((state) => state.getGrandTotal());

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();

    return allDishes.filter((dish) => {
      // Global diet mode tracking
      if (isVegOnly && !dish.isVeg) return false;

      const matchName = dish.name.toLowerCase().includes(lowerQuery);
      const matchCategory = dish.category.toLowerCase().includes(lowerQuery);
      const matchDesc = dish.description.toLowerCase().includes(lowerQuery);
      const matchIng = dish.ingredients?.some((i) =>
        i.toLowerCase().includes(lowerQuery)
      );

      if (!matchName && !matchCategory && !matchDesc && !matchIng) return false;
      if (filterBudget && (dish.halfPrice || dish.fullPrice) > 200) return false;

      return true;
    });
  }, [query, isVegOnly, filterBudget]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top Search Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.primaryDark }]}>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.searchInputWrap}>
              <Ionicons name="search" size={18} color={theme.primary} />
              <TextInput
                style={styles.input}
                placeholder={
                  isVegOnly
                    ? 'Search veg biryani, paneer, chaap...'
                    : 'Search for biryani, kebabs, curries...'
                }
                placeholderTextColor={Palette.text.secondary}
                value={query}
                onChangeText={setQuery}
                autoFocus
                clearButtonMode="while-editing"
                returnKeyType="search"
              />

              {query.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color={Palette.text.secondary} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Veg / Non-Veg Toggle next to search input */}
            <VegToggle compact />
          </View>
        </View>

        {/* Filter Chips Bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterBudget && [
                styles.filterChipActive,
                { backgroundColor: theme.primary, borderColor: theme.primary },
              ],
            ]}
            onPress={() => setFilterBudget(!filterBudget)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterBudget && styles.filterChipTextActive,
              ]}
            >
              Under ₹200
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => router.push('/explore' as any)}
          >
            <Ionicons name="options-outline" size={13} color={Colors.text} />
            <Text style={styles.filterChipText}>Explore Categories</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {query.trim().length === 0 ? (
            /* Popular & Trending Searches */
            <View style={styles.popularContainer}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="trending-up" size={18} color={theme.accentGold} />
                <Text style={styles.sectionTitle}>TRENDING ROYAL DISHES</Text>
              </View>

              <View style={styles.tagsContainer}>
                {popularSearches.map((term, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.tagPill}
                    onPress={() => setQuery(term)}
                  >
                    <Ionicons name="search" size={13} color={theme.primary} />
                    <Text style={styles.tagText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.sectionHeaderRow, { marginTop: 28 }]}>
                <MaterialCommunityIcons name="crown" size={18} color={theme.accentGold} />
                <Text style={styles.sectionTitle}>POPULAR SPECIALITIES</Text>
              </View>

              <View style={styles.quickGrid}>
                {allDishes
                  .filter((d) => (isVegOnly ? d.isVeg : true) && d.isBestseller)
                  .slice(0, 4)
                  .map((dish) => (
                    <TouchableOpacity
                      key={dish.id}
                      style={styles.quickDishCard}
                      onPress={() => setQuery(dish.name)}
                    >
                      <View style={styles.quickDishText}>
                        <Text style={styles.quickDishName} numberOfLines={1}>
                          {dish.name}
                        </Text>
                        <Text style={[styles.quickDishPrice, { color: theme.primary }]}>
                          ₹{dish.halfPrice || dish.fullPrice}
                        </Text>
                      </View>
                      <Ionicons name="arrow-forward-circle" size={20} color={theme.primary} />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ) : searchResults.length === 0 ? (
            /* No Results Found */
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons
                name="food-off-outline"
                size={64}
                color={theme.accentGold}
              />
              <Text style={styles.noResultsTitle}>No Royal Dishes Found</Text>
              <Text style={styles.noResultsDesc}>
                {isVegOnly
                  ? `No vegetarian results matching "${query}". Try searching for Paneer, Biryani, or toggling Non-Veg.`
                  : `We couldn't find any dish matching "${query}". Try searching for Biryani, Kebabs, or Roti.`}
              </Text>
            </View>
          ) : (
            /* Search Results List */
            <View style={styles.resultsContainer}>
              <View style={styles.resultCountRow}>
                <Text style={styles.resultCountText}>
                  Found <Text style={styles.resultCountBold}>{searchResults.length}</Text>{' '}
                  dishes matching "{query}"
                  {isVegOnly && (
                    <Text style={{ color: '#1B5E20', fontWeight: 'bold' }}> (Veg Only)</Text>
                  )}
                </Text>
              </View>

              {searchResults.map((dish) => (
                <FoodCardHorizontal key={dish.id} dish={dish} />
              ))}
            </View>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Floating Cart Bar if cart has items */}
        {cartItemCount > 0 && (
          <View style={[styles.floatingCartBar, { backgroundColor: theme.floatingBarBg }]}>
            <View style={styles.cartBarLeft}>
              <View style={styles.cartIconBadge}>
                <Ionicons name="bag-handle" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.cartBarCount}>
                  {cartItemCount} {cartItemCount === 1 ? 'ITEM' : 'ITEMS'}
                </Text>
                <Text style={styles.cartBarTotal}>₹{cartGrandTotal} plus taxes</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.cartBarCta, { backgroundColor: theme.floatingBarCta }]}
              onPress={() => router.push('/cart' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.cartBarCtaText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 14,
    ...Shadows.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 6,
    marginRight: 2,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Palette.text.primary,
    marginLeft: 8,
    outlineStyle: 'none' as any,
  },
  clearBtn: {
    padding: 4,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  filterChipActive: {},
  filterChipText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  popularContainer: {
    padding: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 6,
    ...Shadows.sm,
  },
  tagText: {
    fontSize: 12,
    color: Palette.text.primary,
    fontWeight: Typography.weights.medium,
  },
  quickGrid: {
    gap: 8,
  },
  quickDishCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  quickDishText: {
    flex: 1,
    marginRight: 8,
  },
  quickDishName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  quickDishPrice: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  noResultsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginTop: 14,
  },
  noResultsDesc: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.secondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
  },
  resultCountRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: '#FFF8F5',
  },
  resultCountText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
  },
  resultCountBold: {
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBarCount: {
    color: Palette.primary,
    fontSize: 10,
    fontWeight: Typography.weights.extraBold,
    letterSpacing: 0.5,
  },
  cartBarTotal: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  cartBarCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  cartBarCtaText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
});
