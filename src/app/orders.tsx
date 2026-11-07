import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrderStore } from '@/store/orderStore';
import { useCartStore } from '@/store/cartStore';
import { useAppTheme } from '@/store/dietStore';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { VegIndicator } from '@/components/common/VegIndicator';
import { OrderAgainIcon } from '@/components/common/OrderAgainIcon';

export default function MyOrdersScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { orders } = useOrderStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart(item.dish, item.portion, item.quantity);
    });
    router.push({ pathname: '/cart', params: { tab: 'current' } } as any);
  };

  const handleTrack = (orderId: string) => {
    router.push({
      pathname: '/tracking/[orderId]',
      params: { orderId },
    } as any);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.primaryDark }]}>
          <View>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Past Orders & Reorder</Text>
            <Text style={[styles.headerSubtitle, { color: theme.headerSubtext }]}>
              Reorder your previous Lucknow royal feasts in 1 tap
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.exploreLink, { backgroundColor: 'rgba(255, 255, 255, 0.22)' }]}
            onPress={() => router.push('/explore' as any)}
          >
            <Text style={[styles.exploreLinkText, { color: '#FFFFFF' }]}>Order More</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="receipt-text-outline"
                size={64}
                color="#D4C4B9"
              />
              <Text style={styles.emptyTitle}>No Orders Placed Yet</Text>
              <Text style={styles.emptyDesc}>
                Experience our legendary slow-cooked Awadhi Dum Biryani and tender
                Galauti Kebabs today.
              </Text>
              <TouchableOpacity
                style={[styles.startOrderBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/explore' as any)}
              >
                <Text style={styles.startOrderBtnText}>Explore Royal Menu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            orders.map((order) => {
              const isDelivered = order.currentStage === 'Delivered';

              return (
                <View key={order.id} style={styles.orderCard}>
                  {/* Top Row: Order # & Status Badge */}
                  <View style={styles.cardTopRow}>
                    <View>
                      <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{order.date}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        isDelivered
                          ? styles.statusDelivered
                          : [styles.statusActive, { backgroundColor: theme.primary }],
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={isDelivered ? 'check-circle' : 'moped'}
                        size={13}
                        color="#FFFFFF"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.statusBadgeText}>
                        {order.currentStage}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Items List */}
                  <View style={styles.itemsContainer}>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <View style={styles.itemRowLeft}>
                          <VegIndicator isVeg={item.dish.isVeg} size={12} />
                          <Text style={styles.itemName} numberOfLines={1}>
                            {item.quantity}x {item.dish.name}
                          </Text>
                        </View>
                        <Text style={styles.itemPortion}>
                          {item.portion === 'half' ? 'Half' : 'Full'}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Delivery Location Preview */}
                  <View style={styles.deliveryLocationRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.deliveryLocationText} numberOfLines={1}>
                      Delivered to {order.deliveryAddress.label} • {order.deliveryAddress.area}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Card Bottom Row: Total & Action Buttons */}
                  <View style={styles.cardBottomRow}>
                    <View>
                      <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                      <Text style={[styles.totalAmount, { color: theme.primary }]}>
                        ₹{order.totalAmount}
                      </Text>
                    </View>

                    <View style={styles.actionsGroup}>
                      {/* Live Tracking Button for ongoing orders */}
                      {!isDelivered ? (
                        <TouchableOpacity
                          style={[styles.trackBtn, { backgroundColor: theme.primary }]}
                          onPress={() => handleTrack(order.id)}
                          activeOpacity={0.8}
                        >
                          <MaterialCommunityIcons name="map-marker-path" size={15} color="#FFFFFF" />
                          <Text style={styles.trackBtnText}>Track Order</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.trackHistoryBtn}
                          onPress={() => handleTrack(order.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.trackHistoryBtnText}>View Receipt</Text>
                        </TouchableOpacity>
                      )}

                      {/* 1-Tap Reorder Button */}
                      <TouchableOpacity
                        style={[
                          styles.reorderBtn,
                          { borderColor: theme.primary },
                        ]}
                        onPress={() => handleReorder(order)}
                        activeOpacity={0.8}
                      >
                        <OrderAgainIcon size={16} color={theme.primary} />
                        <Text style={[styles.reorderBtnText, { color: theme.primary }]}>
                          Reorder
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
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
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  exploreLink: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  exploreLinkText: {
    color: Colors.warmCream,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 110,
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  orderDate: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  statusActive: {},
  statusDelivered: {
    backgroundColor: '#2E7D32',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: Typography.weights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.divider,
    marginVertical: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 6,
  },
  itemName: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.primary,
    fontWeight: Typography.weights.medium,
  },
  itemPortion: {
    fontSize: 11,
    color: Palette.text.secondary,
  },
  deliveryLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  deliveryLocationText: {
    fontSize: 11,
    color: Palette.text.secondary,
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 9.5,
    fontWeight: Typography.weights.bold,
    color: Palette.text.secondary,
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  trackHistoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  trackHistoryBtnText: {
    color: Palette.charcoal,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 4,
  },
  reorderBtnText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginTop: 14,
  },
  emptyDesc: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.secondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    marginBottom: 20,
  },
  startOrderBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  startOrderBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
});
