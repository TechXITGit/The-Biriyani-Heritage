import React, { useState, useMemo, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { allDishes } from '@/data/menuData';
import { categories } from '@/data/categories';
import { CategoryId, Dish } from '@/types/menu';
import { FoodCardHorizontal } from '@/components/cards/FoodCardHorizontal';
import { CategoryPill } from '@/components/cards/CategoryPill';
import { VegToggle } from '@/components/common/VegToggle';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useDietStore, useAppTheme } from '@/store/dietStore';

type SortOption = 'relevance' | 'rating' | 'price-asc' | 'price-desc';

interface SortFilterOption {
  id: SortOption;
  label: string;
  sublabel: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SORT_OPTIONS: SortFilterOption[] = [
  {
    id: 'relevance',
    label: 'Popular & Bestsellers',
    sublabel: 'Most loved royal Awadhi delicacies',
    icon: 'flame',
  },
  {
    id: 'rating',
    label: 'Top Rated ★',
    sublabel: 'Highest customer rating (4.5+ stars)',
    icon: 'star',
  },
  {
    id: 'price-asc',
    label: 'Price: Low to High',
    sublabel: 'Pocket-friendly royal treats first',
    icon: 'arrow-up',
  },
  {
    id: 'price-desc',
    label: 'Price: High to Low',
    sublabel: 'Grand royal platters & feasts first',
    icon: 'arrow-down',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const theme = useAppTheme();
  const isVegOnly = useDietStore((state) => state.isVegOnly);
  const setVegOnly = useDietStore((state) => state.setVegOnly);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    (params.category as CategoryId) || 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeSortOption =
    SORT_OPTIONS.find((opt) => opt.id === sortBy) || SORT_OPTIONS[0];

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartGrandTotal = useCartStore((state) => state.getGrandTotal());

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    if (catId === 'veg') {
      setVegOnly(true);
    } else if (catId === 'non-veg') {
      setVegOnly(false);
    }
  };

  // Listen to incoming route query params (e.g. from Home screen explore by cuisine)
  useEffect(() => {
    if (params.category && categories.some((c) => c.id === params.category)) {
      const cat = params.category as CategoryId;
      setSelectedCategory(cat);
      if (cat === 'veg') {
        setVegOnly(true);
      } else if (cat === 'non-veg') {
        setVegOnly(false);
      }
    }
  }, [params.category, setVegOnly]);

  // Filtered and Sorted list
  const filteredDishes = useMemo(() => {
    let result = allDishes.filter((dish) => {
      // Veg toggle enforcement
      if (isVegOnly && !dish.isVeg) return false;

      // Search term
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesCategory = dish.category.toLowerCase().includes(query);
        const matchesIngredients = dish.ingredients?.some((ing) =>
          ing.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesIngredients) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory === 'biryani' && dish.category !== 'Biryani') return false;
      if (selectedCategory === 'kebabs' && dish.category !== 'Kebabs') return false;
      if (selectedCategory === 'curries' && dish.category !== 'Curries') return false;
      if (selectedCategory === 'tikkas' && dish.category !== 'Tikkas') return false;
      if (selectedCategory === 'combos' && dish.category !== 'Combos') return false;
      if (selectedCategory === 'rolls-breads' && dish.category !== 'Rolls & Breads') return false;
      if (selectedCategory === 'veg' && !dish.isVeg) return false;
      if (selectedCategory === 'non-veg' && dish.isVeg) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result = [...result].sort(
        (a, b) => (a.halfPrice || a.fullPrice) - (b.halfPrice || b.fullPrice)
      );
    } else if (sortBy === 'price-desc') {
      result = [...result].sort(
        (a, b) => (b.fullPrice || b.halfPrice || 0) - (a.fullPrice || a.halfPrice || 0)
      );
    } else if (sortBy === 'relevance') {
      result = [...result].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, isVegOnly, sortBy]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.primaryDark }]}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                Royal Culinary Menu
              </Text>
              <Text style={[styles.headerSubtitle, { color: isVegOnly ? '#E8F8ED' : '#FCE8F0' }]}>
                {isVegOnly
                  ? 'Pure Vegetarian Awadhi & Hyderabadi Specialities'
                  : 'Authentic Awadhi & Hyderabadi Dum Pukht Delights'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.cartIconWrap,
                { backgroundColor: '#FFFFFF' },
              ]}
              onPress={() => router.push('/cart' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="bag-handle" size={20} color={theme.primary} />
              {cartItemCount > 0 && (
                <View style={[styles.badge, { backgroundColor: isVegOnly ? Palette.veg.primaryDark : Palette.charcoal }]}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Sticky Search & Veg Toggle Row (Side by side, no negative overflow) */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={theme.primary} />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  isVegOnly
                    ? 'Search veg biryani, paneer tikka...'
                    : 'Search biryani, kebabs, curries...'
                }
                placeholderTextColor="#9C938D"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#9C938D" />
                </TouchableOpacity>
              )}
            </View>

            {/* Global Veg / Non-Veg Toggle */}
            <VegToggle compact />
          </View>

          {/* Quick Horizontal Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChips}
          >
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onSelect={handleCategorySelect}
                layout="chip"
              />
            ))}
          </ScrollView>
        </View>

        {/* Filter Bar with "Filter" Dropdown Button */}
        <View style={styles.filterBar}>
          <View style={styles.filterBarRow}>
            {/* Filter Dropdown Trigger Button */}
            <TouchableOpacity
              style={[
                styles.filterButton,
                isFilterOpen && {
                  borderColor: theme.primary,
                  backgroundColor: theme.primarySoft,
                },
                sortBy !== 'relevance' && {
                  borderColor: theme.primary,
                  backgroundColor: theme.primarySoft,
                },
              ]}
              onPress={() => setIsFilterOpen((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={
                  sortBy !== 'relevance' || isFilterOpen
                    ? theme.primary
                    : Palette.charcoal
                }
              />
              <Text
                style={[
                  styles.filterButtonText,
                  (sortBy !== 'relevance' || isFilterOpen) && {
                    color: theme.primary,
                    fontWeight: Typography.weights.bold,
                  },
                ]}
              >
                Filter
              </Text>

              {/* Active Sort Tag if not default */}
              {sortBy !== 'relevance' && (
                <View
                  style={[
                    styles.filterActiveBadge,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={styles.filterActiveBadgeText}>
                    {activeSortOption.label}
                  </Text>
                </View>
              )}

              <Ionicons
                name={isFilterOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={
                  sortBy !== 'relevance' || isFilterOpen
                    ? theme.primary
                    : Palette.textSecondary
                }
              />
            </TouchableOpacity>

            {/* Quick reset button when filter applied */}
            {sortBy !== 'relevance' && (
              <TouchableOpacity
                style={styles.clearFilterButton}
                onPress={() => setSortBy('relevance')}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Ionicons name="close-circle" size={15} color={Palette.textSecondary} />
                <Text style={styles.clearFilterText}>Reset</Text>
              </TouchableOpacity>
            )}

            {/* Right: Dish Counter */}
            <View style={styles.counterPill}>
              <Text style={styles.counterPillText}>
                <Text style={styles.counterPillBold}>{filteredDishes.length}</Text> dishes
              </Text>
            </View>
          </View>

          {/* Filter Dropdown Panel */}
          {isFilterOpen && (
            <View style={[styles.dropdownCard, Shadows.md]}>
              <View style={styles.dropdownHeader}>
                <View style={styles.dropdownTitleWrap}>
                  <Ionicons name="funnel" size={13} color={theme.primary} />
                  <Text style={styles.dropdownTitle}>FILTER & SORT DISHES</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsFilterOpen(false)}
                  style={styles.dropdownCloseBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={18} color={Palette.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.dropdownDivider} />

              <View style={styles.dropdownList}>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.dropdownItem,
                        isSelected && [
                          styles.dropdownItemSelected,
                          {
                            backgroundColor: theme.primarySoft,
                            borderColor: theme.primary,
                          },
                        ],
                      ]}
                      onPress={() => {
                        setSortBy(opt.id);
                        setIsFilterOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dropdownItemLeft}>
                        <View
                          style={[
                            styles.dropdownItemIconWrap,
                            {
                              backgroundColor: isSelected
                                ? theme.primary
                                : '#F5EFEA',
                            },
                          ]}
                        >
                          <Ionicons
                            name={opt.icon}
                            size={14}
                            color={isSelected ? '#FFFFFF' : Palette.charcoal}
                          />
                        </View>
                        <View style={styles.dropdownItemTextCol}>
                          <Text
                            style={[
                              styles.dropdownItemLabel,
                              isSelected && {
                                color: theme.primary,
                                fontWeight: Typography.weights.bold,
                              },
                            ]}
                          >
                            {opt.label}
                          </Text>
                          <Text style={styles.dropdownItemSub}>
                            {opt.sublabel}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dropdownRadioWrap}>
                        {isSelected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={theme.primary}
                          />
                        ) : (
                          <View style={styles.dropdownRadioUnchecked} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Results Counter Banner */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            Showing <Text style={styles.countBold}>{filteredDishes.length}</Text> dishes in{' '}
            <Text style={[styles.countBold, { color: theme.primary }]}>
              {selectedCategory.toUpperCase()}
            </Text>
            {sortBy !== 'relevance' && (
              <Text style={{ color: theme.primary, fontWeight: '600' }}>
                {' '}• Filter: {activeSortOption.label}
              </Text>
            )}
            {isVegOnly && (
              <Text style={{ color: '#1B5E20', fontWeight: 'bold' }}> (Pure Veg Mode)</Text>
            )}
          </Text>
        </View>

        {/* Dish List */}
        <ScrollView
          style={styles.dishList}
          contentContainerStyle={styles.dishListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredDishes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="silverware-clean"
                size={54}
                color={theme.accentGold}
              />
              <Text style={styles.emptyTitle}>No Matching Royal Dishes</Text>
              <Text style={styles.emptyDesc}>
                {isVegOnly
                  ? 'No vegetarian dishes found for this category or search query. Try switching categories or clearing search.'
                  : 'Try searching for another dish or clearing your active filters.'}
              </Text>
              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                <Text style={styles.resetButtonText}>View Complete Menu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredDishes.map((dish) => (
              <FoodCardHorizontal key={dish.id} dish={dish} />
            ))
          )}

          {/* Bottom space */}
          <View style={{ height: cartItemCount > 0 ? 120 : 80 }} />
        </ScrollView>

        {/* Floating Cart Bar */}
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
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  cartIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.saffronGold,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    fontSize: 10,
    fontWeight: Typography.weights.extraBold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: Typography.sizes.sm,
    color: Palette.textPrimary,
    outlineStyle: 'none' as any,
  },
  categoryChips: {
    paddingVertical: 4,
    gap: 8,
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    zIndex: 20,
  },
  filterBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  filterButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Palette.charcoal,
  },
  filterActiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 2,
  },
  filterActiveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearFilterText: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  counterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Palette.mainBg,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  counterPillText: {
    fontSize: Typography.sizes.xs,
    color: Palette.textSecondary,
  },
  counterPillBold: {
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
  },
  dropdownCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 12,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  dropdownTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropdownTitle: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Palette.charcoal,
    letterSpacing: 0.6,
  },
  dropdownCloseBtn: {
    padding: 2,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: Palette.border,
    marginBottom: 6,
  },
  dropdownList: {
    gap: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropdownItemSelected: {},
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dropdownItemIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemTextCol: {
    flex: 1,
  },
  dropdownItemLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Palette.textPrimary,
  },
  dropdownItemSub: {
    fontSize: 10,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  dropdownRadioWrap: {
    marginLeft: 8,
  },
  dropdownRadioUnchecked: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D1CCC6',
  },
  dishList: {
    flex: 1,
  },
  dishListContent: {
    paddingBottom: 110,
  },
  countRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    backgroundColor: Palette.mainBg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  countText: {
    fontSize: Typography.sizes.xs,
    color: Palette.textSecondary,
  },
  countBold: {
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: Typography.sizes.sm,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 86,
    left: 16,
    right: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.charcoal,
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
    color: Palette.primaryLight,
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
