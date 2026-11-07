import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { BannerCarousel } from '@/components/cards/BannerCarousel';
import { CategoryPill } from '@/components/cards/CategoryPill';
import { FoodCardVertical } from '@/components/cards/FoodCardVertical';
import { FoodCardHorizontal } from '@/components/cards/FoodCardHorizontal';
import { LocationModal } from '@/components/common/LocationModal';
import { categories } from '@/data/categories';
import { allDishes } from '@/data/menuData';
import { CategoryId, Dish } from '@/types/menu';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useDietStore, useAppTheme } from '@/store/dietStore';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const isVegOnly = useDietStore((state) => state.isVegOnly);
  const setVegOnly = useDietStore((state) => state.setVegOnly);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartGrandTotal = useCartStore((state) => state.getGrandTotal());

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // Filtered dishes for current selected category & veg state
  const filteredDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      // Veg toggle enforcement
      if (isVegOnly && !dish.isVeg) return false;

      // Category match
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
  }, [selectedCategory, isVegOnly]);

  // Special curated collections (respecting active veg mode)
  const bestsellerDishes = useMemo(() => {
    return allDishes.filter((d) => (isVegOnly ? d.isVeg : true) && d.isBestseller).slice(0, 8);
  }, [isVegOnly]);

  const signatureBiryaniDishes = useMemo(() => {
    return allDishes
      .filter((d) => d.category === 'Biryani' && (isVegOnly ? d.isVeg : true))
      .slice(0, 8);
  }, [isVegOnly]);

  const royalKebabDishes = useMemo(() => {
    return allDishes.filter((d) => d.category === 'Kebabs' && (isVegOnly ? d.isVeg : true));
  }, [isVegOnly]);

  const vegFavouriteDishes = useMemo(() => {
    return allDishes.filter((d) => d.isVeg && (d.isBestseller || d.rating >= 4.8));
  }, []);

  const handleCategorySelect = (catId: CategoryId) => {
    setSelectedCategory(catId);
    if (catId === 'veg') {
      setVegOnly(true);
    } else if (catId === 'non-veg') {
      setVegOnly(false);
    }
    // Navigate immediately to Explore menu with category selected so the items open!
    router.push({
      pathname: '/explore',
      params: { category: catId },
    } as any);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.primary }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {/* Top Header with Location, ETA, Cart, and Integrated Search + Veg Toggle (Scrollable with page) */}
          <Header
            onLocationPress={() => setLocationModalVisible(true)}
            showSearchRow={true}
          />

          {/* Hero Promotional Banner Carousel */}
          <BannerCarousel
            onBannerCtaPress={(catTarget) => {
              if (catTarget) {
                setSelectedCategory(catTarget as CategoryId);
              } else {
                router.push({
                  pathname: '/explore',
                  params: { category: selectedCategory },
                } as any);
              }
            }}
          />

          {/* EXPLORE BY CUISINE Header */}
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>EXPLORE BY CUISINE</Text>
            </View>
          </View>

          {/* Horizontally Scrollable Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onSelect={handleCategorySelect}
                layout="avatar"
              />
            ))}
          </ScrollView>

          {/* Active Category Items Row (Shows items for the selected category right on Home!) */}
          {selectedCategory !== 'all' && filteredDishes.length > 0 && (
            <View style={styles.categoryDishesSection}>
              <View style={styles.categoryDishesHeader}>
                <View>
                  <Text style={styles.categoryDishesTitle}>
                    {categories.find((c) => c.id === selectedCategory)?.name || 'Category'} Specialities
                  </Text>
                  <Text style={styles.categoryDishesSubtitle}>
                    {filteredDishes.length} authentic dishes ready to order
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.categoryDishesBtn, { backgroundColor: theme.primaryLight }]}
                  onPress={() =>
                    router.push({
                      pathname: '/explore',
                      params: { category: selectedCategory },
                    } as any)
                  }
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryDishesBtnText, { color: theme.primary }]}>
                    Open All ({filteredDishes.length}) →
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardScroll}
              >
                {filteredDishes.map((dish) => (
                  <View key={dish.id} style={styles.cardWrapper}>
                    <FoodCardVertical dish={dish} width={175} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}


          {/* Section: Bestsellers */}
          <View style={styles.collectionSection}>
            <View style={styles.collectionHeader}>
              <View>
                <View style={styles.titleWithIcon}>
                  
                  <Text style={styles.collectionTitle}>
                    {isVegOnly ? 'Veg Royal Bestsellers' : 'Royal Bestsellers'}
                  </Text>
                </View>
                <Text style={styles.collectionSubtitle}>Most loved dishes by Lucknow foodies</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/explore',
                    params: { category: 'all' },
                  } as any)
                }
              >
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardScroll}
            >
              {bestsellerDishes.map((dish) => (
                <View key={dish.id} style={styles.cardWrapper}>
                  <FoodCardVertical dish={dish} width={175} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Section: Signature Biryani Collection */}
          <View style={styles.collectionSection}>
            <View style={styles.collectionHeader}>
              <View>
                <View style={styles.titleWithIcon}>
                  <Text style={styles.collectionTitle}>
                    {isVegOnly ? 'Handi Veg Dum Biryani' : 'Signature Dum Biryani'}
                  </Text>
                </View>
                <Text style={styles.collectionSubtitle}>
                  Slow cooked in dough-sealed earthen handis
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory('biryani');
                  router.push({
                    pathname: '/explore',
                    params: { category: 'biryani' },
                  } as any);
                }}
              >
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardScroll}
            >
              {signatureBiryaniDishes.map((dish) => (
                <View key={dish.id} style={styles.cardWrapper}>
                  <FoodCardVertical dish={dish} width={175} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Section: Royal Kebabs Collection */}
          <View style={styles.collectionSection}>
            <View style={styles.collectionHeader}>
              <View>
                <View style={styles.titleWithIcon}>
                  <Text style={styles.collectionTitle}>
                    {isVegOnly ? 'Shahi Veg Kebabs' : 'Royal Awadhi Kebabs'}
                  </Text>
                </View>
                <Text style={styles.collectionSubtitle}>
                  {isVegOnly
                    ? 'Veg Galauti, Paneer Seekh & Shami Kebabs'
                    : 'Melt-in-mouth Galauti & clay-oven skewers'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory('kebabs');
                  router.push({
                    pathname: '/explore',
                    params: { category: 'kebabs' },
                  } as any);
                }}
              >
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardScroll}
            >
              {royalKebabDishes.map((dish) => (
                <View key={dish.id} style={styles.cardWrapper}>
                  <FoodCardVertical dish={dish} width={175} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Section: Vegetarian Delights (only shown in All/Non-Veg mode as dedicated spotlight) */}
          {!isVegOnly && (
            <View style={styles.collectionSection}>
              <View style={styles.collectionHeader}>
                <View>
                  <View style={styles.titleWithIcon}>
          
                    <Text style={styles.collectionTitle}>Shahi Vegetarian Favourites</Text>
                  </View>
                  <Text style={styles.collectionSubtitle}>Paneer butter masala, chaap & rich dals</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory('veg');
                    router.push({
                      pathname: '/explore',
                      params: { category: 'veg' },
                    } as any);
                  }}
                >
                  <Text style={[styles.seeAllText, { color: theme.primary }]}>See all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardScroll}
              >
                {vegFavouriteDishes.map((dish) => (
                  <View key={dish.id} style={styles.cardWrapper}>
                    <FoodCardVertical dish={dish} width={175} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Selected Category Dishes List */}
          <View style={styles.menuListHeader}>
            <View>
              <Text style={styles.menuListTitle}>
                {selectedCategory === 'all'
                  ? isVegOnly
                    ? 'ALL VEGETARIAN DELICACIES'
                    : 'COMPLETE ROYAL MENU'
                  : `${selectedCategory.toUpperCase()} DELICACIES`}
              </Text>
              <Text style={styles.menuListSubtitle}>
                Showing {filteredDishes.length} authentic {isVegOnly ? 'veg ' : ''}dishes
              </Text>
            </View>

            {selectedCategory !== 'all' && (
              <TouchableOpacity
                onPress={() => setSelectedCategory('all')}
                style={styles.clearCatBtn}
              >
                <Text style={[styles.clearCatText, { color: theme.primary }]}>Show All</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.verticalListContainer}>
            {filteredDishes.map((dish) => (
              <FoodCardHorizontal key={dish.id} dish={dish} />
            ))}
          </View>

          {/* Bottom spacing for floating cart bar and bottom tab bar */}
          <View style={{ height: cartItemCount > 0 ? 120 : 90 }} />
        </ScrollView>

        {/* Floating Cart Bar (Swiggy / Blinkit style) */}
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

        {/* Location Picker Modal */}
        <LocationModal
          visible={locationModalVisible}
          onClose={() => setLocationModalVisible(false)}
        />
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
  stickyHeaderWrap: {
    zIndex: 10,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  vegModeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    gap: 8,
  },
  vegDotSmall: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: '#1B7A38',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  vegInnerDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1B7A38',
  },
  vegModeBannerText: {
    fontSize: 11.5,
    fontWeight: Typography.weights.bold,
    color: '#1B5E20',
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.textSecondary,
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  collectionSection: {
    marginTop: 18,
    marginBottom: 8,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  collectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
  },
  collectionSubtitle: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  cardScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 4,
  },
  cardWrapper: {
    marginRight: 14,
  },
  menuListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: 22,
    marginBottom: 8,
  },
  menuListTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
  },
  menuListSubtitle: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  clearCatBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearCatText: {
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  verticalListContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0E5E9',
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
  categoryDishesSection: {
    marginTop: 14,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#F0E5E9',
    ...Shadows.sm,
  },
  categoryDishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: 12,
  },
  categoryDishesTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
  },
  categoryDishesSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  categoryDishesBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryDishesBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
